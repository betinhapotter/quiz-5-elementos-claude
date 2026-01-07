// src/lib/quiz-logic.ts
// Lógica de cálculo para 25 perguntas (5 por elemento)

// Tipo interno para elementos em inglês (usado na lógica de cálculo)
type ElementEn = 'earth' | 'water' | 'fire' | 'air' | 'ether';

// ============ TIPOS ============

export interface Scores {
  earth: number;
  water: number;
  fire: number;
  air: number;
  ether: number;
}

export interface QuizResult {
  scores: Scores;
  lowestElement: ElementEn;
  lowestScore: number;
  highestElement: ElementEn;
  highestScore: number;
  totalScore: number;
  averageScore: number;
  status: 'crisis' | 'attention' | 'balanced' | 'strong';
  direction: 'low' | 'high';
  patterns: string[];
}

// ============ CONSTANTES ============

// Com 5 perguntas por elemento (1-5 pontos cada):
// Mínimo possível: 5 (5 × 1)
// Máximo possível: 25 (5 × 5)
// Ponto médio: 15 (5 × 3)

const THRESHOLDS = {
  CRISIS: 8,        // ≤8 = situação crítica (média ≤1.6)
  LOW: 12,          // ≤12 = elemento em falta (média ≤2.4)
  BALANCED_LOW: 13, // 13-17 = atenção (média 2.6-3.4)
  BALANCED_HIGH: 18,// 18-20 = equilibrado (média 3.6-4.0)
  HIGH: 21,         // ≥21 = elemento em excesso (média ≥4.2)
  STRONG: 23        // ≥23 = muito forte (média ≥4.6)
};

