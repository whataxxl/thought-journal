import { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
  const [text, setText] = useState('');

  const addTag = () => {
    const t = text.trim();
    if (!t || tags.includes(t)) { setText(''); return; }
    onChange([...tags, t]);
    setText('');
  };

  return (
    <div className="mt-3">
      {tags.length > 0 && (
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {tags.map((tag, i) => (
            <button key={i} onClick={() => onChange(tags.filter((_, j) => j !== i))}
              className="flex items-center gap-1 bg-blue-50 text-[#007AFF] text-[13px] font-medium px-2 py-1 rounded-md">
              {tag} <X size={14} />
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Tag size={16} className="text-gray-400" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTag(); }}
          placeholder="Add tag..."
          className="flex-1 text-[13px] outline-none bg-transparent text-black placeholder-gray-400"
        />
      </div>
    </div>
  );
}
