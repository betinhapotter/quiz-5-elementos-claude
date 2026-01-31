import { create } from 'zustand';
import { Answer, QuizResult, QuizState, UserData } from '@/types/quiz';
import { questions } from '@/data/questions';
import { calculateResult } from '@/lib/quiz-logic';
import { THRESHOLDS } from '@/lib/quiz-constants';

interface QuizStore extends QuizState {
  // Planner state
  planner: string | null;
  setPlanner: (planner: string) => void;

  // Actions
  startQuiz: () => void;
  answerQuestion: (answer: Answer) => void;
  goToPreviousQuestion: () => void;
  submitEmail: (email: string, name?: string) => void;
  calculateAndShowResult: () => void;
  resetQuiz: () => void;

  // Computed
  getCurrentQuestion: () => typeof questions[0] | null;
  getProgress: () => number;
  isLastQuestion: () => boolean;
}

const initialState: QuizState = {
  currentStep: 'landing',
  currentQuestionIndex: 0,
  answers: [],
  userData: null,
  result: null,
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,
  planner: null,

  // Planner setter
  setPlanner: (planner: string) => set({ planner }),

  // Iniciar o quiz
  startQuiz: () => {
    set({
      currentStep: 'quiz',
      currentQuestionIndex: 0,
      answers: [],
      result: null,
    });
  },

  // Responder uma pergunta
  answerQuestion: (answer: Answer) => {
    const state = get();
    const newAnswers = [...state.answers];

    // Substitui se já respondeu essa pergunta (voltou e mudou)
    const existingIndex = newAnswers.findIndex(
      (a) => a.questionId === answer.questionId
    );
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }

    // Se é a última pergunta, vai para tela de cálculo
    if (state.currentQuestionIndex >= questions.length - 1) {
      set({
        answers: newAnswers,
        currentStep: 'calculating',
      });

      // Simula cálculo (UX de valor percebido)
      setTimeout(() => {
        const result = calculateResult(newAnswers);
        set({
          result,
          currentStep: 'email-capture',
        });
      }, 8000);
    } else {
      // Próxima pergunta
      set({
        answers: newAnswers,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      });
    }
  },

  // Voltar para pergunta anterior
  goToPreviousQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex > 0) {
      set({ currentQuestionIndex: state.currentQuestionIndex - 1 });
    }
  },

  // Submeter email
  submitEmail: (email: string, name?: string) => {
    const state = get();
    if (!state.result) {
      set({
        userData: {
          email,
          name,
          createdAt: new Date(),
        },
        currentStep: 'result',
      });
      return;
    }

    // Verifica se é situação crítica
    const allScores = Object.values(state.result.scores);
    const isAllInCrisis = allScores.every(score => score <= THRESHOLDS.CRISIS);
    const isAllLow = allScores.every(score => score <= THRESHOLDS.LOW);
    const isCriticalSituation = isAllInCrisis || isAllLow || state.result.pattern?.includes('alerta_vermelho');

    set({
      userData: {
        email,
        name,
        createdAt: new Date(),
      },
      currentStep: isCriticalSituation ? 'critical' : 'result',
    });
  },

  // Calcular e mostrar resultado (caso precise forçar)
  calculateAndShowResult: () => {
    const state = get();
    if (state.answers.length === questions.length) {
      const result = calculateResult(state.answers);
      set({ result, currentStep: 'result' });
    }
  },

  // Resetar quiz
  resetQuiz: () => {
    set(initialState);
  },

  // Getters
  getCurrentQuestion: () => {
    const state = get();
    return questions[state.currentQuestionIndex] || null;
  },

  getProgress: () => {
    const state = get();
    return ((state.currentQuestionIndex + 1) / questions.length) * 100;
  },

  isLastQuestion: () => {
    const state = get();
    return state.currentQuestionIndex >= questions.length - 1;
  },
}));
