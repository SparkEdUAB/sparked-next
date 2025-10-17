import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/authOptions';

const ADMIN_ROLES = ['Admin', 'Content Manager'];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({
        isError: true,
        message: 'No session found',
      }, { status: 401 });
    }

    const isAdmin = session.role && ADMIN_ROLES.includes(session.role);

    return NextResponse.json({
      isError: false,
      data: {
        userId: session.user.id,
        email: session.user.email,
        role: session.role,
        institutionId: session.institution_id,
        isAdmin,
        adminRoles: ADMIN_ROLES,
        sessionData: session,
      }
    });

  } catch (error) {
    console.error('Session debug error:', error);
    return NextResponse.json({
      isError: true,
      message: 'Error checking session',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}