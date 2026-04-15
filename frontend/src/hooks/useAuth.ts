import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types';

interface JWTPayload {
  id: number;
  username: string;
  role: 'Admin' | 'Kerani';
  exp: number;
}

interface ApiError {
  response?: {
    data?: {
      error?: {
        code: string;
        message: string;
      };
    };
  };
  message?: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/login', { username, password });
      const { token } = response.data.data;

      Cookies.set('token', token, { expires: 1 });

      const decoded = jwtDecode<JWTPayload>(token);
      const userData: User = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };

      setAuth(userData);
      router.push('/');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};