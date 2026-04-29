import { db } from './db';

export async function getOrCreateTags(names: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const name of names) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const existing = await db.tags.where('name').equals(trimmed).first();
    if (existing) {
      ids.push(existing.id!);
    } else {
      const id = await db.tags.add({ name: trimmed });
      ids.push(id);
    }
  }
  return ids;
}

export async function linkThoughtTags(thoughtId: number, tagIds: number[]): Promise<void> {
  for (const tagId of tagIds) {
    await db.thoughtTags.put({ thoughtId, tagId });
  }
}

export async function getTagNamesForThought(thoughtId: number): Promise<string[]> {
  const links = await db.thoughtTags.where('thoughtId').equals(thoughtId).toArray();
  const tags = await db.tags.bulkGet(links.map((l) => l.tagId));
  return tags.filter((t): t is NonNullable<typeof t> => t !== undefined).map((t) => t.name);
}

export async function getAllTags(): Promise<{ id: number; name: string }[]> {
  const rows = await db.tags.orderBy('name').toArray();
  return rows.map((r) => ({ id: r.id!, name: r.name }));
}

export async function getThoughtIdsByTag(tagId: number): Promise<number[]> {
  const links = await db.thoughtTags.where('tagId').equals(tagId).toArray();
  return links.map((l) => l.thoughtId);
}
