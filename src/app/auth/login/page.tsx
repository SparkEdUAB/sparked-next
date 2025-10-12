'use client';

import Login from '@components/auth/login';
import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { withAuthorization } from '@hocs/withAuthorization';

const LoginPage: React.FC = () => {
  useDocumentTitle('Login');

  return <Login />;
};

export default  withAuthorization(LoginPage, { requireGuest: true });
;
