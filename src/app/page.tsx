import WelcomePage from '@components/welcomePage';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { T_WelcomePageProps } from '@components/welcomePage/types';
import { getMetadataGenerator } from 'utils/helpers/getMetadataGenerator';

export async function generateMetadata(props: T_WelcomePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  return getMetadata('SparkEd', 'Your digital library - Easily manage your organization resources');
}

const Home = () => {
  return <WelcomePage />;
};

export default Home;
