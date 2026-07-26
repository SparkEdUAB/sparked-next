import bcrypt from 'bcryptjs';
import { dbClient } from '../db';
import { UsersRepository } from '../db/repositories/users';
import { resolveOrganizationContext } from '../organization';

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
  if (!email || !password) {
    return null;
  }

  const db = await dbClient();
  const users = new UsersRepository(db);
  const user = await users.findByEmail(email);
  if (!user?.password || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  const role = (await users.findRoleName(user._id)) || user.role || 'student';
  const organization = await resolveOrganizationContext(db, {
    session: {
      expires: new Date(Date.now() + 60_000).toISOString(),
      user: { id: user._id.toString(), role },
    },
    organizationId: user.organization_id?.toString() || user.institution_id?.toString(),
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
