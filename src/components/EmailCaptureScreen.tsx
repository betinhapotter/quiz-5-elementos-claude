'use client';

import { useState } from 'react';
import { QuizResult, elementsInfo } from '@/types/quiz';

interface EmailCaptureScreenProps {
  result: QuizResult;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export default function EmailCaptureScreen({
  result,
  onSubmit,
  isLoading = false,
}: EmailCaptureScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    onSubmit(email);
  };

  // Detecta se está em crise (todos elementos <= 3)
  const isInCrisis = result.isInCrisis;

  // Detecta se está equilibrado (todos elementos >= 6)
  const isBalanced = result.isBalanced;

  const elementInfo = elementsInfo[result.lowestElement];

  // Renderiza versão CRISE
  if (isInCrisis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Card Principal */}
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-red-900/50">
            {/* Ícone de Alerta */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/50 mb-4">
                <span className="text-5xl">🆘</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Relacionamento em Crise
              </h1>
              <p className="text-red-300">
                Todos os 5 elementos estão em colapso
              </p>
            </div>

            {/* Explicação */}
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                Quando todos os pilares estão abalados ao mesmo tempo, 
                você precisa de <strong className="text-white">suporte real</strong>, 
                não de um PDF bonito.
              </p>
            </div>

            {/* O que você vai descobrir */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">
                Na próxima tela você vai ver:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-red-400">→</span>
                  O que significa esse colapso
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-red-400">→</span>
                  Primeiros passos de emergência
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-red-400">→</span>
                  Como acessar suporte profissional
                </li>
              </ul>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Seu melhor email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processando...
                  </span>
                ) : (
                  'Ver Meu Resultado 🆘'
                )}
              </button>
            </form>

            {/* Nota de privacidade */}
            <p className="text-center text-gray-500 text-xs mt-4">
              🔒 Seus dados estão seguros e não serão compartilhados
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza versão EQUILIBRADA
  if (isBalanced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Card Principal */}
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-green-900/50">
            {/* Ícone de Celebração */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/50 mb-4">
                <span className="text-5xl">🎉</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Parabéns! Relacionamento Equilibrado!
              </h1>
              <p className="text-green-300">
                Todos os 5 elementos estão alinhados
              </p>
            </div>

            {/* O que você vai descobrir */}
            <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 mb-6">
              <h3 className="text-white font-medium mb-3">
                No seu resultado você vai ver:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  O que significa ter todos elementos alinhados
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Como vocês chegaram nesse equilíbrio
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Dicas para manter e aprofundar
                </li>
              </ul>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Seu melhor email para receber o resultado
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processando...
                  </span>
                ) : (
                  'Ver Meu Resultado Completo 🎉'
                )}
              </button>
            </form>

            {/* Nota de privacidade */}
            <p className="text-center text-gray-500 text-xs mt-4">
              🔒 Seus dados estão seguros e não serão compartilhados
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza versão NORMAL (elemento desalinhado)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card Principal */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-gray-700">
          {/* Resultado Preview */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-700/50 mb-4">
              <span className="text-5xl">{elementInfo.icon}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Seu elemento desalinhado é:
            </h1>
            <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {elementInfo.name.toUpperCase()}
            </p>
          </div>

          {/* Teaser do conteúdo */}
          <div className="bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-600/50">
            <p className="text-gray-300 text-sm leading-relaxed">
              {elementInfo.meaning.substring(0, 100)}...
            </p>
          </div>

          {/* O que você vai receber */}
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">
              No resultado completo você vai descobrir:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-amber-500">✓</span>
                Por que vocês não estão se ouvindo
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-amber-500">✓</span>
                Os 3 primeiros passos para reconectar
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-amber-500">✓</span>
                Planner personalizado de 30 dias (com IA)
              </li>
            </ul>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Seu melhor email para receber o resultado
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processando...
                </span>
              ) : (
                'Ver Meu Resultado Completo →'
              )}
            </button>
          </form>

          {/* Nota de privacidade */}
          <p className="text-center text-gray-500 text-xs mt-4">
            🔒 Seus dados estão seguros e não serão compartilhados
          </p>
        </div>
      </div>
    </div>
  );
}
