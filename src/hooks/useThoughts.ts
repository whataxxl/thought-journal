import { useState, useEffect, useCallback } from 'react';
import type { Thought } from '../types';
import { getThoughtsByDate, getAllThoughts } from '../database/thoughtRepo';

export function useThoughts(date: 'all' | string) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = date === 'all' ? await getAllThoughts() : await getThoughtsByDate(date);
    setThoughts(result);
    setLoading(false);
  }, [date]);

  useEffect(() => { refresh(); }, [refresh]);

  return { thoughts, loading, refresh };
}
