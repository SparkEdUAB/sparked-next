import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      // @ts-expect-error
      async authorize(credentials) {
        // @ts-expect-error
        const { jwtToken, id, email, role, firstName, lastName, phoneNumber, avatar } = credentials;

        try {
          return { id, token: jwtToken, email, role, firstName, lastName, phone: phoneNumber, avatar };
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
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.role = token.role as string;
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
        session.user.phone = token.phone as string | undefined;
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role ?? token.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.avatar = user.avatar;
      }

      if (token.sub) {
        const db = await dbClient();
        if (db) {
          const dbUser = await db
            .collection(dbCollections.users.name)
            .findOne({ _id: new BSON.ObjectId(token.sub) }, { projection: { _id: 1 } });

          if (!dbUser) return null; // invalidate session if user no longer exists

          const roleMapping = await db.collection(dbCollections.user_role_mappings.name).findOne({
            user_id: new BSON.ObjectId(token.sub),
          });

          if (roleMapping) {
            const role = await db.collection(dbCollections.user_roles.name).findOne({
              _id: roleMapping.role_id,
            });

            if (role) {
              token.role = role.name;
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
