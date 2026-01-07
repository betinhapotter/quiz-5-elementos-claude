// src/data/questions.ts
// 25 perguntas - 5 por elemento

import { Element } from '@/types/quiz';

export interface QuestionOption {
  text: string;
  value: number;
}

// Interface estendida com campos adicionais para exibição
export interface Question {
  id: string;
  element: Element; // Tipo explícito: 'terra' | 'agua' | 'ar' | 'fogo' | 'eter'
  elementName: string;
  icon: string;
  text: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  // ============ TERRA (5 perguntas) ============
  {
    id: 'terra1',
    element: 'terra',
    elementName: 'Terra',
    icon: '🌍',
    text: 'Quando vocês fazem uma promessa um ao outro, com que frequência ela é cumprida?',
    options: [
      { text: 'Raramente — promessas viram frustrações', value: 1 },
      { text: 'Às vezes — depende da promessa', value: 2 },
      { text: 'Na maioria das vezes cumprimos', value: 3 },
      { text: 'Quase sempre — confiança é sagrada', value: 4 },
      { text: 'Sempre — nossa palavra é lei', value: 5 }
    ]
  },
  {
    id: 'terra2',
    element: 'terra',
    elementName: 'Terra',
    icon: '🌍',
    text: 'Como você descreveria a presença física do seu parceiro/a na rotina?',
    options: [
      { text: 'Ausente — mesmo presente, parece longe', value: 1 },
      { text: 'Inconsistente — oscila muito', value: 2 },
      { text: 'Presente na maioria das vezes', value: 3 },
      { text: 'Bem presente — sinto que posso contar', value: 4 },
      { text: 'Totalmente presente — é meu porto seguro', value: 5 }
    ]
  },
  {
    id: 'terra3',
    element: 'terra',
    elementName: 'Terra',
    icon: '🌍',
    text: 'Vocês têm rituais de casal (café da manhã juntos, série à noite, caminhada etc)?',
    options: [
      { text: 'Nenhum — cada um na sua', value: 1 },
      { text: 'Tivemos, mas abandonamos', value: 2 },
      { text: 'Alguns, mas inconsistentes', value: 3 },
      { text: 'Sim, temos alguns que funcionam', value: 4 },
      { text: 'Vários rituais que amamos', value: 5 }
    ]
  },
  {
    id: 'terra4',
    element: 'terra',
    elementName: 'Terra',
    icon: '🌍',
    text: 'Se você precisasse de apoio numa emergência às 3h da manhã, como se sentiria pedindo?',
    options: [
      { text: 'Não pediria — sei que não posso contar', value: 1 },
      { text: 'Hesitaria muito antes de pedir', value: 2 },
      { text: 'Pediria, mas com alguma insegurança', value: 3 },
      { text: 'Pediria com confiança', value: 4 },
      { text: 'Nem precisaria pedir — já estaria lá', value: 5 }
    ]
  },
  {
    id: 'terra5',
    element: 'terra',
    elementName: 'Terra',
    icon: '🌍',
    text: 'Como você se sente em relação ao compromisso do seu parceiro/a com a relação?',
    options: [
      { text: 'Insegura — não sei se quer ficar', value: 1 },
      { text: 'Dúvidas frequentes sobre isso', value: 2 },
      { text: 'Acho que quer, mas não demonstra muito', value: 3 },
      { text: 'Sinto compromisso claro', value: 4 },
      { text: 'Total — é prioridade declarada', value: 5 }
    ]
  },

