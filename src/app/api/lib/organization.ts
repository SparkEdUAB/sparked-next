import { dbCollections } from './db/collections';
import { Db, Document, Filter, ObjectId } from 'mongodb';
import { Session } from 'next-auth';

export const DEFAULT_ORGANIZATION_NAME = 'Sparked Default Organization';
export const DEFAULT_ORGANIZATION_SLUG = 'default';

type OrganizationDocument = Document & {
  _id: ObjectId;
  name: string;
  slug?: string;
  type?: 'school' | 'college' | 'university' | 'organization';
  is_default?: boolean;
  is_verified?: boolean;
  status?: 'active' | 'inactive';
};

export type OrganizationContext = {
  organizationId: string;
  organizationObjectId: ObjectId;
  organizationSlug: string;
  organizationType: string;
  isDefaultOrganization: boolean;
  isPlatformAdmin: boolean;
};

type SessionWithOrganization = Session & {
  user?: Session['user'] & {
    organizationId?: string;
    organizationSlug?: string;
    organizationType?: string;
    isDefaultOrganization?: boolean;
    isPlatformAdmin?: boolean;
  };
};

const PLATFORM_ADMIN_ROLE_NAMES = new Set(['admin', 'platform admin', 'platform-admin']);

export function slugifyOrganizationName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function toObjectId(value?: string | ObjectId | null) {
  if (!value) return undefined;
  if (value instanceof ObjectId) return value;
  if (!ObjectId.isValid(value)) return undefined;
  return new ObjectId(value);
}

export function isPlatformAdminSession(session?: Session | null) {
  const role = session?.user?.role?.toString().toLowerCase();
  return Boolean(role && PLATFORM_ADMIN_ROLE_NAMES.has(role));
}

export function getCanonicalOrganizationId(input: {
  organizationId?: string | null;
  institutionId?: string | null;
  schoolId?: string | null;
}) {
  return input.organizationId || input.institutionId || undefined;
}

export async function ensureDefaultOrganization(db: Db) {
  const institutions = db.collection<OrganizationDocument>(dbCollections.institutions.name);

  const existingDefault =
    (await institutions.findOne({
      $or: [{ is_default: true }, { slug: DEFAULT_ORGANIZATION_SLUG }],
    })) || null;

  if (existingDefault) {
    const slug = existingDefault.slug || DEFAULT_ORGANIZATION_SLUG;
    await institutions.updateOne(
      { _id: existingDefault._id },
      {
        $set: {
          slug,
          status: existingDefault.status || 'active',
          is_default: true,
          is_verified: existingDefault.is_verified ?? true,
          type: existingDefault.type || 'organization',
        },
      },
    );

    return {
      ...existingDefault,
      slug,
      status: existingDefault.status || 'active',
      is_default: true,
      is_verified: existingDefault.is_verified ?? true,
      type: existingDefault.type || 'organization',
    };
  }

  const now = new Date();
  const defaultOrganization: OrganizationDocument = {
    _id: new ObjectId(),
    name: DEFAULT_ORGANIZATION_NAME,
    slug: DEFAULT_ORGANIZATION_SLUG,
    description: 'Default organization for legacy and single-tenant Sparked records.',
    type: 'organization',
    is_default: true,
    status: 'active',
    is_verified: true,
    created_at: now,
    updated_at: now,
    created_by_id: new ObjectId('000000000000000000000000'),
  };

  await institutions.insertOne(defaultOrganization);

  return defaultOrganization;
}

async function findOrganizationById(db: Db, organizationId?: string | ObjectId | null) {
  const _id = toObjectId(organizationId);
  if (!_id) return null;

  return db.collection<OrganizationDocument>(dbCollections.institutions.name).findOne({ _id });
}

export async function listActiveOrganizations(db: Db) {
  return db
    .collection<OrganizationDocument>(dbCollections.institutions.name)
    .find({
      status: 'active',
      $or: [{ is_verified: true }, { is_default: true }],
    })
    .sort({ name: 1 })
    .toArray();
}

export async function resolveOrganizationContext(
  db: Db,
  options: {
    session?: Session | null;
    organizationId?: string | ObjectId | null;
    institutionId?: string | ObjectId | null;
  } = {},
): Promise<OrganizationContext> {
  const defaultOrganization = await ensureDefaultOrganization(db);
  const sessionWithOrganization = options.session as SessionWithOrganization | undefined;
  const isPlatformAdmin = isPlatformAdminSession(options.session);
  const explicitOrganizationId = options.organizationId || options.institutionId;
  const sessionOrganizationId = sessionWithOrganization?.user?.organizationId;

  let organization =
    (await findOrganizationById(db, explicitOrganizationId)) ||
    (await findOrganizationById(db, sessionOrganizationId)) ||
    null;

  if (!organization && options.session?.user?.id) {
    const user = await db.collection(dbCollections.users.name).findOne(
      { _id: new ObjectId(options.session.user.id) },
      {
        projection: {
          organization_id: 1,
          institution_id: 1,
        },
      },
    );

    organization =
      (await findOrganizationById(db, user?.organization_id || user?.institution_id || null)) || null;
  }

  const resolvedOrganization = organization || defaultOrganization;

  return {
    organizationId: resolvedOrganization._id.toString(),
    organizationObjectId: resolvedOrganization._id,
    organizationSlug: resolvedOrganization.slug || DEFAULT_ORGANIZATION_SLUG,
    organizationType: resolvedOrganization.type || 'organization',
    isDefaultOrganization: Boolean(resolvedOrganization.is_default),
    isPlatformAdmin,
  };
}

export async function buildScopedQuery<T extends Document>(
  db: Db,
  session: Session | null | undefined,
  baseQuery: Filter<T> = {},
  options: {
    organizationId?: string | null;
    institutionId?: string | null;
    includeLegacyUnscopedForDefault?: boolean;
  } = {},
): Promise<Filter<T>> {
  const context = await resolveOrganizationContext(db, {
    session,
    organizationId: options.organizationId,
    institutionId: options.institutionId,
  });

  if (context.isPlatformAdmin && !options.organizationId && !options.institutionId) {
    return baseQuery;
  }

  const organizationFilter = options.includeLegacyUnscopedForDefault && context.isDefaultOrganization
    ? ({
        $or: [
          { organization_id: context.organizationObjectId },
          { organization_id: { $exists: false } },
          { organization_id: null },
        ],
      } as unknown as Filter<T>)
    : ({ organization_id: context.organizationObjectId } as unknown as Filter<T>);

  return {
    $and: [baseQuery, organizationFilter],
  } as Filter<T>;
}

export async function normalizeOrganizationPayload(
  db: Db,
  session: Session | null | undefined,
  payload: {
    organizationId?: string | null;
    institutionId?: string | null;
  } = {},
) {
  const context = await resolveOrganizationContext(db, {
    session,
    organizationId: payload.organizationId,
    institutionId: payload.institutionId,
  });

  return {
    organization_id: context.organizationObjectId,
    institution_id: toObjectId(payload.institutionId) || context.organizationObjectId,
    organizationContext: context,
  };
}
