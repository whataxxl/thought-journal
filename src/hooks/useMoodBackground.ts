import { useMemo } from 'react';
import type { Thought } from '../types';
import { moodToTone, getMoodColors, type MoodTone } from '../utils/moodDetect';

export function useMoodBackground(thoughts: Thought[]): {
  tone: MoodTone;
  bgColor: string;
  cardBgColor: string;
} {
  return useMemo(() => {
    if (thoughts.length === 0) {
      const colors = getMoodColors('default');
      return { tone: 'default', bgColor: colors.bg, cardBgColor: colors.cardBg };
    }

    // Count mood tones from recent thoughts, weighted by recency
    const weights: Record<string, number> = {};
    for (let i = 0; i < thoughts.length; i++) {
      const tone = moodToTone(thoughts[i].mood);
      const weight = i < 3 ? 2 : 1; // most recent 3 count double
      weights[tone] = (weights[tone] || 0) + weight;
    }

    let bestTone: MoodTone = 'default';
    let bestWeight = 0;
    for (const [tone, weight] of Object.entries(weights)) {
      if (weight > bestWeight) {
        bestWeight = weight;
        bestTone = tone as MoodTone;
      }
    }

    const colors = getMoodColors(bestTone);
    return { tone: bestTone, bgColor: colors.bg, cardBgColor: colors.cardBg };
  }, [thoughts]);
}
