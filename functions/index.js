const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

// Configurações - usando defineString para variáveis de ambiente
const { defineString } = require('firebase-functions/params');
const geminiApiKey = defineString('GEMINI_API_KEY');
const supabaseUrl = defineString('SUPABASE_URL');
const supabaseAnonKey = defineString('SUPABASE_ANON_KEY');

// Inicializa Supabase - será inicializado dentro de cada função
let supabase;
let genAI;

function initializeClients() {
  if (!supabase) {
    supabase = createClient(
      supabaseUrl.value(),
      supabaseAnonKey.value()
    );
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(geminiApiKey.value());
  }
}

const elementsInfo = {
  terra: { name: 'Terra', icon: '🌍', meaning: 'Segurança e Estrutura' },
  agua: { name: 'Água', icon: '💧', meaning: 'Emoção e Intimidade' },
  ar: { name: 'Ar', icon: '🌬️', meaning: 'Comunicação' },
  fogo: { name: 'Fogo', icon: '🔥', meaning: 'Paixão e Desejo' },
  eter: { name: 'Éter', icon: '✨', meaning: 'Propósito Compartilhado' }
};

// API: Generate Planner
exports.generatePlanner = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Inicializa os clients
    initializeClients();

    const { lowestElement, scores, secondLowestElement, pattern } = req.body;

    if (!lowestElement || !scores) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const elementInfo = elementsInfo[lowestElement];
    const secondElementInfo = secondLowestElement ? elementsInfo[secondLowestElement] : null;

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plannerContent = response.text();

    return res.json({
      success: true,
      planner: plannerContent,
      element: lowestElement,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Erro ao gerar planner:', error);
    return res.status(500).json({
      error: 'Erro ao gerar planner',
      details: error.message
    });
  }
});

// API: Save Result
exports.saveResult = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Inicializa os clients
    initializeClients();

    const { userId, result, answers, userData } = req.body;

    if (!userId || !result) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        lowest_element: result.lowestElement,
        scores: result.scores,
        second_lowest_element: result.secondLowestElement,
        pattern: result.pattern,
        answers: answers,
        user_data: userData,
      });

    if (error) throw error;

    return res.json({ success: true, data });

  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
    return res.status(500).json({
      error: 'Erro ao salvar resultado',
      details: error.message
    });
  }
});

// API: Submit Quiz
exports.submitQuiz = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Inicializa os clients
    initializeClients();

    const { email, name, answers } = req.body;

    if (!email || !answers) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    // Salva no banco se necessário
    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert({
        email,
        name,
        answers,
        submitted_at: new Date().toISOString(),
      });

    if (error) throw error;

    return res.json({ success: true, data });

  } catch (error) {
    console.error('Erro ao submeter quiz:', error);
    return res.status(500).json({
      error: 'Erro ao submeter quiz',
      details: error.message
    });
  }
});
