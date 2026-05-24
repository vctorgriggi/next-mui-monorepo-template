import 'server-only';

import { clientSchema } from './client';

/**
 * Schema for server-only environment variables (no `NEXT_PUBLIC_` prefix).
 *
 * These never reach the browser. Extend with API keys, database URLs,
 * webhook secrets, etc. as needed.
 */
const schema = clientSchema.extend({
  // TODO: declare your server-only env vars here, e.g.
  // DATABASE_URL: z.string().url(),
  // STRIPE_SECRET_KEY: z.string().min(1),
});

export const serverEnv = schema.parse(process.env);
