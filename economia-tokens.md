# Guia de Economia de Tokens - Modelo por Tarefa

> **Princípio:** Usar o modelo MÍNIMO que entrega QUALIDADE.
> Economizar sem perder performance.

---

## Resumo Executivo

```
HAIKU  → "Buscar, pegar, formatar, listar"
         Não precisa pensar, só executar

SONNET → "Criar, escrever, analisar, codificar"
         Precisa criatividade ou lógica

OPUS   → "Decidir, arquitetar, estrategizar"
         Consequências grandes, múltiplas variáveis
```

---

## Preços (por milhão de tokens)

| Modelo | Input | Output | vs Haiku |
|--------|-------|--------|----------|
| **Haiku** | $0.25 | $1.25 | 1x |
| **Sonnet** | $3 | $15 | 12x mais caro |
| **Opus** | $15 | $75 | 60x mais caro |

---

## HAIKU - Coleta & Execução (70% das tarefas)

### Coleta de Dados

| Tarefa | Por que Haiku basta |
|--------|---------------------|
| WebSearch - buscar termo | Só executa busca, não analisa |
| WebFetch - pegar página | Só baixa conteúdo |
| YouTube - listar vídeos canal | API call simples |
| YouTube - pegar transcrição | Só extrai texto |
| YouTube - métricas (views, likes) | Números, sem análise |
| Instagram - listar posts | API call |
| Supabase - SELECT simples | Query direta |
| Glob/Grep - buscar arquivos | Pattern matching |
| Read - ler arquivo | Sem processamento |
| Git status/log/diff | Comandos diretos |
| Listar tags/listas ActiveCampaign | API call |
| Pegar template existente | Só copiar |
| Checar se link funciona | HTTP request |
| Contar palavras/caracteres | Cálculo simples |
| Converter JSON → CSV | Transformação mecânica |
| Extrair texto de imagem (OCR) | Processamento padrão |

### Formatação & Organização

| Tarefa | Por que Haiku basta |
|--------|---------------------|
| Formatar markdown | Regras fixas |
| Preencher template com dados | Substituição |
| Organizar lista alfabética | Sort |
| Limpar texto (remover espaços) | Regex |
| Gerar HTML de template pronto | Montagem |
| Criar CSV de dados | Estruturação simples |
| Numerar itens | Mecânico |
| Adicionar timestamps | Formatação |
| Traduzir frase curta (<50 palavras) | Tradução direta |
| Marcar checklist items | Atualizar status |

### Análise Leve

| Tarefa | Por que Haiku basta |
|--------|---------------------|
| Resumir 1 parágrafo | Compressão simples |
| Identificar idioma | Detecção básica |
| Extrair emails de texto | Pattern matching |
| Categorizar item (1 categoria) | Classificação simples |
| Verificar se texto tem keyword | Busca |
| Calcular métricas básicas | Matemática |
| Comparar 2 números | Lógica simples |

---

## SONNET - Criação & Análise (25% das tarefas)

### Escrita Simples

| Tarefa | Por que precisa Sonnet |
|--------|------------------------|
| Escrever 1 tweet/post curto | Precisa criatividade |
| Caption de Instagram | Tom de voz importa |
| Responder comentário | Contexto social |
| Email transacional (confirmação) | Clareza + tom |
| Descrição curta de produto | Persuasão básica |
| Alt text de imagem | Descrição útil |
| Commit message descritiva | Entender mudanças |
| Renomear variáveis (refactor) | Semântica |
| Traduzir texto médio (50-500 palavras) | Manter nuances |

### Escrita Criativa

| Tarefa | Por que precisa Sonnet |
|--------|------------------------|
| Subject line de email | Alta competição, precisa ser bom |
| Headline de anúncio | CTR depende disso |
| Hook de vídeo (primeiros 3s) | Retenção crítica |
| CTA button text | Conversão |
| Bullets de benefícios | Persuasão |
| Bio de perfil | Posicionamento |
| Título de vídeo YouTube | SEO + curiosidade |
| Meta description | CTR no Google |
| Primeiro parágrafo de artigo | Hook do leitor |
| Push notification | Abertura |

### Email & Copy

| Tarefa | Por que precisa Sonnet |
|--------|------------------------|
| Email de nurture | Relacionamento |
| Email de venda | Persuasão |
| Sequência SOAP opera | Storytelling |
| Welcome sequence | Primeira impressão |
| Email de carrinho abandonado | Recuperação |
| Copy de landing page | Conversão |
| Descrição de oferta | Valor percebido |
| FAQ copywriting | Objeções |
| Testimonial rewrite | Credibilidade |
| Garantia copy | Reduzir risco |

