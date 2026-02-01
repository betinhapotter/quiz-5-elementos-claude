756# 🚀 DEV Handoff - Design System Migration

> **Projeto**: Quiz 5 Elementos  
> **Data**: 2026-01-31  
> **Prioridade**: Média  
> **Estimativa**: 10 horas

---

## 📋 Contexto

O workflow **brownfield-complete** foi executado e gerou um design system consolidado. 
Este documento contém tudo que você precisa para implementar a migração.

---

## ✅ O Que Foi Entregue

```
outputs/design-system/quiz-5-elementos/
├── audit/
│   └── inventory.yaml          # 47 padrões identificados
├── consolidation/
│   └── decisions.yaml          # Decisões de clustering
├── tokens/
│   ├── tokens.yaml             # Source of truth
│   ├── tokens.css              # CSS custom properties
│   └── tokens.tailwind.js      # Para usar no tailwind.config
├── migration/
│   └── plan.md                 # Plano de migração detalhado
├── reports/
│   ├── shock-report.html       # Relatório visual
│   └── roi.yaml                # Cálculo de ROI
├── components/
│   ├── atoms/
│   │   ├── Button.tsx          # 6 variants, 5 sizes
│   │   ├── Input.tsx           # Icon support, error state
│   │   └── Badge.tsx           # 9 variants (elements + semantic)
│   └── molecules/
│       ├── Card.tsx            # 4 variants + gradient
│       └── AnimatedContainer.tsx # 5 animation presets
└── docs/
    └── README.md               # Documentação de uso
```

---

## 🎯 Tasks para o DEV

### Task 1: Setup (30 min)

1. **Criar pasta de componentes UI**
```bash
mkdir -p src/components/ui
```

2. **Criar utils helper** (se não existir)
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

3. **Instalar dependências** (se necessário)
```bash
npm install clsx tailwind-merge
```

---

### Task 2: Copiar Componentes (15 min)

```bash
# Copiar atoms
cp outputs/design-system/quiz-5-elementos/components/atoms/*.tsx src/components/ui/

# Copiar molecules  
cp outputs/design-system/quiz-5-elementos/components/molecules/*.tsx src/components/ui/
```

**Ajustar imports** em cada componente:
- `@/lib/utils` → verificar se path está correto
- `@/types/quiz` → verificar se Element type existe

---

### Task 3: Migrar Telas (Ordem de Prioridade)

| # | Tela | Componentes | Esforço |
|---|------|-------------|---------|
| 1 | LoginScreen | Button, Card | 30 min |
| 2 | LandingScreen | Button, Badge, Card | 45 min |
| 3 | QuizScreen | Button, Card, Badge | 1h |
| 4 | EmailCaptureScreen | Button, Card, Input | 30 min |
| 5 | CalculatingScreen | AnimatedContainer | 15 min |
| 6 | ResultScreen | Todos | 1h30 |
| 7 | PlannerSection | Button, Card | 1h |

---

### Task 4: Exemplos de Migração

#### Antes (inline):
```tsx
<button className="inline-flex items-center justify-center rounded-xl bg-fogo px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-fogo-dark">
  Começar Quiz
</button>
```

#### Depois (componente):
```tsx
import { Button } from '@/components/ui/Button';

<Button size="lg">Começar Quiz</Button>
```

---

#### Antes (Framer Motion inline):
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

#### Depois (AnimatedContainer):
```tsx
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';

<AnimatedContainer preset="fadeSlideUp">
  {content}
</AnimatedContainer>
```

---

### Task 5: Cleanup (30 min)

Após migrar todas as telas, remover classes duplicadas do `globals.css`:

```diff
- .btn-primary { ... }
- .btn-secondary { ... }  
- .option-card { ... }
- .element-badge { ... }
- .input-email { ... }
```

---

## 📊 Métricas de Sucesso

| Métrica | Target |
|---------|--------|
| Todas as telas funcionando | ✅ |
| Zero regressões visuais | ✅ |
| Testes passando | ✅ |
| Bundle size ≤ atual | ✅ |

---

## 🔗 Arquivos de Referência

| Arquivo | Link |
|---------|------|
| Plano de Migração | [plan.md](file:///c:/Users/Jaya/Projetos/AulaAvancada/quiz-5-elementos/outputs/design-system/quiz-5-elementos/migration/plan.md) |
| Documentação DS | [README.md](file:///c:/Users/Jaya/Projetos/AulaAvancada/quiz-5-elementos/outputs/design-system/quiz-5-elementos/docs/README.md) |
| Shock Report | [shock-report.html](file:///c:/Users/Jaya/Projetos/AulaAvancada/quiz-5-elementos/outputs/design-system/quiz-5-elementos/reports/shock-report.html) |
| ROI | [roi.yaml](file:///c:/Users/Jaya/Projetos/AulaAvancada/quiz-5-elementos/outputs/design-system/quiz-5-elementos/reports/roi.yaml) |

---

## ⚠️ Pontos de Atenção

1. **Element type**: Verificar se o tipo `Element` existe em `@/types/quiz`
2. **cn() helper**: Necessário para class merging
3. **Framer Motion**: Já é dependência do projeto
4. **Lucide Icons**: Já é dependência do projeto

---

## 🆘 Rollback

Se algo der errado:
```bash
git checkout -- src/components/
git checkout -- src/app/globals.css
```

---

**Handoff criado por**: Antigravity (Brownfield Workflow)  
**Para**: @dev
