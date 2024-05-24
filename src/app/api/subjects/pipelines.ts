import { BSON } from 'mongodb';
import { T_RECORD } from 'types';

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
      from: 'grade',
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
      name: 1,
      description: 1,
      ...project,
    },
  },
];
