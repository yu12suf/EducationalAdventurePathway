import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schemas
export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup.string().oneOf(['student', 'counselor']).required('Role is required'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

// Default values
export const loginDefaultValues = { email: '', password: '' };
export const registerDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'student' as const,
};
export const forgotPasswordDefaultValues = { email: '' };
export const resetPasswordDefaultValues = { newPassword: '', confirmPassword: '' };

// Custom hooks
export const useLoginForm = () =>
  useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

export const useRegisterForm = () =>
  useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: registerDefaultValues,
  });

export const useForgotPasswordForm = () =>
  useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
  });

export const useResetPasswordForm = () =>
  useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
  });