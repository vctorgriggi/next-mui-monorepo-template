'use server';

import { failure, type Result, success } from '@template/shared/result';
import { validateInput } from '@template/shared/validators';
import { z } from 'zod';

import { nextUserId, usersStore } from './data';
import type { User } from './types';
import { userSchema, type UserValues } from './validators';

/**
 * Server actions for the `users` feature.
 *
 * Each action returns `Result<T>` so the client never sees a thrown
 * exception (Next.js serializes those as opaque errors). Errors come
 * back as typed, readable strings via `failure()`.
 *
 * Inputs are validated with Zod *before* touching the data layer —
 * server actions are callable from devtools, so client-side validation
 * is not a security barrier.
 *
 * The data layer here is a module-scoped Map (`./data.ts`). Replace
 * with real DB / API calls when wiring this template.
 */

const idSchema = z.string().min(1, 'Invalid ID');

export async function fetchUsers(): Promise<Result<User[]>> {
  return success(
    Array.from(usersStore.values()).sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    ),
  );
}

export async function fetchUserById(id: string): Promise<Result<User>> {
  const invalid = validateInput(idSchema, id);
  if (invalid) return invalid;

  const user = usersStore.get(id);
  if (!user) return failure('User not found');
  return success(user);
}

export async function createUser(input: UserValues): Promise<Result<User>> {
  const invalid = validateInput(userSchema, input);
  if (invalid) return invalid;

  const exists = Array.from(usersStore.values()).some(
    (u) => u.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (exists) return failure('A user with this email already exists');

  const newUser: User = {
    id: nextUserId(),
    name: input.name,
    email: input.email,
    role: input.role,
    active: true,
    created_at: new Date().toISOString(),
  };
  usersStore.set(newUser.id, newUser);
  return success(newUser);
}

export async function updateUser(
  id: string,
  input: UserValues,
): Promise<Result<User>> {
  const idInvalid = validateInput(idSchema, id);
  if (idInvalid) return idInvalid;
  const inputInvalid = validateInput(userSchema, input);
  if (inputInvalid) return inputInvalid;

  const existing = usersStore.get(id);
  if (!existing) return failure('User not found');

  const updated: User = { ...existing, ...input };
  usersStore.set(id, updated);
  return success(updated);
}

export async function deleteUser(id: string): Promise<Result<true>> {
  const invalid = validateInput(idSchema, id);
  if (invalid) return invalid;

  const existed = usersStore.delete(id);
  if (!existed) return failure('User not found');
  return success(true);
}

export async function toggleUserActive(id: string): Promise<Result<User>> {
  const invalid = validateInput(idSchema, id);
  if (invalid) return invalid;

  const existing = usersStore.get(id);
  if (!existing) return failure('User not found');
  const updated: User = { ...existing, active: !existing.active };
  usersStore.set(id, updated);
  return success(updated);
}
