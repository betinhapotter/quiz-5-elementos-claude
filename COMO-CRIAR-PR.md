# Como Criar um Pull Request (PR) para Testar o CodeRabbit

## Passo a Passo Completo

### 1. Criar uma Nova Branch

```powershell
# Criar e mudar para uma nova branch
git checkout -b test/coderabbit-review
```

### 2. Fazer uma Mudança Simples

Vou criar um arquivo de teste para você:

```powershell
# Criar um arquivo README de teste
echo "# Teste CodeRabbit" > TEST.md
echo "" >> TEST.md
echo "Este é um arquivo de teste para verificar se o CodeRabbit está funcionando." >> TEST.md
```

Ou edite qualquer arquivo existente, por exemplo, adicione um comentário em algum arquivo TypeScript.

### 3. Adicionar e Commitar

```powershell
# Adicionar o arquivo
git add .

# Fazer commit
git commit -m "test: adiciona arquivo de teste para CodeRabbit"
```

### 4. Enviar para o GitHub

```powershell
# Enviar a branch para o GitHub
git push -u origin test/coderabbit-review
```

### 5. Criar o Pull Request no GitHub

**Opção A - Via Link Automático:**

Após o `git push`, o terminal vai mostrar um link como:
```
https://github.com/betinhapotter/quiz-5-elementos-claude/pull/new/test/coderabbit-review
```

Copie e cole esse link no navegador!

**Opção B - Via GitHub:**

1. Acesse: https://github.com/betinhapotter/quiz-5-elementos-claude
2. Clique no botão amarelo "Compare & pull request" (aparece após o push)
3. Ou vá em "Pull requests" → "New pull request"
4. Selecione:
   - Base: `main`
   - Compare: `test/coderabbit-review`
5. Clique em "Create pull request"

### 6. Preencher o PR

- **Título**: "Test: Verificar integração do CodeRabbit"
- **Descrição**: 
  ```
  ## Objetivo
  Testar se o CodeRabbit está revisando PRs automaticamente.
  
  ## Mudanças
  - Adiciona arquivo de teste
  
  @coderabbitai review
  ```

### 7. Aguardar o CodeRabbit

Após criar o PR:
- ⏳ Aguarde 10-30 segundos
- 🤖 O CodeRabbit vai comentar automaticamente
- ✅ Vai revisar o código
- 💬 Vai sugerir melhorias (se houver)

### 8. Interagir com CodeRabbit

Você pode comentar no PR:
- `@coderabbitai help` - Ver comandos
- `@coderabbitai review` - Revisar novamente
- `@coderabbitai explain` - Explicar mudanças

### 9. Fechar o PR de Teste

Depois de testar:
1. Vá até o PR no GitHub
2. Clique em "Close pull request" (não precisa fazer merge)
3. Volte para a branch main:
   ```powershell
   git checkout main
   ```
4. Delete a branch de teste (opcional):
   ```powershell
   git branch -D test/coderabbit-review
   ```

## 🚀 Comandos Completos (Copiar e Colar)

```powershell
# 1. Criar branch
git checkout -b test/coderabbit-review

# 2. Criar arquivo de teste
echo "# Teste CodeRabbit" > TEST.md

# 3. Commit
git add TEST.md
git commit -m "test: adiciona arquivo de teste para CodeRabbit"

# 4. Push
git push -u origin test/coderabbit-review

# 5. Abrir o link que aparece no terminal
# Ou acessar: https://github.com/betinhapotter/quiz-5-elementos-claude/pulls
```

## ⚠️ Importante

**ANTES de criar o PR, instale o CodeRabbit GitHub App:**
1. Acesse: https://github.com/apps/coderabbitai
2. Clique em "Install"
3. Selecione o repositório `quiz-5-elementos-claude`

Sem o App instalado, o CodeRabbit não vai revisar o PR!

## 🎯 O que Esperar

Quando funcionar, você verá:
- ✅ Um comentário do bot @coderabbitai
- ✅ Resumo das mudanças
- ✅ Sugestões de melhoria (se aplicável)
- ✅ Análise de segurança e qualidade
