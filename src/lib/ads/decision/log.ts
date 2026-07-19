import type { DecisionLogEntry } from './types';

/** Ring buffer for decision history (last 50 evaluations) */
export class DecisionLog {
  private entries: DecisionLogEntry[] = [];
  private readonly MAX_ENTRIES = 50;

  record(entry: DecisionLogEntry): void {
    this.entries.push(entry);
    if (this.entries.length > this.MAX_ENTRIES) {
      this.entries.shift();
    }
  }

  getAll(): DecisionLogEntry[] {
    return [...this.entries];
  }

  getForPlacement(placement: string): DecisionLogEntry[] {
    return this.entries.filter((e) => e.placement === placement);
  }

  clear(): void {
    this.entries = [];
  }
}