const TOTAL_THRESHOLDS = {
  CRISIS: 50,       // ≤50 total = crise geral (média ≤10 por elemento)
  ATTENTION: 65,    // ≤65 = precisa atenção
  BALANCED: 90,     // ≤90 = equilibrado
  STRONG: 100       // >100 = relacionamento forte
};

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

  // Mapeia prefixos das perguntas (em português) para elementos (em inglês)
  const elementMapPtToEn: Record<string, ElementEn> = {
    'terra': 'earth',
    'agua': 'water',
    'fogo': 'fire',
    'ar': 'air',
    'eter': 'ether'
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
  
  // Encontra elemento mais baixo e mais alto
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

  // Calcula totais
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / 5;

  // Determina direção (falta ou excesso)
  // Se o mais baixo está muito baixo, é falta
  // Se o mais alto está muito alto E os outros estão OK, é excesso
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

  // Detecta padrões perigosos
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

  // Terra + Água baixos = Fundação rachada
  if (scores.earth <= THRESHOLDS.LOW && scores.water <= THRESHOLDS.LOW) {
    patterns.push('fundacao_rachada');
  }

  // Fogo + Ar baixos = Comunicação morta
  if (scores.fire <= THRESHOLDS.LOW && scores.air <= THRESHOLDS.LOW) {
    patterns.push('comunicacao_morta');
  }

  // Éter baixo + qualquer outro = Crise de sentido
  if (scores.ether <= THRESHOLDS.LOW) {
    patterns.push('crise_sentido');
  }

  // Terra + Éter baixos = Relação fantasma
  if (scores.earth <= THRESHOLDS.LOW && scores.ether <= THRESHOLDS.LOW) {
    patterns.push('relacao_fantasma');
  }

  // Água + Fogo baixos = Deserto emocional
  if (scores.water <= THRESHOLDS.LOW && scores.fire <= THRESHOLDS.LOW) {
    patterns.push('deserto_emocional');
  }

  // 3+ elementos em crise = Alerta vermelho
  // Se TODOS os elementos estão em crise, também é alerta vermelho (situação crítica geral)
  const criticalElements = Object.values(scores).filter(s => s <= THRESHOLDS.CRISIS);
  const lowElements = Object.values(scores).filter(s => s <= THRESHOLDS.LOW);
  
  // Se 3+ elementos estão em CRISE, ou se TODOS estão baixos (LOW), é alerta vermelho
  if (criticalElements.length >= 3 || lowElements.length === 5) {
    patterns.push('alerta_vermelho');
  }

  // Todos os elementos equilibrados (todos com score alto e similares)
  const allScores = Object.values(scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  
  // Se todos estão com score alto (>= BALANCED_HIGH) e a diferença é pequena (<= 3 pontos)
  // ou se todos estão no máximo (25), considera equilíbrio geral
  if (minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3) {
    patterns.push('equilibrio_geral');
  }
  
  // Caso especial: todos com score máximo (25)
  if (minScore === 25 && maxScore === 25) {
    patterns.push('equilibrio_perfeito');
  }

  return patterns;
}

/**
 * Retorna a porcentagem do score (para barras de progresso)
 * 5-25 mapeado para 0-100%
 */
export function getScorePercentage(score: number): number {
  // score vai de 5 (min) a 25 (max)
  // Normaliza para 0-100%
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

// ============ DADOS DOS RESULTADOS ============

export interface ResultData {
  title: string;
  meaning: string;
  symptoms: string[];
  ritualName: string;
  ritualDesc: string;
}

export const resultTexts: Record<ElementEn, { low: ResultData; high: ResultData }> = {
  earth: {
    low: {
      title: 'Terra em Falta: O Chão que Treme',
      meaning: 'A base do seu relacionamento está frágil. Falta consistência, rituais compartilhados ou a sensação de poder contar com o outro. Quando a Terra está em falta, tudo parece instável — pequenas coisas viram grandes ameaças porque não há fundação sólida.',
      symptoms: [
        'Sensação constante de insegurança sobre o futuro da relação',
        'Promessas não cumpridas (pequenas ou grandes)',
        'Ausência de rituais ou rotinas de conexão',
        'Dificuldade de confiar que o outro vai estar lá'
      ],
      ritualName: 'Ritual Raiz',
      ritualDesc: 'Durante 7 dias, criem UM micro-ritual diário juntos (pode ser 5 minutos). Café da manhã, boa noite, check-in do dia. Não importa o tamanho — importa a consistência. Anotem cada dia que cumprirem.'
    },
    high: {
      title: 'Terra em Excesso: O Chão que Aprisiona',
      meaning: 'A busca por segurança virou rigidez. Há estrutura demais, controle demais, ou ciúmes travestido de "cuidado". Quando a Terra está em excesso, a relação fica pesada, sem espaço para respirar.',
      symptoms: [
        'Ciúmes ou possessividade frequentes',
        'Necessidade excessiva de controle sobre o parceiro',
        'Rotina que virou prisão, não porto seguro',
        'Dificuldade de lidar com mudanças ou imprevistos'
      ],
      ritualName: 'Ritual Ventania',
      ritualDesc: 'Por 7 dias, pratiquem SOLTAR. Um dia sem checar o celular do outro. Um dia em que cada um faz algo só seu. Notem o desconforto, mas não ajam nele.'
    }
  },
  water: {
    low: {
      title: 'Água em Falta: O Rio Seco',
      meaning: 'A conexão emocional está superficial ou bloqueada. Vocês podem estar funcionando bem como "sócios" ou "colegas de quarto", mas falta profundidade. Sem Água, não há vulnerabilidade, não há intimidade verdadeira.',
      symptoms: [
        'Dificuldade de chorar ou mostrar fragilidade um pro outro',
        'Conversas ficam no nível superficial',
        'Sensação de solidão mesmo estando junto',
        'Evitam falar sobre o que realmente importa'
      ],
      ritualName: 'Ritual Nascente',
      ritualDesc: 'Por 7 dias, compartilhem UMA vulnerabilidade por dia. Pode ser pequena. "Hoje me senti insegura quando..." O objetivo não é resolver — é ser visto.'
    },
    high: {
      title: 'Água em Excesso: O Afogamento',
      meaning: 'A intensidade emocional está sufocando a relação. Há drama demais, fusão demais, ou dependência emocional que impede que cada um seja indivíduo. Quando a Água transborda, afoga.',
      symptoms: [
        'Brigas frequentes e intensas por coisas pequenas',
        'Dificuldade de dar espaço ao outro',
        'Fusão: não conseguem ter vida individual',
        'Montanha-russa emocional constante'
      ],
      ritualName: 'Ritual Margem',
      ritualDesc: 'Por 7 dias, pratiquem a contenção amorosa. Quando sentir que vai transbordar, diga: "Preciso de 20 minutos". Voltem mais calmos. Anotem o que funcionou.'
    }
  },
  fire: {
    low: {
      title: 'Fogo em Falta: A Chama Apagada',
      meaning: 'A paixão, admiração e desejo estão em baixa. A relação pode ter virado uma "sociedade" funcional, mas falta faísca. Sem Fogo, vocês são bons amigos no máximo — e isso corrói lentamente.',
      symptoms: [
        'Vida sexual inexistente ou mecânica',
        'Perderam a admiração um pelo outro',
        'Não há surpresas, novidades ou aventuras',
        'Sensação de "mais do mesmo" constante'
      ],
      ritualName: 'Ritual Faísca',
      ritualDesc: 'Por 7 dias, façam UMA coisa diferente juntos por dia. Pode ser pequena: um caminho novo, uma comida diferente, uma pergunta que nunca fizeram. O fogo precisa de combustível novo.'
    },
    high: {
      title: 'Fogo em Excesso: O Incêndio',
      meaning: 'A intensidade virou destruição. Há competição, brigas explosivas, ou uma paixão que queima mais do que aquece. Quando o Fogo está em excesso, vocês se machucam frequentemente.',
      symptoms: [
        'Brigas explosivas e destrutivas',
        'Competição constante entre vocês',
        'Ciúmes intenso disfarçado de paixão',
        'Ciclo de brigar-fazer as pazes-brigar'
      ],
      ritualName: 'Ritual Brasa',
      ritualDesc: 'Por 7 dias, pratiquem a admiração sem competição. Cada dia, digam uma coisa que admiram no outro SEM esperar reciprocidade. Deixem o fogo aquecer, não queimar.'
    }
  },
  air: {
    low: {
      title: 'Ar em Falta: O Silêncio Sufocante',
      meaning: 'A comunicação travou. Vocês não conseguem falar sobre o que importa, ou quando falam, vira briga. Sem Ar, os mal-entendidos se acumulam e a distância cresce.',
      symptoms: [
        'Evitam conversas difíceis a todo custo',
        'Quando tentam conversar, vira briga',
        'Acumulam ressentimentos não ditos',
        'Não se sentem ouvidos ou compreendidos'
      ],
      ritualName: 'Ritual Respiro',
      ritualDesc: 'Por 7 dias, pratiquem 10 minutos de conversa com REGRAS: um fala, o outro só escuta (sem interromper, sem defender). Depois invertem. Sem resolver nada — só ouvir.'
    },
    high: {
      title: 'Ar em Excesso: O Tornado',
      meaning: 'Há comunicação demais, mas do tipo errado. Discussões intermináveis, análise excessiva, ou palavras que machucam. Quando o Ar está em excesso, vocês falam muito mas não se conectam.',
      symptoms: [
        'Discussões que duram horas sem conclusão',
        'Racionalização excessiva dos sentimentos',
        'Palavras usadas como armas',
        'Falam SOBRE a relação mais do que VIVEM a relação'
      ],
      ritualName: 'Ritual Silêncio',
      ritualDesc: 'Por 7 dias, pratiquem 20 minutos de silêncio JUNTOS. Sem celular, sem TV. Podem se tocar, olhar, mas não falar. Deixem a conexão existir sem palavras.'
    }
  },
  ether: {
    low: {
      title: 'Éter em Falta: O Vazio de Sentido',
      meaning: 'A relação perdeu o propósito. Vocês não sabem mais POR QUE estão juntos, ou têm visões de futuro incompatíveis. Sem Éter, é só inércia — e inércia não sustenta amor.',
      symptoms: [
        'Não sabem responder "por que estamos juntos?"',
        'Visões de futuro diferentes ou inexistentes',
        'Sensação de que a relação "não vai a lugar nenhum"',
        'Falta de projetos ou sonhos compartilhados'
      ],
      ritualName: 'Ritual Horizonte',
      ritualDesc: 'Por 7 dias, conversem 15 minutos sobre FUTURO. Não o que está errado — o que querem construir. Como se veem em 5 anos? O que sonham? Deixem o "nós" ter direção.'
    },
    high: {
      title: 'Éter em Excesso: A Torre de Marfim',
      meaning: 'A espiritualização da relação virou fuga da realidade. Há idealização demais, expectativas impossíveis, ou uso de "propósito" para evitar lidar com problemas concretos.',
      symptoms: [
        'Idealização excessiva do parceiro ou da relação',
        'Usam espiritualidade para evitar conflitos reais',
        'Expectativas irrealistas um do outro',
        'Dificuldade de lidar com o mundano e imperfeito'
      ],
      ritualName: 'Ritual Chão',
      ritualDesc: 'Por 7 dias, façam algo MUNDANO juntos com presença total. Lavar louça, fazer compras, limpar a casa. Sem filosofar — só estar. O sagrado mora no comum.'
    }
  }
};

// ============ TEXTOS DE PADRÕES ============

export const patternTexts: Record<string, { title: string; description: string }> = {
  fundacao_rachada: {
    title: '⚠️ Fundação Rachada',
    description: 'Terra + Água baixos: A base (segurança) e a conexão emocional estão comprometidas. Isso é sério — sem esses dois, o relacionamento não tem onde se sustentar.'
  },
  comunicacao_morta: {
    title: '⚠️ Comunicação Morta',
    description: 'Fogo + Ar baixos: Não há paixão E não há diálogo. Vocês viraram colegas de quarto que nem conversam direito.'
  },
  crise_sentido: {
    title: '⚠️ Crise de Sentido',
    description: 'Éter muito baixo: A pergunta "por que estamos juntos?" não tem resposta clara. Sem propósito, a relação vira inércia.'
  },
  relacao_fantasma: {
    title: '⚠️ Relação Fantasma',
    description: 'Terra + Éter baixos: Não há base sólida NEM direção. A relação existe, mas está vazia de presença e propósito.'
  },
  deserto_emocional: {
    title: '⚠️ Deserto Emocional',
    description: 'Água + Fogo baixos: Não há conexão emocional NEM paixão. O relacionamento está emocionalmente árido.'
  },
  alerta_vermelho: {
    title: '🚨 Alerta Vermelho',
    description: 'Três ou mais elementos em crise. Este relacionamento precisa de atenção profissional urgente. Considere buscar terapia de casal.'
  },
  equilibrio_geral: {
    title: '✨ Equilíbrio Harmonioso',
    description: 'Todos os elementos estão em equilíbrio! Seu relacionamento tem uma base saudável. Continue nutrindo cada dimensão.'
  },
  equilibrio_perfeito: {
    title: '🌟 Equilíbrio Perfeito',
    description: 'Parabéns! Todos os 5 Elementos estão perfeitamente alinhados no seu relacionamento. Vocês têm uma base sólida em todas as dimensões. O planner de manutenção vai ajudar a manter esse equilíbrio.'
  }
};

// ============ FUNÇÕES DE CONVERSÃO E COMPATIBILIDADE ============

/**
 * Mapeia elementos em inglês para português
 */
const elementMapEnToPt: Record<ElementEn, 'terra' | 'agua' | 'ar' | 'fogo' | 'eter'> = {
  earth: 'terra',
  water: 'agua',
  fire: 'fogo',
  air: 'ar',
  ether: 'eter'
};

/**
 * Mapeia elementos em português para inglês
 */
const elementMapPtToEn: Record<'terra' | 'agua' | 'ar' | 'fogo' | 'eter', ElementEn> = {
  terra: 'earth',
  agua: 'water',
  ar: 'air',
  fogo: 'fire',
  eter: 'ether'
};

/**
 * Converte Answer[] para QuizResult do tipo @/types/quiz (português)
 * Esta função é usada pelo store para converter respostas em resultados
 */
export function calculateResult(answers: Array<{ questionId: string; element: string; value: number }>): {
  scores: { terra: number; agua: number; ar: number; fogo: number; eter: number };
  lowestElement: 'terra' | 'agua' | 'ar' | 'fogo' | 'eter';
  lowestScore: number;
  secondLowestElement?: 'terra' | 'agua' | 'ar' | 'fogo' | 'eter';
  pattern?: string;
  disasterType: 'terremoto' | 'tsunami' | 'tornado' | 'incendio' | 'vazio';
} {
  // Converte answers para Record<string, number>
  const answersRecord: Record<string, number> = {};
  answers.forEach(answer => {
    answersRecord[answer.questionId] = answer.value;
  });

  // Calcula scores em inglês
  const scoresEn = calculateScores(answersRecord);
  
  // Analisa resultados
  const resultEn = analyzeResults(scoresEn);

  // Converte scores para português
  const scoresPt = {
    terra: scoresEn.earth,
    agua: scoresEn.water,
    ar: scoresEn.air,
    fogo: scoresEn.fire,
    eter: scoresEn.ether
  };

  // Verifica se todos os elementos estão equilibrados/perfeitos
  const allScores = Object.values(scoresPt);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  const isAllBalanced = minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3;
  const isPerfectBalance = minScore === 25 && maxScore === 25;

  // Encontra elementos mais baixos
  const elementsPt: Array<'terra' | 'agua' | 'ar' | 'fogo' | 'eter'> = ['terra', 'agua', 'ar', 'fogo', 'eter'];
  const sortedElements = elementsPt
    .map(el => ({ element: el, score: scoresPt[el] }))
    .sort((a, b) => a.score - b.score);

  // Se todos estão equilibrados, usa o primeiro elemento apenas como referência (para exibição)
  // mas o padrão vai indicar que está equilibrado
  const lowestElementPt = elementMapEnToPt[resultEn.lowestElement];
  const secondLowestElementPt = sortedElements[1]?.element;

  // Mapeia padrão mais relevante
  let patternText: string | undefined;
  if (resultEn.patterns.length > 0) {
    // Prioriza padrões na seguinte ordem:
    // 1. Alerta vermelho (situação mais crítica - todos ou maioria em crise)
    // 2. Equilíbrio perfeito
    // 3. Equilíbrio geral
    // 4. Outros padrões específicos
    if (resultEn.patterns.includes('alerta_vermelho')) {
      patternText = patternTexts['alerta_vermelho']?.description;
    } else if (resultEn.patterns.includes('equilibrio_perfeito')) {
      patternText = patternTexts['equilibrio_perfeito']?.description;
    } else if (resultEn.patterns.includes('equilibrio_geral')) {
      patternText = patternTexts['equilibrio_geral']?.description;
    } else {
      // Para outros padrões, prioriza o primeiro padrão detectado
      const firstPatternKey = resultEn.patterns[0];
      if (patternTexts[firstPatternKey]) {
        patternText = patternTexts[firstPatternKey]?.description;
      } else {
        // Fallback para o meaning do elemento mais baixo
        const firstPattern = resultTexts[resultEn.lowestElement][resultEn.direction];
        patternText = firstPattern.meaning;
      }
    }
  }

  // Mapeia disaster type
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
  // Verifica se todos estão equilibrados
  const allScores = Object.values(result.scores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const scoreDifference = maxScore - minScore;
  const isAllBalanced = minScore >= THRESHOLDS.BALANCED_HIGH && scoreDifference <= 3;
  const isPerfectBalance = minScore === 25 && maxScore === 25;
  
  // Verifica se há situação crítica (alerta vermelho)
  const isAllInCrisis = allScores.every(score => score <= THRESHOLDS.CRISIS);
  const isAllLow = allScores.every(score => score <= THRESHOLDS.LOW);
  const isCriticalSituation = isAllInCrisis || isAllLow || result.pattern?.includes('alerta_vermelho');

  // Se há situação crítica, retorna explicação de alerta vermelho
  if (isCriticalSituation) {
    return {
      title: '🚨 Alerta Vermelho: Situação Crítica',
      subtitle: 'Múltiplos elementos estão em crise. Este relacionamento precisa de atenção profissional urgente.',
      explanation: 'Três ou mais elementos estão em crise, ou todos os elementos estão desalinhados. Isso indica uma situação crítica que requer atenção profissional. Não é apenas um elemento específico — o relacionamento como um todo precisa de suporte. Considere buscar terapia de casal ou orientação profissional especializada.',
      whyNotHeard: 'Quando múltiplos elementos estão em crise, a comunicação fica completamente bloqueada. Não é apenas um problema de "não se entenderem" — é uma falha sistêmica na base do relacionamento. Cada tentativa de comunicação encontra múltiplos pontos de resistência, criando um ciclo de frustração e desconexão.',
      firstSteps: [
        'Busque ajuda profissional: terapia de casal é essencial nesta situação',
        'Reconheça a gravidade: não tente resolver sozinho quando múltiplos elementos estão em crise',
        'Crie espaço seguro: estabeleçam um acordo de não-agressão verbal enquanto buscam ajuda',
        'Foquem em estabilização: antes de tentar melhorar, precisam estabilizar a situação atual'
      ]
    };
  }

  // Se todos estão equilibrados, retorna explicação especial
  if (isPerfectBalance || (isAllBalanced && result.pattern?.includes('equilibrio'))) {
    return {
      title: isPerfectBalance ? '🌟 Equilíbrio Perfeito' : '✨ Equilíbrio Harmonioso',
      subtitle: 'Todos os 5 Elementos estão alinhados no seu relacionamento!',
      explanation: isPerfectBalance 
        ? 'Parabéns! Todos os 5 Elementos estão perfeitamente alinhados no seu relacionamento. Vocês têm uma base sólida em todas as dimensões: segurança (Terra), conexão emocional (Água), comunicação (Ar), paixão (Fogo) e propósito (Éter). O planner de manutenção vai ajudar vocês a manter esse equilíbrio e continuar crescendo juntos.'
        : 'Todos os elementos estão em equilíbrio! Seu relacionamento tem uma base saudável em todas as dimensões. Continue nutrindo cada área para manter esse alinhamento.',
      whyNotHeard: 'Quando todos os elementos estão equilibrados, vocês têm uma comunicação fluida e se sentem ouvidos porque há base sólida em todas as dimensões do relacionamento. Não há desalinhamento que cause ruído na comunicação.',
      firstSteps: [
        'Mantenham os rituais que já funcionam bem',
        'Continuem praticando escuta ativa e presença',
        'Celebrem regularmente o que está funcionando',
        'Usem o planner de manutenção para continuar nutrindo todos os elementos'
      ]
    };
  }

  const elementEn = elementMapPtToEn[result.lowestElement];
  const direction = result.direction || (result.lowestScore <= THRESHOLDS.LOW ? 'low' : 'high');
  const resultData = resultTexts[elementEn][direction];
  const patternInfo = result.pattern ? patternTexts[result.pattern] : null;

  // Determina subtitle baseado na direção
  const subtitle = direction === 'low' 
    ? `O elemento ${result.lowestElement} está em falta no seu relacionamento`
    : `O elemento ${result.lowestElement} está em excesso no seu relacionamento`;

  // Explicação sobre por que não se sentem ouvidos (baseado no elemento)
  const whyNotHeardMap: Record<'terra' | 'agua' | 'ar' | 'fogo' | 'eter', string> = {
    terra: 'Quando a Terra está desalinhada, vocês não têm base sólida para confiar. Sem essa fundação, cada conversa vira uma ameaça à estabilidade. Vocês falam, mas não há segurança para realmente ouvir — porque ouvir significa se abrir, e se abrir significa vulnerabilidade. E vulnerabilidade sem base é perigosa.',
    agua: 'Quando a Água está desalinhada, a conexão emocional está bloqueada. Vocês podem estar falando, mas não estão se sentindo. As palavras saem, mas não há acolhimento para recebê-las. Sem Água, não há espaço seguro para vulnerabilidade — e sem vulnerabilidade, não há verdadeira escuta.',
    ar: 'Quando o Ar está desalinhado, a comunicação está travada. Vocês falam, mas não se sentem ouvidos porque as palavras não encontram espaço. Ou viram briga, ou são ignoradas, ou se perdem no vazio. Sem Ar, não há diálogo — só monólogos paralelos.',
    fogo: 'Quando o Fogo está desalinhado, a paixão e admiração se apagaram. Vocês podem estar conversando, mas não há calor, não há interesse genuíno. As palavras saem frias, sem energia. Sem Fogo, não há combustível para manter a atenção e o desejo de realmente ouvir.',
    eter: 'Quando o Éter está desalinhado, falta propósito e direção. Vocês falam, mas não há sentido maior que conecte as conversas. Tudo vira funcional, logístico, vazio de significado. Sem Éter, não há "por quê" para realmente se importar com o que o outro diz.'
  };

  // Primeiros passos baseados no elemento e direção
  const firstStepsMap: Record<string, string[]> = {
    'terra-low': [
      'Criem um micro-ritual diário de 5 minutos (café da manhã, boa noite, check-in)',
      'Façam uma promessa pequena por semana e cumpram — sem exceção',
      'Definam um "porto seguro" físico ou emocional onde vocês podem se apoiar',
      'Conversem sobre o que cada um precisa para se sentir seguro na relação'
    ],
    'terra-high': [
      'Pratiquem soltar controle: um dia sem checar o celular do outro',
      'Criem espaço individual: cada um faz algo só seu por semana',
      'Revisem rituais que viraram prisão — quais podem ser flexibilizados?',
      'Pratiquem lidar com imprevistos sem ansiedade'
    ],
    'agua-low': [
      'Compartilhem uma vulnerabilidade por dia (pode ser pequena)',
      'Criem um espaço seguro para chorar ou mostrar fragilidade',
      'Pratiquem escuta ativa: um fala, o outro só escuta (sem resolver)',
      'Conversem sobre medos e inseguranças do passado'
    ],
    'agua-high': [
      'Pratiquem contenção: quando sentir que vai transbordar, diga "preciso de 20 minutos"',
      'Criem espaço individual: cada um tem uma atividade só sua',
      'Estabeleçam limites saudáveis para intensidade emocional',
      'Pratiquem respirar antes de reagir emocionalmente'
    ],
    'ar-low': [
      'Pratiquem 10 minutos de conversa com regras: um fala, o outro só escuta',
      'Evitem interromper — deixem o outro terminar de falar',
      'Pratiquem fazer perguntas ao invés de dar respostas',
      'Criem um "safe word" para pausar quando a conversa descarrila'
    ],
    'ar-high': [
      'Pratiquem 20 minutos de silêncio juntos (sem celular, sem TV)',
      'Limitam discussões a 30 minutos — depois pausa obrigatória',
      'Pratiquem escutar sem analisar ou racionalizar',
      'Foquem em viver a relação ao invés de falar sobre ela'
    ],
    'fogo-low': [
      'Façam uma coisa diferente juntos por dia (pode ser pequena)',
      'Pratiquem admiração: digam uma coisa que admiram no outro por dia',
      'Criem surpresas pequenas e frequentes',
      'Pratiquem olhar nos olhos por 2 minutos sem falar'
    ],
    'fogo-high': [
      'Pratiquem admiração sem competição — digam o que admiram sem esperar reciprocidade',
      'Criem espaço para paixão sem intensidade destrutiva',
      'Pratiquem canalizar energia em atividades criativas juntos',
      'Estabeleçam limites para brigas explosivas'
    ],
    'eter-low': [
      'Conversem 15 minutos sobre futuro por dia (não problemas, mas sonhos)',
      'Definam uma visão compartilhada de 5 anos',
      'Identifiquem valores profundos que vocês compartilham',
      'Criem um projeto conjunto (pode ser pequeno)'
    ],
    'eter-high': [
      'Façam algo mundano juntos com presença total (lavar louça, compras)',
      'Pratiquem estar no presente ao invés de idealizar o futuro',
      'Conectem espiritualidade com realidade prática',
      'Celebrem imperfeições ao invés de buscar perfeição'
    ]
  };

  const stepsKey = `${result.lowestElement}-${direction}`;
  const firstSteps = firstStepsMap[stepsKey] || [
    'Identifiquem o que está funcionando e o que não está',
    'Criem espaço para conversas honestas e vulneráveis',
    'Pratiquem escuta ativa e presença',
    'Busquem apoio profissional se necessário'
  ];

  return {
    title: resultData.title,
    subtitle,
    explanation: patternInfo ? `${patternInfo.description}\n\n${resultData.meaning}` : resultData.meaning,
    whyNotHeard: whyNotHeardMap[result.lowestElement],
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
  if (result.lowestScore <= THRESHOLDS.CRISIS) {
    return 'critica';
  }
  if (result.lowestScore <= THRESHOLDS.LOW) {
    return 'atencao';
  }
  return 'normal';
}
