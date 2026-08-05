import { describe, expect, it } from 'vitest';
import { houseFromReference } from './explained-insight';

describe('houseFromReference', () => {
  it('counts whole-sign houses from reference rashi', () => {
    expect(houseFromReference(0, 0)).toBe(1);
    expect(houseFromReference(0, 4)).toBe(5);
    expect(houseFromReference(11, 0)).toBe(2);
  });
});
