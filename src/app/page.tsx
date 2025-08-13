import WelcomePage from '@components/welcomePage';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { T_WelcomePageProps } from '@components/welcomePage/types';
import { getMetadataGenerator } from 'utils/helpers/getMetadataGenerator';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from './api/auth/authOptions';

export async function generateMetadata(props: T_WelcomePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  return getMetadata('SparkEd', 'Your digital library - Easily manage your organization resources');
}

const Home = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const role = session.user.role?.name || 'student';
    if (role === 'student') redirect('/library');
    else redirect('/admin');
  }
  return <WelcomePage />;
};

export default Home;
