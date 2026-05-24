import { z } from 'zod';

import { ROLE_NAMES, type RoleName } from '@/lib/auth/permissions';

/**
 * The role assigned to a User entity matches the same vocabulary used
 * for client-side RBAC. We re-export the names so callers in this
 * feature don't have to know about `lib/auth/permissions`.
 *
 * If you ever need to decouple "role someone has" from "role you can
 * assign to a user", split this back into its own enum.
 */
export const USER_ROLES = ROLE_NAMES;
export type UserRole = RoleName;

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(USER_ROLES),
});

export type UserValues = z.infer<typeof userSchema>;
