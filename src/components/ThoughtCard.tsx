import { motion } from 'framer-motion';
import { Image, Mic } from 'lucide-react';
import type { Thought } from '../types';
import LocationBadge from './LocationBadge';

export default function ThoughtCard({ thought, onClick }: { thought: Thought; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      className="bg-cream-light rounded-[28px] p-4 mb-3 shadow-card break-inside-avoid cursor-pointer"
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(255, 191, 0, 0.22)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      <p className="text-[15px] text-chocolate leading-[22px] line-clamp-2 mb-2">{thought.content}</p>
      <div className="flex items-center gap-3 flex-wrap">
        <LocationBadge dateTime={thought.createdAt} placeName={thought.placeName} />
        {thought.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="bg-amber/15 text-amber text-[11px] font-medium px-1.5 py-0.5 rounded">{tag}</span>
        ))}
        {thought.mood && <span className="text-base">{thought.mood}</span>}
        {thought.media.length > 0 && (
          <div className="flex items-center gap-0.5 text-xs text-chocolate/50">
            {thought.media.some((m) => m.type === 'image') && <Image size={14} />}
            {thought.media.some((m) => m.type === 'audio') && <Mic size={14} />}
            <span>{thought.media.length}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
