import { T_RECORD } from 'types';
import { dbCollections } from '../lib/db/collections';

export const p_fetchUnitsWithMetaData = ({
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

  {
    $lookup: {
      from: dbCollections.users.name,
      localField: 'created_by_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
  // TODO: This lookup should be decoupled into a reusable constant
  // {
  //   $lookup: {
  //     from: dbCollections.schools.name,
  //     localField: 'school_id',
  //     foreignField: '_id',
  //     as: 'school',
  //   },
  // },
  // {
  //   $unwind: {
  //     path: '$school',
  //     preserveNullAndEmptyArrays: true,
  //   },
  // },
  // {
  //   $lookup: {
  //     from: dbCollections.programs.name,
  //     localField: 'program_id',
  //     foreignField: '_id',
  //     as: 'program',
  //   },
  // },
  // {
  //   $unwind: {
  //     path: '$program',
  //     preserveNullAndEmptyArrays: true,
  //   },
  // },
  // {
  //   $lookup: {
  //     from: dbCollections.courses.name,
  //     localField: 'course_id',
  //     foreignField: '_id',
  //     as: 'course',
  //   },
  // },
  // {
  //   $unwind: {
  //     path: '$course',
  //     preserveNullAndEmptyArrays: true,
  //   },
  // },
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
      updated_at: 1,
      name: 1,
      description: 1,
      created_at: 1,
      _id: 1,
      'user._id': 1,
      'user.name': 1,
      'user.email': 1,
      'subject._id': 1,
      'subject.name': 1,
      'grade.name': 1,
      'grade._id': 1,
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
