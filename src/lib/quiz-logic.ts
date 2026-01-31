// src/lib/quiz-logic.ts
// Lógica de cálculo refinada para 25 perguntas (5 por elemento)

import { ElementEn, Scores, QuizResult } from '../types/elements';
import { THRESHOLDS, TOTAL_THRESHOLDS, elementMapPtToEn } from './quiz-constants';
import {
  resultTexts,
  patternTexts,
  whyNotHeardLines,
  firstStepsMap
} from '../data/quiz-content';

// ============ FUNÇÕES PRINCIPAIS ============

/**
 * Calcula os scores por elemento a partir das respostas
 */
export function calculateScores(answers: Record<string, number>): Scores {
  const scores: Scores = {
    earth: 0,
    water: 0,
    fire: 0,
    air: 0,
    ether: 0
  };

  // Soma os scores de cada pergunta ao elemento correspondente
  Object.entries(answers).forEach(([questionId, value]) => {
    // Extrai o elemento do ID da pergunta (ex: 'terra1' -> 'terra')
    const elementKey = questionId.replace(/[0-9]/g, '');
    if (elementKey in elementMapPtToEn) {
      const elementEn = elementMapPtToEn[elementKey];
      scores[elementEn] += value;
    }
  });

  return scores;
}

/**
 * Analisa os scores e retorna o resultado completo
 */
export function analyzeResults(scores: Scores): QuizResult {
  const elements: ElementEn[] = ['earth', 'water', 'fire', 'air', 'ether'];

  let lowestElement: ElementEn = 'earth';
  let lowestScore = scores.earth;
  let highestElement: ElementEn = 'earth';
  let highestScore = scores.earth;

  elements.forEach(element => {
    if (scores[element] < lowestScore) {
      lowestScore = scores[element];
      lowestElement = element;
    }
    if (scores[element] > highestScore) {
      highestScore = scores[element];
      highestElement = element;
    }
  });

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / 5;

  // Determina direção (falta ou excesso)
  const direction: 'low' | 'high' = lowestScore <= THRESHOLDS.LOW ? 'low' : 'high';

  // Determina status geral
  let status: 'crisis' | 'attention' | 'balanced' | 'strong';
  if (totalScore <= TOTAL_THRESHOLDS.CRISIS || lowestScore <= THRESHOLDS.CRISIS) {
    status = 'crisis';
  } else if (totalScore <= TOTAL_THRESHOLDS.ATTENTION || lowestScore <= THRESHOLDS.LOW) {
    status = 'attention';
  } else if (totalScore >= TOTAL_THRESHOLDS.STRONG && lowestScore >= THRESHOLDS.BALANCED_HIGH) {
    status = 'strong';
  } else {
    status = 'balanced';
  }

  const patterns = detectPatterns(scores);

  return {
    scores,
    lowestElement,
    lowestScore,
    highestElement,
    highestScore,
    totalScore,
    averageScore,
    status,
    direction,
    patterns
  };
}

/**
 * Detecta padrões perigosos de combinações de elementos baixos
 */
