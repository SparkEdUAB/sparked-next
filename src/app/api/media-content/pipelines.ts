import { T_RECORD } from 'types';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';

export const p_fetchMediaContentWithMetaData = ({
  query = {},
  skip = 0,
  limit = 1000,
  project = {},
}: {
  query?: Record<string, any>;
  limit?: number;
  skip?: number;
  project?: T_RECORD;
}) => [
  {
    $match: query,
  },

  // {
  //   $lookup: {
  //     from: dbCollections.users.name,
  //     localField: 'created_by_id',
  //     foreignField: '_id',
  //     as: 'user',
  //   },
  // },
  // {
  //   $unwind: '$user',
  // },
  {
    $lookup: {
      from: dbCollections.schools.name,
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
      from: dbCollections.programs.name,
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
    $lookup: {
      from: dbCollections.courses.name,
      localField: 'course_id',
      foreignField: '_id',
      as: 'course',
    },
  },
  {
    $unwind: {
      path: '$course',
      preserveNullAndEmptyArrays: true,
    },
  },
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
  {
    $lookup: {
      from: dbCollections.topics.name,
      localField: 'topic_id',
      foreignField: '_id',
      as: 'topic',
    },
  },
  {
    $unwind: {
      path: '$topic',
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
    $project: {
      updated_at: 1,
      name: 1,
      description: 1,
      created_at: 1,
      _id: 1,
      // 'user._id': 1,
      // 'user.name': 1,
      // 'user.email': 1,
      'course._id': 1,
      'course.name': 1,
      'unit.name': 1,
      'unit._id': 1,
      'topic.name': 1,
      'topic._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      'subject.name': 1,
      'subject._id': 1,
      file_url: 1,
      external_url: 1,
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

export const p_fetchRandomMediaContent = ({
  query = {},
  skip = 0,
  limit = 1000,
}: {
  query?: object;
  limit?: number;
  skip?: number;
}) => [
  {
    $match: query,
  },
  {
    $sample: { size: limit },
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
  {
    $lookup: {
      from: dbCollections.courses.name,
      localField: 'course_id',
      foreignField: '_id',
      as: 'course',
    },
  },
  {
    $unwind: {
      path: '$course',
      preserveNullAndEmptyArrays: true,
    },
  },
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
  {
    $lookup: {
      from: dbCollections.topics.name,
      localField: 'topic_id',
      foreignField: '_id',
      as: 'topic',
    },
  },
  {
    $unwind: {
      path: '$topic',
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
    $project: {
      updated_at: 1,
      name: 1,
      description: 1,
      created_at: 1,
      _id: 1,
      'user._id': 1,
      'user.name': 1,
      'user.email': 1,
      'course._id': 1,
      'course.name': 1,
      'unit.name': 1,
      'unit._id': 1,
      'topic.name': 1,
      'topic._id': 1,
      'grade.name': 1,
      'grade._id': 1,
      'subject.name': 1,
      'subject._id': 1,
      file_url: 1,
      external_url: 1,
    },
  },
  {
    $skip: skip,
  },
];

export const p_fetchRelatedMediaContent = ({
  query,
  mediaContentId,
  limit = 100,
  skip = 0,
}: {
  query: {
    topic_id?: BSON.ObjectId;
    unit_id?: BSON.ObjectId;
    subject_id?: BSON.ObjectId;
    grade_id?: BSON.ObjectId;
  };
  mediaContentId: BSON.ObjectId;
  limit: number;
  skip: number;
}) => [
  {
    $facet: {
      sameCourse: [
        {
          $match: {
            ...query,
            subject_id: query.subject_id,
            _id: { $ne: mediaContentId },
          },
        },
        { $limit: limit },
      ],
      sameGrade: [
        {
          $match: {
            ...query,
            grade_id: query.grade_id,
            _id: { $ne: mediaContentId },
          },
        },
        { $limit: limit },
      ],
    },
  },
  {
    $project: {
      combined: { $setUnion: ['$sameCourse', '$sameGrade'] },
    },
  },
  {
    $unwind: '$combined',
  },
  {
    $group: {
      _id: '$combined._id',
      doc: { $first: '$combined' },
    },
  },
  {
    $replaceRoot: { newRoot: '$doc' },
  },
  { $skip: skip },
  { $limit: limit },
];
