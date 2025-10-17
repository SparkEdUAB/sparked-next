export const p_fetchInstitutionsWithCreator = (limit: number, skip: number) => [
  {
    $skip: skip,
  },
  {
    $limit: limit,
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
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      type: 1,
      logo: 1,
      website: 1,
      address: 1,
      contact_email: 1,
      contact_phone: 1,
      is_verified: 1,
      created_at: 1,
      updated_at: 1,
      'user.email': 1,
      'user.firstName': 1,
      'user.lastName': 1,
    },
  },
  {
    $sort: {
      created_at: -1,
    },
  },
];