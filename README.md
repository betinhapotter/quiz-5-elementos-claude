# Quiz dos 5 Elementos 🌍💧🌬️🔥✨

Quiz interativo para diagnóstico de relacionamentos baseado no Método dos 5 Elementos de Jaya Roberta.

## Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
- **State Management:** Zustand
- **Database:** Supabase
- **Auth:** Supabase Auth (Google OAuth)
- **IA:** Google Gemini
- **Deploy:** Vercel

## Features

- ✅ **Login com Google** via Supabase Auth
- ✅ Quiz de 10 perguntas (2 por elemento)
- ✅ Cálculo automático de scores
- ✅ Identificação do elemento desalinhado
- ✅ Detecção de padrões perigosos (combinações de elementos baixos)
- ✅ **Planner de 30 dias gerado por IA** (Google Gemini)
- ✅ **Salvamento de resultados** no banco de dados
- ✅ Design responsivo (mobile-first)
- ✅ Animações suaves

## Começando

### 1. Clone e instale

```bash
git clone <repo>
cd quiz-5-elementos
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-supabase

# Google Gemini
GEMINI_API_KEY=sua-chave-gemini

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Para obter as credenciais:**
- Supabase: [supabase.com/dashboard](https://supabase.com/dashboard) > Settings > API
- Gemini API: [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Execute localmente

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   └── submit-quiz/    # API para submissão
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── components/
│   ├── LandingScreen.tsx   # Tela inicial
│   ├── QuizScreen.tsx      # Tela do quiz
│   ├── CalculatingScreen.tsx # Tela de cálculo
│   ├── EmailCaptureScreen.tsx # Captura de email
│   └── ResultScreen.tsx    # Resultado final
├── data/
│   └── questions.ts        # As 10 perguntas
├── hooks/
│   └── useQuizStore.ts     # Estado global (Zustand)
├── lib/
│   └── quiz-logic.ts       # Lógica de cálculo
└── types/
    └── quiz.ts             # Tipos TypeScript
```

## Lógica de Pontuação

- Cada elemento tem 2 perguntas
- Cada resposta vale 1-4 pontos
- Score por elemento: mínimo 2, máximo 8
- O elemento com MENOR pontuação = desalinhado

### Desastres Naturais

| Elemento | Desastre | Significado |
|----------|----------|-------------|
| Terra | Terremoto | Base instável, falta confiança |
| Água | Tsunami | Desconexão emocional |
| Ar | Tornado | Comunicação travada |
| Fogo | Incêndio | Paixão apagada |
| Éter | Vazio | Sem propósito compartilhado |

## Próximos Passos (Roadmap)

### Fase 2: Monetização
- [ ] Integração com Hotmart para checkout
- [ ] Geração de planner de 30 dias com IA (OpenAI)
- [ ] Área de membros para acesso ao planner

### Fase 3: Automação
- [ ] Sequência de 5 emails de nutrição
- [ ] Dashboard de métricas
- [ ] A/B testing de headlines

## Deploy

### Vercel (recomendado)

**⚠️ IMPORTANTE:** Antes de fazer o deploy, leia o [Guia de Deploy](DEPLOY.md) completo.

Passos rápidos:
1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente (veja [DEPLOY.md](DEPLOY.md))
3. Configure as URLs de callback no Supabase
4. Configure o Google OAuth
5. Deploy automático a cada push

**Variáveis de ambiente necessárias:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

Veja o [Guia de Deploy](DEPLOY.md) para instruções detalhadas.

## Licença

Propriedade de Jaya Roberta. Todos os direitos reservados.

---

Desenvolvido com 🔥 para transformar relacionamentos.
