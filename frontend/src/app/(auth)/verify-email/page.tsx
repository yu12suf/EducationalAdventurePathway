'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, isLoading, user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully!');
        // Redirect to dashboard after 3 seconds
        setTimeout(() => router.push('/dashboard'), 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed');
      }
    };

    verify();
  }, [token, verifyEmail, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Educational Adventure Pathway
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          {status === 'verifying' && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verifying your email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {status === 'success' && (
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
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard in 3 seconds...
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/dashboard')}
                className="mt-6"
              >
                Go to Dashboard Now
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => router.push('/login')}
                  fullWidth
                >
                  Go to Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  fullWidth
                >
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}