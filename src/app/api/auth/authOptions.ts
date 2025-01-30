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
        const { jwtToken } = credentials;

        try {
          const user = { ...credentials }; // Extract user details from credentials
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
      if (token.sub && session.user) {
        // @ts-expect-error
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error
        token.role = user.role;
      }

      if (token.sub) {
        const db = await dbClient();
        if (db) {
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
