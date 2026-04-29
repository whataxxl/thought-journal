import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { useLocation } from '../hooks/useLocation';
import { insertThought } from '../database/thoughtRepo';
import { insertMedia } from '../database/mediaRepo';
import { getOrCreateTags, linkThoughtTags } from '../database/tagRepo';
import ThoughtInput, { type SaveData } from '../components/ThoughtInput';
import ThoughtCard from '../components/ThoughtCard';
import { todayStr } from '../utils/dateFormat';

export default function TodayPage() {
  const navigate = useNavigate();
  const { thoughts, loading, refresh } = useThoughts(todayStr());
  const { getCurrentLocation } = useLocation();

  const handleSave = async (content: string, data: SaveData) => {
    const loc = await getCurrentLocation();
    const thoughtId = await insertThought(content, data.mood, loc?.latitude ?? null, loc?.longitude ?? null, loc?.placeName ?? null);
    await Promise.all([
      ...data.images.map((uri) => insertMedia(thoughtId, 'image', uri)),
      data.audioUri ? insertMedia(thoughtId, 'audio', data.audioUri) : null,
      data.tags.length ? getOrCreateTags(data.tags).then((ids) => linkThoughtTags(thoughtId, ids)) : null,
    ].filter(Boolean));
    refresh();
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] px-4 pt-[max(env(safe-area-inset-top),16px)]">
      <h1 className="text-[28px] font-bold text-black mt-2 mb-4">今天</h1>
      <div className="overflow-y-auto flex-1 pb-4">
        <ThoughtInput onSave={handleSave} />
        {!loading && thoughts.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <p className="text-[15px] font-semibold text-gray-500">还没有想法</p>
            <p className="text-sm text-gray-400 mt-1">在上方记录你的想法</p>
          </div>
        )}
        {thoughts.map((t) => (
          <ThoughtCard key={t.id} thought={t} onClick={() => navigate(`/thought/${t.id}`)} />
        ))}
      </div>
    </div>
  );
}
