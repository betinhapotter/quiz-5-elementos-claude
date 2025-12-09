'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
  { text: 'Analisando suas respostas...', emoji: '🔍' },
  { text: 'Mapeando os 5 Elementos...', emoji: '🌍' },
  { text: 'Identificando padrões...', emoji: '🧩' },
  { text: 'Gerando seu diagnóstico...', emoji: '✨' },
];

export default function CalculatingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100 flex items-center justify-center">
      <div className="container-quiz text-center py-16">
        {/* Animação dos elementos girando */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {['🌍', '💧', '🌬️', '🔥', '✨'].map((emoji, index) => {
            const angle = (index * 360) / 5;
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * 50;
            const y = Math.sin(radians) * 50;

            return (
              <motion.span
                key={index}
                className="absolute text-3xl"
                style={{
                  left: `calc(50% + ${x}px - 15px)`,
                  top: `calc(50% + ${y}px - 15px)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {emoji}
              </motion.span>
            );
          })}

          {/* Centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loading-spinner" />
          </div>
        </motion.div>

        {/* Texto de progresso */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3"
            >
              <span className="text-xl">{step.emoji}</span>
              <span
                className={`text-lg ${
                  index <= currentStep
                    ? 'text-warmGray-800 font-medium'
                    : 'text-warmGray-400'
                }`}
              >
                {step.text}
              </span>
              {index < currentStep && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mensagem de contexto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 text-warmGray-500 text-sm max-w-md mx-auto"
        >
          O Método dos 5 Elementos analisa as dimensões fundamentais
          de todo relacionamento saudável...
        </motion.p>
      </div>
    </div>
  );
}
