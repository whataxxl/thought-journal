import { db, type ThoughtRow } from './db';
import type { Thought } from '../types';
import { getTagNamesForThought } from './tagRepo';
import { getMediaByThoughtId } from './mediaRepo';

async function enrichThought(row: ThoughtRow): Promise<Thought> {
  const [tags, media] = await Promise.all([
    getTagNamesForThought(row.id!),
    getMediaByThoughtId(row.id!),
  ]);
  return {
    id: row.id!,
    content: row.content,
    mood: row.mood,
    createdAt: row.createdAt,
    latitude: row.latitude,
    longitude: row.longitude,
    placeName: row.placeName,
    tags,
    media,
  };
}

export async function insertThought(
  content: string, mood: string | null,
  latitude: number | null, longitude: number | null, placeName: string | null,
): Promise<number> {
  return db.thoughts.add({
    content, mood,
    createdAt: new Date().toISOString(),
    latitude, longitude, placeName,
  });
}

export async function getThoughtsByDate(dateStr: string): Promise<Thought[]> {
  const rows = await db.thoughts
    .orderBy('createdAt')
    .reverse()
    .toArray();
  const filtered = rows.filter((r) => r.createdAt.startsWith(dateStr));
  return Promise.all(filtered.map(enrichThought));
}

export async function getAllThoughts(): Promise<Thought[]> {
  const rows = await db.thoughts.orderBy('createdAt').reverse().toArray();
  return Promise.all(rows.map(enrichThought));
}

export async function getThoughtById(id: number): Promise<Thought | null> {
  const row = await db.thoughts.get(id);
  return row ? enrichThought(row) : null;
}

export async function getThoughtsByIds(ids: number[]): Promise<Thought[]> {
  const rows = await db.thoughts.bulkGet(ids);
  const valid = rows.filter((r): r is NonNullable<typeof r> => r !== undefined);
  return Promise.all(valid.map(enrichThought));
}
