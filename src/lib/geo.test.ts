import { describe, expect, it } from 'vitest';
import { CITIES } from './cities';
import {
  findNearestCity,
  findNearestCityWithinKm,
  haversineKm,
  isInIndia,
} from './geo';

describe('haversineKm', () => {
  it('returns zero for identical points', () => {
    expect(haversineKm(12.97, 77.59, 12.97, 77.59)).toBe(0);
  });

  it('returns a small distance for nearby points', () => {
    const distance = haversineKm(12.9716, 77.5946, 13.0827, 80.2707);
    expect(distance).toBeGreaterThan(200);
    expect(distance).toBeLessThan(350);
  });
});

describe('isInIndia', () => {
  it('returns true for major Indian cities', () => {
    expect(isInIndia(28.6139, 77.209)).toBe(true);
    expect(isInIndia(12.9716, 77.5946)).toBe(true);
  });

  it('returns false outside India', () => {
    expect(isInIndia(51.5074, -0.1278)).toBe(false);
    expect(isInIndia(40.7128, -74.006)).toBe(false);
  });

  it('returns false below the southern bound', () => {
    expect(isInIndia(6.0, 80.0)).toBe(false);
  });

  it('returns false beyond the eastern bound', () => {
    expect(isInIndia(25.0, 98.0)).toBe(false);
  });
});

describe('findNearestCity', () => {
  it('maps coordinates near Bengaluru to Bengaluru', () => {
    const { city } = findNearestCity(12.98, 77.6);
    expect(city.id).toBe('bengaluru');
  });

  it('maps a remote Indian town to the nearest metro', () => {
    const { city, distanceKm } = findNearestCity(18.75, 73.4);
    expect(city.id).toBe('pune');
    expect(distanceKm).toBeGreaterThan(50);
  });

  it('maps Delhi coordinates to New Delhi', () => {
    const { city } = findNearestCity(28.61, 77.21);
    expect(city.id).toBe('delhi');
  });
});

describe('findNearestCityWithinKm', () => {
  it('returns null when the nearest city is beyond the threshold', () => {
    const remote = findNearestCityWithinKm(30, 75, 50);
    expect(remote).toBeNull();
  });

  it('returns the nearest city within the threshold', () => {
    const nearby = findNearestCityWithinKm(
      CITIES[0].latitude,
      CITIES[0].longitude,
      50,
    );
    expect(nearby?.id).toBe('delhi');
  });
});
