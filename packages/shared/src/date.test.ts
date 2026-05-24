import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime } from './date';

describe('formatDate', () => {
  it('formats date as "DD MMM YYYY"', () => {
    const result = formatDate('2026-03-15');
    expect(result).toBe('15 Mar 2026');
  });

  it('accepts a Date object', () => {
    const result = formatDate(new Date('2026-12-25T00:00:00'));
    expect(result).toBe('25 Dec 2026');
  });
});

describe('formatDateTime', () => {
  it('formats date and time joined by "at"', () => {
    const result = formatDateTime('2026-03-15T14:30:00');
    expect(result).toMatch(/15 Mar 2026 at 14:30/);
  });
});
