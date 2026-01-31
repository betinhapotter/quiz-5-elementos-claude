'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, RefreshCw, Sparkles, Download, Loader2, LogOut } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { elementsInfo, Element } from '@/types/quiz';
import { generateResultExplanation, getResultSeverity } from '@/lib/quiz-logic';
import { THRESHOLDS } from '@/lib/quiz-constants';
import { API_ENDPOINTS, callAPI } from '@/lib/api';
import '@/styles/print.css';

export default function ResultScreen() {
  const { result, resetQuiz, userData, answers } = useQuizStore();
  const { user, signOut } = useAuth();
  const supabase = createClient();

  const [isGeneratingPlanner, setIsGeneratingPlanner] = useState(false);
  const [planner, setPlanner] = useState<string | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  // Salva resultado no banco quando carrega
  useEffect(() => {
    if (result && user && !savedToDb) {
      saveResultToDb();
    }
  }, [result, user]);

  const saveResultToDb = async () => {
    if (!result || !user) return;

    try {
      const { error } = await supabase.from('quiz_results').insert({
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
      });

      if (error) throw error;
      setSavedToDb(true);
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
    }
  };

  const handleGeneratePlanner = async () => {
    if (!result) return;

    setIsGeneratingPlanner(true);
    setError(null);

    try {
      // Chama a API route que usa o Gemini no servidor
      const data = await callAPI(API_ENDPOINTS.generatePlanner, {
        lowestElement: result.lowestElement,
        scores: result.scores,
        secondLowestElement: result.secondLowestElement,
        pattern: result.pattern,
      });

      setPlanner(data.planner);

      // Salva o planner no banco vinculado ao resultado do quiz
      if (user && savedToDb) {
        // Busca o quiz_result_id mais recente do usuário
        const { data: latestResult } = await supabase
          .from('quiz_results')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (latestResult) {
          await supabase.from('planners').insert({
            user_id: user.id,
            quiz_result_id: latestResult.id,
            element_focus: result.lowestElement,
            content: data.planner,
          });
        }
      }
    } catch (err) {
      setError('Erro ao gerar seu planner. Tente novamente.');
      console.error(err);
    } finally {
      setIsGeneratingPlanner(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!plannerRef.current || !result || !planner) {
      alert('Planner não está disponível. Gere o planner primeiro.');
      return;
    }

    // Define o nome do arquivo baseado no tipo de planner
    const fileName = isMorna
      ? 'planner-despertar'
      : isAllBalanced
        ? 'planner-manutencao-equilibrio'
        : `planner-30-dias-${result.lowestElement}`;

    // Define o título para aparecer na impressão
    const originalTitle = document.title;
    document.title = fileName;

    // Usa a impressão nativa do navegador
    window.print();

    // Restaura o título após a impressão
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  if (!result) return null;

  // Verifica se todos estão equilibrados
  const allScores = Object.values(result.scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  const isAllBalanced = (minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3) ||
    result.pattern?.includes('equilibrio_geral') ||
    result.pattern?.includes('equilibrio_perfeito');
  const isPerfectBalance = (minScore === 25 && maxScore === 25) ||
    result.pattern?.includes('equilibrio_perfeito');

  // Verifica se todos estão em crise (alerta vermelho)
  const isAllInCrisis = allScores.every(score => score <= THRESHOLDS.CRISIS);
  const isAllLow = allScores.every(score => score <= THRESHOLDS.LOW);
  const isCriticalSituation = isAllInCrisis || isAllLow || result.pattern?.includes('alerta_vermelho');

  // Verifica se é situação "morna" - todos na faixa média (13-17)
  const isAllMedium = minScore >= THRESHOLDS.BALANCED_LOW && maxScore <= 17 && scoreDifference <= 3;
  const isMorna = isAllMedium || result.pattern?.includes('relacao_morna');

  const elementInfo = elementsInfo[result.lowestElement as keyof typeof elementsInfo];
  const explanation = generateResultExplanation(result);
  const severity = getResultSeverity(result);

  // Cores por elemento
  const elementColors: Record<Element, string> = {
    terra: 'from-terra to-terra-dark',
    agua: 'from-agua to-agua-dark',
    ar: 'from-ar to-ar-dark',
    fogo: 'from-fogo to-fogo-dark',
    eter: 'from-eter to-eter-dark',
  };

  // Cor especial para equilíbrio
  const balancedGradient = isPerfectBalance
    ? 'from-green-500 to-emerald-600'
    : 'from-green-400 to-teal-500';

  return (
    <div className="min-h-screen bg-cream">
      {/* Botão de Logout */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-warmGray-600 hover:text-warmGray-900 hover:bg-warmGray-100 rounded-lg transition-colors bg-white/80 backdrop-blur-sm shadow-sm"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>

      {/* Hero do resultado */}
      <div
        className={`bg-gradient-to-br ${isAllBalanced
            ? balancedGradient
            : isMorna
              ? 'from-warmGray-800 to-warmGray-900'
              : elementColors[result.lowestElement]
          } text-white py-12 sm:py-16`}
      >
        <div className="container-quiz text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl sm:text-8xl block mb-4">
              {isAllBalanced ? '✨' : isMorna ? '💨' : elementInfo.icon}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              {explanation.title}
            </h1>

            <p className="text-xl opacity-90">{explanation.subtitle}</p>

            {/* Severidade */}
            {severity === 'critica' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 inline-block bg-white/20 rounded-full px-4 py-2 text-sm"
              >
                ⚠️ Nível crítico identificado — atenção necessária
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container-quiz py-10">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-warmGray-100">
            <div className="space-y-4">
              {(Object.keys(result.scores) as Element[]).map((element) => {
                const score = result.scores[element];
                const maxScore = 25; // 5 perguntas × 5 pontos máximo
                const minPossibleScore = 5;  // 5 perguntas × 1 ponto mínimo
                // Normaliza para 0-100% baseado na escala 5-25
                const percentage = ((score - minPossibleScore) / (maxScore - minPossibleScore)) * 100;
                const info = elementsInfo[element as keyof typeof elementsInfo];
                // Detecta todos os elementos com o mesmo score mínimo (empates)
                const allScores = Object.values(result.scores);
                const lowestScoreValue = Math.min(...allScores);
                const isLowest = score === lowestScoreValue;
                // Não mostra "Desalinhado" se todos estão equilibrados, em crise, ou mornos
                // Se todos estão em crise, mostra "Em Crise" para todos, não apenas o lowest
                // Se todos estão mornos, não mostra nenhum desalinhado
                const showMisaligned = isLowest && !isAllBalanced && !isCriticalSituation && !isMorna;
                const showCritical = isCriticalSituation && score <= THRESHOLDS.LOW;

                return (
                  <div key={element}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-sm font-medium text-warmGray-700">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                        {showCritical && (
                          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                            🚨 Em Crise
                          </span>
                        )}
                        {showMisaligned && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            Desalinhado
                          </span>
                        )}
                        {isAllBalanced && percentage >= 75 && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            Alinhado
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-warmGray-500 tabular-nums">
                        {score}/{maxScore}
                      </span>
                    </div>
                    <div className="h-3 bg-warmGray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className={`h-full rounded-full ${isAllBalanced
                            ? 'bg-green-400'
                            : isMorna
                              ? 'bg-yellow-400' // Todos amarelos quando morno
                              : isLowest
                                ? 'bg-red-400'
                                : percentage >= 75
                                  ? 'bg-green-400'
                                  : percentage >= 50
                                    ? 'bg-yellow-400'
                                    : 'bg-orange-400'
                          }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CTA Principal - Gerar Planner com IA (não mostra se for situação crítica) */}
        {!isCriticalSituation && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-10"
          >
            {!planner ? (
              <div className="bg-gradient-to-br from-warmGray-900 to-warmGray-800 rounded-2xl p-8 text-white text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                  🤖 Seu Planner de 30 Dias Personalizado
                </h2>
                <p className="text-warmGray-300 mb-6 max-w-lg mx-auto">
                  Nossa IA vai criar um plano de <strong>30 dias</strong> com exercícios práticos
                  {isAllBalanced
                    ? ' para manter o equilíbrio perfeito dos 5 Elementos no seu relacionamento.'
                    : isMorna
                      ? ' para despertar a brasa adormecida e tirar seu relacionamento do piloto automático.'
                      : ` específicos para realinhar o elemento ${elementInfo.name} no seu relacionamento.`
                  }
                </p>

                <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
                  <li className="flex items-center gap-2 text-warmGray-300">
                    <span className="text-green-400">✓</span>
                    Exercícios diários de 5-15 minutos
                  </li>
                  <li className="flex items-center gap-2 text-warmGray-300">
                    <span className="text-green-400">✓</span>
                    Progressão gradual ao longo das 4 semanas
                  </li>
                  <li className="flex items-center gap-2 text-warmGray-300">
                    <span className="text-green-400">✓</span>
                    Gerado por IA com base nas SUAS respostas
                  </li>
                </ul>

                <button
                  onClick={handleGeneratePlanner}
                  disabled={isGeneratingPlanner}
                  className="btn-primary bg-fogo hover:bg-fogo-dark text-lg px-8 py-4 disabled:opacity-50"
                >
                  {isGeneratingPlanner ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 inline animate-spin" />
                      Gerando seu planner...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 inline" />
                      Gerar Meu Planner Grátis
                    </>
                  )}
                </button>

                {error && (
                  <p className="mt-4 text-red-300 text-sm">{error}</p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-warmGray-200 overflow-hidden">
                <div className={`bg-gradient-to-r p-6 text-white ${isAllBalanced
                    ? 'from-green-500 to-emerald-600'
                    : 'from-fogo to-fogo-dark'
                  }`}>
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Seu Planner de 30 Dias
                  </h2>
                  <p className="text-white/80 mt-1">
                    {isPerfectBalance
                      ? 'Gerado especialmente para manter o equilíbrio perfeito dos 5 Elementos'
                      : isAllBalanced
                        ? 'Gerado especialmente para manter o equilíbrio harmonioso dos 5 Elementos'
                        : isMorna
                          ? 'Planner Despertar - Relacionamento Fora do Piloto Automático'
                          : `Gerado especialmente para realinhar o elemento ${elementInfo.name}`
                    }
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  <div
                    ref={plannerRef}
                    className="max-w-none prose prose-lg"
                    style={{
                      marginLeft: 0,
                      marginRight: 0,
                      padding: '2.5rem',
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      lineHeight: '1.7',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    {(() => {
                      const lines = planner.split('\n');
                      const elements: JSX.Element[] = [];
                      let currentList: string[] = [];
                      let listKey = 0;

                      lines.forEach((line, index) => {
                        const trimmed = line.trim();

                        // H1
                        if (trimmed.startsWith('# ')) {
                          // Fecha lista pendente se houver
                          if (currentList.length > 0) {
                            elements.push(
                              <ul key={`list-${listKey++}`} style={{
                                margin: '1.25rem 0',
                                paddingLeft: '2.5rem',
                                listStyleType: 'disc',
                                pageBreakInside: 'avoid'
                              }}>
                                {currentList.map((item, i) => (
                                  <li key={i} style={{
                                    marginBottom: '0.75rem',
                                    fontSize: '17px',
                                    lineHeight: '1.7',
                                    color: '#374151',
                                    paddingLeft: '0.5rem'
                                  }}>
                                    <span dangerouslySetInnerHTML={{
                                      __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>')
                                    }} />
                                  </li>
                                ))}
                              </ul>
                            );
                            currentList = [];
                          }
                          elements.push(
                            <h1
                              key={index}
                              style={{
                                marginLeft: 0,
                                marginRight: 0,
                                marginTop: index === 0 ? 0 : '2rem',
                                marginBottom: '1.5rem',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                lineHeight: '1.2',
                                color: '#111827'
                              }}
                            >
                              {trimmed.substring(2)}
                            </h1>
                          );
                          return;
                        }

                        // H2
                        if (trimmed.startsWith('## ')) {
                          if (currentList.length > 0) {
                            elements.push(
                              <ul key={`list-${listKey++}`} style={{
                                margin: '1.25rem 0',
                                paddingLeft: '2.5rem',
                                listStyleType: 'disc',
                                pageBreakInside: 'avoid'
                              }}>
                                {currentList.map((item, i) => (
                                  <li key={i} style={{
                                    marginBottom: '0.75rem',
                                    fontSize: '17px',
                                    lineHeight: '1.7',
                                    color: '#374151',
                                    paddingLeft: '0.5rem'
                                  }}>
                                    <span dangerouslySetInnerHTML={{
                                      __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>')
                                    }} />
                                  </li>
                                ))}
                              </ul>
                            );
                            currentList = [];
                          }
                          elements.push(
                            <h2
                              key={index}
                              style={{
                                marginTop: '2.5rem',
                                marginBottom: '1.25rem',
                                marginLeft: '-1rem',
                                marginRight: '-1rem',
                                fontSize: '24px',
                                fontWeight: '600',
                                lineHeight: '1.3',
                                color: isMorna ? '#d97706' : '#E25822',
                                borderBottom: `2px solid ${isMorna ? '#fef3c7' : '#f3f4f6'}`,
                                backgroundColor: isMorna ? '#fffbeb' : 'transparent',
                                padding: '0.75rem 1rem',
                                borderRadius: '6px',
                                pageBreakAfter: 'avoid',
                                pageBreakInside: 'avoid'
                              }}
                            >
                              {trimmed.substring(3)}
                            </h2>
                          );
                          return;
                        }

                        // H3
                        if (trimmed.startsWith('### ')) {
                          if (currentList.length > 0) {
                            elements.push(
                              <ul key={`list-${listKey++}`} style={{
                                margin: '1.25rem 0',
                                paddingLeft: '2.5rem',
                                listStyleType: 'disc',
                                pageBreakInside: 'avoid'
                              }}>
                                {currentList.map((item, i) => (
                                  <li key={i} style={{
                                    marginBottom: '0.75rem',
                                    fontSize: '17px',
                                    lineHeight: '1.7',
                                    color: '#374151',
                                    paddingLeft: '0.5rem'
                                  }}>
                                    <span dangerouslySetInnerHTML={{
                                      __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>')
                                    }} />
                                  </li>
                                ))}
                              </ul>
                            );
                            currentList = [];
                          }
                          elements.push(
                            <h3
                              key={index}
                              style={{
                                marginLeft: 0,
                                marginRight: 0,
                                marginTop: '1.75rem',
                                marginBottom: '0.875rem',
                                fontSize: '20px',
                                fontWeight: '600',
                                lineHeight: '1.4',
                                color: '#4b5563',
                                paddingLeft: '0.5rem',
                                borderLeft: `4px solid ${isMorna ? '#fbbf24' : '#E25822'}`,
                                pageBreakAfter: 'avoid',
                                pageBreakInside: 'avoid'
                              }}
                            >
                              {trimmed.substring(4)}
                            </h3>
                          );
                          return;
                        }

                        // Lista - acumula itens
                        if (trimmed.startsWith('- ')) {
                          currentList.push(trimmed.substring(2));
                          return;
                        }

                        // Linha vazia - fecha lista se houver
                        if (!trimmed) {
                          if (currentList.length > 0) {
                            elements.push(
                              <ul key={`list-${listKey++}`} style={{
                                margin: '1.25rem 0',
                                paddingLeft: '2.5rem',
                                listStyleType: 'disc',
                                pageBreakInside: 'avoid'
                              }}>
                                {currentList.map((item, i) => (
                                  <li key={i} style={{
                                    marginBottom: '0.75rem',
                                    fontSize: '17px',
                                    lineHeight: '1.7',
                                    color: '#374151',
                                    paddingLeft: '0.5rem'
                                  }}>
                                    <span dangerouslySetInnerHTML={{
                                      __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>')
                                    }} />
                                  </li>
                                ))}
                              </ul>
                            );
                            currentList = [];
                          }
                          elements.push(<div key={index} style={{ height: '0.75rem' }} />);
                          return;
                        }

                        // Parágrafo normal - fecha lista se houver
                        if (currentList.length > 0) {
                          elements.push(
                            <ul key={`list-${listKey++}`} style={{ margin: '1rem 0', paddingLeft: '2rem', listStyleType: 'disc' }}>
                              {currentList.map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem', fontSize: '16px', lineHeight: '1.6' }}>
                                  <span dangerouslySetInnerHTML={{
                                    __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')
                                  }} />
                                </li>
                              ))}
                            </ul>
                          );
                          currentList = [];
                        }

                        elements.push(
                          <p
                            key={index}
                            style={{
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: '0.5rem',
                              marginBottom: '1rem',
                              fontSize: '17px',
                              lineHeight: '1.75',
                              color: '#374151',
                              textAlign: 'justify',
                              pageBreakInside: 'avoid'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: trimmed
                                .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>')
                                .replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>')
                            }}
                          />
                        );
                      });

                      // Fecha lista pendente no final
                      if (currentList.length > 0) {
                        elements.push(
                          <ul key={`list-${listKey++}`} style={{ margin: '1rem 0', paddingLeft: '2rem', listStyleType: 'disc' }}>
                            {currentList.map((item, i) => (
                              <li key={i} style={{ marginBottom: '0.5rem', fontSize: '16px', lineHeight: '1.6' }}>
                                <span dangerouslySetInnerHTML={{
                                  __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')
                                }} />
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      return elements;
                    })()}
                  </div>
                </div>

                <div className="border-t border-warmGray-200 p-6 bg-warmGray-50 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleDownloadPDF}
                    className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([planner], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      // Define o nome do arquivo baseado no tipo de planner
                      const fileName = isMorna
                        ? 'planner-despertar'
                        : isAllBalanced
                          ? 'planner-manutencao-equilibrio'
                          : `planner-30-dias-${result.lowestElement}`;
                      a.download = `${fileName}.md`;
                      a.click();
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar MD
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        )}

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
      </div>
    </div>
  );
}
