'use client';

import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useAuth } from '@/hooks/useAuth';
import { elementsInfo } from '@/types/quiz';

export default function LandingScreen() {
  const startQuiz = useQuizStore((state) => state.startQuiz);
  const { signOut } = useAuth();

  const elements = Object.values(elementsInfo);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100">
      {/* Botão de Logout */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-warmGray-600 hover:text-warmGray-900 hover:bg-warmGray-100 rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
      
      <div className="container-quiz py-12 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <span className="inline-block rounded-full bg-fogo/10 px-4 py-1.5 text-sm font-medium text-fogo-dark mb-6">
            Teste gratuito • 3 minutos
          </span>

          {/* Headline principal */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-warmGray-900 leading-tight mb-4">
            Por Que Vocês Falam
            <br />
            <span className="text-gradient">Mas Ninguém Se Ouve?</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-warmGray-600 max-w-xl mx-auto mb-8">
            Descubra em 3 minutos qual dos 5 Elementos está desalinhado
            no seu relacionamento — e por que vocês parecem falar línguas diferentes.
          </p>
        </motion.div>

        {/* Os 5 Elementos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-10"
        >
          {elements.map((element, index) => (
            <motion.div
              key={element.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className={`flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-warmGray-100
                ${index === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <span className="text-3xl mb-2">{element.icon}</span>
              <span className="font-semibold text-warmGray-800 text-sm">
                {element.name.toUpperCase()}
              </span>
              <span className="text-xs text-warmGray-500 text-center mt-1">
                {element.shortMeaning}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={startQuiz}
            className="btn-primary text-xl px-10 py-5 mb-4"
          >
            Descobrir Meu Elemento Desalinhado
          </button>

          <p className="text-sm text-warmGray-500">
            ✓ 25 perguntas rápidas &nbsp;•&nbsp; ✓ Resultado imediato &nbsp;•&nbsp; ✓ 100% gratuito
          </p>
        </motion.div>

        {/* Prova social / Autoridade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-warmGray-200"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-warmGray-200 flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <span className="text-sm text-warmGray-600">
                Por <strong>Jaya Roberta</strong> | 8 anos transformando casais
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-warmGray-200 flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              <span className="text-sm text-warmGray-600">
                <strong>+500 casais</strong> já fizeram esse diagnóstico
              </span>
            </div>
          </div>
        </motion.div>

        {/* Aviso de honestidade */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center text-warmGray-500 text-sm mt-8 max-w-md mx-auto"
        >
          ⚠️ Responda com honestidade. Este teste só funciona se você for real
          consigo mesmo(a) sobre como o relacionamento está hoje.
        </motion.p>
      </div>
    </div>
  );
}
