import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {},
      //@ts-ignore
      async authorize(credentials, req) {
        // const { JWT_SECRET } = sharedConfig();origin
        //@ts-ignore
        const { jwtToken } = credentials;

        try {
          // const jwtData = jwt.verify(jwtToken as string, JWT_SECRET as string);

          //token is valid. Login user
          return { token: jwtToken, user: { ...credentials } };
        } catch (error) {
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
      if (!session || !token) return session;

      //@ts-ignore
      session.token = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
