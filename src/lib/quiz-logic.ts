import {
  Answer,
  Element,
  ElementScores,
  QuizResult,
  elementToDisaster,
  elementsInfo,
} from '@/types/quiz';

/**
 * Calcula os scores de cada elemento baseado nas respostas
 */
export function calculateScores(answers: Answer[]): ElementScores {
  const scores: ElementScores = {
    terra: 0,
    agua: 0,
    ar: 0,
    fogo: 0,
    eter: 0,
  };

  // Soma os valores de cada resposta no elemento correspondente
  answers.forEach((answer) => {
    scores[answer.element] += answer.value;
  });

  return scores;
}

/**
 * Identifica o elemento com menor pontuação (mais desalinhado)
 */
export function findLowestElement(scores: ElementScores): {
  element: Element;
  score: number;
} {
  const elements: Element[] = ['terra', 'agua', 'ar', 'fogo', 'eter'];

  let lowestElement: Element = 'terra';
  let lowestScore = scores.terra;

  elements.forEach((element) => {
    if (scores[element] < lowestScore) {
      lowestScore = scores[element];
      lowestElement = element;
    }
  });

  return { element: lowestElement, score: lowestScore };
}

/**
 * Identifica o segundo elemento mais baixo (para análise de padrões)
 */
export function findSecondLowestElement(
  scores: ElementScores,
  lowestElement: Element
): { element: Element; score: number } | null {
  const elements: Element[] = ['terra', 'agua', 'ar', 'fogo', 'eter'];
  const filteredElements = elements.filter((e) => e !== lowestElement);

  let secondLowest: Element | null = null;
  let secondLowestScore = Infinity;

  filteredElements.forEach((element) => {
    if (scores[element] < secondLowestScore) {
      secondLowestScore = scores[element];
      secondLowest = element;
    }
  });

  // Só retorna se o segundo também estiver baixo (<=4 de 8)
  if (secondLowest && secondLowestScore <= 4) {
    return { element: secondLowest, score: secondLowestScore };
  }

  return null;
}

/**
 * Identifica padrões perigosos de combinações de elementos baixos
 */
export function identifyPattern(
  lowestElement: Element,
  secondLowest: Element | null,
  scores: ElementScores
): string | undefined {
  // Padrões críticos de combinação
  const patterns: Record<string, string> = {
    'terra_agua': 'Colapso duplo: base + emoção. O relacionamento não tem onde se apoiar nem como se nutrir.',
    'terra_ar': 'Estrutura e comunicação quebradas. Vocês não sabem o que esperar um do outro.',
    'ar_fogo': 'Comunicação travada + paixão morta. A convivência esfriou completamente.',
    'agua_fogo': 'Sem emoção nem desejo. O relacionamento virou burocracia.',
    'fogo_eter': 'Sem paixão nem propósito. Por que ainda estão juntos?',
    'terra_eter': 'Sem base nem direção. Relacionamento à deriva.',
  };

  if (!secondLowest) return undefined;

  // Cria chave para buscar padrão (ordem alfabética para consistência)
  const key = [lowestElement, secondLowest].sort().join('_');

  return patterns[key];
}

/**
 * Calcula o resultado completo do quiz
 */
export function calculateResult(answers: Answer[]): QuizResult {
  const scores = calculateScores(answers);
  const { element: lowestElement, score: lowestScore } = findLowestElement(scores);
  const secondLowest = findSecondLowestElement(scores, lowestElement);
  const pattern = identifyPattern(
    lowestElement,
    secondLowest?.element || null,
    scores
  );

  return {
    scores,
    lowestElement,
    lowestScore,
    disasterType: elementToDisaster[lowestElement],
    secondLowestElement: secondLowest?.element,
    pattern,
  };
}

/**
 * Gera o texto de explicação do resultado
 */
