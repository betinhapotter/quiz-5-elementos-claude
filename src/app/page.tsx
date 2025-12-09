'use client';

import { useQuizStore } from '@/hooks/useQuizStore';
import LandingScreen from '@/components/LandingScreen';
import QuizScreen from '@/components/QuizScreen';
import CalculatingScreen from '@/components/CalculatingScreen';
import EmailCaptureScreen from '@/components/EmailCaptureScreen';
import ResultScreen from '@/components/ResultScreen';

export default function Home() {
  const currentStep = useQuizStore((state) => state.currentStep);

  return (
    <div className="flex-1">
      {currentStep === 'landing' && <LandingScreen />}
      {currentStep === 'quiz' && <QuizScreen />}
      {currentStep === 'calculating' && <CalculatingScreen />}
      {currentStep === 'email-capture' && <EmailCaptureScreen />}
      {currentStep === 'result' && <ResultScreen />}
    </div>
  );
}
