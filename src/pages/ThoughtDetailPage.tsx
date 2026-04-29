import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import type { Thought } from '../types';
import { getThoughtById } from '../database/thoughtRepo';
import { insertAnnotation } from '../database/annotationRepo';
import { useAnnotations } from '../hooks/useAnnotations';
import { useLocation } from '../hooks/useLocation';
import AnnotationItem from '../components/AnnotationItem';
import AnnotationInput from '../components/AnnotationInput';
import LocationBadge from '../components/LocationBadge';

export default function ThoughtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const thoughtId = Number(id);

  const [thought, setThought] = useState<Thought | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPara, setSelectedPara] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { annotations, refresh } = useAnnotations(isNaN(thoughtId) ? null : thoughtId);
  const { getCurrentLocation } = useLocation();

  useEffect(() => {
    if (isNaN(thoughtId)) { setLoading(false); return; }
    getThoughtById(thoughtId).then((t) => { setThought(t); setLoading(false); });
    return () => { audioRef.current?.pause(); };
  }, [thoughtId]);

  const handleSaveAnnotation = useCallback(async (content: string) => {
    if (isNaN(thoughtId)) return;
    const loc = await getCurrentLocation();
    await insertAnnotation(thoughtId, selectedPara ?? 0, content, loc?.latitude ?? null, loc?.longitude ?? null, loc?.placeName ?? null);
    setSelectedPara(null);
    refresh();
  }, [thoughtId, selectedPara, refresh, getCurrentLocation]);

  if (loading) return <div className="flex-1 flex items-center justify-center bg-[#F2F2F7]"><div className="w-8 h-8 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" /></div>;
  if (!thought) return <div className="flex-1 flex items-center justify-center bg-[#F2F2F7]"><p className="text-gray-500">Not found</p></div>;

  const paragraphs = thought.content.split('\n').filter((p) => p.trim());
  const generalAnnotations = annotations.filter((a) => a.paragraphIndex === 0);

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <div className="flex items-center gap-3 px-4 pt-[max(env(safe-area-inset-top),8px)] pb-3 bg-[#F2F2F7]">
        <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
      </div>

      <div className="overflow-y-auto flex-1 px-4 pb-4">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <LocationBadge dateTime={thought.createdAt} placeName={thought.placeName} />
          {thought.mood && <span className="text-xl">{thought.mood}</span>}
          {thought.tags.map((tag) => (
            <span key={tag} className="bg-blue-50 text-[#007AFF] text-[11px] font-medium px-1.5 py-0.5 rounded">{tag}</span>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          {paragraphs.map((para, i) => (
            <div key={i}>
              <div onContextMenu={(e) => { e.preventDefault(); setSelectedPara(i + 1); }}
                className={`p-1 rounded-lg mb-2 ${selectedPara === i + 1 ? 'bg-blue-50' : ''}`}>
                <p className="text-[17px] text-black leading-[26px]">{para}</p>
                {selectedPara === i + 1 && (
                  <p className="text-xs text-[#007AFF] mt-1">Add annotation below</p>
                )}
              </div>
              {annotations.filter((a) => a.paragraphIndex === i + 1).map((a, ai, arr) => (
                <AnnotationItem key={a.id} annotation={a} isLast={ai === arr.length - 1} />
              ))}
            </div>
          ))}
          {paragraphs.length === 0 && <p className="text-[17px] text-black leading-[26px]">{thought.content}</p>}
        </div>

        {thought.media.length > 0 && (
          <div className="mb-4 space-y-2">
            {thought.media.map((m) => (
              <div key={m.id} className="rounded-xl overflow-hidden">
                {m.type === 'image' && <img src={m.uri} className="w-full h-[200px] object-cover rounded-xl" alt="" />}
                {m.type === 'audio' && (
                  <button onClick={() => { const a = new Audio(m.uri); audioRef.current = a; a.play(); }}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 w-full">
                    <PlayCircle size={32} className="text-[#007AFF]" />
                    <span className="text-[15px] text-[#007AFF] font-medium">Play recording</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {generalAnnotations.length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</p>
            {generalAnnotations.map((a, i) => <AnnotationItem key={a.id} annotation={a} isLast={i === generalAnnotations.length - 1} />)}
          </>
        )}
        {annotations.length === 0 && <p className="text-center text-gray-400 mt-8">Long press a paragraph to annotate it</p>}
        <div className="h-8" />
      </div>

      <AnnotationInput onSave={handleSaveAnnotation}
        placeholder={selectedPara ? `Annotate paragraph ${selectedPara}...` : 'Add a general note...'}
        onCancel={selectedPara ? () => setSelectedPara(null) : undefined} />
    </div>
  );
}
