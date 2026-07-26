import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/authOptions';

export type AuthorizationContext = {
  userId: string;
  role: string;
  organizationId: string;
  isPlatformAdmin: boolean;
  session: Session;
};

const errorResponse = (status: 401 | 403) =>
  new Response(
    JSON.stringify({
      isError: true,
      code: status,
      message: status === 401 ? 'Authentication required' : 'Permission denied',
    }),
    { status, headers: { 'Content-Type': 'application/json' } },
  );

export async function getAuthorizationContext(): Promise<AuthorizationContext | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const organizationId = session?.user?.organizationId;

  if (!userId || !role || !organizationId) {
    return null;
  }

  return {
    userId,
    role,
    organizationId,
    isPlatformAdmin: Boolean(session.user.isPlatformAdmin),
    session,
  };
}

export async function requireAuth(): Promise<AuthorizationContext | Response> {
  return (await getAuthorizationContext()) || errorResponse(401);
}

export function requireRole(context: AuthorizationContext, roles: readonly string[]): Response | null {
  if (context.isPlatformAdmin || roles.some((role) => role.toLowerCase() === context.role.toLowerCase())) {
    return null;
  }

  return errorResponse(403);
}

export function requireOrganizationAccess(
  context: AuthorizationContext,
  organizationId: string | undefined,
): Response | null {
  if (context.isPlatformAdmin || (organizationId && context.organizationId === organizationId)) {
    return null;
  }

  return errorResponse(403);
}
