import { describe, expect, it } from 'vitest';
import { cityToLocation, CITIES } from '../cities';
import { computeMangalPairing } from './mangal-pairing';
import type { BirthProfile } from '../types';

function profile(
  date: string,
  time: string,
  timeUnknown = false,
): BirthProfile {
  return {
    birthDate: date,
    birthTime: timeUnknown ? undefined : time,
    timeUnknown,
    birthLocation: cityToLocation(CITIES[0]),
  };
}

describe('computeMangalPairing', () => {
  it('marks approximate when either time is unknown', () => {
    const result = computeMangalPairing(
      profile('1990-01-01', '10:00'),
      profile('1992-06-15', '14:00', true),
      'en',
    );
    expect(result.approximate).toBe(true);
    expect(result.pairingNote).toBe('neither');
  });

  it('returns neither when both times known and no manglik pattern', () => {
    const self = profile('1990-06-15', '06:30');
    const partner = profile('1992-03-20', '18:00');
    const result = computeMangalPairing(self, partner, 'en');
    expect(result.approximate).toBe(false);
    expect(['both', 'neither', 'self_only', 'partner_only']).toContain(
      result.pairingNote,
    );
  });
});
