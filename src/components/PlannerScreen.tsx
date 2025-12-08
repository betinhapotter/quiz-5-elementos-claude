'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Sparkles, ArrowLeft, FileText } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo, Element } from '@/types/quiz';

interface PlannerScreenProps {
  onBack: () => void;
}

export default function PlannerScreen({ onBack }: PlannerScreenProps) {
  console.log('🔥🔥🔥 PLANNER SCREEN V2.0 CARREGADO! 🔥🔥🔥');
  console.log('Se você vê esta mensagem, o novo código ESTÁ rodando!');

  const { result } = useQuizStore();
  const [planner, setPlanner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  if (!result) return null;

  const elementInfo = elementsInfo[result.lowestElement];

  const generatePlanner = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lowestElement: result.lowestElement,
          scores: result.scores,
          secondLowestElement: result.secondLowestElement,
          pattern: result.pattern,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        console.error('API Error:', data);
        throw new Error(errorMsg || 'Erro ao gerar planner');
      }

      console.log('Planner received successfully');
      setPlanner(data.planner);
    } catch (err) {
      console.error('Planner generation error:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!planner) return;
    const blob = new Blob([planner], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-${result.lowestElement}-30-dias.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!plannerRef.current || !planner) {
      console.log('PDF: plannerRef ou planner não disponível');
      return;
    }

    setIsGeneratingPDF(true);
    console.log('Iniciando geração do PDF...');

    try {
      // Importa dinamicamente apenas quando necessário
      console.log('Importando bibliotecas...');
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      console.log('Bibliotecas importadas com sucesso');

      // Cria canvas do conteúdo
      console.log('Criando canvas...');
      const canvas = await html2canvas(plannerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      console.log('Canvas criado:', canvas.width, 'x', canvas.height);

      // Cria PDF
      console.log('Gerando PDF...');
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
      const imgY = 0;

      // Calcula quantas páginas são necessárias
      const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);
      console.log('Total de páginas:', totalPages);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', imgX, imgY + yOffset, imgWidth * ratio, imgHeight * ratio);
      }

      console.log('Salvando PDF...');
      pdf.save(`planner-${result.lowestElement}-30-dias.pdf`);
      console.log('PDF salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Verifique o console para mais detalhes.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
      {/* Header */}
      <div className={`bg-gradient-to-br ${elementColors[result.lowestElement]} text-white py-8`}>
        <div className="container-quiz">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao resultado
          </button>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{elementInfo.icon}</span>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                Planner de 30 Dias V2.0 ✨
              </h1>
              <p className="opacity-90">
                Elemento {elementInfo.name} • Gerado por IA • NOVA VERSÃO
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-quiz py-8">
        {/* Estado: Ainda não gerou */}
        {!planner && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-8 max-w-lg mx-auto">
              <Sparkles className="w-12 h-12 text-fogo mx-auto mb-4" />
              
              <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
                Gere Seu Planner Personalizado
              </h2>
              
              <p className="text-warmGray-600 mb-6">
                Nossa IA vai criar um plano de 30 dias exclusivo para você,
                focado em realinhar o elemento <strong>{elementInfo.name}</strong>.
              </p>

              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-warmGray-600">
                  <span className="text-green-500">✓</span>
                  30 exercícios práticos (1 por dia)
                </li>
                <li className="flex items-center gap-2 text-sm text-warmGray-600">
                  <span className="text-green-500">✓</span>
                  Progressão de individual para casal
                </li>
                <li className="flex items-center gap-2 text-sm text-warmGray-600">
                  <span className="text-green-500">✓</span>
                  Baseado nas suas respostas específicas
                </li>
              </ul>

              <button
                onClick={generatePlanner}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Gerar Meu Planner com IA
              </button>

              {error && (
                <p className="mt-4 text-red-500 text-sm">{error}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Estado: Carregando */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-8 max-w-lg mx-auto">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-warmGray-200" />
                <div className="absolute inset-0 rounded-full border-4 border-fogo border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-fogo" />
              </div>
              
              <h2 className="font-display text-xl font-bold text-warmGray-900 mb-2">
                Gerando seu planner...
              </h2>
              
              <p className="text-warmGray-500">
                A IA está criando um plano personalizado para você.
                <br />
                Isso pode levar alguns segundos.
              </p>
            </div>
          </motion.div>
        )}

        {/* Estado: Planner gerado */}
        {planner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Debug: Indicador de versão */}
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 text-sm text-blue-800">
              ✅ <strong>Versão atualizada v2.0</strong> - Margens corrigidas + Exportação PDF
            </div>

            {/* Ações */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={generatePlanner}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Gerar novamente
              </button>

              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className="btn-primary flex items-center gap-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Baixar PDF
                  </>
                )}
              </button>

              <button
                onClick={downloadMarkdown}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar Markdown
              </button>
            </div>

            {/* Conteúdo do Planner */}
            <div
              ref={plannerRef}
              className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-6 sm:p-8"
            >
              <article className="max-w-none" style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                {/* Renderiza o markdown com margens consistentes */}
                {(() => {
                  const lines = planner.split('\n');
                  const elements: JSX.Element[] = [];
                  let listItems: string[] = [];
                  let listKey = 0;

                  const flushList = () => {
                    if (listItems.length > 0) {
                      elements.push(
                        <ul key={`list-${listKey++}`} style={{ marginTop: '1rem', marginBottom: '1rem', marginLeft: '1.5rem', marginRight: 0, paddingLeft: 0 }} className="list-disc space-y-1">
                          {listItems.map((item, idx) => (
                            <li key={idx} style={{ marginLeft: 0, marginRight: 0 }} className="text-warmGray-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                      listItems = [];
                    }
                  };

                  lines.forEach((line, index) => {
                    // Títulos H1
                    if (line.startsWith('# ')) {
                      flushList();
                      elements.push(
                        <h1 key={`h1-${index}`} style={{ marginTop: index === 0 ? 0 : '2rem', marginBottom: '1rem', marginLeft: 0, marginRight: 0 }} className="font-display text-2xl font-bold text-warmGray-900">
                          {line.replace('# ', '')}
                        </h1>
                      );
                    }
                    // Títulos H2
                    else if (line.startsWith('## ')) {
                      flushList();
                      elements.push(
                        <h2 key={`h2-${index}`} style={{ marginTop: '1.5rem', marginBottom: '0.75rem', marginLeft: 0, marginRight: 0, paddingBottom: '0.5rem' }} className="font-display text-xl font-bold text-warmGray-800 border-b border-warmGray-200">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    // Títulos H3
                    else if (line.startsWith('### ')) {
                      flushList();
                      elements.push(
                        <h3 key={`h3-${index}`} style={{ marginTop: '1rem', marginBottom: '0.5rem', marginLeft: 0, marginRight: 0 }} className="font-semibold text-warmGray-700">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    // Lista
                    else if (line.startsWith('- ')) {
                      listItems.push(line.replace('- ', ''));
                    }
                    // Negrito (linha inteira)
                    else if (line.startsWith('**') && line.endsWith('**')) {
                      flushList();
                      elements.push(
                        <p key={`bold-${index}`} style={{ marginTop: '0.75rem', marginBottom: '0.25rem', marginLeft: 0, marginRight: 0 }} className="font-semibold text-warmGray-900">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    // Itálico (linha inteira)
                    else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                      flushList();
                      elements.push(
                        <p key={`italic-${index}`} style={{ marginTop: '0.25rem', marginBottom: '0.5rem', marginLeft: 0, marginRight: 0 }} className="italic text-warmGray-600 text-sm">
                          {line.replace(/\*/g, '')}
                        </p>
                      );
                    }
                    // Parágrafo normal
                    else if (line.trim()) {
                      flushList();
                      // Renderiza texto com negrito inline
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      elements.push(
                        <p key={`p-${index}`} style={{ marginTop: '0.5rem', marginBottom: '0.5rem', marginLeft: 0, marginRight: 0 }} className="text-warmGray-700">
                          {parts.map((part, i) =>
                            part.startsWith('**') && part.endsWith('**') ? (
                              <strong key={i}>{part.replace(/\*\*/g, '')}</strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      );
                    }
                    // Linha vazia
                    else {
                      flushList();
                    }
                  });

                  // Flush any remaining list items
                  flushList();

                  return elements;
                })()}
              </article>
            </div>

            {/* CTA Final */}
            <div className="mt-8 text-center">
              <p className="text-warmGray-500 mb-4">
                Quer acompanhamento profissional para aplicar esse planner?
              </p>
              <a
                href="https://instagram.com/jayaroberta"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Falar com Jaya Roberta
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
