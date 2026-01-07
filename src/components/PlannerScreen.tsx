'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Sparkles, ArrowLeft } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo, Element } from '@/types/quiz';

interface PlannerScreenProps {
  onBack: () => void;
}

export default function PlannerScreen({ onBack }: PlannerScreenProps) {
  const { result } = useQuizStore();
  const [planner, setPlanner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!result) return null;

  const elementInfo = elementsInfo[result.lowestElement as keyof typeof elementsInfo];

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
        throw new Error(data.error || 'Erro ao gerar planner');
      }

      setPlanner(data.planner);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
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
                Planner de 30 Dias
              </h1>
              <p className="opacity-90">
                Elemento {elementInfo.name} • Gerado por IA
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
                onClick={() => {
                  const blob = new Blob([planner], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `planner-${result.lowestElement}-30-dias.md`;
                  a.click();
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar Planner
              </button>
            </div>

            {/* Conteúdo do Planner */}
            <div className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-6 sm:p-8">
              <article className="prose prose-warmGray max-w-none">
                {/* Renderiza o markdown de forma simples */}
                {planner.split('\n').map((line, index) => {
                  // Títulos
                  if (line.startsWith('# ')) {
                    return (
                      <h1 key={index} className="font-display text-2xl font-bold text-warmGray-900 mt-8 mb-4 first:mt-0">
                        {line.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={index} className="font-display text-xl font-bold text-warmGray-800 mt-6 mb-3 border-b border-warmGray-200 pb-2">
                        {line.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={index} className="font-semibold text-warmGray-700 mt-4 mb-2">
                        {line.replace('### ', '')}
                      </h3>
                    );
                  }
                  // Negrito
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={index} className="font-semibold text-warmGray-900 mt-3">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  // Itálico
                  if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                    return (
                      <p key={index} className="italic text-warmGray-600 text-sm">
                        {line.replace(/\*/g, '')}
                      </p>
                    );
                  }
                  // Lista
                  if (line.startsWith('- ')) {
                    return (
                      <li key={index} className="text-warmGray-700 ml-4">
                        {line.replace('- ', '')}
                      </li>
                    );
                  }
                  // Parágrafo normal
                  if (line.trim()) {
                    return (
                      <p key={index} className="text-warmGray-700">
                        {line}
                      </p>
                    );
                  }
                  // Linha vazia
                  return <div key={index} className="h-2" />;
                })}
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
