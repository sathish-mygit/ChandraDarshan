import { describe, expect, it } from 'vitest';
import {
  isInPanchangWindow,
  makeOffsetAdjustedDate,
  resolveTimezoneOffsetMinutes,
  toPanchangComparableMs,
} from './time';

describe('panchang time', () => {
  it('resolves IANA timezone offset minutes', () => {
    const winter = new Date('2026-01-15T12:00:00.000Z');
    expect(resolveTimezoneOffsetMinutes('Asia/Kolkata', winter)).toBe(330);
    expect(resolveTimezoneOffsetMinutes(330, winter)).toBe(330);
  });

  it('compares real instants against offset-adjusted panchang windows', () => {
    const timezone = 330;
    const start = makeOffsetAdjustedDate(2026, 8, 7, 17, 57);
    const end = makeOffsetAdjustedDate(2026, 8, 8, 14, 0);

    const beforeEnd = new Date('2026-08-08T08:00:00.000Z');
    const afterEnd = new Date('2026-08-08T09:43:00.000Z');

    expect(isInPanchangWindow(beforeEnd, start, end, timezone)).toBe(true);
    expect(isInPanchangWindow(afterEnd, start, end, timezone)).toBe(false);
  });

  it('aligns comparable ms with offset-adjusted end times', () => {
    const timezone = 330;
    const end = makeOffsetAdjustedDate(2026, 8, 8, 14, 0);
    const beforeEnd = new Date('2026-08-08T08:00:00.000Z');

    const delayMs = end.getTime() - toPanchangComparableMs(beforeEnd, timezone);
    expect(delayMs).toBe(30 * 60 * 1000);
  });
});
