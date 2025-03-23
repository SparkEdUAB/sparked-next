'use client';

import ForgotPassword from '@components/auth/forgot-password';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const Home: React.FC = () => {
    useDocumentTitle('Login');

    return <ForgotPassword />;
};

export default Home;
