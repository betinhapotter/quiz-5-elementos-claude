'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { elementsInfo } from '@/types/quiz';

export default function LoginScreen({ onSkip }: { onSkip?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    console.log('Login button clicked');
    setIsLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      console.log('SignInWithOAuth result:', { data, error });

      if (error) {
        setError('Erro ao fazer login. Tente novamente.');
        console.error('Login error:', error);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const elements = Object.values(elementsInfo);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {elements.map((el, i) => (
              <motion.span
                key={el.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-2xl"
              >
                {el.icon}
              </motion.span>
            ))}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-2">
            Quiz dos 5 Elementos
          </h1>
          <p className="text-warmGray-600">
            Descubra o que está desalinhado no seu relacionamento
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-8">
          <h2 className="text-xl font-semibold text-warmGray-900 text-center mb-6">
            Entre para começar
          </h2>

          {/* Benefícios do login */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-sm text-warmGray-600">
              <span className="text-green-500">✓</span>
              Salve seu resultado e acesse depois
            </li>
            <li className="flex items-center gap-3 text-sm text-warmGray-600">
              <span className="text-green-500">✓</span>
              Receba seu Planner de 30 dias personalizado
            </li>
            <li className="flex items-center gap-3 text-sm text-warmGray-600">
              <span className="text-green-500">✓</span>
              Acompanhe sua evolução ao longo do tempo
            </li>
          </ul>

          {/* Botão de Login com Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-warmGray-200 
                     rounded-xl px-6 py-4 text-warmGray-700 font-medium
                     hover:bg-warmGray-50 hover:border-warmGray-300 
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-warmGray-300 border-t-warmGray-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? 'Conectando...' : 'Continuar com Google'}
          </button>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}

          {/* Opção de pular (opcional) */}
          {onSkip && (
            <button
              onClick={onSkip}
              className="w-full mt-4 text-sm text-warmGray-500 hover:text-warmGray-700 transition-colors"
            >
              Fazer sem cadastro (resultado não será salvo)
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-warmGray-400 mt-6">
          Ao continuar, você concorda com nossa política de privacidade.
          <br />
          Seus dados estão seguros e não serão compartilhados.
        </p>

        {/* Assinatura */}
        <p className="text-center text-sm text-warmGray-500 mt-8">
          Por <strong>Jaya Roberta</strong> | Terapeuta Integrativa
        </p>
      </motion.div>
    </div>
  );
}
