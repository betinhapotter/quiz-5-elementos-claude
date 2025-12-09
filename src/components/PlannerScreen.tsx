'use client';

import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { elementsInfo, Element } from '@/types/quiz';

interface PlannerScreenProps {
  planner: string;
  element: Element;
  onBack: () => void;
}

export default function PlannerScreen({ planner, element, onBack }: PlannerScreenProps) {
  const elementInfo = elementsInfo[element];

  const elementColors: Record<Element, string> = {
    terra: 'from-terra to-terra-dark',
    agua: 'from-agua to-agua-dark',
    ar: 'from-ar to-ar-dark',
    fogo: 'from-fogo to-fogo-dark',
    eter: 'from-eter to-eter-dark',
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Planner 30 Dias - ${elementInfo.name}</title>
          <style>
            @page {
              size: A4;
              margin: 2.5cm;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            html, body {
              width: 100%;
              height: auto;
              overflow-x: hidden;
            }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #333;
              padding: 0;
              margin: 0;
              max-width: 100%;
              word-break: break-word;
            }

            .container {
              max-width: 100%;
              width: 100%;
              padding: 0;
              margin: 0 auto;
            }

            h1 {
              color: #E25822;
              font-size: 20pt;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #E25822;
              page-break-after: avoid;
              page-break-inside: avoid;
            }

            h2 {
              color: #E25822;
              font-size: 14pt;
              margin-top: 25px;
              margin-bottom: 15px;
              page-break-after: avoid;
              page-break-inside: avoid;
              orphans: 3;
              widows: 3;
            }

            h3 {
              font-size: 12pt;
              margin-top: 18px;
              margin-bottom: 10px;
              color: #555;
              page-break-after: avoid;
              page-break-inside: avoid;
              orphans: 3;
              widows: 3;
            }

            p {
              margin-bottom: 10px;
              text-align: justify;
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: none;
              orphans: 3;
              widows: 3;
            }

            ul {
              padding-left: 20px;
              margin: 10px 0 15px 0;
              list-style-type: disc;
              page-break-inside: avoid;
            }

            li {
              margin-bottom: 6px;
              word-wrap: break-word;
              overflow-wrap: break-word;
              orphans: 2;
              widows: 2;
            }

            strong {
              color: #222;
              font-weight: 600;
            }

            em {
              color: #666;
              font-style: italic;
            }

            .header {
              text-align: center;
              margin-bottom: 30px;
              page-break-after: avoid;
              page-break-inside: avoid;
            }

            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 10pt;
              color: #888;
              page-break-inside: avoid;
            }

            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid;
              page-break-inside: avoid;
            }

            ul, ol {
              page-break-inside: avoid;
            }

            p, li {
              orphans: 3;
              widows: 3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PLANNER DE 30 DIAS - ELEMENTO ${elementInfo.name.toUpperCase()}</h1>
              <p>Método dos 5 Elementos por <strong>Jaya Roberta</strong></p>
            </div>
            ${planner
              .replace(/^# .+$/gm, '')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              .replace(/\*([^*]+)\*/g, '<em>$1</em>')
              .replace(/^- (.+)$/gm, '<li>$1</li>')
              .replace(/(<li>.*?<\/li>\n?)+/gs, '<ul>$&</ul>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^(?!<[hul])/gm, '<p>')
              .replace(/(?<![>])$/gm, '</p>')
              .replace(/<p><\/p>/g, '')
              .replace(/<p>(<[hul])/g, '$1')
              .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1')
            }
            <div class="footer">
              <p>Método dos 5 Elementos por Jaya Roberta</p>
              <p>Terapeuta Integrativa | Relacionamentos & Sexualidade</p>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDownloadMD = () => {
    const blob = new Blob([planner], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-30-dias-${element}.md`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero com ilustração do elemento */}
      <div className={`bg-gradient-to-br ${elementColors[element]} text-white py-16`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-8xl block mb-6">
              {elementInfo.icon}
            </span>
            <h1 className="font-display text-4xl font-bold mb-3">
              Seu Planner de 30 Dias
            </h1>
            <p className="text-xl opacity-90">
              Elemento {elementInfo.name} - {elementInfo.meaning}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Conteúdo do Planner */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="btn-secondary flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Resultados
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div
            className="prose prose-lg max-w-none"
            style={{
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{
              __html: planner
                .replace(/^# .+$/gm, '')
                .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-fogo-dark">$1</h2>')
                .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3 text-warmGray-800">$1</h3>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-warmGray-900">$1</strong>')
                .replace(/\*([^*]+)\*/g, '<em class="text-warmGray-600 italic">$1</em>')
                .replace(/^- (.+)$/gm, '<li class="mb-2 ml-6">$1</li>')
                .replace(/(<li>.*?<\/li>\n?)+/gs, '<ul class="list-disc space-y-2 my-4">$&</ul>')
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/^(?!<[hul])/gm, '<p class="mb-4">')
                .replace(/(?<![>])$/gm, '</p>')
                .replace(/<p class="mb-4"><\/p>/g, '')
                .replace(/<p class="mb-4">(<[hul])/g, '$1')
                .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1')
            }}
          />
        </motion.div>

        {/* Botões de Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <button
            onClick={handleDownloadPDF}
            className="btn-primary bg-fogo hover:bg-fogo-dark flex items-center gap-2 text-lg px-8 py-4"
          >
            <Download className="w-5 h-5" />
            Baixar PDF
          </button>
          <button
            onClick={handleDownloadMD}
            className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
          >
            <Download className="w-5 h-5" />
            Baixar Markdown
          </button>
        </motion.div>

        {/* Assinatura */}
        <div className="text-center pt-8 border-t border-warmGray-200">
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
