# IMPLEMENTATION KICKOFF - Cenário B Aprovado
## Quiz dos 5 Elementos - Technical Debt Resolution

**Data:** 31 de janeiro de 2026
**Decisão:** Cenário B - P0 + P1 (20h, 3-4 semanas)
**Status:** ✅ PRONTO PARA COMEÇAR
**Próximo Passo:** Dev pega P0-001

---

## DECISÃO EXECUTIVA

**Jaya aprovou:** Resolver P0 (5h) + P1 (15h) antes de soft launch.

**Timeline:**
- **Semana 1:** P0 (5 stories, ~5h)
- **Semanas 2-3:** P1 (6 stories, ~15h)
- **Semana 4+:** P2/P3 conforme recursos

**Investimento:** ~R$3.000 (se dev senior @ R$150/h)
**ROI:** Evita -70% conversão + multa LGPD até R$50M

---

## ANTES DE COMEÇAR

### Checklist Técnico
- [ ] Access ao Supabase dashboard (para DB migrations)
- [ ] VS Code com projeto aberto
- [ ] Branch novo: `feature/technical-debt-p0-p1`
- [ ] npm install (dependências atualizadas)
- [ ] Staging environment disponível para FE-010 testing

### Checklist Conhecimento
- [ ] Leu `docs/stories/epic-technical-debt.md` (as 11 stories)
- [ ] Entendeu order de execução: DB fixes → FE-010 → WCAG
- [ ] Sabe que P0-003 (FE-010) é o gargalo crítico
- [ ] Sabe testar com 50+ casos antes de merge

### Checklist Documentação
- [ ] Abriu issue/task para P0-001
- [ ] Criou checklist de testes
- [ ] Definiu code review process

---

## SEMANA 1: P0 (BLOQUEADORES CRÍTICOS)

### Segunda (4h)

**P0-001: DELETE policies (15min)**
- [ ] Abrir Supabase dashboard
- [ ] Criar nova migration: `20260203_add_delete_policies.sql`
- [ ] Adicionar DELETE policy em quiz_results
- [ ] Adicionar DELETE policy em planners
- [ ] Adicionar DELETE policy em leads
- [ ] Rodar migration em dev
- [ ] Teste: usuário consegue deletar próprio record (200 OK)
- [ ] Teste: usuário NÃO consegue deletar record alheio (403)

**P0-002: Remover acesso anônimo (30min)**
- [ ] Editar policy em leads SELECT
- [ ] Remover `auth.uid() IS NULL`
- [ ] Manter apenas `auth.uid() = user_id`
- [ ] Teste em Supabase console

### Terça (2-3h)

**P0-003: Mover login gate (FE-010)**
- [ ] Ler `useQuizStore.ts` completo
- [ ] Remover check de `session` antes de `CALCULATING`
- [ ] Testar quiz anônimo localmente
- [ ] Atualizar `EmailCaptureScreen.tsx` (submit sem auth)
- [ ] Criar button de "upgrade" em ResultScreen
- [ ] Teste: anônimo → email → resultado (SEM login)
- [ ] Teste: anônimo → email → login (DEPOIS) → resultado
- [ ] 10+ casos de cada

### Quarta (2h)

**P0-004: Radio buttons (A-001) - 1.5h**
- [ ] Refatorar QuizScreen options
- [ ] Usar `<input type="radio">`
- [ ] Usar `<label htmlFor>`
- [ ] Screen reader test (NVDA/JAWS)
- [ ] axe-core automation test

**P0-005: Input labels (A-002) - 30min**
- [ ] EmailCaptureScreen labels
- [ ] `<label htmlFor="email">`
- [ ] `<label htmlFor="name">`
- [ ] axe-core test

### Quinta (validação)

**E2E Testing + Code Review**
- [ ] Run full flow: anônimo → quiz (25q) → calculating (8s) → email → resultado
- [ ] 50+ test cases FE-010 (combinações de login/no-login)
- [ ] Code review completo
- [ ] Staging deployment
- [ ] Zero JavaScript errors
- [ ] Legal team: LGPD compliance validated

### Sexta (deploy)

- [ ] Final checks
- [ ] Merge para main
- [ ] Deploy (soft launch ou preview)

---

## SEMANA 2-3: P1 (ALTA PRIORIDADE)

### Semana 2 - Primeira Metade (7-8h)

**P1-003: Design System Migration (6-8h) - Main Effort**
- [ ] Refatorar EmailCaptureScreen → usar Button, Input
- [ ] Refatorar QuizScreen → usar Button
- [ ] Refatorar ResultScreen → usar Button + Card
- [ ] Visual regression test
- [ ] Screenshot comparison
- [ ] Zero layout breaks

**P1-001: UPDATE policies (10min)**
- [ ] Adicionar UPDATE em planners
- [ ] Adicionar UPDATE em leads
- [ ] Teste rápido

### Semana 2 - Segunda Metade (2h)

