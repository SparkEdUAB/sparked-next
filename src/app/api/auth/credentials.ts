import bcrypt from 'bcryptjs';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { resolveOrganizationContext } from '../lib/organization';

export type AuthenticatedUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  organizationId: string;
  organizationSlug: string;
  organizationType: string;
  isDefaultOrganization: boolean;
  isPlatformAdmin: boolean;
};

export async function authenticateCredentials(
  email: string | undefined,
  password: string | undefined,
): Promise<AuthenticatedUser | null> {
  if (!email || !password) return null;

  const db = await dbClient();
  const user = await db.collection(dbCollections.users.name).findOne(
    { email: email.trim().toLowerCase() },
    {
      projection: {
        email: 1,
        firstName: 1,
        lastName: 1,
        phoneNumber: 1,
        password: 1,
        role: 1,
      },
    },
  );

  if (!user?.password || !(await bcrypt.compare(password, user.password))) return null;

  const roleMapping = await db.collection(dbCollections.user_role_mappings.name).findOne({
    user_id: user._id,
  });
  const mappedRole = roleMapping
    ? await db.collection(dbCollections.user_roles.name).findOne({ _id: roleMapping.role_id })
    : null;
  const role = typeof mappedRole?.name === 'string' ? mappedRole.name : user.role || 'student';
  const organization = await resolveOrganizationContext(db, {
    session: {
      expires: new Date(Date.now() + 60_000).toISOString(),
      user: { id: user._id.toString(), role },
    },
  });

  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phoneNumber,
    role,
    organizationId: organization.organizationId,
    organizationSlug: organization.organizationSlug,
    organizationType: organization.organizationType,
    isDefaultOrganization: organization.isDefaultOrganization,
    isPlatformAdmin: organization.isPlatformAdmin,
  };
}
