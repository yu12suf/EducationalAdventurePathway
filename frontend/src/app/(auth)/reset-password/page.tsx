'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';                       // ✅ Add if not already present
import { useResetPasswordForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';
import Card from '@/components/ui/Card';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useResetPasswordForm();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No reset token provided');
    }
  }, [token]);

  const onSubmit = async (data: any) => {
    try {
      await resetPassword(token!, data.newPassword);
      setStatus('success');
      setMessage('Password reset successful!');
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Password reset failed');
    }
  };

  if (status === 'success') {
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                Your password has been reset successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login in 3 seconds...
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/login')}
                className="mt-6"
              >
                Go to Login Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'error' && !token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="The password reset link is invalid or expired">
        <div className="text-center">
          <p className="text-red-600 mb-4">{message}</p>
          <Button variant="primary" onClick={() => router.push('/forgot-password')} fullWidth>
            Request New Link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your new password below"
      alternateLink={{
        text: "Remember your password?",
        linkText: "Sign in",
        href: "/login",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
          placeholder="••••••••"
          helperText="At least 6 characters"   // ✅ Now valid
        />

        <Input
          label="Confirm New Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}