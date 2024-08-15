import { BSON } from 'mongodb';
import { T_RECORD } from 'types';

export const p_fetchUserRoleDetails = ({
  userId,
  project = {},
}: {
  userId: string;
  limit?: number;
  skip?: number;
  project?: T_RECORD;
}) => [
  {
    $match: {
      user_id: new BSON.ObjectId(userId),
    },
  },
  {
    $lookup: {
      from: 'user_roles',
      localField: 'role_id',
      foreignField: '_id',
      as: 'role_details',
    },
  },
  {
    $unwind: '$role_details',
  },
];
