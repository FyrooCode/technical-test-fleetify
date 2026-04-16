import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
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
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { mutate: login, isPending: isLoading, error } = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      authService.login(credentials),
    onSuccess: (response) => {
      const { token } = response.data;

      Cookies.set('token', token, { expires: 1 });

      const decoded = jwtDecode<JWTPayload>(token);
      const userData: User = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };

      setAuth(userData);
      toast.success(`Welcome, ${decoded.username}!`);
      router.push('/');
    },
    onError: (err: Error) => {
      const apiError = err as unknown as ApiError;
      const errorMsg = apiError?.response?.data?.error?.message || 'Login failed. Please try again.';
      toast.error(errorMsg);
    },
  });

  return {
    login: (username: string, password: string) => login({ username, password }),
    isLoading,
    error: error
      ? ((error as unknown as ApiError)?.response?.data?.error?.message || error.message || 'Login failed. Please try again.')
      : null,
  };
};