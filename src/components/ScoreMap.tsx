'use client';

import { motion } from 'framer-motion';
import { Element, ElementScores, elementsInfo } from '@/types/quiz';
import { THRESHOLDS } from '@/lib/quiz-constants';
import { classifyResult } from '@/lib/quiz-logic';

interface ScoreMapProps {
  scores: ElementScores;
  lowestElement: Element;
  result: {
    scores: ElementScores;
    lowestElement: Element;
    lowestScore: number;
    secondLowestElement?: Element;
    pattern?: string;
    disasterType: any;
  };
}

export default function ScoreMap({ scores, lowestElement, result }: ScoreMapProps) {
  const { isBalanced: isAllBalanced, isCritical: isCriticalSituation, isMorna } = classifyResult(result);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-warmGray-100">
      <div className="space-y-4">
        {(Object.keys(scores) as Element[]).map((element) => {
          const score = scores[element];
          const maxScore = 25;
          const minPossibleScore = 5;
          const percentage = ((score - minPossibleScore) / (maxScore - minPossibleScore)) * 100;
          const info = elementsInfo[element as keyof typeof elementsInfo];

          const allScores = Object.values(scores);
          const lowestScoreValue = Math.min(...allScores);
          const isLowest = score === lowestScoreValue;

          const showMisaligned = isLowest && !isAllBalanced && !isCriticalSituation && !isMorna;
          const showCritical = isCriticalSituation && score <= THRESHOLDS.LOW;

          return (
            <div key={element}>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-2 text-sm font-medium text-warmGray-700">
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                  {showCritical && (
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                      🚨 Em Crise
                    </span>
                  )}
                  {showMisaligned && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Desalinhado
                    </span>
                  )}
                  {isAllBalanced && percentage >= 75 && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      Alinhado
                    </span>
                  )}
                </span>
                <span className="text-sm text-warmGray-500 tabular-nums">
                  {score}/{maxScore}
                </span>
              </div>
              <div className="h-3 bg-warmGray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className={`h-full rounded-full ${
                    isAllBalanced
                      ? 'bg-green-400'
                      : isMorna
                        ? 'bg-yellow-400'
                        : isLowest
                          ? 'bg-red-400'
                          : percentage >= 75
                            ? 'bg-green-400'
                            : percentage >= 50
                              ? 'bg-yellow-400'
                              : 'bg-orange-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
