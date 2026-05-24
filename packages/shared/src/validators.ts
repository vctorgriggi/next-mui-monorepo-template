import { z } from 'zod';

import type { Result } from './result';
import { failure } from './result';

export const uuidSchema = z.string().uuid('Invalid ID');

/**
 * Validates input against a Zod schema server-side.
 * Returns a failure Result if invalid, undefined if valid.
 */
export function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown,
): Result<T> | undefined {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return failure(parsed.error.errors[0]?.message ?? 'Invalid data');
  }
  return undefined;
}
