import { describe, it, expect } from 'vitest';
import { resolveRequiredWardrobeItems } from './wardrobe-readiness';

describe('resolveRequiredWardrobeItems', () => {
  it('uses the higher of global and placement minimums', () => {
    expect(
      resolveRequiredWardrobeItems(3, { showForNewUsers: false, minWardrobeItems: 8 })
    ).toBe(8);
  });

  it('falls back to startAfterSession for legacy policies', () => {
    expect(
      resolveRequiredWardrobeItems(0, { showForNewUsers: false, startAfterSession: 5 })
    ).toBe(5);
  });

  it('only applies the global floor for showForNewUsers placements', () => {
    expect(resolveRequiredWardrobeItems(5, { showForNewUsers: true, minWardrobeItems: 8 })).toBe(
      5
    );
    expect(resolveRequiredWardrobeItems(0, { showForNewUsers: true, minWardrobeItems: 8 })).toBe(0);
  });
});
