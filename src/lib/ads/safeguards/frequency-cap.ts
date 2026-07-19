import { PlacementRegistry } from '../config/PlacementRegistry';
import type { FrequencyCapMap, FrequencyCapValue } from '../core/types';

type ImpressionBucket = { hourKey: string; hourCount: number; dayKey: string; dayCount: number };

const STORAGE_KEY = 'ads:ivt:impressions';

function hourKey(ts = Date.now()): string {
  const d = new Date(ts);
  return `${d.toISOString().slice(0, 13)}`;
}

function dayKey(ts = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export class FrequencyCapTracker {
  private caps: FrequencyCapMap = {};
  private buckets = new Map<string, ImpressionBucket>();
  private simulatedUsage = new Map<string, { hourUsed?: number; dayUsed?: number }>();

  constructor(caps: FrequencyCapMap = {}) {
    this.caps = { ...caps };
    this.buckets = this.readBuckets();
  }

  updateConfig(caps: FrequencyCapMap): void {
    this.caps = { ...caps };
  }

  /** Debug-only: override cap values for a placement */
  setCapOverride(placement: string, perHour?: number, perDay?: number): void {
    const existing = this.caps[placement] ?? {};
    this.caps[placement] = {
      perHour: perHour ?? existing.perHour ?? 0,
      perDay: perDay ?? existing.perDay ?? 0,
    };
  }

  /** Debug-only: simulate impression usage without recording real impressions */
  setSimulatedUsage(
    placement: string,
    usage: { hourUsed?: number; dayUsed?: number }
  ): void {
    this.simulatedUsage.set(placement, usage);
    const bucket = this.getBucket(placement);
    if (usage.hourUsed != null) bucket.hourCount = usage.hourUsed;
    if (usage.dayUsed != null) bucket.dayCount = usage.dayUsed;
    this.buckets.set(placement, bucket);
    this.writeBuckets();
  }

  clearSimulatedUsage(): void {
    this.simulatedUsage.clear();
  }

  getCap(placement: string): FrequencyCapValue {
    const override = this.caps[placement];
    if (override) {
      return {
        perHour: override.perHour ?? 0,
        perDay: override.perDay ?? 0,
      };
    }

    const def = PlacementRegistry.get(placement);
    return {
      perHour: def?.frequencyCap?.perHour ?? 0,
      perDay: def?.frequencyCap?.perDay ?? 0,
    };
  }

  canShow(placement: string): { allowed: boolean; capType?: 'hour' | 'day'; capValue?: number; currentCount?: number } {
    const cap = this.getCap(placement);
    const bucket = this.getBucket(placement);

    if (cap.perHour > 0 && bucket.hourCount >= cap.perHour) {
      return { allowed: false, capType: 'hour', capValue: cap.perHour, currentCount: bucket.hourCount };
    }
    if (cap.perDay > 0 && bucket.dayCount >= cap.perDay) {
      return { allowed: false, capType: 'day', capValue: cap.perDay, currentCount: bucket.dayCount };
    }
    return { allowed: true };
  }

  recordImpression(placement: string): void {
    const bucket = this.getBucket(placement);
    bucket.hourCount += 1;
    bucket.dayCount += 1;
    this.buckets.set(placement, bucket);
    this.writeBuckets();
  }

  getUsage(placement: string): { hourUsed: number; dayUsed: number } {
    const bucket = this.getBucket(placement);
    return { hourUsed: bucket.hourCount, dayUsed: bucket.dayCount };
  }

  private getBucket(placement: string): ImpressionBucket {
    const now = Date.now();
    const hk = hourKey(now);
    const dk = dayKey(now);
    const existing = this.buckets.get(placement);

    if (!existing || existing.hourKey !== hk || existing.dayKey !== dk) {
      const bucket: ImpressionBucket = {
        hourKey: hk,
        hourCount: existing && existing.hourKey === hk ? existing.hourCount : 0,
        dayKey: dk,
        dayCount: existing && existing.dayKey === dk ? existing.dayCount : 0,
      };
      this.buckets.set(placement, bucket);
      return bucket;
    }
    return existing;
  }

  private readBuckets(): Map<string, ImpressionBucket> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Map();
      const obj = JSON.parse(raw) as Record<string, ImpressionBucket>;
      return new Map(Object.entries(obj));
    } catch {
      return new Map();
    }
  }

  private writeBuckets(): void {
    try {
      const obj = Object.fromEntries(this.buckets.entries());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      // ignore
    }
  }
}
