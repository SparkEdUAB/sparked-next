import { T_RECORD } from 'types';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';

export const p_fetchTopicsWithMetaData = ({
  query = {},
  skip = 0,
  limit = 1000,
  project = {},
}: {
  query?: object;
  limit?: number;
  skip?: number;
  project: T_RECORD;
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
  // Join with units collection (optional)
  {
    $lookup: {
      from: dbCollections.units.name,
      localField: 'unit_id',
      foreignField: '_id',
      as: 'unit',
    },
  },
  {
    $unwind: {
      path: '$unit',
      preserveNullAndEmptyArrays: true,
    },
  },
  // Join with grades collection (if needed)
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
      unit_id: 1,
      grade_id: 1,
      'subject.name': 1,
      'subject._id': 1,
      'unit.name': 1,
      'unit._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      grade_name: '$grade.name',
      subject_name: '$subject.name',
      unit_name: '$unit.name',
      'user.name': 1,
      'user._id': 1,
      ...project,
    },
  },
];

// Pipeline for fetching topics by unit ID
export const p_fetchTopicsByUnitId = ({
  unitId,
  limit = 100,
  skip = 0,
}: {
  unitId: string;
  limit?: number;
  skip?: number;
}) => [
  {
    $match: {
      unit_id: new BSON.ObjectId(unitId),
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
  // Join with units collection
  {
    $lookup: {
      from: dbCollections.units.name,
      localField: 'unit_id',
      foreignField: '_id',
      as: 'unit',
    },
  },
  {
    $unwind: {
      path: '$unit',
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
      unit_id: 1,
      grade_id: 1,
      'subject.name': 1,
      'subject._id': 1,
      'unit.name': 1,
      'unit._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      grade_name: '$grade.name',
      subject_name: '$subject.name',
      unit_name: '$unit.name',
    },
  },
];

// Pipeline for fetching topics by subject ID
export const p_fetchTopicsBySubjectId = ({
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
  // Join with units collection (optional)
  {
    $lookup: {
      from: dbCollections.units.name,
      localField: 'unit_id',
      foreignField: '_id',
      as: 'unit',
    },
  },
  {
    $unwind: {
      path: '$unit',
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
      unit_id: 1,
      grade_id: 1,
      'subject.name': 1,
      'subject._id': 1,
      'unit.name': 1,
      'unit._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      grade_name: '$grade.name',
      subject_name: '$subject.name',
      unit_name: '$unit.name',
    },
  },
];
