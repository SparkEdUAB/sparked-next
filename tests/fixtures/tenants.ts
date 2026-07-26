export const SUPPORTED_ROLES = ['Admin', 'Content Manager', 'Editor', 'student'] as const;

export type SupportedRole = (typeof SUPPORTED_ROLES)[number];

export const SYNTHETIC_TENANTS = [
  {
    id: '64b000000000000000000001',
    slug: 'fixture-north',
    name: 'Fixture North Academy',
  },
  {
    id: '64b000000000000000000002',
    slug: 'fixture-south',
    name: 'Fixture South Academy',
  },
] as const;

export const SYNTHETIC_USERS = SYNTHETIC_TENANTS.flatMap((organization) =>
  SUPPORTED_ROLES.map((role) => ({
    id: `${organization.slug}-${role.toLowerCase().replaceAll(' ', '-')}`,
    email: `${role.toLowerCase().replaceAll(' ', '.')}@${organization.slug}.test`,
    firstName: role,
    lastName: 'Fixture',
    organizationId: organization.id,
    role,
  })),
);
