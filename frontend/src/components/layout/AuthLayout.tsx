import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { FaArrowLeft } from 'react-icons/fa';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  alternateLink?: {
    text: string;
    linkText: string;
    href: string;
  };
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  alternateLink,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        <Link href="/">
          <h1 className="text-center text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition">
            Educational Adventure Pathway
          </h1>
        </Link>
        <p className="mt-2 text-center text-sm text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            {title}
          </h2>
          {children}
          
          {alternateLink && (
            <p className="mt-6 text-center text-sm text-gray-600">
              {alternateLink.text}{' '}
              <Link
                href={alternateLink.href}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {alternateLink.linkText}
              </Link>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;