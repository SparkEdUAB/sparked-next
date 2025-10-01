'use client';

import ForgotPassword from '@components/auth/forgot-password';
import { withAuthorization } from '@hocs/withAuthorization';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

const ForgotPasswordPage = () => {
    useDocumentTitle('Forgot Password');

    return <ForgotPassword />;
};


export default  withAuthorization(ForgotPasswordPage, { requireGuest: true });
