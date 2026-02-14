'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLoginForm } from '@/hooks/useAuthForm';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useLoginForm();

  const onSubmit = async (data: any) => {
    await login(data);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue your educational journey"
      alternateLink={{
        text: "Don't have an account?",
        linkText: "Sign up",
        href: "/register",
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
        
        <div>
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="••••••••"
          />
          <div className="text-right mt-1">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}