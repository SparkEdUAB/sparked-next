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
      'grade.name': 1,
      'grade._id': 1,
      ...project,
    },
  },
];
