# PRD - Quiz dos 5 Elementos
## Product Requirements Document

---

## 1. VISÃO GERAL DO PRODUTO

**Nome:** Quiz dos 5 Elementos  
**Versão:** 1.0  
**Autora:** Jaya Roberta  
**Data:** Dezembro 2025

---

## 2. QUAL É O PROBLEMA QUE O APP RESOLVE?

### O Problema Central
**50% dos casamentos terminam em divórcio no Brasil.** Mas a maioria desses casais não termina por falta de amor — termina por **falta de diagnóstico**.

Casais em crise enfrentam um paradoxo devastador: **"Conversamos, mas ninguém se ouve."** Eles falam, discutem, tentam — mas parecem falar línguas diferentes. Isso acontece porque não sabem **qual dimensão do relacionamento está desalinhada**.

### Por que as soluções atuais falham?

| Solução Atual | Problema |
|---------------|----------|
| Terapia de casal tradicional | Cara (R$ 300-500/sessão), longa (meses), baixa adesão |
| Apps de relacionamento | Superficiais, foco em "dicas", não em diagnóstico |
| Conteúdo de autoajuda | Genérico, não personalizado, sem acompanhamento |
| Ignorar o problema | 67% dos casais esperam 6+ anos para buscar ajuda (quando já é tarde) |

### A Oportunidade
Criar uma **ferramenta de diagnóstico rápida, acessível e personalizada** que identifica exatamente onde o relacionamento está travado — e oferece um plano de ação concreto gerado por IA.

---

## 3. QUEM É O PÚBLICO-ALVO PRINCIPAL?

### Persona Primária: "Clara e Rafael"

**Demografia:**
- Idade: 30-50 anos
- Relacionamento: 3+ anos juntos (casados ou união estável)
- Classe: Média/média-alta
- Localização: Brasil (urbano)
- Digital: Confortáveis com tecnologia, usam smartphone diariamente

**Psicografia:**
- Sentem que o relacionamento "esfriou" mas não sabem por quê
- Já tentaram conversar, mas sempre termina em briga ou silêncio
- Têm vergonha de procurar terapia ou acham caro demais
- Buscam soluções práticas, não teoria
- Valorizam privacidade (não querem expor problemas)

**Dores Específicas:**
- "A gente conversa, mas parece que ninguém ouve"
- "Viramos sócios, não casal"
- "Não sei mais o que ele/ela quer"
- "Tenho medo de falar o que sinto porque vai virar briga"
- "Será que é só comigo ou todo relacionamento é assim?"

**Gatilhos de Busca:**
- Briga recente que "passou dos limites"
- Aniversário de casamento que não foi celebrado
- Comparação com casais que parecem felizes
- Descoberta de mensagens/comportamentos suspeitos
- Filhos percebendo tensão entre os pais

---

## 4. O QUE O USUÁRIO PRECISA CONSEGUIR FAZER COM O APP?

### Funcionalidades Principais (v1)

#### 4.1 Fazer Login Seguro
- Login via Google (OAuth)
- Dados protegidos e privados
- Sessão persistente

#### 4.2 Responder o Quiz de Diagnóstico
- 10 perguntas sobre o relacionamento (2 por elemento)
- Interface fluida, uma pergunta por tela
- Progresso visual
- ~3 minutos para completar

#### 4.3 Receber Diagnóstico Personalizado
- Identificação do elemento mais desalinhado
- Explicação clara do que isso significa
- Visualização dos scores de todos os 5 elementos
- Detecção de padrões perigosos (combinações de elementos baixos)

#### 4.4 Receber Planner de 30 Dias Gerado por IA
- Plano personalizado baseado nas respostas específicas
- 30 dias de exercícios práticos
- Gerado em tempo real pelo Google Gemini
- Focado no elemento identificado como desalinhado

#### 4.5 Salvar e Acessar Histórico
- Resultados salvos no banco de dados
- Possibilidade de refazer o quiz e comparar evolução
- Acesso ao planner a qualquer momento

### User Flow Principal

```
[Landing Page] 
    → [Login com Google]
    → [Quiz 10 perguntas]
    → [Tela de cálculo/loading]
    → [Resultado: Elemento desalinhado]
    → [Gerar Planner com IA]
    → [Visualizar/Baixar Planner]
    → [Dashboard com histórico]
```

---

## 5. EXISTE ALGUMA REFERÊNCIA DE APP PARECIDO?

### Análise Competitiva

| App/Serviço | O que faz | Limitação | Nosso diferencial |
|-------------|-----------|-----------|-------------------|
| **Gottman Card Decks** | Cards com perguntas para casais | Não tem diagnóstico, só perguntas soltas | Diagnóstico estruturado + plano de ação |
| **Relish** | App de relacionamento com coaching | Caro ($150/mês), em inglês, genérico | Acessível, português BR, metodologia própria |
| **Lasting** | Quiz + conteúdo para casais | Superficial, sem IA, conteúdo engessado | IA gera plano personalizado em tempo real |
| **Terapia Online** | Sessões com terapeuta | R$300+/sessão, agenda, exposição | Privado, imediato, fração do custo |

### Nosso Oceano Azul
Não existe no mercado brasileiro um app que:
1. Use metodologia proprietária (5 Elementos)
2. Faça diagnóstico estruturado em 3 minutos
3. Gere plano de ação personalizado com IA
4. Seja acessível (gratuito para diagnóstico)
5. Mantenha privacidade total

