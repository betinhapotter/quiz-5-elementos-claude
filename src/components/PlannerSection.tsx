'use client';

import { useState, useRef } from 'react';
import { Sparkles, Download, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { QuizResult, elementsInfo } from '@/types/quiz';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { API_ENDPOINTS, callAPI } from '@/lib/api';
import { classifyResult } from '@/lib/quiz-logic';

interface PlannerSectionProps {
  result: QuizResult;
  quizResultId: string | null;
  user?: User;
}

function sanitizeMarkdownHtml(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i'],
    ALLOWED_ATTR: ['style'],
    KEEP_CONTENT: true
  });
}

export default function PlannerSection({ result, quizResultId, user }: PlannerSectionProps) {
  const [isGeneratingPlanner, setIsGeneratingPlanner] = useState(false);
  const [planner, setPlanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const { isBalanced: isAllBalanced, isPerfectBalance, isMorna } = classifyResult(result);
  const elementInfo = elementsInfo[result.lowestElement as keyof typeof elementsInfo];

  const handleGeneratePlanner = async () => {
    setIsGeneratingPlanner(true);
    setError(null);

    try {
      const data = await callAPI(API_ENDPOINTS.generatePlanner, {
        lowestElement: result.lowestElement,
        scores: result.scores,
        secondLowestElement: result.secondLowestElement,
        pattern: result.pattern,
      });

      setPlanner(data.planner);

      if (user && quizResultId) {
        await supabase.from('planners').insert({
          user_id: user.id,
          quiz_result_id: quizResultId,
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

  const handleDownloadPDF = () => {
    if (!plannerRef.current || !planner) {
      alert('Planner não está disponível. Gere o planner primeiro.');
      return;
    }

    const fileName = isMorna
      ? 'planner-despertar'
      : isAllBalanced
        ? 'planner-manutencao-equilibrio'
        : `planner-30-dias-${result.lowestElement}`;

    const originalTitle = document.title;
    document.title = fileName;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  if (!planner) {
    return (
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
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-warmGray-200 overflow-hidden">
      <div
        className={`bg-gradient-to-r p-6 text-white ${
          isAllBalanced
            ? 'from-green-500 to-emerald-600'
            : 'from-fogo to-fogo-dark'
        }`}
      >
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

              if (trimmed.startsWith('# ')) {
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
                            __html: sanitizeMarkdownHtml(item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>'))
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
                            __html: sanitizeMarkdownHtml(item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>'))
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
                            __html: sanitizeMarkdownHtml(item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>'))
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

              if (trimmed.startsWith('- ')) {
                currentList.push(trimmed.substring(2));
                return;
              }

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
                            __html: sanitizeMarkdownHtml(item.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>').replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>'))
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
                    __html: sanitizeMarkdownHtml(trimmed
                      .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>')
                      .replace(/\*([^*]+)\*/g, '<em style="color: #6b7280;">$1</em>'))
                  }}
                />
              );
            });

            if (currentList.length > 0) {
              elements.push(
                <ul key={`list-${listKey++}`} style={{ margin: '1rem 0', paddingLeft: '2rem', listStyleType: 'disc' }}>
                  {currentList.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem', fontSize: '16px', lineHeight: '1.6' }}>
                      <span dangerouslySetInnerHTML={{
                        __html: sanitizeMarkdownHtml(item.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>'))
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
  );
}
