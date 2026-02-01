'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginScreen from '@/components/LoginScreen';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se já está autenticado, volta para home
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Se está carregando ou já autenticado, não renderiza nada
  if (loading || isAuthenticated) {
    return null;
  }

  // Renderiza LoginScreen sem opção de pular
  return <LoginScreen />;
}
