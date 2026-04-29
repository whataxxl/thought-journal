import type { Annotation } from '../types';
import LocationBadge from './LocationBadge';

export default function AnnotationItem({ annotation, isLast }: { annotation: Annotation; isLast: boolean }) {
  return (
    <div className="flex pl-1">
      <div className="w-6 flex flex-col items-center pt-1">
        <div className="w-2 h-2 rounded-full bg-[#007AFF]" />
        {!isLast && <div className="w-0.5 flex-1 bg-blue-200 mt-1" />}
      </div>
      <div className="flex-1 bg-blue-50 rounded-[10px] p-2.5 ml-2 mb-2">
        {annotation.paragraphIndex > 0 && (
          <div className="text-[11px] font-semibold text-[#007AFF] mb-1">
            ¶ {annotation.paragraphIndex + 1}
          </div>
        )}
        <p className="text-[15px] text-black leading-[22px] mb-1">{annotation.content}</p>
        <LocationBadge dateTime={annotation.createdAt} placeName={annotation.placeName} />
      </div>
    </div>
  );
}
