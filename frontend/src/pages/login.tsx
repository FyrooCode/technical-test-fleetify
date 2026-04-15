import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { LoginForm } from '@/components/ui/loginForm';
import { AuthLayout } from '@/components/layout/authLayout';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          router.push('/');
          return;
        }
      } catch {}
      Cookies.remove('token');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <AuthLayout>
      <LoginForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    </AuthLayout>
  );
}