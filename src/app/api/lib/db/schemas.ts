import { z } from 'zod';
import { dbCollections } from './collections';

// Base schemas for common fields
const baseSchema = z.object({
  _id: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by_id: z.string().optional(),
  updated_by_id: z.string().optional(),
});

// Collection-specific schemas
export const collectionSchemas = {
  [dbCollections.users.name]: baseSchema.extend({
    name: z.string(),
    email: z.string().email(),
    role: z.string().optional(),
  }),

  [dbCollections.schools.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
  }),

  [dbCollections.programs.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
    school_id: z.string(),
  }),

  [dbCollections.courses.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
    program_id: z.string().optional(),
  }),

  [dbCollections.units.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
    topic_id: z.string().optional(),
    subject_id: z.string().optional(),
    grade_id: z.string().optional(),
  }),

  [dbCollections.topics.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
    unit_id: z.string().optional(),
    subject_id: z.string().optional(),
    grade_id: z.string().optional(),
  }),

  [dbCollections.media_content.name]: baseSchema.extend({
    title: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    type: z.string(),
    topic_id: z.string().optional(),
    name: z.string(),
    topicId: z.string().optional(),
    unitId: z.string().optional(),
    schoolId: z.string().optional(),
    programId: z.string().optional(),
    courseId: z.string().optional(),
    subjectId: z.string().optional(),
    gradeId: z.string().optional(),
    fileUrl: z.string().optional().nullable(),
    thumbnailUrl: z.string().optional(),
    externalUrl: z.string().optional().nullable(),
  }),

  [dbCollections.grades.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
  }),

  [dbCollections.subjects.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
    grade_id: z.string(),
  }),

  [dbCollections.user_roles.name]: baseSchema.extend({
    name: z.string(),
    description: z.string().optional(),
    permissions: z.array(z.string()).optional(),
  }),

  [dbCollections.settings.name]: baseSchema.extend({
    key: z.string().default('global_settings'),
    isActive: z.boolean().optional().default(true),
    lastUpdated: z.date().optional(),
    scope: z.enum(['global', 'user', 'school']).optional().default('global'),
    institutions: z
      .array(
        z.object({
          _id: z.string(),
          name: z.string(),
          type: z.enum(['highSchool', 'college', 'other']).optional(),
          address: z.string().optional(),
          contactInfo: z.string().optional(),
          isActive: z.boolean().optional().default(true),
          isConfigured: z.boolean().optional().default(false),
        }),
      )
      .optional()
      .default([]),
    version: z.number().optional().default(1),
    uploadSetup: z.enum(['local', 's3']).optional().default('s3'),
  }),
};

export function validateCollectionData(collectionName: string, data: any) {
  const schema = collectionSchemas[collectionName];
  if (!schema) {
    throw new Error(`No schema defined for collection: ${collectionName}`);
  }

  return schema.parse(data);
}

export function prepareDataForValidation(data: any) {
  const preparedData = { ...data };

  if (preparedData.created_at && typeof preparedData.created_at === 'string') {
    preparedData.created_at = new Date(preparedData.created_at);
  }

  if (preparedData.updated_at && typeof preparedData.updated_at === 'string') {
    preparedData.updated_at = new Date(preparedData.updated_at);
  }

  return preparedData;
}
