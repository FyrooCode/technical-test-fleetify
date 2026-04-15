import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { MainLayout } from '@/components/layout/mainLayout';

export default function Home() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthed(true);
          setIsChecking(false);
          return;
        }
      } catch {}
      Cookies.remove('token');
    }
    setIsChecking(false);
    router.push('/login');
  }, [router]);

  if (isChecking || !isAuthed) return null;

  return (
    <MainLayout>
      <div>Dashboard Content</div>
    </MainLayout>
  );
}
