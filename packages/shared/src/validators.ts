import { z } from 'zod';

import type { Failure } from './result';
import { failure } from './result';

export const uuidSchema = z.string().uuid('Invalid ID');

/**
 * Validates `data` against a Zod schema. Returns a `Failure` if invalid,
 * `undefined` if valid.
 *
 * Designed to be returned directly from server actions:
 *
 *   const invalid = validateInput(userSchema, input);
 *   if (invalid) return invalid;   // `Failure` assignable to any Result<T>
 */
export function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown,
): Failure | undefined {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return failure(parsed.error.errors[0]?.message ?? 'Invalid data');
  }
  return undefined;
}
