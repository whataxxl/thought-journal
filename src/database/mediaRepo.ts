import { db } from './db';
import type { MediaItem } from '../types';

export async function insertMedia(thoughtId: number, type: 'image' | 'audio', uri: string): Promise<number> {
  return db.media.add({ thoughtId, type, uri, createdAt: new Date().toISOString() });
}

export async function getMediaByThoughtId(thoughtId: number): Promise<MediaItem[]> {
  const rows = await db.media.where('thoughtId').equals(thoughtId).sortBy('createdAt');
  return rows.map((r) => ({
    id: r.id!, thoughtId: r.thoughtId, type: r.type, uri: r.uri, createdAt: r.createdAt,
  }));
}
