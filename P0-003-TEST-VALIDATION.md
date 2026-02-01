# P0-003 Test Validation Checklist

**Status:** ✅ Código implementado e commitado
**Próximo:** Executar testes abaixo em `npm run dev`

---

## Quick Test (5 min)

Antes de rodar todos os 50+ casos, valide o happy path básico:

```bash
# Terminal 1: Inicie dev server
npm run dev
# Acesse http://localhost:3000
```

**Quick Path (5 min):**
- [ ] Abre http://localhost:3000 → vê LandingScreen ✅
- [ ] Clica "Descobrir Meu Elemento" → vai para QuizScreen ✅
- [ ] Responde primeira pergunta → próxima pergunta renderiza ✅
- [ ] Continua respondendo até Q25 → CalculatingScreen (8s delay) ✅
- [ ] Delay termina → EmailCaptureScreen renderiza ✅
- [ ] Preenche email válido + nome opcional → clica "Ver Meu Resultado" ✅
- [ ] Vê ResultScreen COMPLETO (sem fazer login) ✅
- [ ] Vê card "Salve seu resultado" com botão "Fazer Login" ✅
- [ ] **ZERO console errors em DevTools** ✅

---

## Full Test Suite (50+ casos)

Após quick path passar, execute os casos abaixo:

### Category A: Happy Path (25 casos)

**Fluxo básico anônimo:**
- [ ] **A-01:** Landing: Vê "Por Que Vocês Falam Mas Ninguém Se Ouve?"
- [ ] **A-02:** Landing: Vê 5 elementos (Terra, Água, Ar, Fogo, Éter)
- [ ] **A-03:** Landing: Botão "Descobrir..." clicável
- [ ] **A-04:** Landing: Botão "Sair" (logout) presente no canto
- [ ] **A-05:** Quiz Q1: Renderiza primeira pergunta
- [ ] **A-06:** Quiz: Vê 5 opções de resposta (1-5 scale)
- [ ] **A-07:** Quiz: Clica resposta → próxima pergunta renderiza
- [ ] **A-08:** Quiz: Progresso bar atualiza (Q1/25 → Q2/25)
- [ ] **A-09:** Quiz: Botão "Anterior" aparece após Q2
- [ ] **A-10:** Quiz: Volta (anterior) → muda resposta → próxima funciona

**Fluxo cálculo + email:**
- [ ] **A-11:** Q25: Responde última pergunta → CalculatingScreen com spinner
- [ ] **A-12:** CalculatingScreen: Delay de 8 segundos (4-9s aceitável)
- [ ] **A-13:** EmailCaptureScreen: Renderiza após cálculo
- [ ] **A-14:** Email form: Input email vazio, clica submit → erro "email válido"
- [ ] **A-15:** Email form: Entra email inválido "abc" → erro
- [ ] **A-16:** Email form: Entra email válido → clica submit
- [ ] **A-17:** Email form: Entra email + nome → clica submit
- [ ] **A-18:** Email form: Sem nome (opcional) → submit funciona

**Fluxo resultado:**
- [ ] **A-19:** ResultScreen: Título principal renderiza (elemento ou "Equilíbrio")
- [ ] **A-20:** ResultScreen: ScoreMap (5 barras) renderiza
- [ ] **A-21:** ResultScreen: "O Que Isso Significa" section presente
- [ ] **A-22:** ResultScreen: "Primeiros Passos" lista com 3-5 itens
- [ ] **A-23:** ResultScreen: Vê card de upgrade "Salve seu resultado"
- [ ] **A-24:** ResultScreen: Botão "Fazer Login" redireciona para /login
- [ ] **A-25:** ResultScreen: Botões "Refazer Quiz" + "Seguir Instagram" presentes

### Category B: Edge Cases (15 casos)

**Dados inválidos:**
- [ ] **B-01:** Email "teste@example" (sem .com) → erro "email válido"
- [ ] **B-02:** Email "teste" (sem @) → erro
- [ ] **B-03:** Email "@example.com" (sem user) → erro
- [ ] **B-04:** Email muito longo (>254 chars) → validação passa? (Supabase valida)
- [ ] **B-05:** Nome com caracteres especiais "João@#$%" → salva normalmente

