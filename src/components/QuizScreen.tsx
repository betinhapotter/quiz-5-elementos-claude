'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo, Element } from '@/types/quiz';
import { questions, type Question } from '@/data/questions';

// Helper function para garantir type safety
// Usa type narrowing explícito para garantir que TypeScript reconheça o tipo correto
function getElementInfo(element: Element) {
  // Type assertion explícita para garantir type safety
  // Garante que o elemento é uma chave válida de elementsInfo
  const validElements: Element[] = ['terra', 'agua', 'ar', 'fogo', 'eter'];
  if (validElements.includes(element)) {
    // Type assertion para garantir que TypeScript reconheça o tipo
    return elementsInfo[element as keyof typeof elementsInfo];
  }
  throw new Error(`Elemento inválido: ${element}`);
}

export default function QuizScreen() {
  const {
    currentQuestionIndex,
    answers,
    answerQuestion,
    goToPreviousQuestion,
    getProgress,
  } = useQuizStore();

  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const question: Question = questions[currentQuestionIndex];
  // Type assertion explícita para garantir que TypeScript reconheça o tipo correto
  // question.element é do tipo Element ('terra' | 'agua' | 'ar' | 'fogo' | 'eter')
  // Usa type narrowing explícito para evitar inferência incorreta
  const element = question.element as Element;
  // Verificação de tipo em runtime para garantir type safety
  if (!['terra', 'agua', 'ar', 'fogo', 'eter'].includes(element)) {
    throw new Error(`Elemento inválido: ${element}`);
  }
  const elementInfo = getElementInfo(element);
  const progress = getProgress();

  // Verifica se já tinha resposta para essa pergunta (caso volte)
  const existingAnswer = answers.find((a) => a.questionId === question.id);

  const handleSelectOption = (value: number) => {
    setSelectedValue(value);

    // Delay para mostrar seleção antes de avançar
    setTimeout(() => {
      answerQuestion({
        questionId: question.id,
        element: element,
        value,
      });
      setSelectedValue(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header com progresso */}
      <div className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-warmGray-100 z-10">
        <div className="container-quiz py-4">
          {/* Barra de progresso */}
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="p-2 -ml-2 rounded-lg text-warmGray-500 hover:text-warmGray-700 
                       hover:bg-warmGray-100 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <div className="progress-bar">
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <span className="text-sm font-medium text-warmGray-500 tabular-nums">
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Indicador de elemento */}
          <div className="flex items-center gap-2">
            <span className={`element-badge ${element}`}>
              {elementInfo.icon} {elementInfo.name}
            </span>
            <span className="text-xs text-warmGray-400">
              {elementInfo.question}
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo da pergunta */}
      <div className="flex-1 flex items-center">
        <div className="container-quiz py-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pergunta */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmGray-900 mb-8 leading-snug">
                {question.text}
              </h2>

              {/* Opções */}
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected =
                    selectedValue === option.value ||
                    existingAnswer?.value === option.value;

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleSelectOption(option.value)}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Indicador visual */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200
                            ${
                              isSelected
                                ? 'border-fogo bg-fogo'
                                : 'border-warmGray-300'
                            }`}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full rounded-full flex items-center justify-center"
                            >
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </motion.div>
                          )}
                        </div>

                        {/* Texto da opção */}
                        <span
                          className={`text-base sm:text-lg transition-colors duration-200
                            ${isSelected ? 'text-warmGray-900 font-medium' : 'text-warmGray-700'}`}
                        >
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer com dica */}
      <div className="border-t border-warmGray-100 bg-warmGray-50">
        <div className="container-quiz py-4">
          <p className="text-center text-sm text-warmGray-500">
            💡 Responda pensando em como as coisas estão <strong>hoje</strong>, não como você gostaria que fossem.
          </p>
        </div>
      </div>
    </div>
  );
}
