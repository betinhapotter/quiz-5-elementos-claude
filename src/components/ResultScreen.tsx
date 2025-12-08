'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, RefreshCw, Sparkles, Download, Loader2, FileText } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { elementsInfo, Element } from '@/types/quiz';
import { generateResultExplanation, getResultSeverity } from '@/lib/quiz-logic';

export default function ResultScreen() {
  const { result, resetQuiz, userData, answers } = useQuizStore();
  const { user } = useAuth();
  const supabase = createClient();
  
  const [isGeneratingPlanner, setIsGeneratingPlanner] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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
      const response = await fetch('/api/generate-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lowestElement: result.lowestElement,
          scores: result.scores,
          secondLowestElement: result.secondLowestElement,
          pattern: result.pattern,
        }),
      });

      if (!response.ok) throw new Error('Falha ao gerar planner');

      const data = await response.json();
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

  const downloadMarkdown = () => {
    if (!planner) return;
    const blob = new Blob([planner], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-${result?.lowestElement}-30-dias.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!plannerRef.current || !planner) return;

    setIsGeneratingPDF(true);
    console.log('🚀 Gerando PDF...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(plannerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
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
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', imgX, yOffset, imgWidth * ratio, imgHeight * ratio);
      }

      pdf.save(`planner-${result?.lowestElement}-30-dias.pdf`);
      console.log('✅ PDF salvo!');
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Veja o console.');
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
              {/* Banner V2 */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-bold">VERSÃO 2.0 FUNCIONANDO!</h3>
                    <p className="text-sm opacity-90">Margens corrigidas • PDF funcionando</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-fogo to-fogo-dark p-6 text-white">
                <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Seu Planner de 30 Dias
                </h2>
                <p className="text-white/80 mt-1">
                  Gerado especialmente para realinhar o elemento {elementInfo.name}
                </p>
              </div>

              {/* Botões */}
              <div className="border-b border-warmGray-200 p-4 bg-warmGray-50 flex flex-wrap gap-3">
                <button onClick={handleGeneratePlanner} className="btn-secondary flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Gerar Novo
                </button>

                <button
                  onClick={downloadPDF}
                  disabled={isGeneratingPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Baixar PDF
                    </>
                  )}
                </button>

                <button onClick={downloadMarkdown} className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Baixar MD
                </button>
              </div>

              {/* Conteúdo do Planner */}
              <div ref={plannerRef} className="p-6 sm:p-8">
                <div style={{ margin: 0, padding: 0 }}>
                  {planner.split('\n').map((line, i) => {
                    const baseStyle = { marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 };

                    if (line.startsWith('# ')) {
                      return <h1 key={i} style={{...baseStyle, marginTop: i === 0 ? 0 : '2rem', marginBottom: '1rem'}} className="text-2xl font-bold">{line.slice(2)}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={i} style={{...baseStyle, marginTop: '1.5rem', marginBottom: '0.75rem'}} className="text-xl font-bold border-b pb-2">{line.slice(3)}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} style={{...baseStyle, marginTop: '1rem', marginBottom: '0.5rem'}} className="text-lg font-semibold">{line.slice(4)}</h3>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} style={{...baseStyle, marginLeft: '1.5rem'}} className="my-1">{line.slice(2)}</li>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} style={{...baseStyle, marginTop: '0.5rem', marginBottom: '0.25rem'}} className="font-bold">{line.slice(2, -2)}</p>;
                    }
                    if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                      return <p key={i} style={baseStyle} className="italic text-sm text-gray-600">{line.slice(1, -1)}</p>;
                    }
                    if (line.trim()) {
                      return <p key={i} style={{...baseStyle, marginTop: '0.5rem', marginBottom: '0.5rem'}}>{line}</p>;
                    }
                    return <div key={i} style={{ height: '0.5rem' }} />;
                  })}
                </div>
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
