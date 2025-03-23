'use client';

import { SIGNUP_FORM_FIELDS } from '@components/auth/constants';
import AppLogo from '@components/logo';
import useAuth from '@hooks/useAuth';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuCircleUser } from 'react-icons/lu';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/password/forgotPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (data.isError) {
      setMessage('Error sending email. Please try again.');
    } else {
      setMessage('Email sent! Please check your inbox.');
    }
  };

  return (

    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center overflow-auto py-12">
      <div className="flex flex-col items-center justify-center px-6 w-full max-w-xl mx-auto">
        <Link href="/" className="flex items-center mb-6 transform hover:scale-105 transition-transform">
          <AppLogo />
        </Link>
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 space-y-4">
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Forgot Password
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
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="rounded-lg"
                />
              </div>
              <Button
                disabled={loading}
                type="submit"
                size="sm"
                className="w-full mt-2 py-1.5 rounded-md text-sm font-medium"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {i18next.t('loading')}
                  </>
                ) : (
                  i18next.t('Send Reset Link')
                )}
              </Button>
              <p className="text-md font-light text-center text-gray-600 dark:text-gray-400 mt-4">
                Or {" "}
                <Link
                  href="/auth/login"
                  className="font-medium  hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
              {message && <p className="text-red-500 text-center">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;