export function detectPatterns(scores: Scores): string[] {
  const patterns: string[] = [];

  if (scores.earth <= THRESHOLDS.LOW && scores.water <= THRESHOLDS.LOW) patterns.push('fundacao_rachada');
  if (scores.fire <= THRESHOLDS.LOW && scores.air <= THRESHOLDS.LOW) patterns.push('comunicacao_morta');
  if (scores.ether <= THRESHOLDS.LOW) patterns.push('crise_sentido');
  if (scores.earth <= THRESHOLDS.LOW && scores.ether <= THRESHOLDS.LOW) patterns.push('relacao_fantasma');
  if (scores.water <= THRESHOLDS.LOW && scores.fire <= THRESHOLDS.LOW) patterns.push('deserto_emocional');

  const criticalElements = Object.values(scores).filter(s => s <= THRESHOLDS.CRISIS);
  const lowElements = Object.values(scores).filter(s => s <= THRESHOLDS.LOW);

  if (criticalElements.length >= 3 || lowElements.length === 5) {
    patterns.push('alerta_vermelho');
  }

  const allScores = Object.values(scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;

  if (minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3) {
    patterns.push('equilibrio_geral');
  }

  if (minScore === 25 && maxScore === 25) {
    patterns.push('equilibrio_perfeito');
  }

  const isAllMedium = minScore >= THRESHOLDS.BALANCED_LOW && maxScore <= 17 && scoreDifference <= 3;
  if (isAllMedium) patterns.push('relacao_morna');

  return patterns;
}

/**
 * Retorna a porcentagem do score (para barras de progresso)
 */
export function getScorePercentage(score: number): number {
  const min = 5;
  const max = 25;
  const percentage = ((score - min) / (max - min)) * 100;
  return Math.round(Math.max(0, Math.min(100, percentage)));
}

/**
 * Retorna o nível descritivo do score
 */
export function getScoreLevel(score: number): 'critical' | 'low' | 'medium' | 'good' | 'excellent' {
  if (score <= THRESHOLDS.CRISIS) return 'critical';
  if (score <= THRESHOLDS.LOW) return 'low';
  if (score <= THRESHOLDS.BALANCED_HIGH) return 'medium';
  if (score <= THRESHOLDS.HIGH) return 'good';
  return 'excellent';
}

/**
 * Verifica se precisa mostrar tela de crise
 */
export function shouldShowCrisisScreen(result: QuizResult): boolean {
  return result.status === 'crisis' ||
    result.patterns.includes('alerta_vermelho') ||
    result.lowestScore <= THRESHOLDS.CRISIS;
}

/**
 * Verifica se está equilibrado o suficiente para celebrar
 */
export function shouldShowBalancedScreen(result: QuizResult): boolean {
  return result.status === 'strong' ||
    result.patterns.includes('equilibrio_geral');
}

// ============ FUNÇÕES DE CONVERSÃO E COMPATIBILIDADE ============

const elementMapEnToPt: Record<ElementEn, 'terra' | 'agua' | 'ar' | 'fogo' | 'eter'> = {
  earth: 'terra',
  water: 'agua',
  fire: 'fogo',
  air: 'ar',
  ether: 'eter'
};

/**
 * Converte Answer[] para QuizResult do tipo @/types/quiz (português)
 */
export function calculateResult(answers: Array<{ questionId: string; element: string; value: number }>): {
  scores: { terra: number; agua: number; ar: number; fogo: number; eter: number };
  lowestElement: 'terra' | 'agua' | 'ar' | 'fogo' | 'eter';
  lowestScore: number;
  secondLowestElement?: 'terra' | 'agua' | 'ar' | 'fogo' | 'eter';
  pattern?: string;
  disasterType: 'terremoto' | 'tsunami' | 'tornado' | 'incendio' | 'vazio';
} {
  const answersRecord: Record<string, number> = {};
  answers.forEach(answer => {
    answersRecord[answer.questionId] = answer.value;
  });

  const scoresEn = calculateScores(answersRecord);
  const resultEn = analyzeResults(scoresEn);

  const scoresPt = {
    terra: scoresEn.earth,
    agua: scoresEn.water,
    ar: scoresEn.air,
    fogo: scoresEn.fire,
    eter: scoresEn.ether
  };

  const allScores = Object.values(scoresPt);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  const isAllBalanced = minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3;
  const isPerfectBalance = minScore === 25 && maxScore === 25;

  if (isPerfectBalance && !resultEn.patterns.includes('equilibrio_perfeito')) {
    resultEn.patterns.push('equilibrio_perfeito');
  } else if (isAllBalanced && !resultEn.patterns.includes('equilibrio_geral') && !resultEn.patterns.includes('equilibrio_perfeito')) {
    resultEn.patterns.push('equilibrio_geral');
  }

  const elementsPt: Array<'terra' | 'agua' | 'ar' | 'fogo' | 'eter'> = ['terra', 'agua', 'ar', 'fogo', 'eter'];
  const sortedElements = elementsPt
    .map(el => ({ element: el, score: scoresPt[el] }))
    .sort((a, b) => a.score - b.score);

  const lowestElementPt = elementMapEnToPt[resultEn.lowestElement];
  const secondLowestElementPt = sortedElements[1]?.element;
  const isAllMedium = minScore >= THRESHOLDS.BALANCED_LOW && maxScore <= 17 && scoreDifference <= 3;

  let patternText: string | undefined;

  if (resultEn.patterns.includes('alerta_vermelho')) {
    patternText = patternTexts['alerta_vermelho']?.description;
  } else if (isPerfectBalance) {
    patternText = patternTexts['equilibrio_perfeito']?.description;
  } else if (isAllBalanced) {
    patternText = patternTexts['equilibrio_geral']?.description;
  } else if (isAllMedium || resultEn.patterns.includes('relacao_morna')) {
    patternText = patternTexts['relacao_morna']?.description;
  } else if (resultEn.patterns.length > 0) {
    const firstPatternKey = resultEn.patterns[0];
    if (patternTexts[firstPatternKey]) {
      patternText = patternTexts[firstPatternKey]?.description;
    } else {
      const firstPattern = resultTexts[resultEn.lowestElement][resultEn.direction];
      patternText = firstPattern.meaning;
    }
  }

  const disasterMap: Record<ElementEn, 'terremoto' | 'tsunami' | 'tornado' | 'incendio' | 'vazio'> = {
    earth: 'terremoto',
    water: 'tsunami',
    fire: 'incendio',
    air: 'tornado',
    ether: 'vazio'
  };

  return {
    scores: scoresPt,
    lowestElement: lowestElementPt,
    lowestScore: resultEn.lowestScore,
    secondLowestElement: secondLowestElementPt,
    pattern: patternText,
    disasterType: disasterMap[resultEn.lowestElement]
  };
}

/**
 * Gera explicação do resultado para exibição no ResultScreen
 */
export function generateResultExplanation(result: {
  lowestElement: 'terra' | 'agua' | 'ar' | 'fogo' | 'eter';
  lowestScore: number;
  scores: { terra: number; agua: number; ar: number; fogo: number; eter: number };
  direction?: 'low' | 'high';
  pattern?: string;
}): {
  title: string;
  subtitle: string;
  explanation: string;
  whyNotHeard: string;
  firstSteps: string[];
} {
  const allScores = Object.values(result.scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  const isAllBalanced = minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3;
  const isPerfectBalance = minScore === 25 && maxScore === 25;

  const isAllInCrisis = allScores.every(score => score <= THRESHOLDS.CRISIS);
  const isAllLow = allScores.every(score => score <= THRESHOLDS.LOW);
  const isCriticalSituation = isAllInCrisis || isAllLow || result.pattern?.includes('alerta_vermelho');

  const isAllMedium = minScore >= THRESHOLDS.BALANCED_LOW && maxScore <= 17 && scoreDifference <= 3;
  const isMorna = isAllMedium || result.pattern?.includes('relacao_morna');

  if (isCriticalSituation) {
    return {
      title: '🚨 Alerta Vermelho: Situação Crítica',
      subtitle: 'Múltiplos elementos estão em crise. Este relacionamento precisa de atenção profissional urgente.',
      explanation: 'Três ou mais elementos estão em crise, ou todos os elementos estão desalinhados. Isso indica uma situação crítica que requer atenção profissional...',
      whyNotHeard: 'Quando múltiplos elementos estão em crise, a comunicação fica completamente bloqueada...',
      firstSteps: [
        'Busque ajuda profissional: terapia de casal é essencial nesta situação',
        'Reconheça a gravidade: não tente resolver sozinho',
        'Crie espaço seguro: estabeleçam um acordo de não-agressão',
        'Foquem em estabilização'
      ]
    };
  }

  if (isMorna) {
    return {
      title: '🔥 A Brasa Adormecida',
      subtitle: 'Seu relacionamento não morreu — está esperando ser despertado.',
      explanation: 'Este é o relacionamento no piloto automático — não está em crise, mas também não está vivo...',
      whyNotHeard: 'Quando tudo está "morno", a comunicação também fica morna...',
      firstSteps: [
        'Reconheçam o piloto automático',
        'Usem o Planner Despertar: 30 dias trabalhando os 5 elementos',
        'Criem momentos de presença',
        'Reacendam a brasa: pequenos gestos intencionais'
      ]
    };
  }

  if (isPerfectBalance || (isAllBalanced && result.pattern?.includes('equilibrio'))) {
    return {
      title: isPerfectBalance ? '🌟 Equilíbrio Perfeito' : '✨ Equilíbrio Harmonioso',
      subtitle: 'Todos os 5 Elementos estão alinhados no seu relacionamento!',
      explanation: isPerfectBalance
        ? 'Parabéns! Todos os 5 Elementos estão perfeitamente alinhados no seu relacionamento...'
        : 'Todos os elementos estão em equilíbrio! Seu relacionamento tem uma base saudável...',
      whyNotHeard: 'Quando todos os elementos estão equilibrados, vocês têm uma comunicação fluida...',
      firstSteps: [
        'Mantenham os rituais que já funcionam bem',
        'Continuem praticando escuta ativa e presença',
        'Celebrem regularmente o que está funcionando',
        'Usem o planner de manutenção'
      ]
    };
  }

  const elementEn = elementMapPtToEn[result.lowestElement];
  const direction = result.direction || (result.lowestScore <= THRESHOLDS.LOW ? 'low' : 'high');
  const resultData = resultTexts[elementEn][direction];
  const patternInfo = result.pattern ? patternTexts[result.pattern] : null;

  const subtitle = direction === 'low'
    ? `O elemento ${result.lowestElement} está em falta no seu relacionamento`
    : `O elemento ${result.lowestElement} está em excesso no seu relacionamento`;

  const stepsKey = `${elementEn}-${direction}`;
  const firstSteps = firstStepsMap[stepsKey] || [
    'Identifiquem o que está funcionando',
    'Criem espaço para conversas honestas',
    'Pratiquem escuta ativa',
    'Busquem apoio profissional'
  ];

  return {
    title: resultData.title,
    subtitle,
    explanation: patternInfo ? `${patternInfo.description}\n\n${resultData.meaning}` : resultData.meaning,
    whyNotHeard: whyNotHeardLines[result.lowestElement],
    firstSteps
  };
}

/**
 * Determina a severidade do resultado
 */
export function getResultSeverity(result: {
  lowestScore: number;
  scores: { terra: number; agua: number; ar: number; fogo: number; eter: number };
}): 'critica' | 'atencao' | 'normal' {
  if (result.lowestScore <= THRESHOLDS.CRISIS) return 'critica';
  if (result.lowestScore <= THRESHOLDS.LOW) return 'atencao';
  return 'normal';
}

/**
 * Classifica o resultado em uma categoria (critical, balanced, morna, normal)
 * Centraliza toda lógica de classificação que estava duplicada em 4 arquivos
 */
export function classifyResult(result: {
  scores: { terra: number; agua: number; ar: number; fogo: number; eter: number };
  pattern?: string;
}): {
  isCritical: boolean;
  isBalanced: boolean;
  isPerfectBalance: boolean;
  isMorna: boolean;
  classification: 'critical' | 'balanced' | 'morna' | 'normal';
} {
  const allScores = Object.values(result.scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;

  // Crítico: todos em crise ou padrão de alerta vermelho
  const isAllInCrisis = allScores.every(score => score <= THRESHOLDS.CRISIS);
  const isAllLow = allScores.every(score => score <= THRESHOLDS.LOW);
  const isCritical = isAllInCrisis || isAllLow || result.pattern?.includes('alerta_vermelho');

  // Equilibrado: scores altos e próximos entre si
  const isAllBalanced = (minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3) ||
    result.pattern?.includes('equilibrio_geral') ||
    result.pattern?.includes('equilibrio_perfeito');

  // Perfeito: todos máximo ou padrão de equilíbrio perfeito
  const isPerfectBalance = (minScore === 25 && maxScore === 25) ||
    result.pattern?.includes('equilibrio_perfeito');

  // Morna: todos na faixa média (13-17)
  const isAllMedium = minScore >= THRESHOLDS.BALANCED_LOW && maxScore <= 17 && scoreDifference <= 3;
  const isMorna = isAllMedium || result.pattern?.includes('relacao_morna');

  // Determina classificação final
  let classification: 'critical' | 'balanced' | 'morna' | 'normal';
  if (isCritical) classification = 'critical';
  else if (isAllBalanced) classification = 'balanced';
  else if (isMorna) classification = 'morna';
  else classification = 'normal';

  return {
    isCritical,
    isBalanced: isAllBalanced,
    isPerfectBalance,
    isMorna,
    classification
  };
}
