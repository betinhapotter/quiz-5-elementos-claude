'use client';

import { motion } from 'framer-motion';
import { MessageCircle, AlertTriangle, Phone, Heart } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { THRESHOLDS } from '@/lib/quiz-logic';

export default function CriticalSituationScreen() {
  const { result } = useQuizStore();

  if (!result) return null;

  // Verifica se é situação crítica
  const allScores = Object.values(result.scores);
  const isAllInCrisis = allScores.every(score => score <= THRESHOLDS.CRISIS);
  const isAllLow = allScores.every(score => score <= THRESHOLDS.LOW);
  const isCriticalSituation = isAllInCrisis || isAllLow || result.pattern?.includes('alerta_vermelho');

  if (!isCriticalSituation) return null;

  const whatsappNumber = '+55619962634557'; // Substitua pelo número real
  const whatsappMessage = encodeURIComponent('Olá Jaya, acabei de fazer o Quiz dos 5 Elementos e identifiquei uma situação crítica. Preciso de ajuda urgente.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-warmGray-900">
      {/* Header SOS */}
      <div className="bg-red-900 text-white py-12 sm:py-16">
        <div className="container-quiz text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-pink-500 rounded-lg px-4 py-2 mb-6">
              <span className="text-white font-bold text-lg">SOS</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Identificamos uma situação que precisa de atenção especial
            </h1>
            
            <p className="text-lg sm:text-xl text-red-100 max-w-2xl mx-auto">
              Seu relacionamento está passando por um momento crítico em múltiplas dimensões. 
              Isso não é o fim — mas precisa de cuidado profissional.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container-quiz py-10">
        {/* O que isso significa */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-white mb-4">
            O que isso significa
          </h2>
          
          <div className="bg-warmGray-800 rounded-xl p-6 sm:p-8 text-warmGray-100 space-y-4">
            <p className="leading-relaxed">
              Quando todos os elementos estão em níveis baixos simultaneamente, geralmente indica uma 
              <strong className="text-white"> crise sistêmica no relacionamento</strong>. Isso pode ser resultado de:
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Um evento específico que abalou a base do relacionamento</li>
              <li>Acúmulo de tensões não resolvidas ao longo do tempo</li>
              <li>Uma incompatibilidade fundamental que precisa ser endereçada</li>
            </ul>
            
            <div className="mt-6 p-4 bg-warmGray-700 rounded-lg border-l-4 border-yellow-400">
              <p className="text-white font-semibold mb-2">
                ⚠️ Um quiz não substitui o olhar profissional
              </p>
              <p className="text-warmGray-200">
                Recomendo fortemente uma <strong>sessão de emergência</strong> para:
              </p>
            </div>

            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Compreender o que detonou a crise atual</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Criar um plano de estabilização imediato de 7 dias</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Definir os próximos passos individuais e em casal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Identificar se há situações de violência/abuso (com encaminhamento apropriado)</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* CTA WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-10"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            Falar com Jaya no WhatsApp
          </a>
          
          <p className="text-warmGray-400 text-sm mt-4">
            Respondo em até 24h úteis. Sessões online ou presenciais em Brasília.
          </p>
        </motion.div>

        {/* Contatos de Emergência */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-warmGray-800 rounded-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h2 className="font-display text-xl font-bold text-white">
              EM CASO DE EMERGÊNCIA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="tel:188"
              className="bg-warmGray-700 hover:bg-warmGray-600 rounded-lg p-4 transition-colors"
            >
              <div className="text-red-400 font-bold text-lg mb-1">188</div>
              <div className="text-warmGray-200 text-sm">CVV - Apoio emocional 24h</div>
            </a>

            <a
              href="tel:180"
              className="bg-warmGray-700 hover:bg-warmGray-600 rounded-lg p-4 transition-colors"
            >
              <div className="text-red-400 font-bold text-lg mb-1">180</div>
              <div className="text-warmGray-200 text-sm">Violência contra mulher</div>
            </a>

            <a
              href="tel:190"
              className="bg-warmGray-700 hover:bg-warmGray-600 rounded-lg p-4 transition-colors"
            >
              <div className="text-red-400 font-bold text-lg mb-1">190</div>
              <div className="text-warmGray-200 text-sm">Emergência policial</div>
            </a>

            <div className="bg-warmGray-700 rounded-lg p-4">
              <div className="text-red-400 font-bold text-lg mb-1">CAPS</div>
              <div className="text-warmGray-200 text-sm">Centro de Atenção Psicossocial</div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

