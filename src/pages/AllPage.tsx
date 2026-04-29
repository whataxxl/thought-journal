import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { getAllTags } from '../database/tagRepo';
import ThoughtCard from '../components/ThoughtCard';
import { groupByDate } from '../utils/dateFormat';

export default function AllPage() {
  const navigate = useNavigate();
  const { thoughts } = useThoughts('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => { getAllTags().then(setTags); }, [thoughts]);

  const filtered = useMemo(() =>
    selectedTag ? thoughts.filter((t) => t.tags.includes(selectedTag)) : thoughts,
  [thoughts, selectedTag]);

  const sections = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] px-4 pt-[max(env(safe-area-inset-top),16px)]">
      <h1 className="text-[28px] font-bold text-black mt-2 mb-4">全部</h1>

      {tags.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {tags.map((t) => (
            <button key={t.name} onClick={() => setSelectedTag(selectedTag === t.name ? null : t.name)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap border ${selectedTag === t.name ? 'bg-[#007AFF] text-white border-[#007AFF]' : 'bg-white text-gray-500 border-gray-200'}`}>
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-y-auto flex-1 pb-4">
        {sections.map((sec) => (
          <div key={sec.title}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-2">{sec.title}</p>
            {sec.data.map((t) => (
              <ThoughtCard key={t.id} thought={t} onClick={() => navigate(`/thought/${t.id}`)} />
            ))}
          </div>
        ))}
        {sections.length === 0 && <p className="text-center text-gray-500 mt-16">还没有想法</p>}
      </div>
    </div>
  );
}
