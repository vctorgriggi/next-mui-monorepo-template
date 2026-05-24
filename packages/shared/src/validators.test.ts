import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { uuidSchema, validateInput } from './validators';

describe('uuidSchema', () => {
  it('accepts a valid UUID', () => {
    const parsed = uuidSchema.safeParse('123e4567-e89b-12d3-a456-426614174000');
    expect(parsed.success).toBe(true);
  });

  it('rejects a non-UUID with the configured message', () => {
    const parsed = uuidSchema.safeParse('not-a-uuid');
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.errors[0]?.message).toBe('Invalid ID');
    }
  });
});

describe('validateInput', () => {
  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.number().int().nonnegative(),
  });

  it('returns undefined for valid input', () => {
    expect(validateInput(schema, { name: 'Ana', age: 30 })).toBeUndefined();
  });

  it('returns a Failure with the first schema error', () => {
    const result = validateInput(schema, { name: 'A', age: 30 });
    expect(result).toEqual({
      success: false,
      error: 'Name must be at least 2 characters',
    });
  });

  it('falls back to "Invalid data" when the schema has no message', () => {
    const looseSchema = z.string();
    const result = validateInput(looseSchema, 42);
    expect(result?.success).toBe(false);
    expect(result?.error).toBeTruthy();
  });
});
