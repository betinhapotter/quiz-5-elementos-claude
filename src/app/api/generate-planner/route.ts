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

    const elementInfo = elementsInfo[lowestElement as keyof typeof elementsInfo];
    const secondElementInfo = secondLowestElement
      ? elementsInfo[secondLowestElement as keyof typeof elementsInfo]
      : null;

    const prompt = `
Você é Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana,
com 8 anos de experiência transformando casais. Você desenvolveu o Método dos 5 Elementos.

O usuário completou o Quiz dos 5 Elementos e estes são os resultados:

SCORES (de 2 a 8 cada):
- Terra: ${scores.terra}/8
- Água: ${scores.agua}/8
- Ar: ${scores.ar}/8
- Fogo: ${scores.fogo}/8
- Éter: ${scores.eter}/8

ELEMENTO MAIS DESALINHADO: ${elementInfo.name.toUpperCase()} (${elementInfo.icon})
- Score: ${scores[lowestElement]}/8
- Significa: ${elementInfo.meaning}

${secondElementInfo ? `
SEGUNDO ELEMENTO EM RISCO: ${secondElementInfo.name.toUpperCase()} (${secondElementInfo.icon})
- Score: ${scores[secondLowestElement]}/8
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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
