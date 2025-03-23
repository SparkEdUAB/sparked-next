import { SIGNUP_FORM_FIELDS } from './constants';
import useAuth from '@hooks/useAuth';
import Link from 'next/link';
import AppLogo from '@components/logo';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import { LuCircleUser } from 'react-icons/lu';
import { AiOutlineLock } from 'react-icons/ai';
import i18next from 'i18next';
import { FormEventHandler } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_LoginFields } from '@hooks/useAuth/types';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login: React.FC = () => {
  const { handleLogin, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const keys = [SIGNUP_FORM_FIELDS.email.key, SIGNUP_FORM_FIELDS.password.key];
    let result = extractValuesFromFormEvent<T_LoginFields>(e, keys);
    handleLogin(result);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center overflow-auto py-12">
      <div className="flex flex-col items-center justify-center px-6 w-full max-w-xl mx-auto">
        <Link href="/" className="flex items-center mb-6 transform hover:scale-105 transition-transform">
          <AppLogo />
        </Link>
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Sign in to your account to continue
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="mb-1.5 block">
                  <Label htmlFor={SIGNUP_FORM_FIELDS.email.key} value="Your email" className="text-gray-700 dark:text-gray-300" />
                </div>
                <TextInput
                  icon={LuCircleUser}
                  disabled={loading}
                  id={SIGNUP_FORM_FIELDS.email.key}
                  name={SIGNUP_FORM_FIELDS.email.key}
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="rounded-lg"
                />
              </div>
              <div>
                <div className="mb-1.5 block">
                  <Label htmlFor="password" value="Password" className="text-gray-700 dark:text-gray-300" />
                </div>
                <TextInput
                  icon={AiOutlineLock}
                  disabled={loading}
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="rounded-lg"
                  rightIcon={() => (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 pointer-events-auto"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                />
              </div>
              <Button
                disabled={loading}
                type="submit"
                size="xs"
                className="w-full mt-4 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 py-2.5 rounded-lg text-base font-large"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-3" />
                    {i18next.t('loading')}
                  </>
                ) : (
                  i18next.t('signin')
                )}
              </Button>
              <p className="text-md font-light text-center text-gray-600 dark:text-gray-400 mt-4">
                Don&apos;t have an account yet?{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium  hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <div className="flex justify-center">
                <Link href="/auth/forgot-password" className="text-sky-600 dark:text-sky-400 font-medium mt-2">
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
