import { T_RECORD } from 'types';
import { dbCollections } from '../lib/db/collections';

export const p_fetchSubjectWithGrade = ({
  limit = 1000,
  skip = 0,
  project,
}: {
  limit?: number;
  skip?: number;
  project: T_RECORD;
}) => [
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
      grade_id: 1,
      grade_name: '$grade.name',
      ...project,
    },
  },
  { $sort: { name: 1 } },
];

export const p_findSubjectByName = ({
  name,
  limit = 100,
  skip = 0,
}: {
  name: string;
  limit?: number;
  skip?: number;
}) => [
  {
    $match: {
      name: { $regex: new RegExp(name, 'i') },
    },
  },
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
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      grade_id: 1,
      grade_name: '$grade.name',
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
];

export const p_findSubjectByName = ({
  name,
  limit = 100,
  skip = 0,
}: {
  name: string;
  limit?: number;
  skip?: number;
}) => [
  {
    $match: {
      name: { $regex: new RegExp(name, 'i') },
    },
  },
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
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      grade_id: 1,
      grade_name: '$grade.name',
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
];
