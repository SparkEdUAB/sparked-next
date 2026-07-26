import { Db, ObjectId } from 'mongodb';
import { dbCollections } from '../collections';

export type UserRecord = {
  _id: ObjectId;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  organization_id?: ObjectId;
  institution_id?: ObjectId;
};

export class UsersRepository {
  constructor(private readonly db: Db) {}

  findByEmail(email: string) {
    return this.db.collection<UserRecord>(dbCollections.users.name).findOne(
      { email: email.trim().toLowerCase() },
      {
        projection: {
          email: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          password: 1,
          role: 1,
          organization_id: 1,
          institution_id: 1,
        },
      },
    );
  }

  async findRoleName(userId: ObjectId) {
    const mapping = await this.db.collection(dbCollections.user_role_mappings.name).findOne({ user_id: userId });
    if (!mapping?.role_id) {
      return null;
    }

    const role = await this.db.collection(dbCollections.user_roles.name).findOne({ _id: mapping.role_id });
    return typeof role?.name === 'string' ? role.name : null;
  }
}
