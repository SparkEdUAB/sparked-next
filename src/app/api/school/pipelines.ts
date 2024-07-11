export const p_fetchSchoolsWithCreator = (limit?: number, skip?: number) => [
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
    $project: {
      updated_at: 1,
      name: 1,
      description: 1,
      created_at: 1,
      _id: 1,
      'user._id': 1,
      'user.name': 1,
      'user.email': 1,
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
];