### Conteúdo Longo

| Tarefa | Por que precisa Sonnet |
|--------|------------------------|
| Roteiro de Reels (15-60s) | Estrutura + hook |
| Roteiro de vídeo YouTube | Retenção |
| Script de VSL | Persuasão longa |
| Artigo de blog (500-2000 palavras) | SEO + valor |
| Newsletter semanal | Engajamento |
| Carrossel Instagram (slides) | Fluxo narrativo |
| Thread Twitter/X | Progressão lógica |
| Webinar outline | Estrutura didática |
| Podcast outline | Conversa natural |
| Ebook capítulo | Profundidade |

### Código

| Tarefa | Por que precisa Sonnet |
|--------|------------------------|
| Componente React novo | Lógica + padrões |
| Hook customizado | Abstração |
| Função com lógica | Algoritmo |
| API endpoint | Request/response |
| Query SQL média | Joins, subqueries |
| Migration de banco | Schema changes |
| Integração de API | Error handling |
| Testes unitários | Edge cases |
| Refactor de código | Manter comportamento |
| Debug de erro | Investigação |
| CSS/Tailwind complexo | Layout responsivo |
| Regex complexa | Pattern matching avançado |

### Análise Média

| Tarefa | Por que precisa Sonnet |
|--------|------------------------|
| Analisar métricas de campanha | Insights |
| Comparar 2-3 concorrentes | Padrões |
| Identificar gaps de conteúdo | Oportunidades |
| Review de código | Qualidade |
| Analisar feedback de clientes | Temas |
| Sugerir melhorias | Recomendações |
| Criar persona básica | Avatar |
| Mapear jornada simples | Touchpoints |
| Analisar transcrição (1 vídeo) | Extração de valor |
| Relatório semanal | Narrativa de dados |

---

## OPUS - Estratégia & Decisão (5% das tarefas)

| Tarefa | Por que precisa Opus |
|--------|----------------------|
| Big Idea de campanha | Diferenciação única |
| Mecanismo único | Posicionamento |
| Estratégia de lançamento | Múltiplas variáveis |
| Plano de marketing trimestral | Visão sistêmica |
| Análise de cohort completa | Padrões profundos |
| Pricing strategy | Trade-offs complexos |
| Arquitetura de sistema | Decisões irreversíveis |
| PRD completo do zero | Visão de produto |
| Análise de pivô | Risco alto |
| Negociação complexa | Múltiplos interesses |
| Gestão de crise | Decisões rápidas críticas |
| Síntese de personalidade (MMOS) | Raciocínio multi-camada |
| Debug impossível | Investigação profunda |
| Código de segurança/auth | Zero margem de erro |
| Decisão de deletar dados prod | Irreversível |
| Rebranding completo | Identidade |
| Due diligence | Análise exaustiva |
| Definir OKRs anuais | Direção estratégica |
| Resolver conflito de requisitos | Trade-offs |
| Plano de escala | Timing + recursos |

---

## Distribuição por Squad

| Squad | Haiku | Sonnet | Opus |
|-------|-------|--------|------|
| **Marketing** | 60% | 35% | 5% |
| **Copy** | 20% | 70% | 10% |
| **Ads/Traffic** | 50% | 45% | 5% |
| **Data/Analytics** | 70% | 25% | 5% |
| **Content** | 30% | 65% | 5% |
| **MMOS** | 40% | 40% | 20% |
| **Dev/Code** | 30% | 60% | 10% |
| **Design** | 50% | 45% | 5% |
| **Estratégia** | 20% | 40% | 40% |

---

## NUNCA usar Haiku para:

```
❌ Escrever copy (qualidade cai muito)
❌ Código com lógica (bugs)
❌ Análise que precisa de insight
❌ Qualquer coisa que vai pro cliente
❌ Decisões que afetam dinheiro
❌ Conteúdo que representa a marca
```

---

## Economia Estimada

| Cenário | Só Sonnet | Com Haiku | Economia |
|---------|-----------|-----------|----------|
| Sessão espião (10 buscas) | $1.10 | $0.10 | 91% |
| Dia de trabalho normal | $8-15 | $3-6 | 60% |
| Mês intenso | $200-400 | $80-150 | 60% |

---

**Versão:** 1.0
**Criado:** 01/02/2026
**Regra:** Qualidade > Economia. Nunca sacrificar output por tokens.
