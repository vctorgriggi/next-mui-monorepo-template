'use server';

import { type Result, success } from '@template/shared/result';
import { validateInput } from '@template/shared/validators';

import { currentAccount } from './data';
import type { Account } from './types';
import { accountSchema, type AccountValues } from './validators';

export async function fetchMyAccount(): Promise<Result<Account>> {
  return success({ ...currentAccount });
}

export async function updateMyAccount(
  input: AccountValues,
): Promise<Result<Account>> {
  const invalid = validateInput(accountSchema, input);
  if (invalid) return invalid;

  // Simulate latency to show loading UI.
  await new Promise((r) => setTimeout(r, 400));

  currentAccount.name = input.name;
  currentAccount.email = input.email;
  currentAccount.bio = input.bio ?? null;

  return success({ ...currentAccount });
}