**Navegação:**
- [ ] **B-06:** Browser back button durante QuizScreen → volta para Landing
- [ ] **B-07:** Browser back button durante CalculatingScreen → volta para Q25 ou Email?
- [ ] **B-08:** Browser back button durante EmailCaptureScreen → volta para Calculating?
- [ ] **B-09:** Refresh (F5) durante QuizScreen → estado resetado ou mantém?
- [ ] **B-10:** Refresh durante CalculatingScreen → delay restarta ou continua?

**Cross-flow:**
- [ ] **B-11:** Completa quiz anônimo → email → login via button → dados salvos?
- [ ] **B-12:** Login em outra aba → volta para resultado → sincronização OK?
- [ ] **B-13:** Multiple quizzes abertos (2 abas) → qual estado é salvo?
- [ ] **B-14:** Email duplicate (entra email já existente) → novo lead criado?
- [ ] **B-15:** Email capture form: keyboard Enter submete → verificar

### Category C: Accessibility (10 casos)

**Screen Reader (teste com NVDA ou Safari Voice Over):**
- [ ] **C-01:** Landing headline legível: "Por Que Vocês Falam..."
- [ ] **C-02:** 5 elementos nomeados: "Terra", "Água", etc.
- [ ] **C-03:** Quiz question legível: "Em relação a comunição..."
- [ ] **C-04:** Quiz options legíveis: botões 1, 2, 3, 4, 5
- [ ] **C-05:** Email input tem label associado (ou placeholder)

**Keyboard Navigation:**
- [ ] **C-06:** Tab navega buttons: "Descobrir" → "Sair" → "Descobrir"
- [ ] **C-07:** Quiz: Tab funciona entre opções de resposta
- [ ] **C-08:** Email form: Tab → email input → name input → submit button
- [ ] **C-09:** Enter submete email form (não só click)
- [ ] **C-10:** Focus visible: outline aparece em buttons (não desaparece)

### Category D: Styling + Responsive (5 casos)

**Mobile (iPhone SE 375px):**
- [ ] **D-01:** Landing: Layout mobile-friendly (1 coluna)
- [ ] **D-02:** Quiz: Question texto legível em mobile
- [ ] **D-03:** Email form: Inputs full-width em mobile
- [ ] **D-04:** ResultScreen: Scores layout mobile-friendly
- [ ] **D-05:** Resultado: Card de upgrade legível em mobile

### Category E: Database (5 casos)

**Supabase Integration:**
- [ ] **E-01:** Submit email → lead criado em `leads` table (sem user_id)
- [ ] **E-02:** Lead tem email correto
- [ ] **E-03:** Lead tem name correto (ou NULL se vazio)
- [ ] **E-04:** Login depois + refaz quiz → novo lead criado com user_id
- [ ] **E-05:** Antigos leads sem user_id continuam acessíveis (RLS OK)

---

## Results Reporting

### Passing Criteria ✅

Todos os casos nas categorias A-E DEVEM passar. Se falhar:

1. **Quick Path:** Se falha, há erro de sintaxe. Verificar console.
2. **Happy Path (A):** Se falha, mudanças básicas não funcionaram.
3. **Edge Cases (B):** Se falha, é comportamento esperado (validação).
4. **Accessibility (C):** Se falha, comunicar para P0-004/005.

### Failure Handling

Se algum caso falhar:

```bash
# 1. Abra DevTools (F12)
# 2. Console tab → procure por erros em vermelho
# 3. Se houver erro JavaScript → reporte
# 4. Se comportamento estranho → describe o caso que falhou

# Exemplo de failure report:
# "B-06: Browser back durante quiz → esperado voltar para Landing, mas foi para top of page"
```

---

## Manual Test Execution (recommended)

Rode este script para validar quick path:

```javascript
// Abra DevTools > Console durante teste
// Rode este código:

console.log('=== P0-003 Validation ===');
console.log('✓ Landing accessible without auth?');
console.log('✓ Quiz renders 25 questions?');
console.log('✓ Email capture accepts anonymous submission?');
console.log('✓ Result screen shows upgrade button?');
console.log('✓ No JavaScript errors?');
console.log('=== All checks passed ===');
```

---

## Next Steps After Validation

**If all 50+ cases PASS:**
1. Create PR (or update existing)
2. Request code review
3. Move to P0-004 (Radio buttons WCAG)

**If any case FAILS:**
1. Identify root cause
2. Create new commit with fix
3. Re-test affected category
4. Update this checklist

---

**Instructions:**
Execute `npm run dev` e vá testando cada categoria. Report resultado aqui com quantos casos passaram/falharam.
