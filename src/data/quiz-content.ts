import { ElementEn } from '../types/elements';

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
    },
    relacao_morna: {
        title: '🌡️ Relação Morna',
        description: 'Todos os elementos estão na faixa média. Seu relacionamento não está em crise, mas também não está vibrante. É como uma sopa morna: não queima, mas também não aquece o coração. Este é o momento perfeito para "aquecer" o relacionamento antes que esfrie de vez.'
    }
};

export const whyNotHeardLines: Record<string, string> = {
    terra: 'Quando a Terra está desalinhada, vocês não têm base sólida para confiar. Sem essa fundação, cada conversa vira uma ameaça à estabilidade. Vocês falam, mas não há segurança para realmente ouvir — porque ouvir significa se abrir, e se abrir significa vulnerabilidade. E vulnerabilidade sem base é perigosa.',
    agua: 'Quando a Água está desalinhada, a conexão emocional está bloqueada. Vocês podem estar falando, mas não estão se sentindo. As palavras saem, mas não há acolhimento para recebê-las. Sem Água, não há espaço seguro para vulnerabilidade — e sem vulnerabilidade, não há verdadeira escuta.',
    ar: 'Quando o Ar está desalinhada, a comunicação está travada. Vocês falam, mas não se sentem ouvidos porque as palavras não encontram espaço. Ou viram briga, ou são ignoradas, ou se perdem no vazio. Sem Ar, não há diálogo — só monólogos paralelos.',
    fogo: 'Quando o Fogo está desalinhado, a paixão e admiração se apagaram. Vocês podem estar conversando, mas não há calor, não há interesse genuíno. As palavras saem frias, sem energia. Sem Fogo, não há combustível para manter a atenção e o desejo de realmente ouvir.',
    eter: 'Quando o Éter está desalinhado, falta propósito e direção. Vocês falam, mas não há sentido maior que conecte as conversas. Tudo vira funcional, logístico, vazio de significado. Sem Éter, não há "por quê" para realmente se importar com o que o outro diz.'
};

export const firstStepsMap: Record<string, string[]> = {
    'earth-low': [
        'Criem um micro-ritual diário de 5 minutos (café da manhã, boa noite, check-in)',
        'Façam uma promessa pequena por semana e cumpram — sem exceção',
        'Definam um "porto seguro" físico ou emocional onde vocês podem se apoiar',
        'Conversem sobre o que cada um precisa para se sentir seguro na relação'
    ],
    'earth-high': [
        'Pratiquem soltar controle: um dia sem checar o celular do outro',
        'Criem espaço individual: cada um faz algo só seu por semana',
        'Revisem rituais que viraram prisão — quais podem ser flexibilizados?',
        'Pratiquem lidar com imprevistos sem ansiedade'
    ],
    'water-low': [
        'Compartilhem uma vulnerabilidade por dia (pode ser pequena)',
        'Criem um espaço seguro para chorar ou mostrar fragilidade',
        'Pratiquem escuta ativa: um fala, o outro só escuta (sem resolver)',
        'Conversem sobre medos e inseguranças do passado'
    ],
    'water-high': [
        'Pratiquem contenção: quando sentir que vai transbordar, diga "preciso de 20 minutos"',
        'Criem espaço individual: cada um tem uma atividade só sua',
        'Estabeleçam limites saudáveis para intensidade emocional',
        'Pratiquem respirar antes de reagir emocionalmente'
    ],
    'air-low': [
        'Pratiquem 10 minutos de conversa com regras: um fala, o outro só escuta',
        'Evitem interromper — deixem o outro terminar de falar',
        'Pratiquem fazer perguntas ao invés de dar respostas',
        'Criem um "safe word" para pausar quando a conversa descarrila'
    ],
    'air-high': [
        'Pratiquem 20 minutos de silêncio juntos (sem celular, sem TV)',
        'Limitam discussões a 30 minutos — depois pausa obrigatória',
        'Pratiquem escutar sem analisar ou racionalizar',
        'Foquem em viver a relação ao invés de falar sobre ela'
    ],
    'fire-low': [
        'Façam uma coisa diferente juntos por dia (pode ser pequena)',
        'Pratiquem admiração: digam uma coisa que admiram no outro por dia',
        'Criem surpresas pequenas e frequentes',
        'Pratiquem olhar nos olhos por 2 minutos sem falar'
    ],
    'fire-high': [
        'Pratiquem admiração sem competição — digam o que admiram sem esperar reciprocidade',
        'Criem espaço para paixão sem intensidade destrutiva',
        'Pratiquem canalizar energia em atividades criativas juntos',
        'Estabeleçam limites para brigas explosivas'
    ],
    'ether-low': [
        'Conversem 15 minutos sobre futuro por dia (não problemas, mas sonhos)',
        'Definam uma visão compartilhada de 5 anos',
        'Identifiquem valores profundos que vocês compartilham',
        'Criem um projeto conjunto (pode ser pequeno)'
    ],
    'ether-high': [
        'Façam algo mundano juntos com presença total (lavar louça, compras)',
        'Pratiquem estar no presente ao invés de idealizar o futuro',
        'Conectem espiritualidade com realidade prática',
        'Celebrem imperfeições ao invés de buscar perfeição'
    ]
};
