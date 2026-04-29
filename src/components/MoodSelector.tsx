import { useState } from 'react';

const PRESET = ['😊','🤔','😌','😢','😡','🎉','😴','💡','❤️','🔥'];

interface Props {
  mood: string | null;
  onChange: (mood: string | null) => void;
}

export default function MoodSelector({ mood, onChange }: Props) {
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState('');

  const submitCustom = () => {
    const t = custom.trim();
    if (t) onChange(t);
    setCustom(''); setShowCustom(false);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-0.5">
        {PRESET.map((e) => (
          <button key={e} onClick={() => onChange(mood === e ? null : e)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${mood === e ? 'bg-blue-50' : ''}`}>
            {e}
          </button>
        ))}
        <button onClick={() => setShowCustom(!showCustom)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-400 font-semibold ${showCustom ? 'bg-blue-50' : ''}`}>
          ...
        </button>
      </div>
      {showCustom && (
        <div className="flex items-center gap-2 mt-2">
          <input value={custom} onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitCustom(); }}
            placeholder="Custom mood..." className="flex-1 bg-gray-100 rounded-lg px-3 py-1.5 text-[15px] outline-none" />
          <button onClick={submitCustom} className="text-[#007AFF] font-semibold text-[15px]">Done</button>
        </div>
      )}
    </div>
  );
}
