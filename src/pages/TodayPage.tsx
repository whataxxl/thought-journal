import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { useLocation } from '../hooks/useLocation';
import { insertThought } from '../database/thoughtRepo';
import { insertMedia } from '../database/mediaRepo';
import { getOrCreateTags, linkThoughtTags } from '../database/tagRepo';
import { type SaveData } from '../components/ThoughtInput';
import ThoughtCard from '../components/ThoughtCard';
import MasonryGrid from '../components/MasonryGrid';
import BreathingFAB from '../components/BreathingFAB';
import ImmersiveInput from '../components/ImmersiveInput';
import { useMoodBackground } from '../hooks/useMoodBackground';
import { todayStr } from '../utils/dateFormat';

export default function TodayPage() {
  const navigate = useNavigate();
  const { thoughts, loading, refresh } = useThoughts(todayStr());
  const { getCurrentLocation } = useLocation();
  const { bgColor } = useMoodBackground(thoughts);
  const [immersiveOpen, setImmersiveOpen] = useState(false);

  const handleSave = async (content: string, data: SaveData) => {
    const loc = await getCurrentLocation();
    const thoughtId = await insertThought(content, data.mood, loc?.latitude ?? null, loc?.longitude ?? null, loc?.placeName ?? null);
    await Promise.all([
      ...data.images.map((uri) => insertMedia(thoughtId, 'image', uri)),
      data.audioUri ? insertMedia(thoughtId, 'audio', data.audioUri) : null,
      data.tags.length ? getOrCreateTags(data.tags).then((ids) => linkThoughtTags(thoughtId, ids)) : null,
    ].filter(Boolean));
    setImmersiveOpen(false);
    refresh();
  };

  return (
    <div
      className="flex flex-col h-full px-4 pt-[max(env(safe-area-inset-top),16px)] transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <h1 className="text-[28px] font-bold text-chocolate mt-2 mb-4">今天</h1>
      <div className="overflow-y-auto flex-1 pb-4">
        {!loading && thoughts.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <p className="text-[15px] font-semibold text-chocolate/60">还没有想法</p>
            <p className="text-sm text-chocolate/50 mt-1">点击下方按钮记录你的想法</p>
          </div>
        )}
        {thoughts.length > 0 && (
          <MasonryGrid>
            {thoughts.map((t, i) => (
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
        )}
      </div>

      <BreathingFAB
        onRecordClick={() => setImmersiveOpen(true)}
        onLongPress={() => setImmersiveOpen(true)}
      />

      <ImmersiveInput
        visible={immersiveOpen}
        onSave={handleSave}
        onClose={() => setImmersiveOpen(false)}
      />
    </div>
  );
}
