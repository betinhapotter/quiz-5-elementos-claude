/**
 * Central types for the Quiz 5 Elements
 */

export type ElementEn = 'earth' | 'water' | 'fire' | 'air' | 'ether';

export interface Scores {
    earth: number;
    water: number;
    fire: number;
    air: number;
    ether: number;
}

export interface QuizResult {
    scores: Scores;
    lowestElement: ElementEn;
    lowestScore: number;
    highestElement: ElementEn;
    highestScore: number;
    totalScore: number;
    averageScore: number;
    status: 'crisis' | 'attention' | 'balanced' | 'strong';
    direction: 'low' | 'high';
    patterns: string[];
}
