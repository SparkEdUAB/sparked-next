'use client';

import 'utils/intl';
import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';
import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

const Home: React.FC = (props) => {
  useDocumentTitle('Admin Dashboard');

  return <ContentPlaceholder message="The admin dashboard will be placed here" />;
};

export default Home;
