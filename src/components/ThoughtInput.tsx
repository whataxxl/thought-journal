import { useState } from 'react';
import ImagePicker from './ImagePicker';
import AudioRecorder from './AudioRecorder';
import TagInput from './TagInput';
import MoodSelector from './MoodSelector';

export interface SaveData {
  images: string[];
  audioUri: string | null;
  tags: string[];
  mood: string | null;
}

interface Props {
  onSave: (content: string, data: SaveData) => Promise<void>;
  className?: string;
}

export default function ThoughtInput({ onSave, className }: Props) {
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    await onSave(trimmed, { images, audioUri, tags, mood });
    setText(''); setImages([]); setAudioUri(null); setTags([]); setMood(null);
    setSaving(false);
  };

  return (
    <div className={`bg-cream-light rounded-[28px] p-4 mb-4 shadow-card ${className ?? ''}`}>
      <textarea
        className="w-full text-[17px] leading-6 text-chocolate placeholder-chocolate/40 resize-none outline-none min-h-[80px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="此刻的想法..."
      />
      <ImagePicker images={images} onChange={setImages} />
      <MoodSelector mood={mood} onChange={setMood} />
      <TagInput tags={tags} onChange={setTags} />
      <div className="flex items-end justify-between mt-3">
        <AudioRecorder audioUri={audioUri} onChange={setAudioUri} />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber text-cream-light font-semibold px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? '保存中...' : '记录'}
        </button>
      </div>
    </div>
  );
}
