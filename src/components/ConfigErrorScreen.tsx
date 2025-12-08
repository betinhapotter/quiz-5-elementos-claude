'use client';

import { AlertCircle } from 'lucide-react';

export default function ConfigErrorScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-warmGray-900 mb-4 text-center">
            Erro de Configuração
          </h1>

          <p className="text-warmGray-600 mb-6 text-center">
            As variáveis de ambiente do Supabase não estão configuradas corretamente.
          </p>

          <div className="bg-warmGray-50 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-warmGray-900 mb-3">
              Configure estas variáveis na Vercel:
            </h2>
            <ul className="space-y-2 text-sm font-mono text-warmGray-700">
              <li className="bg-white p-2 rounded border border-warmGray-200">
                NEXT_PUBLIC_SUPABASE_URL
              </li>
              <li className="bg-white p-2 rounded border border-warmGray-200">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </li>
              <li className="bg-white p-2 rounded border border-warmGray-200">
                GEMINI_API_KEY
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">
              📚 Como configurar:
            </h3>
            <ol className="space-y-1 text-sm text-blue-800 list-decimal list-inside">
              <li>Acesse o dashboard da Vercel</li>
              <li>Vá em Settings → Environment Variables</li>
              <li>Adicione as variáveis acima</li>
              <li>Faça um redeploy do projeto</li>
            </ol>
          </div>

          <p className="text-center text-sm text-warmGray-500">
            Consulte o arquivo <code className="bg-warmGray-100 px-2 py-1 rounded">DEPLOY.md</code> no repositório para instruções detalhadas.
          </p>
        </div>
      </div>
    </div>
  );
}
