import { useSearchParams } from 'next/navigation'
import { FormEventHandler, useState } from 'react';
import { Label, TextInput, Button, Spinner, Alert } from 'flowbite-react';
import { AiOutlineLock } from 'react-icons/ai';
import i18next from 'i18next';
import AppLogo from '@components/logo';
import Link from 'next/link';
import useAuth from '@hooks/useAuth';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { handleResetPassword, loading } = useAuth();

  const token = searchParams.get('token');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (typeof token !== 'string') {
      setError('Invalid reset token');
      return;
    }

    if (await handleResetPassword(token, newPassword)) {
      setSuccess(true);
      return
    };
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
              Reset Password
            </h1>

            {success ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Your password has been successfully reset.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login Now
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <div className="mb-1.5 block">
                    <Label htmlFor="password" value="New Password" className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <TextInput
                    icon={AiOutlineLock}
                    disabled={loading}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <div className="mb-1.5 block">
                    <Label htmlFor="confirmPassword" value="Confirm Password" className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <TextInput
                    icon={AiOutlineLock}
                    disabled={loading}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="rounded-lg"
                  />
                </div>
                {error && (
                  <Alert color="failure" className="mb-4">
                    {error}
                  </Alert>
                )}
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
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;