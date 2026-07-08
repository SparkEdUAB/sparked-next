import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';
import { resolveOrganizationContext } from '../lib/organization';

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
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.phone = token.phone;
        session.user.organizationId = token.organizationId;
        session.user.organizationSlug = token.organizationSlug;
        session.user.organizationType = token.organizationType;
        session.user.isDefaultOrganization = token.isDefaultOrganization;
        session.user.isPlatformAdmin = token.isPlatformAdmin;
        session.role = token.role as string;
        session.organizationId = token.organizationId;
        session.organizationSlug = token.organizationSlug;
        session.organizationType = token.organizationType;
        session.isDefaultOrganization = token.isDefaultOrganization;
        session.isPlatformAdmin = token.isPlatformAdmin;
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
        token.organizationId = user.organizationId;
        token.organizationSlug = user.organizationSlug;
        token.organizationType = user.organizationType;
        token.isDefaultOrganization = user.isDefaultOrganization;
        token.isPlatformAdmin = user.isPlatformAdmin;
      }

      if (token.sub) {
        const db = await dbClient();
        if (db) {
          const dbUser = await db.collection(dbCollections.users.name).findOne(
            { _id: new BSON.ObjectId(token.sub) },
            {
              projection: {
                firstName: 1,
                lastName: 1,
                phoneNumber: 1,
              },
            },
          );

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

          const organizationContext = await resolveOrganizationContext(db, {
            session: {
              expires: new Date(Date.now() + 60_000).toISOString(),
              user: {
                id: token.sub,
                role: token.role,
              },
            } as Session,
          });

          token.firstName ||= dbUser?.firstName;
          token.lastName ||= dbUser?.lastName;
          token.phone ||= dbUser?.phoneNumber;
          token.organizationId = organizationContext.organizationId;
          token.organizationSlug = organizationContext.organizationSlug;
          token.organizationType = organizationContext.organizationType;
          token.isDefaultOrganization = organizationContext.isDefaultOrganization;
          token.isPlatformAdmin = organizationContext.isPlatformAdmin;
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
