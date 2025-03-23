'use client';

import ForgotPassword from '@components/auth/forgot-password';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

const ForgotPasswordPage = () => {
    useDocumentTitle('Forgot Password');

    return <ForgotPassword />;
};

export default ForgotPasswordPage;
