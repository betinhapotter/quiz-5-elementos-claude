'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo } from '@/types/quiz';
import { THRESHOLDS } from '@/lib/quiz-logic';

export default function EmailCaptureScreen() {
  const { result, submitEmail } = useQuizStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!result) return null;

  // Verifica se todos estão equilibrados
  const allScores = Object.values(result.scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  const isAllBalanced = (minScore >= 18 && scoreDifference <= 3) || 
                        result.pattern?.includes('equilibrio_geral') || 
                        result.pattern?.includes('equilibrio_perfeito'); // THRESHOLDS.BALANCED_HIGH = 18
  const isPerfectBalance = (minScore === 25 && maxScore === 25) || 
                          result.pattern?.includes('equilibrio_perfeito');
  
  // Verifica se é situação crítica
  const isAllInCrisis = allScores.every(score => score <= 8); // THRESHOLDS.CRISIS = 8
  const isAllLow = allScores.every(score => score <= 12); // THRESHOLDS.LOW = 12
  const isCriticalSituation = isAllInCrisis || isAllLow || result.pattern?.includes('alerta_vermelho');
  
  // Verifica se é situação "morna" - todos na faixa média (13-17)
  const isAllMedium = minScore >= 13 && maxScore <= 17 && scoreDifference <= 3; // THRESHOLDS.BALANCED_LOW = 13
  const isMorna = isAllMedium || result.pattern?.includes('relacao_morna');

  const elementInfo = elementsInfo[result.lowestElement as keyof typeof elementsInfo];

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
            <span className="text-7xl">
              {isCriticalSituation ? '🚨' : isAllBalanced ? '✨' : isMorna ? '🔥' : elementInfo.icon}
            </span>
          </motion.div>

          {/* Resultado parcial (gancho) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isCriticalSituation ? (
              <>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-2">
                  🚨 Situação Crítica Identificada
                </h1>

                <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-red-600">
                  ALERTA VERMELHO
                </h2>

                <p className="text-warmGray-600 mb-8 max-w-md mx-auto">
                  Múltiplos elementos do seu relacionamento estão em crise. 
                  Esta situação requer atenção profissional urgente.
                </p>
              </>
            ) : isMorna ? (
              <>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-2">
                  🔥 A Brasa Adormecida
                </h1>

                <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-orange-600">
                  RELACIONAMENTO NO PILOTO AUTOMÁTICO
                </h2>

                <p className="text-warmGray-600 mb-8 max-w-md mx-auto">
                  Seu relacionamento não morreu — está esperando ser despertado. 
                  Receba seu Planner Despertar para reacender a brasa.
                </p>
              </>
            ) : isAllBalanced ? (
              <>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-2">
                  {isPerfectBalance ? '🌟 Equilíbrio Perfeito!' : '✨ Equilíbrio Harmonioso!'}
                </h1>

                <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-green-600">
                  TODOS OS 5 ELEMENTOS ALINHADOS
                </h2>

                <p className="text-warmGray-600 mb-8 max-w-md mx-auto">
                  Parabéns! Todos os elementos estão perfeitamente alinhados no seu relacionamento. 
                  Receba seu planner de manutenção para continuar nutrindo esse equilíbrio.
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
            className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-6 sm:p-8 max-w-md mx-auto"
          >
            <div className="text-left mb-6">
              <h3 className="font-semibold text-warmGray-900 text-lg mb-2">
                Para receber sua análise completa:
              </h3>
              <ul className="space-y-2 text-sm text-warmGray-600">
                {isCriticalSituation ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      Informações sobre a situação crítica identificada
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      Orientações para busca de ajuda profissional urgente
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      Contatos de emergência e recursos disponíveis
                    </li>
                  </>
                ) : isMorna ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">🔥</span>
                      O que significa estar no "piloto automático"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">🔥</span>
                      Como despertar a brasa adormecida
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">🔥</span>
                      Planner Despertar: 30 dias trabalhando os 5 elementos
                    </li>
                  </>
                ) : isAllBalanced ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Análise completa do seu equilíbrio perfeito
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Planner de manutenção personalizado de 30 dias
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Exercícios práticos para manter o equilíbrio
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
