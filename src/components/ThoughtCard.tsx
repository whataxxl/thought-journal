import { Image, Mic } from 'lucide-react';
import type { Thought } from '../types';
import LocationBadge from './LocationBadge';

export default function ThoughtCard({ thought, onClick }: { thought: Thought; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl p-4 mb-1.5 active:opacity-60 cursor-pointer">
      <p className="text-[15px] text-black leading-[22px] line-clamp-2 mb-2">{thought.content}</p>
      <div className="flex items-center gap-3 flex-wrap">
        <LocationBadge dateTime={thought.createdAt} placeName={thought.placeName} />
        {thought.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="bg-blue-50 text-[#007AFF] text-[11px] font-medium px-1.5 py-0.5 rounded">{tag}</span>
        ))}
        {thought.mood && <span className="text-base">{thought.mood}</span>}
        {thought.media.length > 0 && (
          <div className="flex items-center gap-0.5 text-xs text-gray-400">
            {thought.media.some((m) => m.type === 'image') && <Image size={14} />}
            {thought.media.some((m) => m.type === 'audio') && <Mic size={14} />}
            <span>{thought.media.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
