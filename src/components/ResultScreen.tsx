'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { elementsInfo, Element } from '@/types/quiz';
import { generateResultExplanation, getResultSeverity } from '@/lib/quiz-logic';
import PlannerScreen from './PlannerScreen';

export default function ResultScreen() {
  const { result, resetQuiz, userData, answers } = useQuizStore();

  const [isGeneratingPlanner, setIsGeneratingPlanner] = useState(false);
  const [planner, setPlanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPlannerScreen, setShowPlannerScreen] = useState(false);

  const handleGeneratePlanner = async () => {
    if (!result) return;

    setIsGeneratingPlanner(true);
    setError(null);

    try {
      // Chama Gemini diretamente do cliente
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

      const elementInfo = elementsInfo[result.lowestElement];
      const secondElementInfo = result.secondLowestElement
        ? elementsInfo[result.secondLowestElement]
        : null;

      const prompt = `
Você é Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana,
com 8 anos de experiência transformando casais. Você desenvolveu o Método dos 5 Elementos.

O usuário completou o Quiz dos 5 Elementos e estes são os resultados:

SCORES (de 2 a 8 cada):
- Terra: ${result.scores.terra}/8 (${result.scores.terra <= 4 ? 'BAIXO' : result.scores.terra <= 6 ? 'MÉDIO' : 'BOM'})
- Água: ${result.scores.agua}/8 (${result.scores.agua <= 4 ? 'BAIXO' : result.scores.agua <= 6 ? 'MÉDIO' : 'BOM'})
- Ar: ${result.scores.ar}/8 (${result.scores.ar <= 4 ? 'BAIXO' : result.scores.ar <= 6 ? 'MÉDIO' : 'BOM'})
- Fogo: ${result.scores.fogo}/8 (${result.scores.fogo <= 4 ? 'BAIXO' : result.scores.fogo <= 6 ? 'MÉDIO' : 'BOM'})
- Éter: ${result.scores.eter}/8 (${result.scores.eter <= 4 ? 'BAIXO' : result.scores.eter <= 6 ? 'MÉDIO' : 'BOM'})

ELEMENTO MAIS DESALINHADO: ${elementInfo.name.toUpperCase()} (${elementInfo.icon})
- Score: ${result.scores[result.lowestElement]}/8
- Significa: ${elementInfo.meaning}

${secondElementInfo ? `
SEGUNDO ELEMENTO EM RISCO: ${secondElementInfo.name.toUpperCase()} (${secondElementInfo.icon})
` : ''}

${result.pattern ? `PADRÃO IDENTIFICADO: ${result.pattern}` : ''}

CRIE UM PLANNER DE 30 DIAS para este casal, seguindo estas regras:

1. FOCO PRINCIPAL no elemento ${elementInfo.name} (o mais desalinhado)
2. Cada dia deve ter 1 EXERCÍCIO PRÁTICO de 5-15 minutos
3. Progressão:
   - Semana 1: Exercícios INDIVIDUAIS (sem pressionar o parceiro)
   - Semana 2: Exercícios LEVES a dois
   - Semana 3: Exercícios de CONEXÃO mais profundos
   - Semana 4: RITUAIS de consolidação
4. Tom: DIRETO, prático, sem jargão new age
5. Cada exercício deve ter:
   - Nome criativo
   - Duração (5-15 min)
   - Por que funciona (1 frase)
   - Passo a passo claro

FORMATO DE RESPOSTA (use EXATAMENTE esta estrutura):

# PLANNER DE 30 DIAS - ELEMENTO ${elementInfo.name.toUpperCase()}

## Semana 1: Reconexão Individual
### Dia 1
**[Nome do Exercício]** (X minutos)
*Por que funciona:* [explicação curta]
- Passo 1
- Passo 2
- Passo 3

[Continue para os dias 2-7]

## Semana 2: Primeiros Passos a Dois
[Dias 8-14]

## Semana 3: Aprofundando a Conexão
[Dias 15-21]

## Semana 4: Consolidando Rituais
[Dias 22-30]

## Mensagem Final
[Uma mensagem de encorajamento de 2-3 frases]
`;

      const genResult = await model.generateContent(prompt);
      const response = await genResult.response;
      const plannerContent = response.text();

      setPlanner(plannerContent);
      setShowPlannerScreen(true);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro desconhecido';
      setError(`Erro ao gerar seu planner: ${errorMessage}`);
      console.error('Erro completo:', err);
    } finally {
      setIsGeneratingPlanner(false);
    }
  };

  if (!result) return null;

  // Se o planner foi gerado, mostra a página dedicada do planner
  if (showPlannerScreen && planner) {
    return (
      <PlannerScreen
        planner={planner}
        element={result.lowestElement}
        onBack={() => setShowPlannerScreen(false)}
      />
    );
  }

  const elementInfo = elementsInfo[result.lowestElement];
  const explanation = generateResultExplanation(result);
  const severity = getResultSeverity(result);

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
      {/* Hero do resultado */}
      <div
        className={`bg-gradient-to-br ${elementColors[result.lowestElement]} text-white py-12 sm:py-16`}
      >
        <div className="container-quiz text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl sm:text-8xl block mb-4">
              {elementInfo.icon}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              {explanation.title}
            </h1>

            <p className="text-xl opacity-90">{explanation.subtitle}</p>

            {/* Severidade */}
            {severity === 'critica' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 inline-block bg-white/20 rounded-full px-4 py-2 text-sm"
              >
                ⚠️ Nível crítico identificado — atenção necessária
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container-quiz py-10">
        {/* O que significa */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            O Que Isso Significa
          </h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-warmGray-100">
            <p className="text-warmGray-700 leading-relaxed">
              {explanation.explanation}
            </p>
          </div>
        </motion.section>

        {/* Por que não se sentem ouvidos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            Por Que Vocês Falam Mas Não Se Sentem Ouvidos
          </h2>
          <div className="bg-warmGray-50 rounded-xl p-6 border-l-4 border-fogo">
            <p className="text-warmGray-700 leading-relaxed">
              {explanation.whyNotHeard}
            </p>
          </div>
        </motion.section>

        {/* Padrão identificado (se houver) */}
        {result.pattern && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
              ⚡ Padrão Identificado
            </h2>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <p className="text-warmGray-700 leading-relaxed">
                <strong>Atenção:</strong> {result.pattern}
              </p>
              {result.secondLowestElement && (
                <p className="mt-2 text-sm text-warmGray-500">
                  Elemento secundário em risco:{' '}
                  <span className={`element-badge ${result.secondLowestElement}`}>
                    {elementsInfo[result.secondLowestElement].icon}{' '}
                    {elementsInfo[result.secondLowestElement].name}
                  </span>
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* Primeiros passos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            Primeiros Passos Para Realinhar
          </h2>
          <div className="space-y-3">
            {explanation.firstSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-warmGray-100"
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-${elementInfo.color}/10
                             text-${elementInfo.color}-dark font-bold flex items-center justify-center`}
                >
                  {index + 1}
                </span>
                <p className="text-warmGray-700 pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scores de todos os elementos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            Seu Mapa dos 5 Elementos
          </h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-warmGray-100">
            <div className="space-y-4">
              {(Object.keys(result.scores) as Element[]).map((element) => {
                const score = result.scores[element];
                const maxScore = 8;
                const percentage = (score / maxScore) * 100;
                const info = elementsInfo[element];
                const isLowest = element === result.lowestElement;

                return (
                  <div key={element}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-sm font-medium text-warmGray-700">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                        {isLowest && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            Desalinhado
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-warmGray-500 tabular-nums">
                        {score}/{maxScore}
                      </span>
                    </div>
                    <div className="h-3 bg-warmGray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className={`h-full rounded-full ${
                          isLowest
                            ? 'bg-red-400'
                            : percentage >= 75
                              ? 'bg-green-400'
                              : percentage >= 50
                                ? 'bg-yellow-400'
                                : 'bg-orange-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CTA Principal - Gerar Planner com IA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-br from-warmGray-900 to-warmGray-800 rounded-2xl p-8 text-white text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              🤖 Seu Planner de 30 Dias Personalizado
            </h2>
            <p className="text-warmGray-300 mb-6 max-w-lg mx-auto">
              Nossa IA vai criar um plano de <strong>30 dias</strong> com exercícios práticos
              específicos para realinhar o elemento <strong>{elementInfo.name}</strong> no seu relacionamento.
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
        </motion.section>

        {/* Footer / Ações secundárias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-warmGray-200"
        >
          <button
            onClick={resetQuiz}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refazer Quiz
          </button>

          <a
            href="https://www.instagram.com/jaya.terapia/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Seguir @jaya.terapia
          </a>
        </motion.div>

        {/* Assinatura */}
        <div className="text-center mt-10 pt-6 border-t border-warmGray-200">
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
