import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_ROLES = ['Admin', 'Content Manager'];
const PUBLIC_PATHS = [
  '/api/authentication/login',
  '/api/authentication/signup',
  '/api/authentication/logout',
  '/api/auth/signout',
  '/api/auth/callback/credentials',
  '/api/media-actions/createMediaView',
  '/api/password/forgotPassword',
  '/api/password/resetPassword',
  '/api/settings/fetchInstitutions',
];
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api') && method === 'POST') {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // @ts-expect-error
    if (!session || !session.role || !ADMIN_ROLES.includes(session.role)) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Permission Denied', code: 401 }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
