import { Clock, MapPin } from 'lucide-react';
import { formatTime } from '../utils/dateFormat';

export default function LocationBadge({ dateTime, placeName }: { dateTime: string; placeName: string | null }) {
  return (
    <div className="flex items-center gap-1 text-xs text-chocolate/50">
      <Clock size={12} />
      <span>{formatTime(dateTime)}</span>
      {placeName && (
        <>
          <MapPin size={12} />
          <span className="truncate">{placeName}</span>
        </>
      )}
    </div>
  );
}
