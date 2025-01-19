import { BSON } from 'mongodb';

export const p_fetchUserRoleDetails = ({
  userId,
}: {
  userId: string;
  limit?: number;
  skip?: number;
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
