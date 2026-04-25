import AppLogo from '@components/logo';
import useAuth from '@hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">New Password</Label>
                  </div>
                  <div className="relative">
                    <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      disabled={loading}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      className="rounded-lg pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 block">
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                  </div>
                  <div className="relative">
                    <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      disabled={loading}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      className="rounded-lg pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full mt-4 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 py-2.5 rounded-lg text-base font-large"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
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
