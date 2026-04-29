import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { getAllTags } from '../database/tagRepo';
import ThoughtCard from '../components/ThoughtCard';
import { groupByDate, formatDate, formatDateDisplay } from '../utils/dateFormat';

type ViewMode = 'all' | 'date';

export default function BrowsePage() {
  const navigate = useNavigate();
  const { thoughts } = useThoughts('all');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => { getAllTags().then(setTags); }, [thoughts]);

  const byTag = useMemo(() =>
    selectedTag ? thoughts.filter((t) => t.tags.includes(selectedTag)) : thoughts,
  [thoughts, selectedTag]);

  const sections = useMemo(() => groupByDate(byTag), [byTag]);

  const dates = useMemo(() => {
    const m = new Map<string, { dateStr: string; label: string; count: number }>();
    for (const t of byTag) {
      const key = formatDate(t.createdAt);
      if (!m.has(key)) m.set(key, { dateStr: key, label: formatDateDisplay(t.createdAt), count: 0 });
      m.get(key)!.count++;
    }
    return Array.from(m.values());
  }, [byTag]);

  const byDate = useMemo(() =>
    selectedDate ? byTag.filter((t) => t.createdAt.startsWith(selectedDate)) : [],
  [byTag, selectedDate]);

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] px-4 pt-[max(env(safe-area-inset-top),16px)]">
      <h1 className="text-[28px] font-bold text-black mt-2 mb-4">Browse</h1>

      <div className="flex bg-white rounded-lg p-0.5 mb-2">
        <button onClick={() => setViewMode('all')}
          className={`flex-1 py-1.5 rounded-md text-[13px] font-semibold ${viewMode === 'all' ? 'bg-[#007AFF] text-white' : 'text-gray-500'}`}>
          All
        </button>
        <button onClick={() => setViewMode('date')}
          className={`flex-1 py-1.5 rounded-md text-[13px] font-semibold ${viewMode === 'date' ? 'bg-[#007AFF] text-white' : 'text-gray-500'}`}>
          By Date
        </button>
      </div>

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
        {viewMode === 'all' && (
          <>
            {sections.map((sec) => (
              <div key={sec.title}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-2">{sec.title}</p>
                {sec.data.map((t) => (
                  <ThoughtCard key={t.id} thought={t} onClick={() => navigate(`/thought/${t.id}`)} />
                ))}
              </div>
            ))}
            {sections.length === 0 && <p className="text-center text-gray-500 mt-16">No thoughts yet</p>}
          </>
        )}

        {viewMode === 'date' && (
          <>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {dates.map((d) => (
                <button key={d.dateStr} onClick={() => setSelectedDate(selectedDate === d.dateStr ? null : d.dateStr)}
                  className={`px-4 py-2 rounded-lg text-center min-w-[64px] ${selectedDate === d.dateStr ? 'bg-[#007AFF] text-white' : 'bg-white'}`}>
                  <div className="text-[13px] font-semibold">{d.dateStr.slice(5)}</div>
                  <div className={`text-[11px] ${selectedDate === d.dateStr ? 'text-white/70' : 'text-gray-400'}`}>{d.count}</div>
                </button>
              ))}
            </div>
            {selectedDate && byDate.map((t) => (
              <ThoughtCard key={t.id} thought={t} onClick={() => navigate(`/thought/${t.id}`)} />
            ))}
            {selectedDate && byDate.length === 0 && <p className="text-center text-gray-500 mt-8">No thoughts on this date</p>}
            {!selectedDate && byTag.length > 0 && <p className="text-center text-gray-400 mt-8">Select a date above</p>}
          </>
        )}
      </div>
    </div>
  );
}
