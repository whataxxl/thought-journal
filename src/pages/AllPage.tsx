import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { getAllTags } from '../database/tagRepo';
import ThoughtCard from '../components/ThoughtCard';
import MasonryGrid from '../components/MasonryGrid';
import { useMoodBackground } from '../hooks/useMoodBackground';
import { groupByDate } from '../utils/dateFormat';

export default function AllPage() {
  const navigate = useNavigate();
  const { thoughts } = useThoughts('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { bgColor } = useMoodBackground(thoughts);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => { getAllTags().then(setTags); }, [thoughts]);

  const filtered = useMemo(() =>
    selectedTag ? thoughts.filter((t) => t.tags.includes(selectedTag)) : thoughts,
  [thoughts, selectedTag]);

  const sections = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div
      className="flex flex-col h-full px-4 pt-[max(env(safe-area-inset-top),16px)] transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <h1 className="text-[28px] font-bold text-chocolate mt-2 mb-4">全部</h1>

      {tags.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {tags.map((t) => (
            <button key={t.name} onClick={() => setSelectedTag(selectedTag === t.name ? null : t.name)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap border ${selectedTag === t.name ? 'bg-amber text-cream-light border-amber' : 'bg-cream-light text-chocolate/60 border-chocolate/10'}`}>
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-y-auto flex-1 pb-4">
        {sections.map((sec) => (
          <div key={sec.title}>
            <p className="text-xs font-semibold text-chocolate/60 uppercase mb-2 mt-2">{sec.title}</p>
            <MasonryGrid>
              {sec.data.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15, mass: 0.8, delay: Math.min(i * 0.04, 0.25) }}
                >
                  <ThoughtCard thought={t} onClick={() => navigate(`/thought/${t.id}`)} />
                </motion.div>
              ))}
            </MasonryGrid>
          </div>
        ))}
        {sections.length === 0 && <p className="text-center text-chocolate/60 mt-16">还没有想法</p>}
      </div>
    </div>
  );
}