  // ============ ÁGUA (5 perguntas) ============
  {
    id: 'agua1',
    element: 'agua',
    elementName: 'Água',
    icon: '💧',
    text: 'Quando você está triste ou vulnerável, como seu parceiro/a costuma reagir?',
    options: [
      { text: 'Ignora ou minimiza', value: 1 },
      { text: 'Fica desconfortável e muda de assunto', value: 2 },
      { text: 'Tenta ajudar, mas nem sempre acerta', value: 3 },
      { text: 'Acolhe e escuta com atenção', value: 4 },
      { text: 'É meu espaço seguro — me sinto totalmente acolhida', value: 5 }
    ]
  },
  {
    id: 'agua2',
    element: 'agua',
    elementName: 'Água',
    icon: '💧',
    text: 'Com que facilidade você consegue chorar ou mostrar fragilidade perto dele/a?',
    options: [
      { text: 'Impossível — me fecho completamente', value: 1 },
      { text: 'Muito difícil — tenho medo da reação', value: 2 },
      { text: 'Consigo às vezes, com esforço', value: 3 },
      { text: 'Consigo na maioria das vezes', value: 4 },
      { text: 'Total liberdade — é onde mais me permito', value: 5 }
    ]
  },
  {
    id: 'agua3',
    element: 'agua',
    elementName: 'Água',
    icon: '💧',
    text: 'Vocês conseguem falar sobre medos, inseguranças e feridas do passado?',
    options: [
      { text: 'Nunca — são assuntos proibidos', value: 1 },
      { text: 'Raramente — evitamos', value: 2 },
      { text: 'Às vezes, quando a situação força', value: 3 },
      { text: 'Sim, com cuidado e respeito', value: 4 },
      { text: 'Profundamente — é nossa fortaleza', value: 5 }
    ]
  },
  {
    id: 'agua4',
    element: 'agua',
    elementName: 'Água',
    icon: '💧',
    text: 'Depois de uma briga, como vocês costumam se reconectar?',
    options: [
      { text: 'Não reconectamos — fica um clima ruim por dias', value: 1 },
      { text: 'Fingimos que nada aconteceu', value: 2 },
      { text: 'Um dos dois cede, mas sem resolver de verdade', value: 3 },
      { text: 'Conversamos e reparamos', value: 4 },
      { text: 'Brigas nos aproximam — sempre saímos mais fortes', value: 5 }
    ]
  },
  {
    id: 'agua5',
    element: 'agua',
    elementName: 'Água',
    icon: '💧',
    text: 'Você sente que seu parceiro/a realmente te "vê" — suas nuances, mudanças de humor, necessidades não ditas?',
    options: [
      { text: 'Não — sou invisível', value: 1 },
      { text: 'Raramente percebe', value: 2 },
      { text: 'Às vezes percebe, às vezes não', value: 3 },
      { text: 'Na maioria das vezes me vê', value: 4 },
      { text: 'Totalmente — me sinto profundamente vista', value: 5 }
    ]
  },

  // ============ FOGO (5 perguntas) ============
  {
    id: 'fogo1',
    element: 'fogo',
    elementName: 'Fogo',
    icon: '🔥',
    text: 'Como está a vida sexual de vocês atualmente?',
    options: [
      { text: 'Inexistente ou muito rara', value: 1 },
      { text: 'Acontece por obrigação ou rotina', value: 2 },
      { text: 'Razoável, mas sem muita intensidade', value: 3 },
      { text: 'Boa — há desejo e conexão', value: 4 },
      { text: 'Vibrante — é uma área de força', value: 5 }
    ]
  },
  {
    id: 'fogo2',
    element: 'fogo',
    elementName: 'Fogo',
    icon: '🔥',
    text: 'Você ainda sente admiração pelo seu parceiro/a?',
    options: [
      { text: 'Perdi a admiração — só vejo defeitos', value: 1 },
      { text: 'Pouca — preciso me esforçar pra lembrar', value: 2 },
      { text: 'Às vezes sim, às vezes não', value: 3 },
      { text: 'Sim, admiro várias coisas nele/a', value: 4 },
      { text: 'Profundamente — me inspira', value: 5 }
    ]
  },
  {
    id: 'fogo3',
    element: 'fogo',
    elementName: 'Fogo',
    icon: '🔥',
    text: 'Vocês ainda se surpreendem positivamente um ao outro?',
    options: [
      { text: 'Nunca — é tudo previsível (negativamente)', value: 1 },
      { text: 'Raramente — caímos na mesmice', value: 2 },
      { text: 'De vez em quando acontece', value: 3 },
      { text: 'Sim, ainda nos surpreendemos', value: 4 },
      { text: 'Frequentemente — mantemos a chama viva', value: 5 }
    ]
  },
  {
    id: 'fogo4',
    element: 'fogo',
    elementName: 'Fogo',
    icon: '🔥',
    text: 'Vocês estimulam o crescimento individual um do outro?',
    options: [
      { text: 'Não — a relação me limita', value: 1 },
      { text: 'Pouco — cada um cuida do seu', value: 2 },
      { text: 'Às vezes apoiamos, às vezes competimos', value: 3 },
      { text: 'Sim, nos incentivamos', value: 4 },
      { text: 'Somos parceiros de evolução', value: 5 }
    ]
  },
  {
    id: 'fogo5',
    element: 'fogo',
    elementName: 'Fogo',
    icon: '🔥',
    text: 'Quando vocês se olham nos olhos, o que você sente?',
    options: [
      { text: 'Desconforto ou vazio', value: 1 },
      { text: 'Indiferença — não sinto muito', value: 2 },
      { text: 'Carinho, mas sem intensidade', value: 3 },
      { text: 'Conexão e ternura', value: 4 },
      { text: 'Fogo — ainda há faísca', value: 5 }
    ]
  },

