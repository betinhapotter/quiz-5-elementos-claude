'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, RefreshCw, Sparkles, Download, Loader2 } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { elementsInfo, Element } from '@/types/quiz';
import { generateResultExplanation, getResultSeverity } from '@/lib/quiz-logic';
import { API_ENDPOINTS, callAPI } from '@/lib/api';

export default function ResultScreen() {
  const { result, resetQuiz, userData, answers } = useQuizStore();
  const { user } = useAuth();
  const supabase = createClient();
  
  const [isGeneratingPlanner, setIsGeneratingPlanner] = useState(false);
  const [planner, setPlanner] = useState<string | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

      // Salva o planner no banco
      if (user) {
        await supabase.from('planners').insert({
          user_id: user.id,
          element_focus: result.lowestElement,
          content: data.planner,
        });
      }
    } catch (err) {
      setError('Erro ao gerar seu planner. Tente novamente.');
      console.error(err);
    } finally {
      setIsGeneratingPlanner(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!plannerRef.current || !result) return;

    setIsGeneratingPDF(true);

    try {
      const jsPDF = (await import('jspdf')).jsPDF;
      const element = plannerRef.current;

      // Cria o PDF diretamente do HTML (sem canvas = arquivo muito menor!)
      const pdf = new jsPDF('p', 'mm', 'a4');

      await pdf.html(element, {
        callback: (doc) => {
          doc.save(`planner-30-dias-${result.lowestElement}.pdf`);
        },
        x: 15,
        y: 15,
        width: 180, // largura útil em mm (A4 = 210mm - 30mm de margens)
        windowWidth: 800, // largura de referência para renderização
        html2canvas: {
          scale: 0.25, // reduz muito o tamanho do arquivo
        }
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!result) return null;

  const elementInfo = elementsInfo[result.lowestElement];
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

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero do resultado */}
      <div
        className={`bg-gradient-to-br ${elementColors[result.lowestElement]} text-white py-12 sm:py-16`}
      >
        <div className="container-quiz text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl sm:text-8xl block mb-4">
              {elementInfo.icon}
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

        {/* Por que não se sentem ouvidos */}
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

        {/* Padrão identificado (se houver) */}
        {result.pattern && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
              ⚡ Padrão Identificado
            </h2>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <p className="text-warmGray-700 leading-relaxed">
                <strong>Atenção:</strong> {result.pattern}
              </p>
              {result.secondLowestElement && (
                <p className="mt-2 text-sm text-warmGray-500">
                  Elemento secundário em risco:{' '}
                  <span className={`element-badge ${result.secondLowestElement}`}>
                    {elementsInfo[result.secondLowestElement].icon}{' '}
                    {elementsInfo[result.secondLowestElement].name}
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
            Primeiros Passos Para Realinhar
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
                const maxScore = 8;
                const percentage = (score / maxScore) * 100;
                const info = elementsInfo[element];
                const isLowest = element === result.lowestElement;

                return (
                  <div key={element}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-sm font-medium text-warmGray-700">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                        {isLowest && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            Desalinhado
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
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className={`h-full rounded-full ${
                          isLowest
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

        {/* CTA Principal - Gerar Planner com IA */}
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
                específicos para realinhar o elemento <strong>{elementInfo.name}</strong> no seu relacionamento.
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
              <div className="bg-gradient-to-r from-fogo to-fogo-dark p-6 text-white">
                <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Seu Planner de 30 Dias
                </h2>
                <p className="text-white/80 mt-1">
                  Gerado especialmente para realinhar o elemento {elementInfo.name}
                </p>
              </div>
              
              <div className="p-6 sm:p-8">
                <div
                  ref={plannerRef}
                  className="max-w-none"
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  {planner.split('\n').map((line, index) => {
                    const trimmed = line.trim();

                    // H1
                    if (trimmed.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-2xl font-bold mt-8 mb-4 first:mt-0" style={{ marginLeft: 0, marginRight: 0 }}>
                          {trimmed.substring(2)}
                        </h1>
                      );
                    }

                    // H2
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-fogo-dark" style={{ marginLeft: 0, marginRight: 0 }}>
                          {trimmed.substring(3)}
                        </h2>
                      );
                    }

                    // H3
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-lg font-semibold mt-4 mb-2" style={{ marginLeft: 0, marginRight: 0 }}>
                          {trimmed.substring(4)}
                        </h3>
                      );
                    }

                    // Lista
                    if (trimmed.startsWith('- ')) {
                      return (
                        <li key={index} className="ml-4 mb-1" style={{ marginLeft: '1rem', marginRight: 0 }}>
                          {trimmed.substring(2).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')}
                        </li>
                      );
                    }

                    // Linha vazia
                    if (!trimmed) {
                      return <br key={index} />;
                    }

                    // Parágrafo normal
                    return (
                      <p
                        key={index}
                        className="mb-2"
                        style={{ marginLeft: 0, marginRight: 0 }}
                        dangerouslySetInnerHTML={{
                          __html: trimmed
                            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-warmGray-200 p-6 bg-warmGray-50 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Baixar PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([planner], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `planner-30-dias-${result.lowestElement}.md`;
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
            href="https://instagram.com/jayaroberta"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Seguir @jayaroberta
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
