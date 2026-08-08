/**
 * panchang-ts returns offset-adjusted Date objects: local wall time is read via
 * getUTC* and getTime() is shifted by the location timezone offset. Comparisons
 * against real `new Date()` instants must use the same adjusted clock.
 */

export function resolveTimezoneOffsetMinutes(
  timezone: number | string,
  at: Date = new Date(),
): number {
  if (typeof timezone === 'number') {
    return timezone;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(at);
  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const asUtcMs = Date.UTC(
    read('year'),
    read('month') - 1,
    read('day'),
    read('hour'),
    read('minute'),
    read('second'),
  );

  return (asUtcMs - at.getTime()) / 60_000;
}

export function toPanchangComparableMs(
  instant: Date,
  timezone: number | string,
): number {
  const offsetMinutes = resolveTimezoneOffsetMinutes(timezone, instant);
  return instant.getTime() + offsetMinutes * 60_000;
}

export function isInPanchangWindow(
  now: Date,
  start: Date,
  end: Date,
  timezone: number | string,
): boolean {
  const nowMs = toPanchangComparableMs(now, timezone);
  return nowMs >= start.getTime() && nowMs < end.getTime();
}

/** Build a panchang-ts style offset-adjusted Date (local components stored in UTC fields). */
export function makeOffsetAdjustedDate(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
}
