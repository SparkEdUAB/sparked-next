import { dbCollections } from '../collections';
import {
  DEFAULT_ORGANIZATION_SLUG,
  ensureDefaultOrganization,
  slugifyOrganizationName,
} from '../../organization';
import { Db, Document, ObjectId, WithId } from 'mongodb';

const TENANT_SCOPED_COLLECTIONS = [
  dbCollections.users.name,
  dbCollections.schools.name,
  dbCollections.programs.name,
  dbCollections.courses.name,
  dbCollections.units.name,
  dbCollections.topics.name,
  dbCollections.media_content.name,
  dbCollections.grades.name,
  dbCollections.subjects.name,
  dbCollections.page_links.name,
  dbCollections.page_actions.name,
  dbCollections.page_views.name,
  dbCollections.searches.name,
  dbCollections.content_categories.name,
  dbCollections.media_reactions.name,
] as const;

export async function addDefaultOrganizationAndTenantData(db: Db) {
  const defaultOrganization = await ensureDefaultOrganization(db);
  await normalizeInstitutions(db, defaultOrganization._id);
  await backfillUsers(db, defaultOrganization._id);

  for (const collectionName of TENANT_SCOPED_COLLECTIONS) {
    await backfillTenantScopedCollection(db, collectionName, defaultOrganization._id);
  }
}

async function normalizeInstitutions(db: Db, defaultOrganizationId: ObjectId) {
  const institutions = db.collection(dbCollections.institutions.name);
  const cursor = institutions.find({});
  let index = 0;

  for await (const institution of cursor) {
    const slugBase =
      institution.slug ||
      (institution._id.equals(defaultOrganizationId)
        ? DEFAULT_ORGANIZATION_SLUG
        : slugifyOrganizationName(institution.name || `organization-${index + 1}`));

    let slug = slugBase || `organization-${index + 1}`;
    let suffix = 1;

    while (
      (
        await institutions.findOne({
          _id: { $ne: institution._id },
          slug,
        })
      ) !== null
    ) {
      suffix += 1;
      slug = `${slugBase}-${suffix}`;
    }

    await institutions.updateOne(
      { _id: institution._id },
      {
        $set: {
          slug,
          status: institution.status || 'active',
          is_default: institution._id.equals(defaultOrganizationId),
          type: institution.type || 'organization',
          is_verified: institution.is_verified ?? institution._id.equals(defaultOrganizationId),
        },
      },
    );

    index += 1;
  }
}

async function backfillUsers(db: Db, defaultOrganizationId: ObjectId) {
  await db.collection(dbCollections.users.name).updateMany(
    {
      $or: [{ organization_id: { $exists: false } }, { organization_id: null }],
    },
    [
      {
        $set: {
          organization_id: { $ifNull: ['$institution_id', defaultOrganizationId] },
        },
      },
    ],
  );
}

async function backfillTenantScopedCollection(db: Db, collectionName: string, defaultOrganizationId: ObjectId) {
  const collection = db.collection(collectionName);
  const cursor = collection.find({
    $or: [{ organization_id: { $exists: false } }, { organization_id: null }],
  });

  for await (const doc of cursor) {
    const organizationId = await deriveOrganizationId(db, doc, defaultOrganizationId);
    await collection.updateOne(
      { _id: doc._id },
      {
        $set: {
          organization_id: organizationId,
        },
      },
    );
  }
}

async function deriveOrganizationId(db: Db, doc: WithId<Document>, defaultOrganizationId: ObjectId) {
  const directOrganizationId = asObjectId(doc.organization_id) || asObjectId(doc.institution_id);
  if (directOrganizationId) return directOrganizationId;

  const lookups: Array<[string, string]> = [
    ['school_id', dbCollections.schools.name],
    ['program_id', dbCollections.programs.name],
    ['course_id', dbCollections.courses.name],
    ['unit_id', dbCollections.units.name],
    ['topic_id', dbCollections.topics.name],
    ['subject_id', dbCollections.subjects.name],
    ['grade_id', dbCollections.grades.name],
    ['user_id', dbCollections.users.name],
    ['created_by_id', dbCollections.users.name],
    ['updated_by_id', dbCollections.users.name],
    ['createdById', dbCollections.users.name],
    ['updatedById', dbCollections.users.name],
    ['reported_by_id', dbCollections.users.name],
  ];

  for (const [fieldName, collectionName] of lookups) {
    const relatedId = asObjectId(doc[fieldName]);
    if (!relatedId) continue;

    const relatedDoc = await db.collection(collectionName).findOne(
      { _id: relatedId },
      {
        projection: {
          organization_id: 1,
          institution_id: 1,
        },
      },
    );

    const relatedOrganizationId =
      asObjectId(relatedDoc?.organization_id) || asObjectId(relatedDoc?.institution_id);

    if (relatedOrganizationId) return relatedOrganizationId;
  }

  return defaultOrganizationId;
}

function asObjectId(value: unknown) {
  if (value instanceof ObjectId) return value;
  if (typeof value === 'string' && ObjectId.isValid(value)) return new ObjectId(value);
  return undefined;
}
