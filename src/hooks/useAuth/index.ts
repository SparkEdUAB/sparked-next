'use client';

import { API_LINKS } from 'app/links';
import { useSession } from 'next-auth/react';
import { T_LoginFields, T_SignupFields } from './types';
import i18next from 'i18next';
import { signIn, signOut } from 'next-auth/react';
import AUTH_PROCESS_CODES from '@app/api/auth/processCodes';
import { useState } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useAuth = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const message = useToastMessage();

  const isAuthenticated = status === 'authenticated';

  const handleSignup = async (fields: T_SignupFields) => {
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

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(getProcessCodeMeaning(responseData.code));
        return false;
      }
      message.success(getProcessCodeMeaning(responseData.code));
      router.replace('/');
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (fields: T_LoginFields) => {
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

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(getProcessCodeMeaning(responseData.code));
        return false;
      }

      const { user } = responseData;

      await signIn('credentials', {
        redirect: false,
        user: JSON.stringify(user),
      });

      router.replace('/admin');

      message.success(i18next.t('logged_in'));
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
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

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(
          responseData.code === AUTH_PROCESS_CODES.FAILED_TO_LOGOUT_USER
            ? i18next.t('logout_failed')
            : i18next.t('unknown_error'),
        );
        return false;
      }

      const respd = await signOut({ redirect: false, callbackUrl: '/' });

      message.success(i18next.t('logout_ok'));
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    handleSignup,
    handleLogin,
    handleLogout,
    loading,
  };
};

export default useAuth;
