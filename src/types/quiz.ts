// Elementos do método
export type Element = 'terra' | 'agua' | 'ar' | 'fogo' | 'eter';

// Desastres naturais correspondentes
export type DisasterType = 'terremoto' | 'tsunami' | 'tornado' | 'incendio' | 'vazio';

// Opção de resposta
export interface QuestionOption {
  text: string;
  value: 4 | 3 | 2 | 1;
}

// Estrutura de uma pergunta
export interface Question {
  id: string;
  element: Element;
  text: string;
  options: QuestionOption[];
}

// Resposta do usuário a uma pergunta
export interface Answer {
  questionId: string;
  element: Element;
  value: number;
}

// Scores calculados
export interface ElementScores {
  terra: number;
  agua: number;
  ar: number;
  fogo: number;
  eter: number;
}

// Resultado do quiz
export interface QuizResult {
  scores: ElementScores;
  lowestElement: Element;
  lowestScore: number;
  disasterType: DisasterType;
  secondLowestElement?: Element;
  pattern?: string;
}

// Dados do usuário
export interface UserData {
  email: string;
  name?: string;
  createdAt: Date;
}

// Estado completo do quiz
export interface QuizState {
  currentStep: 'landing' | 'quiz' | 'calculating' | 'email-capture' | 'result';
  currentQuestionIndex: number;
  answers: Answer[];
  userData: UserData | null;
  result: QuizResult | null;
}

// Mapeamento elemento -> desastre
export const elementToDisaster: Record<Element, DisasterType> = {
  terra: 'terremoto',
  agua: 'tsunami',
  ar: 'tornado',
  fogo: 'incendio',
  eter: 'vazio',
};

// Informações de cada elemento
export interface ElementInfo {
  name: string;
  icon: string;
  color: string;
  question: string;
  disaster: DisasterType;
  disasterName: string;
  meaning: string;
  shortMeaning: string;
}

export const elementsInfo: Record<Element, ElementInfo> = {
  terra: {
    name: 'Terra',
    icon: '🌍',
    color: 'terra',
    question: 'Eu posso me apoiar em você?',
    disaster: 'terremoto',
    disasterName: 'Terremoto',
    meaning: 'A base do seu relacionamento está instável. Falta confiança plena, compromisso consistente e rituais que conectam vocês.',
    shortMeaning: 'Falta de confiança e base sólida',
  },
  agua: {
    name: 'Água',
    icon: '💧',
    color: 'agua',
    question: 'Eu sou sentido(a) por você?',
    disaster: 'tsunami',
    disasterName: 'Tsunami',
    meaning: 'Falta conexão emocional profunda. Vocês conversam sobre logística mas não sobre sentimentos. Não há acolhimento emocional nos momentos difíceis.',
    shortMeaning: 'Desconexão emocional',
  },
  ar: {
    name: 'Ar',
    icon: '🌬️',
    color: 'ar',
    question: 'Você me escuta ou só espera a sua vez de falar?',
    disaster: 'tornado',
    disasterName: 'Tornado',
    meaning: 'A comunicação está travada. Vocês falam mas não se sentem ouvidos. Discussões viram brigas que nunca resolvem nada.',
    shortMeaning: 'Comunicação travada',
  },
  fogo: {
    name: 'Fogo',
    icon: '🔥',
    color: 'fogo',
    question: 'Ainda existe desejo aqui?',
    disaster: 'incendio',
    disasterName: 'Incêndio',
    meaning: 'A paixão e admiração estão apagadas. A relação virou administrativa: dividir tarefas, pagar contas. Falta calor, desejo, brilho nos olhos.',
    shortMeaning: 'Paixão apagada',
  },
  eter: {
    name: 'Éter',
    icon: '✨',
    color: 'eter',
    question: 'O que nós somos, além de boletos e rotina?',
    disaster: 'vazio',
    disasterName: 'Vazio',
    meaning: 'Falta perspectiva positiva e propósito maior. Sensação de "estamos juntos mas pra quê?". Sem visão de futuro compartilhada.',
    shortMeaning: 'Sem propósito compartilhado',
  },
};