export function generateResultExplanation(result: QuizResult): {
  title: string;
  subtitle: string;
  explanation: string;
  whyNotHeard: string;
  firstSteps: string[];
} {
  const elementInfo = elementsInfo[result.lowestElement];

  const explanations: Record<Element, {
    title: string;
    subtitle: string;
    explanation: string;
    whyNotHeard: string;
    firstSteps: string[];
  }> = {
    terra: {
      title: `Elemento TERRA desalinhado`,
      subtitle: `${elementInfo.icon} A base do relacionamento está instável`,
      explanation: `O elemento Terra representa a fundação do relacionamento: confiança, compromisso e presença consistente. Quando está desalinhado, vocês podem sentir que estão "pisando em ovos" — nunca sabem quando o chão vai ceder.`,
      whyNotHeard: `Quando a TERRA está desalinhada, as conversas ficam superficiais porque falta a SEGURANÇA para serem vulneráveis. Vocês não confiam que o outro vai "segurar" o que for dito. Então falam de logística, de rotina, de reclamações — mas nunca do que realmente importa.`,
      firstSteps: [
        'Conversem sobre compromisso: "Você está 100% dentro dessa relação?"',
        'Criem 1 ritual simples: jantar juntos 3x/semana SEM celular',
        'Alinhem valores: "O que é inegociável pra você numa relação?"',
      ],
    },
    agua: {
      title: `Elemento ÁGUA desalinhado`,
      subtitle: `${elementInfo.icon} Falta conexão emocional profunda`,
      explanation: `O elemento Água representa o fluxo emocional: carinho, ternura, vulnerabilidade compartilhada. Quando está desalinhado, vocês podem estar lado a lado mas emocionalmente em planetas diferentes.`,
      whyNotHeard: `Quando a ÁGUA está desalinhada, vocês até trocam palavras, mas não há EMPATIA. Um fala sobre emoção, o outro responde com lógica. Não há encontro verdadeiro — só dois monólogos paralelos.`,
      firstSteps: [
        'Façam 1 pergunta profunda por dia: "O que te deixou mais feliz hoje? E mais triste?"',
        'Pratiquem escuta sem tentar "resolver": só acolham',
        'Criem "mapas de amor": dediquem 30 min para explorar os sonhos/medos do outro',
      ],
    },
    ar: {
      title: `Elemento AR desalinhado`,
      subtitle: `${elementInfo.icon} A comunicação está travada`,
      explanation: `O elemento Ar representa a troca verbal: diálogo, escuta, clareza. Quando está desalinhado, vocês falam línguas diferentes. Um pede conexão, o outro lê como cobrança. A mensagem nunca chega como foi enviada.`,
      whyNotHeard: `Quando o AR está desalinhado, é EXATAMENTE isso: vocês falam lí­nguas diferentes. Um fala, o outro ouve como ataque. Um pede conexão, o outro lê como cobranã§a. O ar não circula — sufoca.`,
      firstSteps: [
        'Respondam aos pedidos de conexão (mesmo que seja "agora não posso, mas às 20h sim")',
        'Durante conflitos, façam pausas de 20 min quando esquentar demais',
        'Pratiquem espelhamento: "O que ouvi você dizer foi... Entendi certo?"',
      ],
    },
    fogo: {
      title: `Elemento FOGO desalinhado`,
      subtitle: `${elementInfo.icon} A paixão e admiração estão apagadas`,
      explanation: `O elemento Fogo representa a energia vital do relacionamento: desejo, admiração, entusiasmo mútuo. Quando está desalinhado, vocês viram "sócios" — dividem tarefas, contas, agenda. Mas o brilho nos olhos sumiu.`,
      whyNotHeard: `Quando o FOGO está desalinhado, vocês até conversam, mas falta CALOR. As palavras são frias, técnicas, sem vida. Não há energia, não há interesse genuíno. É como falar com um colega de trabalho.`,
      firstSteps: [
        'Expressem 1 admiração por dia: "Eu admiro em você..."',
        'Resgatem toque físico não-sexual: abraço de 20 segundos, massagem, dançar junto',
        'Apoiem os sonhos do outro ATIVAMENTE: "Como posso te ajudar com isso?"',
      ],
    },
    eter: {
      title: `Elemento ÉTER desalinhado`,
      subtitle: `${elementInfo.icon} Falta propósito e perspectiva positiva`,
      explanation: `O elemento Éter representa o significado maior: propósito compartilhado, visão de futuro, capacidade de ver o melhor no outro mesmo nas dificuldades. Quando está desalinhado, vocês perguntam "pra quê?".`,
      whyNotHeard: `Quando o ÉTER está desalinhado, vocês conversam sobre problemas mas não sobre PROPÓSITO. Falta o "por quê maior" que dá sentido às dificuldades. Sem isso, toda conversa parece vazia, inútil.`,
      firstSteps: [
        'Façam "poupança emocional": todo dia, compartilhem 1 coisa que admiram no outro',
        'Conversem sobre visão de futuro: "Como queremos estar daqui 5 anos?"',
        'Criem um propósito compartilhado: um valor/missão que guia vocês',
      ],
    },
  };

  return explanations[result.lowestElement];
}

/**
 * Determina a severidade do resultado (para personalização do tom)
 */
export function getResultSeverity(result: QuizResult): 'critica' | 'alta' | 'moderada' | 'leve' {
  const { lowestScore, secondLowestElement, scores } = result;

  // Score crítico no elemento principal
  if (lowestScore <= 3) return 'critica';

  // Dois elementos baixos
  if (secondLowestElement && scores[secondLowestElement] <= 4) return 'alta';

  // Score moderadamente baixo
  if (lowestScore <= 5) return 'moderada';

  return 'leve';
}
