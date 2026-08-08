import { describe, expect, it } from 'vitest';
import { getDailyPanchang } from 'panchang-ts';
import type { AppPreferences, PanchangViewModel } from '../types';
import { makeOffsetAdjustedDate, isInPanchangWindow } from './time';
import { getNextPanchangTransitionMs, resolveLivePanchang } from './service';

const hyderabadPrefs: AppPreferences = {
  language: 'en',
  masaSystem: 'auto',
  location: {
    label: 'Hyderabad',
    latitude: 17.385,
    longitude: 78.4867,
    timezone: 330,
    source: 'city',
  },
  locationAutoDetected: false,
};

function makeStaleDashamiViewModel(): PanchangViewModel {
  const sunrise = makeOffsetAdjustedDate(2026, 8, 8, 5, 57);
  const sunset = makeOffsetAdjustedDate(2026, 8, 8, 18, 45);
  const dashamiEnd = makeOffsetAdjustedDate(2026, 8, 8, 14, 0);
  const dashamiStart = makeOffsetAdjustedDate(2026, 8, 7, 17, 57);
  const ekadashiStart = dashamiEnd;
  const ekadashiEnd = makeOffsetAdjustedDate(2026, 8, 9, 5, 57);

  return {
    tithi: 'Krishna Dashami',
    paksha: 'krishna',
    pakshaLabel: 'Krishna Paksha',
    maasa: 'Ashadha',
    isAdhika: false,
    samvatsara: 'Parabhava',
    vikramSamvat: 2083,
    shakaSamvat: 1948,
    vara: 'Shaniwara',
    nakshatra: 'Rohini',
    tithiUntil: dashamiEnd,
    tithiStart: dashamiStart,
    previousTithi: null,
    previousTithiEnd: null,
    tithiTimeline: [
      {
        name: 'Krishna Dashami',
        start: dashamiStart,
        end: dashamiEnd,
        isCurrent: true,
        paksha: 'krishna',
      },
      {
        name: 'Krishna Ekadashi',
        start: ekadashiStart,
        end: ekadashiEnd,
        isCurrent: false,
        paksha: 'krishna',
      },
    ],
    moonFill: 0.6,
    isWaxing: false,
    sunrise,
    sunset,
    moonrise: null,
    moonset: null,
    festivals: [],
    locationLabel: 'Hyderabad',
    gregorianDate: 'Saturday, 8 August 2026',
  };
}

describe('resolveLivePanchang', () => {
  it('updates stale cached tithi after the transition time passes', () => {
    const stale = makeStaleDashamiViewModel();
    const afterTransition = new Date('2026-08-08T09:43:00.000Z');

    const live = resolveLivePanchang(stale, hyderabadPrefs, afterTransition);

    expect(live.tithi).toBe('Krishna Ekadashi');
    expect(live.tithiTimeline[0].isCurrent).toBe(false);
    expect(live.tithiTimeline[1].isCurrent).toBe(true);
    expect(live.tithiStart).toEqual(stale.tithiTimeline[1].start);
    expect(live.tithiUntil).toEqual(stale.tithiTimeline[1].end);
  });

  it('returns ms until the next tithi end from the timeline', () => {
    const stale = makeStaleDashamiViewModel();
    const beforeTransition = new Date('2026-08-08T08:00:00.000Z');
    const delayMs = getNextPanchangTransitionMs(
      stale,
      hyderabadPrefs.location.timezone,
      beforeTransition,
    );

    expect(delayMs).toBe(30 * 60 * 1000);
  });

  it('matches getDailyPanchang for Hyderabad after a midday tithi transition', () => {
    const afterTransition = new Date('2026-08-08T09:43:00.000Z');
    const geo = {
      latitude: hyderabadPrefs.location.latitude,
      longitude: hyderabadPrefs.location.longitude,
    };

    const daily = getDailyPanchang(afterTransition, geo, {
      timezone: 330,
      computeEndTimes: true,
    });

    expect(daily).not.toBeNull();

    const stale = makeStaleDashamiViewModel();
    const live = resolveLivePanchang(stale, hyderabadPrefs, afterTransition);

    const activeTithi = daily!.tithis.find(
      (tithi) =>
        tithi.startTime &&
        tithi.endTime &&
        isInPanchangWindow(
          afterTransition,
          tithi.startTime,
          tithi.endTime,
          330,
        ),
    );

    expect(activeTithi?.name.toLowerCase()).toContain('ekadashi');
    expect(live.tithi.toLowerCase()).toContain('ekadashi');
  });
});
