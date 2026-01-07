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

      // Salva estilos originais do container
      const originalContainerStyles = {
        backgroundColor: element.style.backgroundColor,
        padding: element.style.padding,
        margin: element.style.margin,
        width: element.style.width,
        maxWidth: element.style.maxWidth,
      };

      // Aplica estilos otimizados para PDF
      element.style.backgroundColor = '#ffffff';
      element.style.padding = '40px';
      element.style.margin = '0';
      element.style.width = '210mm'; // Largura A4
      element.style.maxWidth = '210mm';

      // Ajusta fontes e espaçamentos para melhor legibilidade no PDF
      const allElements = element.querySelectorAll('h1, h2, h3, p, li, ul, ol');
      const originalStyles = new Map();

      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        originalStyles.set(htmlEl, {
          fontSize: htmlEl.style.fontSize,
          marginTop: htmlEl.style.marginTop,
          marginBottom: htmlEl.style.marginBottom,
          padding: htmlEl.style.padding,
        });

        // Ajusta tamanhos para PDF
        if (el.tagName === 'H1') {
          htmlEl.style.fontSize = '24px';
          htmlEl.style.marginTop = '20px';
          htmlEl.style.marginBottom = '12px';
        } else if (el.tagName === 'H2') {
          htmlEl.style.fontSize = '20px';
          htmlEl.style.marginTop = '16px';
          htmlEl.style.marginBottom = '10px';
        } else if (el.tagName === 'H3') {
          htmlEl.style.fontSize = '18px';
          htmlEl.style.marginTop = '14px';
          htmlEl.style.marginBottom = '8px';
        } else if (el.tagName === 'P') {
          htmlEl.style.fontSize = '14px';
          htmlEl.style.marginTop = '8px';
          htmlEl.style.marginBottom = '8px';
          htmlEl.style.lineHeight = '1.6';
        } else if (el.tagName === 'LI') {
          htmlEl.style.fontSize = '14px';
          htmlEl.style.marginBottom = '6px';
          htmlEl.style.lineHeight = '1.5';
        }
      });

      // Aguarda um momento para os estilos serem aplicados
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: 800,
        windowHeight: element.scrollHeight,
      });

      // Restaura estilos originais
      element.style.backgroundColor = originalContainerStyles.backgroundColor;
      element.style.padding = originalContainerStyles.padding;
      element.style.margin = originalContainerStyles.margin;
      element.style.width = originalContainerStyles.width;
      element.style.maxWidth = originalContainerStyles.maxWidth;

      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const original = originalStyles.get(htmlEl);
        if (original) {
          htmlEl.style.fontSize = original.fontSize;
          htmlEl.style.marginTop = original.marginTop;
          htmlEl.style.marginBottom = original.marginBottom;
          htmlEl.style.padding = original.padding;
        }
      });

      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // Margem de 15mm de cada lado
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      const totalPages = Math.ceil(scaledHeight / contentHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        
        const sourceY = (page * contentHeight) / ratio;
        const sourceHeight = Math.min(contentHeight / ratio, imgHeight - sourceY);
        const destHeight = sourceHeight * ratio;

        // Cria um canvas temporário para cada página
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
          const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
          pdf.addImage(pageImgData, 'PNG', margin, margin, scaledWidth, destHeight);
        }
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
                  className="max-w-none prose prose-lg"
                  style={{ 
                    marginLeft: 0, 
                    marginRight: 0,
                    padding: '2rem',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    lineHeight: '1.6',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
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
                          <h2 
                            key={index} 
                            style={{ 
                              marginLeft: 0, 
                              marginRight: 0,
                              marginTop: '1.5rem',
                              marginBottom: '1rem',
                              fontSize: '22px',
                              fontWeight: 'bold',
                              lineHeight: '1.3',
                              color: '#E25822',
                              borderBottom: '2px solid #f3f4f6',
                              paddingBottom: '0.5rem'
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
                          <h3 
                            key={index} 
                            style={{ 
                              marginLeft: 0, 
                              marginRight: 0,
                              marginTop: '1rem',
                              marginBottom: '0.75rem',
                              fontSize: '18px',
                              fontWeight: '600',
                              lineHeight: '1.4',
                              color: '#374151'
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
                            marginBottom: '0.75rem',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#374151'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: trimmed
                              .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*([^*]+)\*/g, '<em>$1</em>')
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
