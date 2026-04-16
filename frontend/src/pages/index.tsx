import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { MainLayout } from '@/components/layout/mainLayout';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          Cookies.remove('token');
          router.push('/login');
        } else {
          setIsChecking(false);
        }
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  if (isChecking) return null;

  return (
    <MainLayout>
    </MainLayout>
  );
}