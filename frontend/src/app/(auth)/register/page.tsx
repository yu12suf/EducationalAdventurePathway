'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRegisterForm } from '@/hooks/useAuthForm';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useRegisterForm();

  const onSubmit = async (data: any) => {
    await registerUser(data);
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join thousands of students pursuing international education"
      alternateLink={{
        text: "Already have an account?",
        linkText: "Sign in",
        href: "/login",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
            placeholder="John"
          />
          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
            placeholder="Doe"
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
          helperText="At least 6 characters"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I want to register as
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="student"
                {...register('role')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Student</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="counselor"
                {...register('role')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Counselor</span>
            </label>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Sign Up
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}