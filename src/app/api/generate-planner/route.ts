import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const elementsInfo = {
  terra: { name: 'Terra', icon: '🌍', meaning: 'Segurança e Estrutura' },
  agua: { name: 'Água', icon: '💧', meaning: 'Emoção e Intimidade' },
  ar: { name: 'Ar', icon: '🌬️', meaning: 'Comunicação' },
  fogo: { name: 'Fogo', icon: '🔥', meaning: 'Paixão e Desejo' },
  eter: { name: 'Éter', icon: '✨', meaning: 'Propósito Compartilhado' }
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY não configurada');
      return NextResponse.json(
        { error: 'Serviço de IA não configurado' },
        { status: 500 }
      );
    }

    const { lowestElement, scores, secondLowestElement, pattern } = await request.json();

    if (!lowestElement || !scores) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Verifica se todos estão equilibrados
    // Type assertion explícita para garantir que scores é um objeto com números
    // NOTA: Usamos scoresTyped e array manual para evitar type errors com Object.values
    type ScoresType = { terra: number; agua: number; ar: number; fogo: number; eter: number };
    const scoresTyped: ScoresType = scores as ScoresType;
    
    // Cria array tipado manualmente para evitar problemas de type inference
    const allScores: number[] = [
      scoresTyped.terra,
      scoresTyped.agua,
      scoresTyped.ar,
      scoresTyped.fogo,
      scoresTyped.eter
    ];
    
    const minScore: number = Math.min(...allScores);
    const maxScore: number = Math.max(...allScores);
    const scoreDifference: number = maxScore - minScore;
    const isAllBalanced: boolean = minScore >= 18 && scoreDifference <= 3; // THRESHOLDS.BALANCED_HIGH = 18
    const isPerfectBalance: boolean = minScore === 25 && maxScore === 25;

    const elementInfo = elementsInfo[lowestElement as keyof typeof elementsInfo];
    const secondElementInfo = secondLowestElement
      ? elementsInfo[secondLowestElement as keyof typeof elementsInfo]
      : null;

    const prompt = isAllBalanced ? `
Você é Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana,
com 8 anos de experiência transformando casais. Você desenvolveu o Método dos 5 Elementos.

O usuário completou o Quiz dos 5 Elementos e estes são os resultados:

SCORES (de 5 a 25 cada - 5 perguntas por elemento, 1-5 pontos cada):
- Terra: ${scoresTyped.terra}/25
- Água: ${scoresTyped.agua}/25
- Ar: ${scoresTyped.ar}/25
- Fogo: ${scoresTyped.fogo}/25
- Éter: ${scoresTyped.eter}/25

🎉 SITUAÇÃO ESPECIAL: TODOS OS ELEMENTOS ESTÃO EQUILIBRADOS!
${isPerfectBalance ? 'Todos os elementos estão com score máximo (25/25) - Equilíbrio Perfeito!' : 'Todos os elementos estão em equilíbrio harmonioso.'}

CRIE UM PLANNER DE 30 DIAS DE MANUTENÇÃO para este casal, seguindo estas regras:

1. FOCO: MANUTENÇÃO do equilíbrio perfeito dos 5 Elementos
2. Cada dia deve ter 1 EXERCÍCIO PRÁTICO de 5-15 minutos
3. Progressão:
   - Semana 1: Exercícios de CONSOLIDAÇÃO dos rituais existentes
   - Semana 2: Exercícios de APROFUNDAMENTO da conexão
   - Semana 3: Exercícios de CRESCIMENTO conjunto
   - Semana 4: Exercícios de CELEBRAÇÃO e renovação
4. Tom: POSITIVO, encorajador, celebrativo, mas prático
5. Cada exercício deve ter:
   - Nome criativo
   - Duração (5-15 min)
   - Por que funciona (1 frase)
   - Passo a passo claro
6. Distribua os exercícios entre os 5 elementos de forma equilibrada

FORMATO DE RESPOSTA (use EXATAMENTE esta estrutura):

# PLANNER DE 30 DIAS - MANUTENÇÃO DO EQUILÍBRIO

## Semana 1: Consolidando Rituais
### Dia 1
**[Nome do Exercício]** (X minutos)
*Por que funciona:* [explicação curta]
- Passo 1
- Passo 2
- Passo 3

[Continue para os dias 2-7]

## Semana 2: Aprofundando a Conexão
[Dias 8-14]

## Semana 3: Crescimento Conjunto
[Dias 15-21]

## Semana 4: Celebração e Renovação
[Dias 22-30]

## Mensagem Final
[Uma mensagem de encorajamento e celebração de 2-3 frases]
` : `
Você é Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana,
com 8 anos de experiência transformando casais. Você desenvolveu o Método dos 5 Elementos.

O usuário completou o Quiz dos 5 Elementos e estes são os resultados:

SCORES (de 5 a 25 cada - 5 perguntas por elemento, 1-5 pontos cada):
- Terra: ${scoresTyped.terra}/25
- Água: ${scoresTyped.agua}/25
- Ar: ${scoresTyped.ar}/25
- Fogo: ${scoresTyped.fogo}/25
- Éter: ${scoresTyped.eter}/25

ELEMENTO MAIS DESALINHADO: ${elementInfo.name.toUpperCase()} (${elementInfo.icon})
- Score: ${scoresTyped[lowestElement as keyof typeof scoresTyped]}/25
- Significa: ${elementInfo.meaning}

${secondElementInfo ? `
SEGUNDO ELEMENTO EM RISCO: ${secondElementInfo.name.toUpperCase()} (${secondElementInfo.icon})
- Score: ${scoresTyped[secondLowestElement as keyof typeof scoresTyped]}/25
` : ''}

${pattern ? `PADRÃO IDENTIFICADO: ${pattern}` : ''}

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plannerContent = response.text();

    return NextResponse.json({
      success: true,
      planner: plannerContent,
      element: lowestElement,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao gerar planner:', error);
    return NextResponse.json(
      {
        error: 'Erro ao gerar planner',
        details: error.message
      },
      { status: 500 }
    );
  }
}
