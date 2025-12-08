'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo } from '@/types/quiz';

export default function EmailCaptureScreen() {
  const { result, submitEmail } = useQuizStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!result) return null;

  const elementInfo = elementsInfo[result.lowestElement];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    setIsSubmitting(true);

    // Simula envio (aqui você integra com sua API)
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
          {/* Reveal do elemento */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-7xl">{elementInfo.icon}</span>
          </motion.div>

          {/* Resultado parcial (gancho) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
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
          </motion.div>

          {/* Formulário de email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-6 sm:p-8 max-w-md mx-auto"
          >
            <div className="text-left mb-6">
              <h3 className="font-semibold text-warmGray-900 text-lg mb-2">
                Para receber sua análise completa:
              </h3>
              <ul className="space-y-2 text-sm text-warmGray-600">
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
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
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
