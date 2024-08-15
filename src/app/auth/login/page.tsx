'use client';

import Login from '@components/auth/login';
import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

const Home: React.FC = () => {
  useDocumentTitle('Login');

  return <Login />;
};

export default Home;
