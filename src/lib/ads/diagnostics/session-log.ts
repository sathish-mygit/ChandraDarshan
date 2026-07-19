import type { SessionAttemptEntry } from './types';

/** Ring buffer for session ad attempts (last 50 entries) */
export class SessionAttemptLog {
  private entries: SessionAttemptEntry[] = [];
  private readonly MAX_ENTRIES = 50;

  record(entry: SessionAttemptEntry): void {
    this.entries.push({
      ...entry,
      timestamp: entry.timestamp || Date.now(),
    });

    if (this.entries.length > this.MAX_ENTRIES) {
      this.entries.shift();
    }
  }

  recordShow(placement: string, allowed: boolean, message: string): void {
    this.record({
      timestamp: Date.now(),
      kind: 'show',
      placement,
      phase: 'show',
      allowed,
      message,
      source: 'policy',
    });
  }

  recordPreload(placement: string, allowed: boolean, message: string): void {
    this.record({
      timestamp: Date.now(),
      kind: 'preload',
      placement,
      phase: 'preload',
      allowed,
      message,
      source: 'policy',
    });
  }

  recordSkip(
    placement: string,
    phase: 'show' | 'preload',
    ruleId: string,
    message: string
  ): void {
    this.record({
      timestamp: Date.now(),
      kind: phase === 'show' ? 'skip' : 'preload_skip',
      placement,
      phase,
      allowed: false,
      ruleId,
      message,
      source: 'policy',
    });
  }

  recordProviderEvent(
    event: {
      type: string;
      placement?: string;
      message: string;
    }
  ): void {
    this.record({
      timestamp: Date.now(),
      kind: 'provider',
      placement: event.placement || 'unknown',
      message: event.message,
      source: 'provider',
    });
  }

  recordDebugAction(placement: string, message: string): void {
    this.record({
      timestamp: Date.now(),
      kind: 'evaluate',
      placement,
      message,
      source: 'debug',
    });
  }

  getAll(): SessionAttemptEntry[] {
    return [...this.entries];
  }

  getRecent(count: number = 20): SessionAttemptEntry[] {
    return this.entries.slice(-count);
  }

  clear(): void {
    this.entries = [];
  }
}