---

## 6. EM QUAL PLATAFORMA O APP SERÁ LANÇADO PRIMEIRO?

### Plataforma: **Web (PWA)**

**Justificativa:**
- **Alcance imediato:** Funciona em qualquer dispositivo com navegador
- **Sem fricção:** Não precisa baixar app (reduz barreira de entrada)
- **Privacidade:** Usuário pode acessar sem deixar "app de relacionamento" no celular
- **Velocidade de desenvolvimento:** Deploy instantâneo via Vercel
- **SEO:** Pode capturar tráfego orgânico do Google

**Responsividade:**
- Mobile-first (70% do tráfego esperado vem de Instagram)
- Funciona perfeitamente em desktop
- PWA instalável para quem quiser

**URL de Produção:** `https://quiz.jayaroberta.com.br`

---

## 7. FUNCIONALIDADES OBRIGATÓRIAS NA V1

### Must Have (MVP)

| # | Funcionalidade | Descrição | Status |
|---|----------------|-----------|--------|
| 1 | Login com Google | Autenticação OAuth via Supabase | 🔧 Implementar |
| 2 | Quiz dos 5 Elementos | 10 perguntas, cálculo de scores | ✅ Pronto |
| 3 | Diagnóstico visual | Resultado com elemento desalinhado + gráfico | ✅ Pronto |
| 4 | Geração de Planner com IA | Google Gemini gera plano de 30 dias | 🔧 Implementar |
| 5 | Persistência de dados | Salvar resultados no Supabase | 🔧 Implementar |
| 6 | Histórico do usuário | Ver quizzes anteriores | 🔧 Implementar |

### Nice to Have (v1.1+)

| # | Funcionalidade | Descrição |
|---|----------------|-----------|
| 7 | Quiz para o casal | Ambos respondem, cruza dados |
| 8 | Notificações | Lembretes diários do planner |
| 9 | Compartilhamento | Enviar resultado para parceiro(a) |
| 10 | Modo escuro | Preferência visual |

---

## 8. ARQUITETURA TÉCNICA

### Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Animações | Framer Motion |
| State Management | Zustand |
| Autenticação | Supabase Auth (Google OAuth) |
| Banco de Dados | Supabase (PostgreSQL) |
| IA | Google Gemini API |
| Deploy | Vercel |
| Domínio | quiz.jayaroberta.com.br |

### Modelo de Dados

```sql
-- users (gerenciado pelo Supabase Auth)
id, email, name, avatar_url, created_at

-- quiz_results
id
user_id (FK → users)
terra_score (int)
agua_score (int)
ar_score (int)
fogo_score (int)
eter_score (int)
lowest_element (enum)
raw_answers (jsonb)
created_at

-- planners
id
user_id (FK → users)
quiz_result_id (FK → quiz_results)
element_focus (enum)
content (text) -- planner gerado pela IA
created_at
```

### Fluxo de Integração com IA

```
[Usuário completa quiz]
    → [Frontend calcula scores]
    → [Envia para API: /api/generate-planner]
    → [API monta prompt com contexto do usuário]
    → [Chama Google Gemini]
    → [Recebe planner personalizado]
    → [Salva no Supabase]
    → [Retorna para usuário]
```

---

## 9. MÉTRICAS DE SUCESSO

### KPIs Principais

| Métrica | Meta v1 | Como medir |
|---------|---------|------------|
| Quiz completados | 500/mês | Supabase analytics |
| Taxa de conclusão do quiz | >70% | Eventos de início vs fim |
| Geração de planners | >50% dos que completam | Contagem no banco |
| Retenção D7 | >30% | Usuários que voltam em 7 dias |
| NPS | >50 | Pesquisa pós-quiz |

---

## 10. CRONOGRAMA DE IMPLEMENTAÇÃO

| Fase | Entrega | Prazo |
|------|---------|-------|
| 1 | PRD completo | ✅ Concluído |
| 2 | Setup Supabase + Auth | 1 dia |
| 3 | Integração Google Gemini | 1 dia |
| 4 | Persistência de dados | 1 dia |
| 5 | Testes e ajustes | 1 dia |
| 6 | Vídeo demonstração | 1 dia |
| 7 | Submissão do desafio | - |

---

## 11. SOBRE A CRIADORA

**Jaya Roberta** é Terapeuta Integrativa especializada em Relacionamentos e Sexualidade Humana, com 8 anos de experiência transformando casais.

Formação:
- Pós-graduação em Sexualidade Humana
- 8 anos como terapeuta tântrica
- Formação em Análise Corporal
- 19 anos como Analista de TI (Banco do Brasil)

O **Método dos 5 Elementos** foi desenvolvido a partir de sua experiência clínica, integrando:
- 🔬 **Ciência:** Pesquisas de relacionamento
- 🧘 **Corpo:** Práticas somáticas e Gestalt
- 🔥 **Sagrado:** Tantra e propósito transcendente

---

## 12. LINKS E RECURSOS

- **Aplicação:** https://quiz.jayaroberta.com.br
- **Repositório:** [GitHub - quiz-5-elementos]
- **Instagram:** @jayaroberta

---

*Documento criado em Dezembro 2025*
*Versão 1.0*
