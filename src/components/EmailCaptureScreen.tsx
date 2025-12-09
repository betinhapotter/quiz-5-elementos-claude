'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo } from '@/types/quiz';
import { createClient } from '@/lib/supabase/client';

export default function EmailCaptureScreen() {
  const { result, submitEmail } = useQuizStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!result) return null;

  const elementInfo = elementsInfo[result.lowestElement];
  const isBalanced = result.isBalanced;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Salva o lead no Supabase
      const { error: dbError } = await supabase.from('leads').insert({
        email: email,
        lowest_element: isBalanced ? 'equilibrado' : result.lowestElement,
        lowest_score: result.lowestScore,
        source: 'quiz-5-elementos',
      });

      if (dbError) {
        console.error('Erro ao salvar lead:', dbError);
        // Continua mesmo se der erro no banco (não bloqueia o usuário)
      }
    } catch (err) {
      console.error('Erro ao salvar lead:', err);
    }

    submitEmail(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100 flex items-center justify-center">
      <div className="container-quiz py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Ícone - muda conforme resultado */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-7xl">{isBalanced ? '🎉' : elementInfo.icon}</span>
          </motion.div>

          {/* Resultado parcial (gancho) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isBalanced ? (
              <>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-2">
                  Parabéns!
                </h1>

                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-green-600">
                  Relacionamento Equilibrado!
                </h2>

                <p className="text-warmGray-600 mb-8 max-w-md mx-auto">
                  Todos os 5 elementos estão alinhados — isso é raro e valioso! 
                  Vocês construíram uma base sólida juntos.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-2">
                  Seu elemento desalinhado é:
                </h1>

                <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                  <span className={`text-${elementInfo.color}`}>
                    {elementInfo.name.toUpperCase()}
                  </span>
                </h2>

                <p className="text-warmGray-600 mb-8 max-w-md mx-auto">
                  {elementInfo.shortMeaning} — isso explica por que vocês
                  falam mas não se sentem ouvidos.
                </p>
              </>
            )}
          </motion.div>

          {/* Formulário de email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`rounded-2xl shadow-lg border p-6 sm:p-8 max-w-md mx-auto ${
              isBalanced 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-warmGray-100'
            }`}
          >
            <div className="text-left mb-6">
              <h3 className="font-semibold text-warmGray-900 text-lg mb-2">
                {isBalanced 
                  ? 'Para receber seu plano de manutenção:' 
                  : 'Para receber sua análise completa:'}
              </h3>
              <ul className="space-y-2 text-sm text-warmGray-600">
                {isBalanced ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      O que significa ter todos elementos alinhados
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Como vocês chegaram nesse equilíbrio
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Dicas para manter e aprofundar a conexão
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      O que esse desalinhamento significa na prática
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Por que vocês "falam mas não se entendem"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      3 primeiros passos para realinhar
                    </li>
                  </>
                )}
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warmGray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor email"
                  className="input-email pl-12"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary w-full ${
                  isBalanced ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : isBalanced ? (
                  'Ver Meu Resultado Completo 🎉'
                ) : (
                  'Ver Meu Resultado Completo'
                )}
              </button>
            </form>

            {/* Garantia de privacidade */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-warmGray-500">
              <Lock className="w-3 h-3" />
              <span>Seu email está seguro. Não enviamos spam.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
