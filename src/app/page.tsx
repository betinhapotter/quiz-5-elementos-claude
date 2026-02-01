'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuizStore } from '@/hooks/useQuizStore';
import LoginScreen from '@/components/LoginScreen';
import LandingScreen from '@/components/LandingScreen';
import QuizScreen from '@/components/QuizScreen';
import CalculatingScreen from '@/components/CalculatingScreen';
import EmailCaptureScreen from '@/components/EmailCaptureScreen';
import ResultScreen from '@/components/ResultScreen';
import CriticalSituationScreen from '@/components/CriticalSituationScreen';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const currentStep = useQuizStore((state) => state.currentStep);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {['🌍', '💧', '🌬️', '🔥', '✨'].map((emoji, i) => (
              <span key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-warmGray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Fluxo do quiz: anônimo ou autenticado
  // P0-003: Removido auth gate para permitir fluxo anônimo completo
  return (
    <div className="flex-1">
      {currentStep === 'landing' && <LandingScreen />}
      {currentStep === 'quiz' && <QuizScreen />}
      {currentStep === 'calculating' && <CalculatingScreen />}
      {currentStep === 'email-capture' && <EmailCaptureScreen />}
      {currentStep === 'critical' && <CriticalSituationScreen />}
      {currentStep === 'result' && <ResultScreen />}
    </div>
  );
}
