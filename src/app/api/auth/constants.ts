import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoClientPromise from "../lib/db";

export const authOptions: NextAuthOptions = {
  // adapter: MongoDBAdapter(mongoClientPromise),

  // pages: {
  //   // signIn: "/auth/signin",
  //   // signOut: "/auth/signout",
  //   error: "/auth/error", // Error code passed in query string as ?error=
  //   verifyRequest: "/auth/verify-request", // (used for check email message)
  //   newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  // },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("muks", credentials);
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

            // return new Response(JSON.stringify({ isError: false }), {
            //   status: 200,
            // });
       
       
        // if (1) {
        //   return { error: "my custom error" };
        // }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    // async jwt({ token }) {
    //   token.userRole = "admin";
    //   return token;
    // },
    // async signIn({ user, account, profile, email, credentials }) {
  

    //   console.log("signIn", user);

    //   if (user?.error === "my custom error") {
    //     throw new Error("custom error to the client");
    //   }
    // },
  },
};

export default NextAuth(authOptions);
