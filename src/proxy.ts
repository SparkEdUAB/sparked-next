import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const MUTATION_ROLES = ['Admin', 'Content Manager'];
const AUTH_SESSION_VERSION = process.env.AUTH_SESSION_VERSION || '2';
const PUBLIC_PATHS = new Set([
  '/api/authentication/login',
  '/api/authentication/signup',
  '/api/authentication/logout',
  '/api/auth/signout',
  '/api/auth/callback/credentials',
  '/api/media-actions/createMediaView',
  '/api/password/forgotPassword',
  '/api/password/resetPassword',
  '/api/institution/createInstitution',
  '/api/institution/fetchPublicInstitutions',
  '/api/config/readConfigFile',
]);

const publicApiPath = (pathname: string) => pathname.startsWith('/api/auth/') || PUBLIC_PATHS.has(pathname);

const authorizationError = (status: 401 | 403) =>
  new NextResponse(
    JSON.stringify({
      isError: true,
      code: status,
      message: status === 401 ? 'Authentication required' : 'Permission denied',
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  );

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  if (!pathname.startsWith('/api') || publicApiPath(pathname)) {
    return NextResponse.next();
  }

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    !session?.sub ||
    !session.role ||
    !session.organizationId ||
    session.authSessionVersion !== AUTH_SESSION_VERSION
  ) {
    return authorizationError(401);
  }

  if (
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
    !session.isPlatformAdmin &&
    !MUTATION_ROLES.includes(session.role as string)
  ) {
    return authorizationError(403);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
