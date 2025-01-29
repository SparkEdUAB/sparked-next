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
      async authorize(credentials) {
        const { jwtToken, _id } = credentials as any;
        try {
          const user = {
            id: _id, // Use MongoDB's _id
            token: jwtToken,
          };
          return user;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
