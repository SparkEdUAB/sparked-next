import { T_RECORD } from 'types';

export const p_fetchProgramsWithCreator = (limit?: number, skip?: number) => [
  {
    $lookup: {
      from: 'users',
      localField: 'created_by_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
  {
    $lookup: {
      from: 'schools',
      localField: 'school_id',
      foreignField: '_id',
      as: 'school',
    },
  },
  {
    $unwind: '$school',
  },

  {
    $project: {
      updated_at: 1,
      name: 1,
      description: 1,
      created_at: 1,
      _id: 1,
      'user._id': 1,
      'user.name': 1,
      'user.email': 1,
      'school.name': 1,
      'school._id': 1,
    },
  },
];

export const p_fetchCoursesWithMetaData = ({
  query = {},
  skip = 0,
  limit = 1000,
  project,
}: {
  query?: object;
  limit?: number;
  skip?: number;
  project: T_RECORD;
}) => [
  {
    $match: query,
  },

  {
    $lookup: {
      from: 'users',
      localField: 'created_by_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
  {
    $lookup: {
      from: 'schools',
      localField: 'school_id',
      foreignField: '_id',
      as: 'school',
    },
  },
  {
    $unwind: {
      path: '$school',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'programs',
      localField: 'program_id',
      foreignField: '_id',
      as: 'program',
    },
  },
  {
    $unwind: {
      path: '$program',
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $project: {
      updated_at: 1,
      name: 1,
      description: 1,
      created_at: 1,
      _id: 1,
      'user._id': 1,
      'user.name': 1,
      'user.email': 1,
      ...project,
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
];
