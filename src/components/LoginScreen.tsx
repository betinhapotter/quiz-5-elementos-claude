'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { elementsInfo } from '@/types/quiz';
import { Button, AnimatedContainer, Card, StaggerContainer, StaggerItem } from '@/components/ui';
import { Mail } from 'lucide-react';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [useEmailForm, setUseEmailForm] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    if (!name.trim()) {
      setError('Por favor, insira seu nome');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up com email/password (usa email como password temporária)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-12), // Gera senha aleatória
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Erro ao criar conta');
        return;
      }

      if (data.user) {
        // Auto-login após signup
        window.location.href = '/';
      }
    } catch (err: any) {
      setError('Erro inesperado. Tente novamente.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const elements = Object.values(elementsInfo);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100 flex items-center justify-center px-4">
      <AnimatedContainer preset="fadeSlideUp" className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <StaggerContainer staggerDelay={0.1} className="flex justify-center gap-2 mb-4">
            {elements.map((el) => (
              <StaggerItem key={el.name}>
                <span className="text-2xl">{el.icon}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-2">
            Quiz dos 5 Elementos
          </h1>
          <p className="text-warmGray-600">
            Descubra o que está desalinhado no seu relacionamento
          </p>
        </div>

        {/* Card de Login */}
        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-warmGray-900 text-center mb-6">
            Entre para começar
          </h2>

          {/* Benefícios do login */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-sm text-warmGray-600">
              <span className="text-green-500">✓</span>
              Diagnóstico completo dos 5 Elementos
            </li>
            <li className="flex items-center gap-3 text-sm text-warmGray-600">
              <span className="text-green-500">✓</span>
              Acesso ao seu resultado personalizado
            </li>
            <li className="flex items-center gap-3 text-sm text-warmGray-600">
              <span className="text-green-500">✓</span>
              Opção de comprar o Planner de 30 dias
            </li>
          </ul>

          {/* Toggle entre Google e Email */}
          {!useEmailForm ? (
            <>
              {/* Botão de Login com Google */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleLogin}
                isLoading={isLoading}
                className="w-full"
              >
                {!isLoading && (
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
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-warmGray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-warmGray-500">ou</span>
                </div>
              </div>

              {/* Link para formulário de email */}
              <Button
                variant="ghost"
                onClick={() => setUseEmailForm(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Usar email e nome
              </Button>
            </>
          ) : (
            <>
              {/* Formulário de Email/Nome */}
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="input-email w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor email"
                    className="input-email w-full"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Criando conta...' : 'Continuar com Email'}
                </Button>
              </form>

              {/* Link para voltar ao Google */}
              <Button
                variant="ghost"
                onClick={() => {
                  setUseEmailForm(false);
                  setError(null);
                }}
                className="w-full mt-2"
              >
                ← Voltar
              </Button>
            </>
          )}

          {!useEmailForm && error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
        </Card>

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
      </AnimatedContainer>
    </div>
  );
}
