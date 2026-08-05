import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveApproximateLocation } from './approximate-location';

function mockFetchResponse(body: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      json: async () => body,
    }),
  );
}

describe('resolveApproximateLocation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps Indian IP coordinates to the nearest preset city', async () => {
    mockFetchResponse({
      success: true,
      latitude: 12.98,
      longitude: 77.6,
      city: 'Bengaluru',
      country_code: 'IN',
    });

    const location = await resolveApproximateLocation();
    expect(location).toEqual({
      source: 'approx',
      label: 'Bengaluru',
      latitude: 12.9716,
      longitude: 77.5946,
      timezone: 330,
    });
  });

  it('keeps abroad IP coordinates with the city label', async () => {
    mockFetchResponse({
      success: true,
      latitude: 51.5074,
      longitude: -0.1278,
      city: 'London',
      country_code: 'GB',
    });

    const location = await resolveApproximateLocation();
    expect(location).toMatchObject({
      source: 'approx',
      label: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
    });
    expect(typeof location?.timezone).toBe('string');
  });

  it('returns null when the API responds with an error', async () => {
    mockFetchResponse({ success: false }, true);
    await expect(resolveApproximateLocation()).resolves.toBeNull();
  });

  it('returns null when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network error')),
    );
    await expect(resolveApproximateLocation()).resolves.toBeNull();
  });

  it('returns null when coordinates are missing', async () => {
    mockFetchResponse({
      success: true,
      city: 'Nowhere',
    });
    await expect(resolveApproximateLocation()).resolves.toBeNull();
  });
});
