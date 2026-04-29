import Dexie, { type Table } from 'dexie';

export interface ThoughtRow {
  id?: number;
  content: string;
  mood: string | null;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
}

export interface AnnotationRow {
  id?: number;
  thoughtId: number;
  paragraphIndex: number;
  content: string;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
}

export interface MediaRow {
  id?: number;
  thoughtId: number;
  type: 'image' | 'audio';
  uri: string;
  createdAt: string;
}

export interface TagRow {
  id?: number;
  name: string;
}

export interface ThoughtTagRow {
  thoughtId: number;
  tagId: number;
}

class ThoughtJournalDB extends Dexie {
  thoughts!: Table<ThoughtRow, number>;
  annotations!: Table<AnnotationRow, number>;
  tags!: Table<TagRow, number>;
  thoughtTags!: Table<ThoughtTagRow, number>;
  media!: Table<MediaRow, number>;

  constructor() {
    super('ThoughtJournal');
    this.version(1).stores({
      thoughts: '++id, createdAt',
      annotations: '++id, thoughtId',
      tags: '++id, &name',
      thoughtTags: '[thoughtId+tagId], thoughtId, tagId',
      media: '++id, thoughtId',
    });
  }
}

export const db = new ThoughtJournalDB();
