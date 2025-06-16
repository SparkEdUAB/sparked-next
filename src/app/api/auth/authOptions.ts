import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      // @ts-expect-error
      async authorize(credentials) {
        // @ts-expect-error
        const { jwtToken } = credentials;

        try {
          const user = { ...credentials };
          return { ...user, token: jwtToken };
        } catch {
          return null;
        }
      },
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.email && session.user) {
        if (token.userData) {
          // @ts-expect-error
          session.user = { ...session.user, ...token.userData, role: token.role };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error
        token.role = user.role;
      }

      if (token.userData) {
        return token;
      }

      if (token.email) {
        const db = await dbClient();
        if (db) {
          const userWithRole = await db
            .collection(dbCollections.users.name)
            .aggregate([
              { $match: { email: token.email } },
              {
                $lookup: {
                  from: dbCollections.user_role_mappings.name,
                  localField: '_id',
                  foreignField: 'user_id',
                  as: 'roleMapping',
                },
              },
              { $unwind: { path: '$roleMapping', preserveNullAndEmptyArrays: true } },
              {
                $lookup: {
                  from: dbCollections.user_roles.name,
                  localField: 'roleMapping.role_id',
                  foreignField: '_id',
                  as: 'role',
                },
              },
              { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  institutionId: 1,
                  grade: 1,
                  'role.name': 1,
                },
              },
            ])
            .toArray();

          const userData = userWithRole[0];

          if (userData) {
            token.userData = {
              fullName: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              institutionId: userData.institutionId?.toString(),
              _id: userData._id?.toString(),
              grade: userData.grade,
            };

            if (userData.role?.name) {
              token.role = userData.role.name;
            }
          }
        }
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
