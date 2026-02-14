'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, AuthResponse, LoginData, RegisterData } from '@/types/auth';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile (including profileCompleted) from /api/auth/me
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/auth/me');
      const { user: userData, profileCompleted } = response.data;
      // Merge profileCompleted into user object
      setUser({ ...userData, profileCompleted });
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      // If token is invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Optionally fetch fresh profile data
      fetchUserProfile();
    }
    setIsLoading(false);
  }, []);

  // Login
  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/api/auth/login', data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      toast.success('Login successful!');
      
      // Fetch full profile (includes profileCompleted) before redirecting
      await fetchUserProfile();
      // Redirect will be handled by the useEffect below
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/api/auth/register', data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      toast.success(response.data.message || 'Registration successful!');
      
      // Redirect immediately based on role (profile not yet completed)
      if (user.role === 'student') {
        router.push('/profile-setup');
      } else if (user.role === 'counselor') {
        router.push('/counselor-profile-setup');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/verify-email', { token });
      toast.success(response.data.message);
      
      // Update local user if emailVerified changed
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Email verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/forgot-password', { email });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/reset-password', { token, newPassword });
      toast.success(response.data.message);
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password reset failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle redirect after user state changes (for login)
  useEffect(() => {
    if (user && token) {
      // Check profile completion and redirect accordingly
      if (user.role === 'student' && !user.profileCompleted) {
        router.push('/profile-setup');
      } else if (user.role === 'counselor' && !user.profileCompleted) {
        router.push('/counselor-profile-setup');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, token, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};