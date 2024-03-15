import React, { FormEventHandler } from 'react';
import useAuth from '@hooks/useAuth';
import Link from 'next/link';
import { SIGNUP_FORM_FIELDS } from './constants';
import AppLogo from '@components/logo';
import { T_SignupFields } from '@hooks/useAuth/types';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { AiOutlineLock } from 'react-icons/ai';
import { LuUser2 } from 'react-icons/lu';

const onFinishFailed = (errorInfo: any) => {};

const Signup = () => {
  const { handleSignup, loading } = useAuth();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const keys = [SIGNUP_FORM_FIELDS.email.key, SIGNUP_FORM_FIELDS.password.key];
    let result = extractValuesFromFormEvent<T_SignupFields>(e, keys);
    handleSignup(result);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <Link href="/" className="flex items-center mb-7">
          <AppLogo />
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor={SIGNUP_FORM_FIELDS.email.key} value="Your email" />
                </div>
                <TextInput
                  icon={LuUser2}
                  disabled={loading}
                  id={SIGNUP_FORM_FIELDS.email.key}
                  name={SIGNUP_FORM_FIELDS.email.key}
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Password" />
                </div>
                <TextInput
                  icon={AiOutlineLock}
                  disabled={loading}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button disabled={loading} type="submit" className="w-full">
                {loading ? <Spinner size="sm" className="mr-3" /> : undefined}
                {i18next.t('signup')}
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
