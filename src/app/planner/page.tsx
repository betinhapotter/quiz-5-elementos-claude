'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, RefreshCw, Sparkles } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo, Element } from '@/types/quiz';

export default function PlannerPage() {
  const router = useRouter();
  const { result, planner } = useQuizStore();
  const plannerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Redireciona se não tiver resultado ou planner
  useEffect(() => {
    if (!result || !planner) {
      router.push('/');
    }
  }, [result, planner, router]);

  if (!result || !planner) {
    return null;
  }

  const elementInfo = elementsInfo[result.lowestElement];

  const elementColors: Record<Element, string> = {
    terra: 'from-terra to-terra-dark',
    agua: 'from-agua to-agua-dark',
    ar: 'from-ar to-ar-dark',
    fogo: 'from-fogo to-fogo-dark',
    eter: 'from-eter to-eter-dark',
  };

  const downloadMarkdown = () => {
    const blob = new Blob([planner], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-${result.lowestElement}-30-dias.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!plannerRef.current) return;

    setIsGeneratingPDF(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const originalFontSize = plannerRef.current.style.fontSize;
      plannerRef.current.style.fontSize = '16px';

      const canvas = await html2canvas(plannerRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
      });

      plannerRef.current.style.fontSize = originalFontSize;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const imgX = (pdfWidth - canvas.width * ratio) / 2;
      const totalPages = Math.ceil((canvas.height * ratio) / pdfHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', imgX, yOffset, canvas.width * ratio, canvas.height * ratio);
      }

      pdf.save(`planner-${result.lowestElement}-30-dias.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header fixo */}
      <div className={`sticky top-0 z-10 bg-gradient-to-br ${elementColors[result.lowestElement]} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{elementInfo.icon}</span>
                <div>
                  <h1 className="font-display text-xl sm:text-2xl font-bold">
                    Planner de 30 Dias
                  </h1>
                  <p className="text-sm opacity-90">Elemento {elementInfo.name}</p>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
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

              <button
                onClick={downloadMarkdown}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Baixar MD
              </button>
            </div>
          </div>

          {/* Botões mobile */}
          <div className="sm:hidden mt-3 flex gap-2">
            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {isGeneratingPDF ? 'Gerando...' : 'PDF'}
            </button>
            <button
              onClick={downloadMarkdown}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              MD
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo do planner */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl border border-warmGray-100 overflow-hidden"
        >
          <div ref={plannerRef} className="p-6 sm:p-10 lg:p-12" style={{ fontSize: '16px' }}>
            <div style={{ margin: 0, padding: 0 }}>
              {planner.split('\n').map((line, i) => {
                const baseStyle = { marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 };

                if (line.startsWith('# ')) {
                  return (
                    <h1
                      key={i}
                      style={{ ...baseStyle, marginTop: i === 0 ? 0 : '2.5rem', marginBottom: '1.5rem', fontSize: '32px', lineHeight: '1.2' }}
                      className="font-bold text-warmGray-900"
                    >
                      {line.slice(2)}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2
                      key={i}
                      style={{ ...baseStyle, marginTop: '2rem', marginBottom: '1rem', fontSize: '26px', borderBottom: '3px solid #e5e7eb', paddingBottom: '0.75rem', lineHeight: '1.3' }}
                      className="font-bold text-warmGray-800"
                    >
                      {line.slice(3)}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3
                      key={i}
                      style={{ ...baseStyle, marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '20px', lineHeight: '1.4' }}
                      className="font-semibold text-warmGray-700"
                    >
                      {line.slice(4)}
                    </h3>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <li
                      key={i}
                      style={{ ...baseStyle, marginLeft: '2rem', fontSize: '16px', lineHeight: '1.7', marginTop: '0.5rem' }}
                      className="text-warmGray-700"
                    >
                      {line.slice(2)}
                    </li>
                  );
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p
                      key={i}
                      style={{ ...baseStyle, marginTop: '1rem', marginBottom: '0.5rem', fontSize: '18px', lineHeight: '1.6' }}
                      className="font-bold text-warmGray-900"
                    >
                      {line.slice(2, -2)}
                    </p>
                  );
                }
                if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                  return (
                    <p
                      key={i}
                      style={{ ...baseStyle, fontSize: '15px', lineHeight: '1.6', marginTop: '0.5rem' }}
                      className="italic text-gray-600"
                    >
                      {line.slice(1, -1)}
                    </p>
                  );
                }
                if (line.trim()) {
                  return (
                    <p
                      key={i}
                      style={{ ...baseStyle, marginTop: '0.75rem', marginBottom: '0.75rem', fontSize: '16px', lineHeight: '1.8' }}
                      className="text-warmGray-700"
                    >
                      {line}
                    </p>
                  );
                }
                return <div key={i} style={{ height: '1rem' }} />;
              })}
            </div>
          </div>

          {/* Footer da página do planner */}
          <div className="border-t border-warmGray-200 bg-warmGray-50 p-6 text-center">
            <p className="text-warmGray-600 mb-3">
              Quer acompanhamento profissional para aplicar esse planner?
            </p>
            <a
              href="https://instagram.com/jayaroberta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-fogo to-fogo-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Falar com Jaya Roberta
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
