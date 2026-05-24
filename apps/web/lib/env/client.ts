import { z } from 'zod';

/**
 * Schema for environment variables exposed to the browser.
 *
 * Anything in here MUST start with `NEXT_PUBLIC_` and is inlined into the
 * client bundle at build time — never put secrets here.
 *
 * Extend this with your own keys as the app grows.
 */
export const clientSchema = z.object({
  // TODO: declare your client-side env vars here, e.g.
  // NEXT_PUBLIC_API_URL: z.string().url(),
});

/**
 * `NEXT_PUBLIC_*` references must be literal so the Next.js bundler can
 * inline the values into the client bundle at build time. Add a literal
 * `process.env.NEXT_PUBLIC_FOO` for every key declared in `clientSchema`.
 */
export const clientEnv = clientSchema.parse({});
