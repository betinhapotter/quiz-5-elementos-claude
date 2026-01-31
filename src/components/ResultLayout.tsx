'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

interface ResultLayoutProps {
  heroGradient: string;
  heroIcon: string;
  title: string;
  subtitle: string;
  showSeverityWarning?: boolean;
  children: ReactNode;
  onLogout: () => void;
}

export default function ResultLayout({
  heroGradient,
  heroIcon,
  title,
  subtitle,
  showSeverityWarning = false,
  children,
  onLogout
}: ResultLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-warmGray-600 hover:text-warmGray-900 hover:bg-warmGray-100 rounded-lg transition-colors bg-white/80 backdrop-blur-sm shadow-sm"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>

      <div className={`bg-gradient-to-br ${heroGradient} text-white py-12 sm:py-16`}>
        <div className="container-quiz text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl sm:text-8xl block mb-4">{heroIcon}</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-xl opacity-90">{subtitle}</p>

            {showSeverityWarning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 inline-block bg-white/20 rounded-full px-4 py-2 text-sm"
              >
                ⚠️ Nível crítico identificado — atenção necessária
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container-quiz py-10">{children}</div>
    </div>
  );
}
