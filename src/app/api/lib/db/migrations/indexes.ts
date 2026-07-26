import { Collection, Db, Document, IndexDescription } from 'mongodb';
import { dbCollections } from '../collections';

export type RequiredIndex = {
  collection: string;
  index: IndexDescription;
};

const tenantScope = { organization_id: 1 } as const;

export const requiredIndexes: RequiredIndex[] = [
  {
    collection: dbCollections.institutions.name,
    index: {
      key: { slug: 1 },
      name: 'institution_slug_unique',
      unique: true,
      partialFilterExpression: { slug: { $type: 'string' } },
    },
  },
  {
    collection: dbCollections.users.name,
    index: {
      key: { ...tenantScope, email: 1 },
      name: 'user_organization_email_unique',
      unique: true,
      partialFilterExpression: { organization_id: { $exists: true }, email: { $type: 'string' } },
    },
  },
  {
    collection: dbCollections.user_roles.name,
    index: { key: { name: 1 }, name: 'user_role_name_unique', unique: true },
  },
  {
    collection: dbCollections.user_role_mappings.name,
    index: { key: { user_id: 1 }, name: 'user_role_mapping_user_unique', unique: true },
  },
  {
    collection: dbCollections.schools.name,
    index: { key: { ...tenantScope, name: 1 }, name: 'school_organization_name' },
  },
  {
    collection: dbCollections.programs.name,
    index: { key: { ...tenantScope, school_id: 1, name: 1 }, name: 'program_organization_school_name' },
  },
  {
    collection: dbCollections.courses.name,
    index: { key: { ...tenantScope, program_id: 1, name: 1 }, name: 'course_organization_program_name' },
  },
  {
    collection: dbCollections.units.name,
    index: { key: { ...tenantScope, course_id: 1, name: 1 }, name: 'unit_organization_course_name' },
  },
  {
    collection: dbCollections.topics.name,
    index: {
      key: { ...tenantScope, unit_id: 1, subject_id: 1, name: 1 },
      name: 'topic_organization_relationship_name',
    },
  },
  {
    collection: dbCollections.grades.name,
    index: { key: { ...tenantScope, name: 1 }, name: 'grade_organization_name' },
  },
  {
    collection: dbCollections.subjects.name,
    index: { key: { ...tenantScope, grade_id: 1, name: 1 }, name: 'subject_organization_grade_name' },
  },
  {
    collection: dbCollections.media_content.name,
    index: { key: { ...tenantScope, title: 1, createdAt: -1 }, name: 'media_organization_title_created' },
  },
  {
    collection: dbCollections.media_content.name,
    index: { key: { ...tenantScope, createdAt: -1 }, name: 'media_organization_created' },
  },
  {
    collection: dbCollections.page_links.name,
    index: { key: { ...tenantScope, resource_id: 1 }, name: 'page_link_organization_resource' },
  },
  {
    collection: dbCollections.page_actions.name,
    index: { key: { ...tenantScope, resource_id: 1 }, name: 'page_action_organization_resource' },
  },
  {
    collection: dbCollections.media_reactions.name,
    index: {
      key: { ...tenantScope, mediaId: 1, user_id: 1 },
      name: 'media_reaction_organization_media_user_unique',
      unique: true,
    },
  },
  {
    collection: dbCollections.searches.name,
    index: { key: { ...tenantScope, createdAt: -1 }, name: 'search_organization_created' },
  },
];

export async function createRequiredIndexes(db: Db) {
  await Promise.all(
    requiredIndexes.map(({ collection, index }) => db.collection(collection).createIndex(index.key, index)),
  );
  return { createdIndexes: requiredIndexes.length };
}

export async function verifyRequiredIndexes(db: Db) {
  const missing: string[] = [];

  for (const { collection, index } of requiredIndexes) {
    let indexes: Document[];
    try {
      indexes = await (db.collection(collection) as Collection<Document>).listIndexes().toArray();
    } catch (error) {
      const mongoError = error as { code?: number; codeName?: string };
      if (mongoError.code !== 26 && mongoError.codeName !== 'NamespaceNotFound') {
        throw error;
      }
      missing.push(`${collection}.${index.name}`);
      continue;
    }

    if (!indexes.some((existing) => existing.name === index.name)) {
      missing.push(`${collection}.${index.name}`);
    }
  }

  return { verified: missing.length === 0, missing };
}
