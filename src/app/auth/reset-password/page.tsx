'use client';

import ResetPassword from '@components/auth/reset-password';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

const ResetPasswordPage = () => {
    useDocumentTitle('Reset Password');

    return <ResetPassword />;
};

export default ResetPasswordPage;