  // ============ AR (5 perguntas) ============
  {
    id: 'ar1',
    element: 'ar',
    elementName: 'Ar',
    icon: '💨',
    text: 'Quando vocês discordam, como costuma ser a conversa?',
    options: [
      { text: 'Vira briga — gritos, acusações, portas batendo', value: 1 },
      { text: 'Um se fecha e o outro ataca', value: 2 },
      { text: 'Tentamos conversar mas frequentemente descarrila', value: 3 },
      { text: 'Conseguimos discordar com respeito', value: 4 },
      { text: 'Discordamos e saímos mais conectados', value: 5 }
    ]
  },
  {
    id: 'ar2',
    element: 'ar',
    elementName: 'Ar',
    icon: '💨',
    text: 'Você se sente ouvida quando fala de algo importante?',
    options: [
      { text: 'Nunca — falo com a parede', value: 1 },
      { text: 'Raramente — preciso repetir várias vezes', value: 2 },
      { text: 'Às vezes sim, às vezes sou ignorada', value: 3 },
      { text: 'Na maioria das vezes me escuta', value: 4 },
      { text: 'Sempre — escuta ativa é nosso forte', value: 5 }
    ]
  },
  {
    id: 'ar3',
    element: 'ar',
    elementName: 'Ar',
    icon: '💨',
    text: 'Vocês conseguem expressar necessidades sem que vire cobrança ou crítica?',
    options: [
      { text: 'Não — toda necessidade vira briga', value: 1 },
      { text: 'Difícil — me sinto criticando ou sendo criticada', value: 2 },
      { text: 'Às vezes conseguimos, às vezes não', value: 3 },
      { text: 'Geralmente sim, com cuidado', value: 4 },
      { text: 'Sim — temos linguagem própria pra isso', value: 5 }
    ]
  },
  {
    id: 'ar4',
    element: 'ar',
    elementName: 'Ar',
    icon: '💨',
    text: 'Quando um dos dois "trava" durante uma conversa difícil, o que acontece?',
    options: [
      { text: 'O outro pressiona até explodir', value: 1 },
      { text: 'Fica um clima horrível de silêncio punitivo', value: 2 },
      { text: 'Tentamos dar espaço mas nem sempre funciona', value: 3 },
      { text: 'Damos espaço e retomamos depois', value: 4 },
      { text: 'Temos acordo: pausa e retorno com calma', value: 5 }
    ]
  },
  {
    id: 'ar5',
    element: 'ar',
    elementName: 'Ar',
    icon: '💨',
    text: 'Vocês conseguem pedir desculpas de verdade (não "desculpa, MAS...")?',
    options: [
      { text: 'Nunca — ninguém assume erro', value: 1 },
      { text: 'Raramente — sempre tem justificativa', value: 2 },
      { text: 'Às vezes, com dificuldade', value: 3 },
      { text: 'Sim, conseguimos reconhecer erros', value: 4 },
      { text: 'Pedimos desculpa e reparamos genuinamente', value: 5 }
    ]
  },