**P1-004: Consolidar 3 markdown parsers (2h)**
- [ ] Criar hook `useMarkdown.ts`
- [ ] Migrar 3 implementações
- [ ] Regression test (output idêntico)
- [ ] Performance check

### Semana 3

**P1-002: Audit Trail (1.5h)**
- [ ] Adicionar created_by, updated_by em tabelas
- [ ] Criar triggers
- [ ] Migration test

**P1-005, P1-006: WCAG Fixes (2-2.5h)**
- [ ] Contrast ratio fix (A-003)
- [ ] Aria-labels em icon buttons (A-004)
- [ ] axe-core 100% pass

**Buffer + Documentação**
- [ ] Retrospectiva
- [ ] Ajustes finais
- [ ] Deploy P1 completo

---

## ORDEM DE EXECUÇÃO (CRITICAL)

```
1. P0-001 (DELETE) ✅ (15min) → enable rng
2. P0-002 (SELECT) ✅ (30min) → security fix
3. P0-003 (FE-010) ✅ (2-3h) → conversão (TESTE BEM)
4. P0-004, P0-005 (WCAG) ✅ (2h) → accessibility
        ↓
5. P1-001 (UPDATE) ✅ (10min) → depends P0-001
6. P1-003 (Design) ✅ (6-8h) → main effort P1
7. P1-004 (Markdown) ✅ (2h) → consolidation
8. P1-002 (Audit) ✅ (1.5h) → traceability
9. P1-005, 006 (WCAG fine) ✅ (2-2.5h) → accessibility
```

**Critical Path:** P0-003 (FE-010) é o gargalo. Tudo depende disso estar robusto.

---

## TESTING STRATEGY

### P0-003 (FE-010) - 50+ Test Cases

**Happy Path (25 casos):**
- Anônimo completa quiz, vê email capture, vê resultado (sem login)
- Anônimo completa quiz, entra email, vê resultado, faz login DEPOIS
- Usuário autenticado completa quiz direto
- Email capture com/sem nome
- Resultado parcial vs completo
- Planner generation sucesso/timeout

**Edge Cases (25 casos):**
- Timeout Gemini durante planner
- Volta (browser back button)
- Refresh durante quiz
- Refresh durante email capture
- Refresh durante resultado
- Multiple logins
- Session expiry
- Network error durante login
- Cross-tab communication

### WCAG Accessibility (10 casos)

- Screen reader: radio buttons legíveis
- Screen reader: inputs com labels
- Keyboard navigation: Tab funciona
- Keyboard navigation: Arrow keys em radio
- Color contrast: warmGray vs cream
- Focus visible: outline aparece
- Aria-labels em icon buttons

### Smoke Test (5 casos)

- Zero JavaScript errors
- Lighthouse score >= 90
- Performance não degradou
- API calls funcionam
- Supabase RLS policies OK

---

## CRITICAL DECISIONS MADE

✅ **LGPD é aplicável** (não GDPR)
✅ **FE-010 -70 a -80% conversão** (não -30%)
✅ **Custo Gemini ~R$100-300/mês** (monitorar após launch)
✅ **ARCH-001 NÃO é dependência** de FE-010
✅ **3 markdown parsers** (não 2) em FE-003
✅ **Console.logs devem ser removidos** (higiene)

---

## DOCUMENTS FOR REFERENCE

**Para Dev (ABRIR AGORA):**
- `docs/stories/epic-technical-debt.md` — 11 stories com AC completo

**Para Context:**
- `docs/prd/technical-debt-assessment-FINAL.md` — Consolidação completa
- `docs/reports/TECHNICAL-DEBT-REPORT.md` — Relatório executivo

**Para Git/History:**
- `docs/sessions/HANDOFF-BROWNFIELD-DISCOVERY-COMPLETE.md` — Handoff summary

---

## GO-LIVE GATES

### After P0 (End of Week 1)
- [ ] Todos P0s DONE + passed QA
- [ ] E2E test 50+ casos
- [ ] Staging validated
- [ ] Legal team signed off LGPD
- [ ] Zero regressions

### After P1 (End of Week 3)
- [ ] Todos P1s DONE
- [ ] Conversão rate medida
- [ ] WCAG AA 100% (axe-core)
- [ ] Design system adopted (80%+)
- [ ] Performance stable
- [ ] Ready to soft launch

---

## START NOW

**Dev:** Abra `docs/stories/epic-technical-debt.md` e comece por **P0-001** (15min).

**PM:** Agenda daily standup (10min) para semanas 1-3.

**QA:** Prepare teste case list (50+ para FE-010).

**Legal:** Review `docs/reports/TECHNICAL-DEBT-REPORT.md` seção 2.2 (LGPD).

---

**Status:** ✅ READY TO EXECUTE
**Expected Delivery:** 3-4 semanas
**Quality Gate:** P0 + P1 100% before any public launch

---

*Kickoff aprovado em 31/01/2026*
*Cenário B: P0 + P1 - Produto Robusto + Compliance Completo*
