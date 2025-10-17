import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authOptions';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';

const ADMIN_ROLES = ['Admin', 'Content Manager'];

/**
 * Middleware to protect content access based on institution
 * Applied to individual content viewing endpoints
 */
export async function withContentAccessGuard(
  request: NextRequest,
  contentId: string,
  handler: (request: NextRequest) => Promise<Response>
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);
    
    // If no session, deny access
    if (!session?.user) {
      return new NextResponse(JSON.stringify({
        isError: true,
        message: 'Authentication required',
      }), {
        status: HttpStatusCode.Unauthorized,
      });
    }

    // Check if user is admin (can access all content)
    const isAdmin = session.role && ADMIN_ROLES.includes(session.role);
    if (isAdmin) {
      return handler(request);
    }

    // For regular users, check if content belongs to their institution
    const db = await dbClient();
    if (!db) {
      return new NextResponse(JSON.stringify({
        isError: true,
        message: 'Database connection failed',
      }), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    // Get the content and check institution
    const content = await db.collection(dbCollections.media_content.name).findOne({
      _id: new BSON.ObjectId(contentId),
    }, {
      projection: { institution_id: 1 }
    });

    if (!content) {
      return new NextResponse(JSON.stringify({
        isError: true,
        message: 'Content not found',
      }), {
        status: HttpStatusCode.NotFound,
      });
    }

    // If content has no institution_id, deny access for non-admins
    if (!content.institution_id) {
      return new NextResponse(JSON.stringify({
        isError: true,
        message: 'Access denied: Content not assigned to any institution',
      }), {
        status: HttpStatusCode.Forbidden,
      });
    }

    // Check if user's institution matches content's institution
    if (!session.institution_id || session.institution_id !== content.institution_id.toString()) {
      return new NextResponse(JSON.stringify({
        isError: true,
        message: 'Access denied: Content not available for your institution',
      }), {
        status: HttpStatusCode.Forbidden,
      });
    }

    // Access granted, proceed with original handler
    return handler(request);

  } catch (error) {
    console.error('Content access guard error:', error);
    return new NextResponse(JSON.stringify({
      isError: true,
      message: 'Access validation failed',
    }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}

/**
 * Guard for content modification (create/edit/delete)
 * Ensures users can only modify content within their institution
 */
export async function withContentModifyGuard(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<Response>,
  contentId?: string // Optional for edit operations
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);
    
    // If no session, deny access
    if (!session?.user) {
      return new NextResponse(JSON.stringify({
        isError: true,
        message: 'Authentication required',
      }), {
        status: HttpStatusCode.Unauthorized,
      });
    }

    // Check if user is admin (can modify all content)
    const isAdmin = session.role && ADMIN_ROLES.includes(session.role);
    if (isAdmin) {
      return handler(request);
    }

    // For regular users, ensure they have an institution
    if (!session.institution_id) {
      return new NextResponse(JSON.stringify({
        isError: true,
        message: 'Access denied: No institution assigned',
      }), {
        status: HttpStatusCode.Forbidden,
      });
    }

    // For edit operations, check if content belongs to user's institution
    if (contentId) {
      const db = await dbClient();
      if (!db) {
        return new NextResponse(JSON.stringify({
          isError: true,
          message: 'Database connection failed',
        }), {
          status: HttpStatusCode.InternalServerError,
        });
      }

      const content = await db.collection(dbCollections.media_content.name).findOne({
        _id: new BSON.ObjectId(contentId),
      }, {
        projection: { institution_id: 1 }
      });

      if (!content) {
        return new NextResponse(JSON.stringify({
          isError: true,
          message: 'Content not found',
        }), {
          status: HttpStatusCode.NotFound,
        });
      }

      // Check if user's institution matches content's institution
      if (content.institution_id && session.institution_id !== content.institution_id.toString()) {
        return new NextResponse(JSON.stringify({
          isError: true,
          message: 'Access denied: Cannot modify content from other institutions',
        }), {
          status: HttpStatusCode.Forbidden,
        });
      }
    }

    // Access granted, proceed with original handler
    return handler(request);

  } catch (error) {
    console.error('Content modify guard error:', error);
    return new NextResponse(JSON.stringify({
      isError: true,
      message: 'Access validation failed',
    }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}