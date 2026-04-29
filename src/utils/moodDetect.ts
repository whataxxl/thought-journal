export type MoodTone = 'default' | 'thinking' | 'happy' | 'confused' | 'anxious' | 'creative' | 'grateful';

export interface MoodColor {
  bg: string;
  cardBg: string;
}

const MOOD_COLORS: Record<MoodTone, MoodColor> = {
  default:  { bg: '#FDF5E6', cardBg: '#FFF9F0' },
  thinking: { bg: '#F5E6D3', cardBg: '#FDF0E0' },
  happy:    { bg: '#FFF8DC', cardBg: '#FFFFF0' },
  confused: { bg: '#E8ECF0', cardBg: '#F0F4F8' },
  anxious:  { bg: '#F5EBE8', cardBg: '#FDF5F3' },
  creative: { bg: '#EDE8F5', cardBg: '#F7F3FC' },
  grateful: { bg: '#F0F5EC', cardBg: '#F8FDF5' },
};

const EMOJI_TONE_MAP: Record<string, MoodTone> = {
  '😊': 'happy',
  '🤔': 'thinking',
  '😌': 'default',
  '😢': 'confused',
  '😡': 'anxious',
  '🎉': 'happy',
  '😴': 'default',
  '💡': 'creative',
  '❤️': 'grateful',
  '🔥': 'creative',
};

export function moodToTone(mood: string | null): MoodTone {
  if (!mood) return 'default';
  return EMOJI_TONE_MAP[mood] ?? 'default';
}

export function getMoodColors(tone: MoodTone): MoodColor {
  return MOOD_COLORS[tone];
}
