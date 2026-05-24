import { type NextRequest, NextResponse } from 'next/server';

/**
 * Next.js middleware.
 *
 * The template ships a no-op middleware. Wire your auth provider's
 * session refresh here when you pick one. Examples:
 *
 *   // Supabase
 *   import { updateSession } from '@supabase/ssr';
 *   return await updateSession(request);
 *
 *   // NextAuth — usually configured via `withAuth` from `next-auth/middleware`:
 *   //   export { default } from 'next-auth/middleware';
 *
 *   // Custom JWT — refresh + re-attach the cookie before returning.
 *
 * The matcher excludes static assets so middleware doesn't run on every
 * image/icon request.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
