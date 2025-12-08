# Guia de Deploy - Quiz 5 Elementos

## Variáveis de Ambiente Necessárias

Para fazer o deploy na Vercel, você precisa configurar as seguintes variáveis de ambiente:

### 1. Supabase

```
NEXT_PUBLIC_SUPABASE_URL=https://gytyvacakzqofpnsutdk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

**Onde encontrar:**
- Acesse [Supabase Dashboard](https://supabase.com/dashboard)
- Selecione seu projeto
- Vá em Settings > API
- Copie a URL e a chave anon/public

### 2. Google Gemini API

```
GEMINI_API_KEY=sua-chave-gemini-aqui
```

**Onde encontrar:**
- Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
- Crie ou copie sua API key

### 3. URL da Aplicação (Produção)

```
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

**Substitua** `seu-app.vercel.app` pela URL real do seu deploy na Vercel.

---

## Configuração do Supabase

Após fazer o deploy, você precisa configurar as URLs de callback no Supabase:

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** > **URL Configuration**
4. Em **Site URL**, adicione:
   ```
   https://seu-app.vercel.app
   ```

5. Em **Redirect URLs**, adicione AMBAS as URLs:
   ```
   https://seu-app.vercel.app/auth/callback
   https://seu-app.vercel.app
   ```

6. Clique em **Save**

---

## Configuração do Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized redirect URIs:
     ```
     https://gytyvacakzqofpnsutdk.supabase.co/auth/v1/callback
     ```

6. Copie o **Client ID** e **Client Secret**

7. Volte ao Supabase Dashboard:
   - Vá em **Authentication** > **Providers**
   - Ative **Google**
   - Cole o Client ID e Client Secret
   - Salve

---

## Passos para Deploy na Vercel

1. **Push do código para o GitHub** (já feito ✓)

2. **Importar projeto na Vercel:**
   - Acesse [Vercel Dashboard](https://vercel.com/dashboard)
   - Clique em "Add New Project"
   - Importe o repositório do GitHub
   - **NÃO** configure Root Directory (o projeto já está na raiz)

3. **Adicionar variáveis de ambiente:**
   - Na tela de configuração do projeto, clique em "Environment Variables"
   - Adicione todas as variáveis listadas acima
   - Clique em "Deploy"

4. **Após o deploy:**
   - Copie a URL gerada pela Vercel
   - Atualize `NEXT_PUBLIC_APP_URL` nas variáveis de ambiente
   - Configure as URLs de callback no Supabase (veja seção acima)
   - Faça um redeploy do projeto

---

## Verificação Pós-Deploy

Teste os seguintes fluxos:

- [ ] Login com Google funciona
- [ ] Após login, usuário é redirecionado para a landing page
- [ ] Quiz pode ser completado
- [ ] Resultado é exibido corretamente
- [ ] Geração do planner de 30 dias funciona
- [ ] Dados são salvos no Supabase

---

## Troubleshooting

### Erro: "Não é possível acessar localhost"
- **Causa**: URLs de callback não configuradas no Supabase
- **Solução**: Configure as URLs conforme seção "Configuração do Supabase"

### Erro: "Serviço de IA não configurado"
- **Causa**: `GEMINI_API_KEY` não está configurada na Vercel
- **Solução**: Adicione a variável nas configurações do projeto na Vercel

### Login não funciona
- **Causa**: Google OAuth não configurado ou URLs incorretas
- **Solução**:
  1. Verifique se o Google OAuth está ativo no Supabase
  2. Confirme que a URL de callback do Google está correta
  3. Verifique se as credenciais do Google estão corretas no Supabase

---

## Suporte

Se o problema persistir, verifique:
- Logs no Vercel Dashboard > Project > Deployments > [seu deploy] > Functions
- Logs no Supabase Dashboard > Logs
- Console do navegador (F12) para erros no cliente
