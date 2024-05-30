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
      from: 'subject',
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
      ...project,
    },
  },
];