  // ============ ÉTER (5 perguntas) ============
  {
    id: 'eter1',
    element: 'eter',
    elementName: 'Éter',
    icon: '✨',
    text: 'Vocês têm uma visão compartilhada de futuro (onde morar, ter filhos, estilo de vida)?',
    options: [
      { text: 'Não — queremos coisas incompatíveis', value: 1 },
      { text: 'Nunca conversamos sobre isso', value: 2 },
      { text: 'Temos ideias vagas, mas nada concreto', value: 3 },
      { text: 'Temos visão alinhada em boa parte', value: 4 },
      { text: 'Visão clara e compartilhada — sonhamos juntos', value: 5 }
    ]
  },
  {
    id: 'eter2',
    element: 'eter',
    elementName: 'Éter',
    icon: '✨',
    text: 'A relação te ajuda a ser uma pessoa melhor?',
    options: [
      { text: 'Não — me sinto pior do que antes', value: 1 },
      { text: 'Pouco — estagnei ou regredi', value: 2 },
      { text: 'Em algumas áreas sim, em outras não', value: 3 },
      { text: 'Sim, tenho crescido com essa relação', value: 4 },
      { text: 'Muito — é o maior catalisador do meu crescimento', value: 5 }
    ]
  },
  {
    id: 'eter3',
    element: 'eter',
    elementName: 'Éter',
    icon: '✨',
    text: 'Vocês compartilham alguma dimensão espiritual, filosófica ou de valores profundos?',
    options: [
      { text: 'Não — temos valores conflitantes', value: 1 },
      { text: 'Nunca conversamos sobre isso', value: 2 },
      { text: 'Respeitamos as diferenças, mas não compartilhamos', value: 3 },
      { text: 'Temos valores em comum que nos conectam', value: 4 },
      { text: 'Profundamente alinhados — é nossa base', value: 5 }
    ]
  },
  {
    id: 'eter4',
    element: 'eter',
    elementName: 'Éter',
    icon: '✨',
    text: 'Qual é o propósito dessa relação na sua vida hoje?',
    options: [
      { text: 'Não sei mais — perdeu o sentido', value: 1 },
      { text: 'Conveniência ou medo de ficar só', value: 2 },
      { text: 'Companheirismo básico', value: 3 },
      { text: 'Parceria de vida com significado', value: 4 },
      { text: 'Missão compartilhada — construímos algo maior', value: 5 }
    ]
  },
  {
    id: 'eter5',
    element: 'eter',
    elementName: 'Éter',
    icon: '✨',
    text: 'Se você olhar 10 anos pra frente, consegue se ver nessa relação?',
    options: [
      { text: 'Não — não me vejo mais aqui', value: 1 },
      { text: 'Tenho muitas dúvidas', value: 2 },
      { text: 'Talvez, se muitas coisas mudarem', value: 3 },
      { text: 'Sim, consigo me ver', value: 4 },
      { text: 'Com certeza — quero envelhecer junto', value: 5 }
    ]
  }
];

// Mapeamento de elementos para nomes em português
export const elementNames: Record<Element, string> = {
  terra: 'Terra',
  agua: 'Água',
  fogo: 'Fogo',
  ar: 'Ar',
  eter: 'Éter'
};

// Cores dos elementos
export const elementColors: Record<Element, string> = {
  terra: '#8B7355',
  agua: '#4A6B8A',
  fogo: '#C75D3A',
  ar: '#9BA8AB',
  eter: '#6B5B7A'
};

// Ícones dos elementos
export const elementIcons: Record<Element, string> = {
  terra: '🌍',
  agua: '💧',
  fogo: '🔥',
  ar: '💨',
  eter: '✨'
};
