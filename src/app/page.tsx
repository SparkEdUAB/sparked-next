import WelcomePage from '@components/welcomePage';
import { fetcher } from '@hooks/use-swr';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { API_LINKS } from './links';
import { T_CONFIG_VARIABLES } from 'types/config';
import { T_WelcomePageProps } from '@components/welcomePage/types';
import { BASE_URL } from './shared/constants';
import { getMetadataGenerator } from 'utils/helpers';

export async function generateMetadata(props: T_WelcomePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  const result = await fetcher<{ configFile: T_CONFIG_VARIABLES }>(BASE_URL + API_LINKS.READ_CONFIG_FILE, {
    method: 'POST',
  });

  if (result instanceof Error) {
    return getMetadata('SparkEd', 'Your digital library - Easily manage your organization resources');
  } else {
    return getMetadata(result.configFile.schoolName, result.configFile.tagline);
  }
}

const Home = () => {
  return <WelcomePage />;
};

export default Home;
