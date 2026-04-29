export interface Thought {
  id: number;
  content: string;
  mood: string | null;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
  tags: string[];
  media: MediaItem[];
}

export interface Annotation {
  id: number;
  thoughtId: number;
  paragraphIndex: number;
  content: string;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
}

export interface MediaItem {
  id: number;
  thoughtId: number;
  type: 'image' | 'audio';
  uri: string;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
}
