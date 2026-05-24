import 'server-only';

import type { Account } from './types';

/**
 * Mock current-user store.
 *
 * Mutated by `updateMyAccount` so the template can demonstrate a working
 * form round-trip without a real backend. Resets on dev server restart.
 *
 * Replace with `auth.getUser()` / your session lookup when wiring real
 * auth — the action signatures stay the same.
 */
export const currentAccount: Account = {
  id: 'mock-user-id',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar_url: 'https://github.com/vctorgriggi.png',
  bio: 'Just exploring the template.',
};
