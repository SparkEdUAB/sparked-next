'use client';

import Signup from '@components/auth/signup';
import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { withAuthorization } from '@hocs/withAuthorization';

const SignupPage: React.FC = () => {
  useDocumentTitle('Sign Up');

  return <Signup />;
};

export default  withAuthorization(SignupPage, { requireGuest: true });
