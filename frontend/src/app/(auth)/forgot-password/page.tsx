'use client';

import { useState } from 'react';
import { useForgotPasswordForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForgotPasswordForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    await forgotPassword(data.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Educational Adventure Pathway
          </h1>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to your email address.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/login'}
                fullWidth
              >
                Return to Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
      alternateLink={{
        text: "Remember your password?",
        linkText: "Sign in",
        href: "/login",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="you@example.com"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
}