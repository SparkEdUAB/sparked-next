'use client';

import 'utils/intl';
import Login from '@components/auth/login';
import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

const Home: React.FC = (props) => {
  useDocumentTitle('Login');

  return <Login />;
};

export default Home;
