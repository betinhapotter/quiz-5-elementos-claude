# ⚠️ CONFIGURAÇÃO URGENTE - CORRIGIR LOGIN

O login está tentando redirecionar para `localhost` porque as URLs não foram configuradas no Supabase.

## Passo 1: Configure URLs no Supabase Dashboard

### 1.1 Acesse o Supabase
1. Vá em: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto: **gytyvacakzqofpnsutdk**

### 1.2 Configure Site URL
1. No menu lateral, clique em **Authentication**
2. Clique em **URL Configuration**
3. Encontre o campo **Site URL**
4. **IMPORTANTE:** Mude de `http://localhost:3000` para:
   ```
   https://quiz-5-elementos-claude.vercel.app
   ```

### 1.3 Configure Redirect URLs
1. Na mesma página (**URL Configuration**)
2. Encontre a seção **Redirect URLs**
3. **Adicione as seguintes URLs** (uma por linha):
   ```
   https://quiz-5-elementos-claude.vercel.app/auth/callback
   https://quiz-5-elementos-claude.vercel.app
   https://quiz-5-elementos-claude-git-main-betinhapotters-projects.vercel.app/auth/callback
   https://quiz-5-elementos-claude-git-main-betinhapotters-projects.vercel.app
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```

   > **Nota:** Incluímos localhost para desenvolvimento local também

4. Clique em **Save** (botão verde no final da página)

---

## Passo 2: Configure Google OAuth (se ainda não fez)

### 2.1 Verifique se Google está habilitado no Supabase
1. No Supabase Dashboard, vá em **Authentication** > **Providers**
2. Procure por **Google**
3. Se não estiver ativo, ative-o:

### 2.2 Configure Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Selecione seu projeto (ou crie um novo)
3. No menu, vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** Quiz 5 Elementos
   - **Authorized JavaScript origins:**
     ```
     https://quiz-5-elementos-claude.vercel.app
     https://gytyvacakzqofpnsutdk.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     https://gytyvacakzqofpnsutdk.supabase.co/auth/v1/callback
     ```
6. Clique em **Create**
7. **Copie** o Client ID e Client Secret

### 2.3 Adicione credenciais no Supabase
1. Volte ao Supabase: **Authentication** > **Providers** > **Google**
2. Cole o **Client ID** (Google)
3. Cole o **Client Secret** (Google)
4. Clique em **Save**

---

## Passo 3: Adicione variável NEXT_PUBLIC_APP_URL na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto: **quiz-5-elementos-claude**
3. Vá em **Settings** > **Environment Variables**
4. Adicione uma nova variável:
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://quiz-5-elementos-claude.vercel.app`
   - **Environments:** ✓ Production, ✓ Preview, ✓ Development
5. Clique em **Save**

---

## Passo 4: Teste

1. **Aguarde 1-2 minutos** para o Vercel redeployar automaticamente
2. Acesse: https://quiz-5-elementos-claude.vercel.app/
3. Clique em **Continuar com Google**
4. Agora deve redirecionar corretamente para o Google
5. Após autorizar, deve voltar para o quiz

---

## Checklist Rápido

- [ ] Site URL configurada no Supabase (sem localhost)
- [ ] Redirect URLs adicionadas no Supabase
- [ ] Google OAuth configurado no Google Cloud Console
- [ ] Credenciais do Google adicionadas no Supabase
- [ ] NEXT_PUBLIC_APP_URL configurada na Vercel
- [ ] Aguardou redeploy da Vercel
- [ ] Testou o login

---

## Troubleshooting

### Ainda redireciona para localhost?
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Tente em uma aba anônima
- Verifique se salvou as mudanças no Supabase

### Erro "redirect_uri_mismatch" do Google?
- Verifique se a URL no Google Cloud Console está exatamente como:
  `https://gytyvacakzqofpnsutdk.supabase.co/auth/v1/callback`

### Erro "unauthorized_client"?
- Verifique se copiou corretamente o Client ID e Secret
- Verifique se o Google OAuth está habilitado no Supabase

---

## Suporte

Se continuar com problemas, verifique:
1. Console do navegador (F12) para erros
2. Logs do Supabase: Dashboard > Logs
3. Logs da Vercel: Dashboard > Deployments > [último deploy] > Functions
