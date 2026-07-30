import { describe, expect, it } from 'vitest';
import { cityToLocation, CITIES } from '../cities';
import {
  inferMasaSystemFromCoords,
  resolveMasaSystem,
} from './masa-system';

describe('inferMasaSystemFromCoords', () => {
  it('uses amanta for South India', () => {
    expect(inferMasaSystemFromCoords(13.08, 80.27)).toBe('amanta');
  });

  it('uses amanta for Maharashtra and Gujarat', () => {
    expect(inferMasaSystemFromCoords(19.08, 72.88)).toBe('amanta');
    expect(inferMasaSystemFromCoords(23.02, 72.57)).toBe('amanta');
  });

  it('uses purnimanta for North India', () => {
    expect(inferMasaSystemFromCoords(28.61, 77.21)).toBe('purnimanta');
    expect(inferMasaSystemFromCoords(26.85, 80.95)).toBe('purnimanta');
  });

  it('uses purnimanta for Bengal', () => {
    expect(inferMasaSystemFromCoords(22.57, 88.36)).toBe('purnimanta');
  });
});

describe('resolveMasaSystem', () => {
  it('returns manual preference when not auto', () => {
    const location = cityToLocation(CITIES[0]);
    expect(resolveMasaSystem('amanta', location)).toBe('amanta');
    expect(resolveMasaSystem('purnimanta', location)).toBe('purnimanta');
  });

  it('uses preset city metadata in auto mode', () => {
    const chennai = CITIES.find((city) => city.id === 'chennai');
    const delhi = CITIES.find((city) => city.id === 'delhi');
    expect(resolveMasaSystem('auto', cityToLocation(chennai!))).toBe('amanta');
    expect(resolveMasaSystem('auto', cityToLocation(delhi!))).toBe('purnimanta');
  });

  it('uses nearby preset city for GPS locations', () => {
    expect(
      resolveMasaSystem('auto', {
        source: 'gps',
        label: 'Near Chennai',
        latitude: 13.1,
        longitude: 80.3,
        timezone: 'Asia/Kolkata',
      }),
    ).toBe('amanta');
  });

  it('falls back to coordinate inference for distant GPS locations', () => {
    expect(
      resolveMasaSystem('auto', {
        source: 'gps',
        label: 'Remote',
        latitude: 30,
        longitude: 75,
        timezone: 'Asia/Kolkata',
      }),
    ).toBe('purnimanta');
  });
});
