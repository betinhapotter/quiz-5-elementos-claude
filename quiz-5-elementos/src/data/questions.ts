import { Question } from '@/types/quiz';

export const questions: Question[] = [
  // TERRA (2 perguntas)
  {
    id: 'terra-1',
    element: 'terra',
    text: 'Vocês têm rituais ou tradições que fortalecem a conexão de vocês?',
    options: [
      { text: 'Sim, temos vários rituais significativos', value: 4 },
      { text: 'Temos alguns, mas não são consistentes', value: 3 },
      { text: 'Quase nenhum', value: 2 },
      { text: 'Nenhum', value: 1 },
    ],
  },
  {
    id: 'terra-2',
    element: 'terra',
    text: 'Você confia plenamente no compromisso do seu parceiro(a) com a relação?',
    options: [
      { text: 'Sim, confio totalmente', value: 4 },
      { text: 'Confio na maioria das vezes', value: 3 },
      { text: 'Tenho dúvidas frequentes', value: 2 },
      { text: 'Não confio', value: 1 },
    ],
  },

  // ÁGUA (2 perguntas)
  {
    id: 'agua-1',
    element: 'agua',
    text: 'Você conhece profundamente os sonhos, medos e aspirações do seu parceiro(a)?',
    options: [
      { text: 'Conheço muito bem', value: 4 },
      { text: 'Conheço razoavelmente', value: 3 },
      { text: 'Conheço superficialmente', value: 2 },
      { text: 'Não conheço', value: 1 },
    ],
  },
  {
    id: 'agua-2',
    element: 'agua',
    text: 'Quando um de vocês está emocionalmente abalado(a), o outro consegue acolher com empatia?',
    options: [
      { text: 'Sempre', value: 4 },
      { text: 'Na maioria das vezes', value: 3 },
      { text: 'Raramente', value: 2 },
      { text: 'Nunca', value: 1 },
    ],
  },

  // AR (2 perguntas)
  {
    id: 'ar-1',
    element: 'ar',
    text: 'Você se sente verdadeiramente OUVIDO(A) quando fala sobre algo importante?',
    options: [
      { text: 'Sempre me sinto ouvido(a)', value: 4 },
      { text: 'Às vezes sim, às vezes não', value: 3 },
      { text: 'Raramente me sinto ouvido(a)', value: 2 },
      { text: 'Nunca me sinto ouvido(a)', value: 1 },
    ],
  },
  {
    id: 'ar-2',
    element: 'ar',
    text: 'Durante conflitos, vocês conseguem dialogar com respeito ou vira briga?',
    options: [
      { text: 'Sempre dialogamos com respeito', value: 4 },
      { text: 'Na maioria das vezes conseguimos', value: 3 },
      { text: 'Geralmente vira briga', value: 2 },
      { text: 'Sempre vira briga ou silêncio', value: 1 },
    ],
  },

  // FOGO (2 perguntas)
  {
    id: 'fogo-1',
    element: 'fogo',
    text: 'Você ainda sente admiração e atração pelo seu parceiro(a)?',
    options: [
      { text: 'Sim, intensamente', value: 4 },
      { text: 'Sim, mas menos que antes', value: 3 },
      { text: 'Muito pouco', value: 2 },
      { text: 'Não sinto mais', value: 1 },
    ],
  },
  {
    id: 'fogo-2',
    element: 'fogo',
    text: 'Vocês demonstram afeto e carinho um pelo outro regularmente?',
    options: [
      { text: 'Sim, diariamente', value: 4 },
      { text: 'Às vezes', value: 3 },
      { text: 'Raramente', value: 2 },
      { text: 'Quase nunca', value: 1 },
    ],
  },

  // ÉTER (2 perguntas)
  {
    id: 'eter-1',
    element: 'eter',
    text: 'Vocês têm um propósito ou visão de futuro compartilhada que inspira vocês?',
    options: [
      { text: 'Sim, temos uma visão clara', value: 4 },
      { text: 'Temos uma ideia vaga', value: 3 },
      { text: 'Não temos', value: 2 },
      { text: 'Nunca conversamos sobre isso', value: 1 },
    ],
  },
  {
    id: 'eter-2',
    element: 'eter',
    text: 'Mesmo nos momentos difíceis, você consegue ver as qualidades positivas do seu parceiro(a)?',
    options: [
      { text: 'Sempre consigo', value: 4 },
      { text: 'Na maioria das vezes', value: 3 },
      { text: 'Raramente', value: 2 },
      { text: 'Não consigo', value: 1 },
    ],
  },
];

// Agrupar perguntas por elemento para visualização
export const questionsByElement = {
  terra: questions.filter((q) => q.element === 'terra'),
  agua: questions.filter((q) => q.element === 'agua'),
  ar: questions.filter((q) => q.element === 'ar'),
  fogo: questions.filter((q) => q.element === 'fogo'),
  eter: questions.filter((q) => q.element === 'eter'),
};
