import { ElementEn } from '../types/elements';

/**
 * Score thresholds for individual elements and total result
 */
export const THRESHOLDS = {
    CRISIS: 8,        // ≤8 = situação crítica (média ≤1.6)
    LOW: 12,          // ≤12 = elemento em falta (média ≤2.4)
    BALANCED_LOW: 13, // 13-17 = atenção (média 2.6-3.4)
    BALANCED_HIGH: 18,// 18-20 = equilibrado (média 3.6-4.0)
    HIGH: 21,         // ≥21 = elemento em excesso (média ≥4.2)
    STRONG: 23        // ≥23 = muito forte (média ≥4.6)
};

export const TOTAL_THRESHOLDS = {
    CRISIS: 50,       // ≤50 total = crise geral (média ≤10 por elemento)
    ATTENTION: 65,    // ≤65 = precisa atenção
    BALANCED: 90,     // ≤90 = equilibrado
    STRONG: 100       // >100 = relacionamento forte
};

/**
 * Mapping of Portuguese question prefixes to English element keys
 */
export const elementMapPtToEn: Record<string, ElementEn> = {
    'terra': 'earth',
    'agua': 'water',
    'fogo': 'fire',
    'ar': 'air',
    'eter': 'ether'
};
