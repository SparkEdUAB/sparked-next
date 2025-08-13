import WelcomePage from '@components/welcomePage';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { T_WelcomePageProps } from '@components/welcomePage/types';
import { getMetadataGenerator } from 'utils/helpers/getMetadataGenerator';
import { getServerSession, Session } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from './api/auth/authOptions';
import { routes } from 'routes';

export async function generateMetadata(props: T_WelcomePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  return getMetadata('SparkEd', 'Your digital library - Easily manage your organization resources');
}

type ExtendedSession = Session & {
  user: {
    role: {
      name: string;
    };
  };
};

const Home = async () => {
  const session: ExtendedSession | null = await getServerSession(authOptions);

  if (session?.user) {
    const role = session?.user.role?.name || 'student';
    if (role === 'student') redirect(routes.library);
    else redirect(routes.admin);
  }
  return <WelcomePage />;
};

export default Home;
