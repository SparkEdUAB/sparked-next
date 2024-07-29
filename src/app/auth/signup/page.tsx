'use client';

import Signup from '@components/auth/signup';
import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

const Home: React.FC = () => {
  useDocumentTitle('Sign Up');

  return <Signup />;
};

export default Home;
