import { db } from './db';
import type { Annotation } from '../types';

export async function insertAnnotation(
  thoughtId: number, paragraphIndex: number, content: string,
  latitude: number | null, longitude: number | null, placeName: string | null,
): Promise<number> {
  return db.annotations.add({
    thoughtId, paragraphIndex, content,
    createdAt: new Date().toISOString(),
    latitude, longitude, placeName,
  });
}

export async function getAnnotationsByThoughtId(thoughtId: number): Promise<Annotation[]> {
  const rows = await db.annotations
    .where('thoughtId').equals(thoughtId)
    .sortBy('createdAt');
  return rows.map((r) => ({
    id: r.id!,
    thoughtId: r.thoughtId,
    paragraphIndex: r.paragraphIndex,
    content: r.content,
    createdAt: r.createdAt,
    latitude: r.latitude,
    longitude: r.longitude,
    placeName: r.placeName,
  }));
}
