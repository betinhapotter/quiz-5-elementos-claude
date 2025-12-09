# 🔍 Diagnóstico de Login

## 1. Verificar Variáveis de Ambiente

Abra o console do navegador em https://quiz-5-elementos-claude.web.app e cole:

```javascript
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

✅ **Deve mostrar:** A URL do Supabase e parte da key
❌ **Se mostrar undefined:** Faltam as variáveis de ambiente

---

## 2. Configurar Supabase (CRÍTICO)

### Passo 1: Acesse o Supabase
https://supabase.com/dashboard/project/gytyvacakzqofpnsutdk/auth/url-configuration

### Passo 2: Configure as URLs

**Site URL:**
```
https://quiz-5-elementos-claude.web.app
```

**Redirect URLs** (adicione TODAS essas):
```
https://quiz-5-elementos-claude.web.app/**
https://quiz-5-elementos-claude.web.app
https://quiz-5-elementos-claude.web.app/auth/callback
http://localhost:3000/**
http://localhost:3000
```

### Passo 3: Clique em **SAVE**

---

## 3. Verificar OAuth do Google

### No Supabase:
1. Vá em **Authentication > Providers**
2. Clique em **Google**
3. Verifique se está **Enabled**
4. Verifique **Authorized redirect URIs** no Google Cloud Console

### No Google Cloud Console:
https://console.cloud.google.com/apis/credentials

1. Encontre seu **OAuth 2.0 Client ID**
2. Clique para editar
3. Em **Authorized redirect URIs**, adicione:
```
https://gytyvacakzqofpnsutdk.supabase.co/auth/v1/callback
```

---

## 4. Teste o Login

1. Acesse: https://quiz-5-elementos-claude.web.app
2. Clique em "Entrar com Google"
3. Veja o console do navegador (F12) para erros
4. Me envie qualquer mensagem de erro que aparecer

---

## 5. Verificação Rápida

Cole isso no console do navegador:

```javascript
const supabase = window.supabase || (await import('@supabase/supabase-js')).createClient(
  'https://gytyvacakzqofpnsutdk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dHl2YWNha3pxb2ZwbnN1dGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTI4NDMsImV4cCI6MjA2MzA4ODg0M30.KexltGV2axhMohvl2avEOBiosH-VmZ8lFZUtuF6IbCc'
);
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin }
});
console.log('Login result:', error || 'Redirecionando...');
```

---

## O que fazer agora:

1. ✅ **Configure o Supabase** (passo 2 acima) - **MAIS IMPORTANTE**
2. ✅ **Verifique o Google OAuth** (passo 3 acima)
3. 📱 **Teste e me envie** qualquer erro do console

Qual erro aparece quando você clica em "Entrar com Google"?
