import { useState, useEffect, useCallback } from 'react';
import type { Annotation } from '../types';
import { getAnnotationsByThoughtId } from '../database/annotationRepo';

export function useAnnotations(thoughtId: number | null) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(thoughtId !== null);

  const refresh = useCallback(async () => {
    if (thoughtId === null) return;
    setLoading(true);
    setAnnotations(await getAnnotationsByThoughtId(thoughtId));
    setLoading(false);
  }, [thoughtId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { annotations, loading, refresh };
}
