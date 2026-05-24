import { describe, expect, it } from 'vitest';

import { formatNumber } from './format';

describe('formatNumber', () => {
  it('formats thousands abbreviated with K', () => {
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(12_345)).toBe('12.3K');
  });

  it('formats millions abbreviated with M', () => {
    expect(formatNumber(1_500_000)).toBe('1.5M');
  });

  it('formats small numbers with thousand separator', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(0)).toBe('0');
  });

  it('values near 1M still use K (no premature promotion)', () => {
    expect(formatNumber(999_999)).toBe('1000.0K');
  });

  it('negatives fall through to toLocaleString (not abbreviated)', () => {
    expect(formatNumber(-1500)).toMatch(/^[-−]1[.,]500$/);
  });
});
