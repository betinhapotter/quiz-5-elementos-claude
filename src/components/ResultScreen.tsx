'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Instagram, RefreshCw } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { elementsInfo, Element } from '@/types/quiz';
import { generateResultExplanation, getResultSeverity, classifyResult } from '@/lib/quiz-logic';
import ScoreMap from '@/components/ScoreMap';
import PlannerSection from '@/components/PlannerSection';
import ResultLayout from '@/components/ResultLayout';
import '@/styles/print.css';

export default function ResultScreen() {
  const { result, resetQuiz, userData, answers } = useQuizStore();
  const { user, signOut, isAuthenticated } = useAuth();
  const supabase = createClient();

  const [savedToDb, setSavedToDb] = useState(false);
  const [quizResultId, setQuizResultId] = useState<string | null>(null);

  // Salva resultado no banco quando carrega
  const saveResultToDb = useCallback(async () => {
    if (!result || !user) return;

    try {
      const { data, error } = await supabase.from('quiz_results').insert({
        user_id: user.id,
        terra_score: result.scores.terra,
        agua_score: result.scores.agua,
        ar_score: result.scores.ar,
        fogo_score: result.scores.fogo,
        eter_score: result.scores.eter,
        lowest_element: result.lowestElement,
        lowest_score: result.lowestScore,
        second_lowest_element: result.secondLowestElement || null,
        pattern: result.pattern || null,
        raw_answers: answers,
      }).select('id').single();

      if (error) throw error;
      if (data?.id) {
        setQuizResultId(data.id);
      }
      setSavedToDb(true);
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
    }
  }, [result, user, answers, supabase]);

  useEffect(() => {
    if (result && user && !savedToDb) {
      saveResultToDb();
    }
  }, [result, user, savedToDb, saveResultToDb]);

  if (!result) return null;

  const { isBalanced: isAllBalanced, isPerfectBalance, isMorna, isCritical: isCriticalSituation } = classifyResult(result);
  const elementInfo = elementsInfo[result.lowestElement as keyof typeof elementsInfo];
  const explanation = generateResultExplanation(result);
  const severity = getResultSeverity(result);

  const elementColors: Record<Element, string> = {
    terra: 'from-terra to-terra-dark',
    agua: 'from-agua to-agua-dark',
    ar: 'from-ar to-ar-dark',
    fogo: 'from-fogo to-fogo-dark',
    eter: 'from-eter to-eter-dark',
  };

  const balancedGradient = isPerfectBalance
    ? 'from-green-500 to-emerald-600'
    : 'from-green-400 to-teal-500';

  const heroGradient = isAllBalanced
    ? balancedGradient
    : isMorna
      ? 'from-warmGray-800 to-warmGray-900'
      : elementColors[result.lowestElement];

  const heroIcon = isAllBalanced ? '✨' : isMorna ? '💨' : elementInfo.icon;

  return (
    <ResultLayout
      heroGradient={heroGradient}
      heroIcon={heroIcon}
      title={explanation.title}
      subtitle={explanation.subtitle}
      showSeverityWarning={severity === 'critica'}
      onLogout={signOut}
    >
        {/* O que significa */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            O Que Isso Significa
          </h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-warmGray-100">
            <p className="text-warmGray-700 leading-relaxed">
              {explanation.explanation}
            </p>
          </div>
        </motion.section>

        {/* Por que não se sentem ouvidos - só mostra se NÃO estiver equilibrado ou morno */}
        {!isAllBalanced && !isMorna && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
              Por Que Vocês Falam Mas Não Se Sentem Ouvidos
            </h2>
            <div className="bg-warmGray-50 rounded-xl p-6 border-l-4 border-fogo">
              <p className="text-warmGray-700 leading-relaxed">
                {explanation.whyNotHeard}
              </p>
            </div>
          </motion.section>
        )}

        {/* Padrão identificado (sempre mostra quando equilibrado ou quando há padrão) */}
        {(result.pattern || isAllBalanced) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
              {isAllBalanced ? '✨ Padrão Identificado' : '⚡ Padrão Identificado'}
            </h2>
            <div className={`rounded-xl p-6 border ${isAllBalanced
                ? 'bg-green-50 border-green-100'
                : isCriticalSituation
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-red-50 border-red-100'
              }`}>
              <p className={`leading-relaxed ${isCriticalSituation ? 'text-white' : 'text-warmGray-700'
                }`}>
                {isAllBalanced ? (
                  <><strong>Parabéns:</strong> {result.pattern || (isPerfectBalance ? 'Todos os 5 Elementos estão perfeitamente alinhados no seu relacionamento. Vocês têm uma base sólida em todas as dimensões. O planner de manutenção vai ajudar a manter esse equilíbrio.' : 'Todos os elementos estão em equilíbrio! Seu relacionamento tem uma base saudável. Continue nutrindo cada dimensão.')}</>
                ) : isCriticalSituation ? (
                  <><strong>🚨 Alerta Vermelho:</strong> {result.pattern}</>
                ) : (
                  <><strong>Atenção:</strong> {result.pattern}</>
                )}
              </p>
              {result.secondLowestElement && !isAllBalanced && !isMorna && (
                <p className="mt-2 text-sm text-warmGray-500">
                  Elemento secundário em risco:{' '}
                  <span className={`element-badge ${result.secondLowestElement}`}>
                    {elementsInfo[result.secondLowestElement as keyof typeof elementsInfo].icon}{' '}
                    {elementsInfo[result.secondLowestElement as keyof typeof elementsInfo].name}
                  </span>
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* Primeiros passos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            {isAllBalanced ? 'Primeiros Passos Para Manter o Equilíbrio' : 'Primeiros Passos Para Realinhar'}
          </h2>
          <div className="space-y-3">
            {explanation.firstSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-warmGray-100"
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-${elementInfo.color}/10 
                             text-${elementInfo.color}-dark font-bold flex items-center justify-center`}
                >
                  {index + 1}
                </span>
                <p className="text-warmGray-700 pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scores de todos os elementos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            Seu Mapa dos 5 Elementos
          </h2>
          <ScoreMap scores={result.scores} lowestElement={result.lowestElement} result={result} />
        </motion.section>

        {/* CTA Principal - Comprar Planner de 30 Dias (Hotmart) */}
        {!isCriticalSituation && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-10"
          >
            <PlannerSection result={result} quizResultId={quizResultId} user={user} />
          </motion.section>
        )}

        {/* CTA Hotmart - Comprar Planner de 30 Dias */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-10 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-warmGray-900 mb-4">
              Você viu o problema. Agora é hora de resolver.
            </h3>
            <p className="text-warmGray-600 mb-6">
              O <strong>Planner de 30 Dias</strong> oferece:
            </p>
            <ul className="text-warmGray-600 mb-6 space-y-2 inline-block text-left">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                30 exercícios práticos focados no seu elemento crítico
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Conversas guiadas para você e seu(sua) parceiro(a)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Acompanhamento de progresso diário
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Garantia de 7 dias (não funcionou? Devolvemos)
              </li>
            </ul>
            <div className="mt-8">
              <a
                href="https://hotmart.com/pt/marketplace/produtos"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Garantir Meu Planner de 30 Dias
              </a>
            </div>
          </div>
        </motion.section>

        {/* Footer / Ações secundárias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-warmGray-200"
        >
          <button
            onClick={resetQuiz}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refazer Quiz
          </button>

          <a
            href="https://instagram.com/jaya.terapia"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Seguir @jaya.terapia
          </a>
        </motion.div>

        {/* Assinatura */}
        <div className="text-center mt-10 pt-6 border-t border-warmGray-200">
          <p className="text-warmGray-500 text-sm">
            Método dos 5 Elementos por{' '}
            <strong className="text-warmGray-700">Jaya Roberta</strong>
          </p>
          <p className="text-warmGray-400 text-xs mt-1">
            Terapeuta Integrativa | Relacionamentos & Sexualidade
          </p>
        </div>
    </ResultLayout>
  );
}
