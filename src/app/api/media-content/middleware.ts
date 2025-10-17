import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authOptions';
import { BSON } from 'mongodb';

const ADMIN_ROLES = ['Admin', 'Content Manager'];

/**
 * Apply institution filtering to media content queries
 * Admins can see all content, regular users only see their institution's content
 */
export async function applyInstitutionFilter(query: Record<string, any>) {
  const session = await getServerSession(authOptions);
  
  // If no session, return empty results
  if (!session?.user) {
    return { ...query, _id: new BSON.ObjectId('000000000000000000000000') }; // Invalid ObjectId to return no results
  }

  // Check if user is admin - ADMINS SEE ALL CONTENT
  const isAdmin = session.role && ADMIN_ROLES.includes(session.role);

  // If user is admin, don't apply institution filter (they can see all content)
  if (isAdmin) {
    return query;
  }

  // For regular users, filter by their institution only
  if (session.institution_id) {
    return {
      ...query,
      institution_id: new BSON.ObjectId(session.institution_id)
    };
  }

  // If user has no institution, return no results
  return { ...query, _id: new BSON.ObjectId('000000000000000000000000') };
}

/**
 * Check if user can access specific content
 */
export async function canAccessContent(contentInstitutionId: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return false;
  }

  // Admins can access all content
  const isAdmin = session.role && ADMIN_ROLES.includes(session.role);
  if (isAdmin) {
    return true;
  }

  // Regular users can only access content from their institution
  return session.institution_id === contentInstitutionId;
}

/**
 * Check if user can mass assign content (admin only)
 */
export async function canMassAssignContent(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !session.role) {
    return false;
  }

  return ADMIN_ROLES.includes(session.role);
}