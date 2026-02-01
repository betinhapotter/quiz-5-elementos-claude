'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import LoginScreen from '@/components/LoginScreen';

export default function AuthLoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se já está autenticado, volta para home (landing screen)
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Se está carregando ou já autenticado, não renderiza nada
  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100">
      {/* Breadcrumb / Context */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-6 px-4 text-center"
      >
        <p className="text-sm text-warmGray-500">
          ← Você estava vendo seu resultado do diagnóstico
        </p>
      </motion.div>

      {/* LoginScreen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LoginScreen />
      </motion.div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center pb-8 px-4"
      >
        <div className="max-w-md mx-auto bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-warmGray-600">
            <strong>Após fazer login:</strong> Você será redirecionado para a página inicial.
            Poderá <strong>refazer o quiz para salvar seu resultado</strong> no seu perfil e acessar seu planner personalizado.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
