import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Element, ElementScores, elementsInfo } from '@/types/quiz';

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GeneratePlannerBody {
  lowestElement: Element;
  scores: ElementScores;
  secondLowestElement?: Element;
  pattern?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePlannerBody = await request.json();
    const { lowestElement, scores, secondLowestElement, pattern } = body;

    // Validação
    if (!lowestElement || !scores) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const elementInfo = elementsInfo[lowestElement];
    const secondElementInfo = secondLowestElement 
      ? elementsInfo[secondLowestElement] 
      : null;

    // Monta o prompt para o Gemini
    const prompt = `
Você é Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana, 
com 8 anos de experiência transformando casais. Você desenvolveu o Método dos 5 Elementos.

O usuário completou o Quiz dos 5 Elementos e estes são os resultados:

SCORES (de 2 a 8 cada):
- Terra: ${scores.terra}/8 (${scores.terra <= 4 ? 'BAIXO' : scores.terra <= 6 ? 'MÉDIO' : 'BOM'})
- Água: ${scores.agua}/8 (${scores.agua <= 4 ? 'BAIXO' : scores.agua <= 6 ? 'MÉDIO' : 'BOM'})
- Ar: ${scores.ar}/8 (${scores.ar <= 4 ? 'BAIXO' : scores.ar <= 6 ? 'MÉDIO' : 'BOM'})
- Fogo: ${scores.fogo}/8 (${scores.fogo <= 4 ? 'BAIXO' : scores.fogo <= 6 ? 'MÉDIO' : 'BOM'})
- Éter: ${scores.eter}/8 (${scores.eter <= 4 ? 'BAIXO' : scores.eter <= 6 ? 'MÉDIO' : 'BOM'})

ELEMENTO MAIS DESALINHADO: ${elementInfo.name.toUpperCase()} (${elementInfo.icon})
- Score: ${scores[lowestElement]}/8
- Significa: ${elementInfo.meaning}

${secondElementInfo ? `
SEGUNDO ELEMENTO EM RISCO: ${secondElementInfo.name.toUpperCase()} (${secondElementInfo.icon})
- Score: ${scores[secondLowestElement!]}/8
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

    // Chama o Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plannerContent = response.text();

    return NextResponse.json({
      success: true,
      planner: plannerContent,
      element: lowestElement,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Erro ao gerar planner:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar planner. Tente novamente.' },
      { status: 500 }
    );
  }
}
