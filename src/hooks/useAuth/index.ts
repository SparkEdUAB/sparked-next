'use client';

import { API_LINKS } from 'app/links';
import { useSession } from 'next-auth/react';
import { T_LoginFields, T_SignupFields } from './types';
import i18next from 'i18next';
import { signIn, signOut } from 'next-auth/react';
import AUTH_PROCESS_CODES from '@app/api/auth/processCodes';
import { useCallback, useState } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const message = useToastMessage();

  const isAuthenticated = status === 'authenticated';

  const handleSignup = useCallback(
    async (fields: T_SignupFields) => {
      const url = API_LINKS.SIGNUP;
      const formData = {
        body: JSON.stringify({ ...fields }),
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      setLoading(true);
      try {
        const resp = await fetch(url, formData);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }
        message.success(getProcessCodeMeaning(responseData.code));
        router.replace('/auth/login');
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [message, router],
  );

  const handleLogin = useCallback(
    async (fields: T_LoginFields) => {
      const url = API_LINKS.LOGIN;
      const formData = {
        body: JSON.stringify({ ...fields }),
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      setLoading(true);
      try {
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const { jwtToken } = responseData;
        const decodedToken: { role?: { name: string } } = jwtDecode(jwtToken);
        const userRole = decodedToken.role;

        await signIn('credentials', {
          redirect: false,
          jwtToken,
          email: fields.email,
          role: userRole?.name,
        });

        // Route based on role
        if (!userRole?.name || userRole.name === 'student') {
          router.replace('/library');
        } else {
          router.replace('/admin');
        }

        message.success(i18next.t('logged_in'));
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [message, router],
  );

  const handleLogout = useCallback(async () => {
    const url = API_LINKS.LOGOUT;
    const formData = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    setLoading(true);
    try {
      const resp = await fetch(url, formData);
      const responseData = await resp.json();

      if (!resp.ok || responseData.isError) {
        message.warning(
          responseData.code === AUTH_PROCESS_CODES.FAILED_TO_LOGOUT_USER
            ? i18next.t('logout_failed')
            : i18next.t('unknown_error'),
        );
        return false;
      }

      const isAdminRoute = window.location.pathname.startsWith('/admin');
      await signOut({
        redirect: false,
        callbackUrl: isAdminRoute ? '/' : window.location.pathname,
      });

      if (isAdminRoute) {
        router.replace('/');
      }

      message.success(i18next.t('logout_ok'));
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [message, router]);

  const handleForgotPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      try {
        const response = await fetch('/api/password/forgotPassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (data.isError) {
          message.warning(getProcessCodeMeaning(data.code));
          return false;
        }
        message.success(getProcessCodeMeaning(data.code));
        return true;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  const handleResetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setLoading(true);
      try {
        const response = await fetch('/api/password/resetPassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();
        if (data.isError) {
          message.warning(getProcessCodeMeaning(data.code));
          return false;
        }
        message.success(getProcessCodeMeaning(AUTH_PROCESS_CODES.PASSWORD_RESET_SUCCESS));
        return true;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  return {
    isAuthenticated,
    handleSignup,
    handleLogin,
    handleLogout,
    loading,
    handleForgotPassword,
    handleResetPassword,
  };
};

export default useAuth;
