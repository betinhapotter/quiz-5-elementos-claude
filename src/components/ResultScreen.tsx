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
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const element = plannerRef.current;

      // Aumenta fontes temporariamente para o PDF
      const originalStyles = {
        fontSize: element.style.fontSize,
        padding: element.style.padding,
        maxWidth: element.style.maxWidth,
      };

      element.style.fontSize = '18px';
      element.style.padding = '20px';
      element.style.maxWidth = '100%';

      // Ajusta fontes dos elementos filhos
      const allElements = element.querySelectorAll('h1, h2, h3, p, li');
      const originalChildStyles = new Map();

      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        originalChildStyles.set(htmlEl, htmlEl.style.fontSize);
        if (el.tagName === 'H1') htmlEl.style.fontSize = '32px';
        if (el.tagName === 'H2') htmlEl.style.fontSize = '26px';
        if (el.tagName === 'H3') htmlEl.style.fontSize = '22px';
        if (el.tagName === 'P') htmlEl.style.fontSize = '16px';
        if (el.tagName === 'LI') htmlEl.style.fontSize = '16px';
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        backgroundColor: '#ffffff',
      });

      // Restaura estilos originais
      element.style.fontSize = originalStyles.fontSize;
      element.style.padding = originalStyles.padding;
      element.style.maxWidth = originalStyles.maxWidth;

      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.fontSize = originalChildStyles.get(htmlEl) || '';
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight); // 10mm de margem de cada lado
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', imgX, yOffset, imgWidth * ratio, imgHeight * ratio);
      }

      pdf.save(`planner-30-dias-${result.lowestElement}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!result) return null;

  // Verifica se todos estão equilibrados
  const allScores = Object.values(result.scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  const isAllBalanced = minScore >= 18 && scoreDifference <= 3; // THRESHOLDS.BALANCED_HIGH = 18
  const isPerfectBalance = minScore === 25 && maxScore === 25;
  
  // Verifica se todos estão em crise (alerta vermelho)
  const isAllInCrisis = allScores.every(score => score <= 8); // THRESHOLDS.CRISIS = 8
  const isAllLow = allScores.every(score => score <= 12); // THRESHOLDS.LOW = 12
  const isCriticalSituation = isAllInCrisis || isAllLow || result.pattern?.includes('alerta_vermelho');

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
      {/* Hero do resultado */}
      <div
        className={`bg-gradient-to-br ${isAllBalanced ? balancedGradient : elementColors[result.lowestElement]} text-white py-12 sm:py-16`}
      >
        <div className="container-quiz text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl sm:text-8xl block mb-4">
              {isAllBalanced ? '✨' : elementInfo.icon}
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

        {/* Por que não se sentem ouvidos - só mostra se NÃO estiver equilibrado */}
        {!isAllBalanced && (
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

        {/* Padrão identificado (se houver) */}
        {result.pattern && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
              {isAllBalanced ? '✨ Padrão Identificado' : '⚡ Padrão Identificado'}
            </h2>
            <div className={`rounded-xl p-6 border ${
              isAllBalanced 
                ? 'bg-green-50 border-green-100' 
                : isCriticalSituation
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-red-50 border-red-100'
            }`}>
              <p className={`leading-relaxed ${
                isCriticalSituation ? 'text-white' : 'text-warmGray-700'
              }`}>
                {isAllBalanced ? (
                  <><strong>Parabéns:</strong> {result.pattern}</>
                ) : isCriticalSituation ? (
                  <><strong>🚨 Alerta Vermelho:</strong> {result.pattern}</>
                ) : (
                  <><strong>Atenção:</strong> {result.pattern}</>
                )}
              </p>
              {result.secondLowestElement && !isAllBalanced && (
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
                const maxScore = 25; // 5 perguntas × 5 pontos máximo
                const minScore = 5;  // 5 perguntas × 1 ponto mínimo
                // Normaliza para 0-100% baseado na escala 5-25
                const percentage = ((score - minScore) / (maxScore - minScore)) * 100;
                const info = elementsInfo[element as keyof typeof elementsInfo];
                const isLowest = element === result.lowestElement;
                // Não mostra "Desalinhado" se todos estão equilibrados
                // Se todos estão em crise, mostra "Em Crise" para todos, não apenas o lowest
                const showMisaligned = isLowest && !isAllBalanced && !isCriticalSituation;
                const showCritical = isCriticalSituation && score <= 12; // THRESHOLDS.LOW = 12

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
                        className={`h-full rounded-full ${
                          isAllBalanced
                            ? 'bg-green-400'
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
                {isAllBalanced 
                  ? ' para manter o equilíbrio perfeito dos 5 Elementos no seu relacionamento.'
                  : ` específicos para realinhar o elemento <strong>${elementInfo.name}</strong> no seu relacionamento.`
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
              <div className={`bg-gradient-to-r p-6 text-white ${
                isAllBalanced 
                  ? 'from-green-500 to-emerald-600' 
                  : 'from-fogo to-fogo-dark'
              }`}>
                <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Seu Planner de 30 Dias
                </h2>
                <p className="text-white/80 mt-1">
                  {isAllBalanced 
                    ? `Gerado especialmente para manter o equilíbrio perfeito dos 5 Elementos`
                    : `Gerado especialmente para realinhar o elemento ${elementInfo.name}`
                  }
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
