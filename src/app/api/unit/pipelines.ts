import { T_RECORD } from 'types';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';

export const p_fetchUnitsWithMetaData = ({
  query = {},
  skip = 0,
  limit = 1000,
  project = {},
}: {
  query?: object;
  limit?: number;
  skip?: number;
  project?: T_RECORD;
}) => [
  {
    $match: query,
  },
  // Join with users collection for creator info
  {
    $lookup: {
      from: dbCollections.users.name,
      localField: 'created_by_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true,
    },
  },
  // Join with subjects collection
  {
    $lookup: {
      from: dbCollections.subjects.name,
      localField: 'subject_id',
      foreignField: '_id',
      as: 'subject',
    },
  },
  {
    $unwind: {
      path: '$subject',
      preserveNullAndEmptyArrays: true,
    },
  },
  // Join with grades collection
  {
    $lookup: {
      from: dbCollections.grades.name,
      localField: 'grade_id',
      foreignField: '_id',
      as: 'grade',
    },
  },
  {
    $unwind: {
      path: '$grade',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
  {
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      created_at: 1,
      updated_at: 1,
      subject_id: 1,
      grade_id: 1,
      'subject.name': 1,
      'subject._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      'user.name': 1,
      'user._id': 1,
      // Add flattened field names for easier access
      grade_name: '$grade.name',
      subject_name: '$subject.name',
      ...project,
    },
  },
];

// Pipeline for fetching units by subject ID
export const p_fetchUnitsBySubjectId = ({
  subjectId,
  limit = 100,
  skip = 0,
}: {
  subjectId: string;
  limit?: number;
  skip?: number;
}) => [
  {
    $match: {
      subject_id: new BSON.ObjectId(subjectId),
    },
  },
  // Join with subjects collection
  {
    $lookup: {
      from: dbCollections.subjects.name,
      localField: 'subject_id',
      foreignField: '_id',
      as: 'subject',
    },
  },
  {
    $unwind: {
      path: '$subject',
      preserveNullAndEmptyArrays: true,
    },
  },
  // Join with grades collection
  {
    $lookup: {
      from: dbCollections.grades.name,
      localField: 'grade_id',
      foreignField: '_id',
      as: 'grade',
    },
  },
  {
    $unwind: {
      path: '$grade',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
  {
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      subject_id: 1,
      grade_id: 1,
      'subject.name': 1,
      'subject._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      // Add flattened field names for easier access
      grade_name: '$grade.name',
      subject_name: '$subject.name',
    },
  },
];

// Pipeline for fetching units by grade ID
export const p_fetchUnitsByGradeId = ({
  gradeId,
  limit = 100,
  skip = 0,
}: {
  gradeId: string;
  limit?: number;
  skip?: number;
}) => [
  {
    $match: {
      grade_id: new BSON.ObjectId(gradeId),
    },
  },
  // Join with subjects collection
  {
    $lookup: {
      from: dbCollections.subjects.name,
      localField: 'subject_id',
      foreignField: '_id',
      as: 'subject',
    },
  },
  {
    $unwind: {
      path: '$subject',
      preserveNullAndEmptyArrays: true,
    },
  },
  // Join with grades collection
  {
    $lookup: {
      from: dbCollections.grades.name,
      localField: 'grade_id',
      foreignField: '_id',
      as: 'grade',
    },
  },
  {
    $unwind: {
      path: '$grade',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
  {
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      subject_id: 1,
      grade_id: 1,
      'subject.name': 1,
      'subject._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      // Add flattened field names for easier access
      grade_name: '$grade.name',
      subject_name: '$subject.name',
    },
  },
];
