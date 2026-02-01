# Migration Plan - Quiz 5 Elementos
# Generated: 2026-01-31
# Workflow: brownfield-complete Step 4 - Migrate

## Executive Summary

Este documento descreve a estratégia de migração para implementar o design system consolidado no projeto Quiz 5 Elementos.

**Redução estimada**: 34% nos padrões UI
**Componentes a migrar**: 13
**Tempo estimado**: 4-6 horas

---

## Phase 1: Foundation (30 min)

### 1.1 Import Design Tokens

```typescript
// tailwind.config.ts
import tokens from './outputs/design-system/quiz-5-elementos/tokens/tokens.tailwind.js';

const config: Config = {
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.fontFamily,
      // ... rest of tokens
    },
  },
};
```

### 1.2 Create Component Directory

```
src/components/
├── ui/                    # NEW: Design system components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Input.tsx
│   └── AnimatedContainer.tsx
├── screens/               # Existing: Move screen components here
└── ...
```

---

## Phase 2: Atomic Components (1-2 hours)

### 2.1 Button Component

**Files affected**: 
- `LandingScreen.tsx` (1x btn-primary)
- `LoginScreen.tsx` (1x google button)
- `QuizScreen.tsx` (2x icon buttons)
- `EmailCaptureScreen.tsx` (1x btn-primary)
- `ResultScreen.tsx` (2x btn-secondary)
- `PlannerSection.tsx` (3x buttons)

**Migration steps**:
1. Create `src/components/ui/Button.tsx`
2. Replace inline classes with Button variants
3. Test each screen

### 2.2 Card Component

**Files affected**:
- `QuizScreen.tsx` (option-card)
- `LoginScreen.tsx` (login card)
- `EmailCaptureScreen.tsx` (form card)
- `ResultScreen.tsx` (multiple content cards)
- `PlannerSection.tsx` (gradient card)

### 2.3 Badge Component

**Files affected**:
- `QuizScreen.tsx` (element-badge)
- `ResultScreen.tsx` (element-badge)
- `LandingScreen.tsx` (promo badge)

### 2.4 Input Component

**Files affected**:
- `EmailCaptureScreen.tsx` (input-email)

---

## Phase 3: Animation Wrapper (30 min)

### 3.1 AnimatedContainer Component

Replace 15+ inline Framer Motion patterns with:

```tsx
<AnimatedContainer preset="fadeSlideUp" delay={0.2}>
  {/* content */}
</AnimatedContainer>
```

---

## Phase 4: Screen Refactoring (1-2 hours)

### Priority Order

| Screen | Complexity | Components Used |
|--------|------------|-----------------|
| 1. LoginScreen | Low | Button, Card |
| 2. LandingScreen | Low | Button, Badge, Card |
| 3. QuizScreen | Medium | Button, Card, Badge |
| 4. EmailCaptureScreen | Low | Button, Card, Input |
| 5. CalculatingScreen | Low | AnimatedContainer |
| 6. ResultScreen | High | All components |
| 7. PlannerSection | High | Button, Card |

---

## Phase 5: Cleanup (30 min)

### 5.1 Remove Deprecated Styles

```diff
// globals.css
- .btn-primary { ... }    // Now in Button.tsx
- .btn-secondary { ... }  // Now in Button.tsx
- .option-card { ... }    // Now in Card.tsx
- .element-badge { ... }  // Now in Badge.tsx
- .input-email { ... }    // Now in Input.tsx
```

### 5.2 Verify No Breaking Changes

- [ ] All screens render correctly
- [ ] All interactive states work
- [ ] Animations smooth
- [ ] Mobile responsive

---

## Rollback Strategy

### If Issues Found

1. **Immediate**: Revert component import, keep inline classes
2. **Partial**: Keep working components, revert problematic ones
3. **Full**: Git revert to pre-migration commit

### Safe Rollback Points

```bash
# Before migration
git tag pre-design-system-migration

# After each phase
git commit -m "Phase X complete"
```

---

## Success Criteria

- [ ] All 13 original components work identically
- [ ] No visual regressions
- [ ] Bundle size reduced or unchanged
- [ ] Code lines reduced by ~150
- [ ] 34% pattern consolidation achieved
