import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        //@ts-ignore
        const { user } = credentials;

        if (user) {
          return JSON.parse(user);
        } else {
          return null;
        }
      },
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async session({ session, token, user }) {
      if (!session || !session.user) return session;
      //@ts-ignore
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
