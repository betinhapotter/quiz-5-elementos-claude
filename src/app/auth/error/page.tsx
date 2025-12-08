'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-warmGray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-warmGray-900 mb-4">
            Erro na Autenticação
          </h1>

          <p className="text-warmGray-600 mb-6">
            Não foi possível fazer login com o Google. Isso pode acontecer por alguns motivos:
          </p>

          <ul className="text-left space-y-2 mb-8 text-sm text-warmGray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Você cancelou o login no Google</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>O link de autenticação expirou</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Problema temporário com o serviço</span>
            </li>
          </ul>

          <button
            onClick={() => router.push('/')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar e tentar novamente
          </button>
        </div>

        <p className="text-center text-sm text-warmGray-500 mt-6">
          Se o problema persistir, entre em contato com o suporte.
        </p>
      </motion.div>
    </div>
  );
}
