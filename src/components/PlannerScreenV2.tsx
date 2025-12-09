'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Sparkles, ArrowLeft, FileText } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo, Element } from '@/types/quiz';
import { API_ENDPOINTS, callAPI } from '@/lib/api';

interface PlannerScreenV2Props {
  onBack: () => void;
}

export default function PlannerScreenV2({ onBack }: PlannerScreenV2Props) {
  console.log('🚀🚀🚀 NOVO PLANNER V2 CARREGADO! 🚀🚀🚀');

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
      const data = await callAPI(API_ENDPOINTS.generatePlanner, {
        lowestElement: result.lowestElement,
        scores: result.scores,
        secondLowestElement: result.secondLowestElement,
        pattern: result.pattern,
      });

      setPlanner(data.planner);
    } catch (err) {
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
    if (!plannerRef.current || !planner) return;

    setIsGeneratingPDF(true);
    console.log('Gerando PDF...');

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

      pdf.save(`planner-${result.lowestElement}-30-dias.pdf`);
      console.log('PDF salvo!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Veja o console.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const elementColors: Record<Element, string> = {
    terra: 'from-terra to-terra-dark',
    agua: 'from-agua to-agua-dark',
    ar: 'from-ar to-ar-dark',
    fogo: 'from-fogo to-fogo-dark',
    eter: 'from-eter to-eter-dark',
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className={`bg-gradient-to-br ${elementColors[result.lowestElement]} text-white py-8`}>
        <div className="container-quiz">
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{elementInfo.icon}</span>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                🆕 Planner V2 - 30 Dias
              </h1>
              <p className="opacity-90">Nova Versão • Elemento {elementInfo.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-quiz py-8">
        {!planner && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">
              <Sparkles className="w-12 h-12 text-fogo mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-4">Gere Seu Planner</h2>
              <p className="text-warmGray-600 mb-6">
                30 dias de exercícios personalizados para realinhar o elemento {elementInfo.name}.
              </p>
              <button onClick={generatePlanner} className="btn-primary w-full">
                <Sparkles className="w-5 h-5" />
                Gerar Planner
              </button>
              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-warmGray-200 border-t-fogo rounded-full animate-spin" />
              <h2 className="font-display text-xl font-bold mb-2">Gerando...</h2>
              <p className="text-warmGray-500">A IA está criando seu plano personalizado.</p>
            </div>
          </div>
        )}

        {planner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* BANNER BEM VISÍVEL */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 mb-6 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="font-bold text-lg">VERSÃO 2.0 FUNCIONANDO!</h3>
                  <p className="text-sm opacity-90">Margens corrigidas • Exportação PDF ativa</p>
                </div>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={generatePlanner} className="btn-secondary flex items-center gap-2">
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
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    📄 Baixar PDF
                  </>
                )}
              </button>

              <button onClick={downloadMarkdown} className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Baixar MD
              </button>
            </div>

            {/* CONTEÚDO */}
            <div
              ref={plannerRef}
              className="bg-white rounded-2xl shadow-lg border p-6 sm:p-8"
              style={{ maxWidth: '100%', overflow: 'hidden' }}
            >
              <div style={{ margin: 0, padding: 0 }}>
                {planner.split('\n').map((line, i) => {
                  const style = { marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 };

                  if (line.startsWith('# ')) {
                    return <h1 key={i} style={{...style, marginTop: i === 0 ? 0 : '2rem', marginBottom: '1rem'}} className="text-2xl font-bold">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} style={{...style, marginTop: '1.5rem', marginBottom: '0.75rem'}} className="text-xl font-bold border-b pb-2">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} style={{...style, marginTop: '1rem', marginBottom: '0.5rem'}} className="text-lg font-semibold">{line.slice(4)}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} style={{...style, marginLeft: '1.5rem'}} className="my-1">{line.slice(2)}</li>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} style={{...style, marginTop: '0.5rem', marginBottom: '0.25rem'}} className="font-bold">{line.slice(2, -2)}</p>;
                  }
                  if (line.startsWith('*') && line.endsWith('*')) {
                    return <p key={i} style={{...style}} className="italic text-sm text-gray-600">{line.slice(1, -1)}</p>;
                  }
                  if (line.trim()) {
                    return <p key={i} style={{...style, marginTop: '0.5rem', marginBottom: '0.5rem'}}>{line}</p>;
                  }
                  return <div key={i} style={{ height: '0.5rem' }} />;
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
