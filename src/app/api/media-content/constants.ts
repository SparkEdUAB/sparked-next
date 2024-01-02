import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        //@ts-ignore
        const { user } = credentials;

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {},
};

export default NextAuth(authOptions);
