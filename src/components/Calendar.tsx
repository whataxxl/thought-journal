import type { Thought } from '../types';

interface Props {
  thoughts: Thought[];
  year: number;
  month: number;
  selectedDate: string | null;
  onSelectDate: (dateStr: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

function pad(n: number) { return n.toString().padStart(2, '0'); }

export default function Calendar({ thoughts, year, month, selectedDate, onSelectDate, onPrevMonth, onNextMonth }: Props) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Build map: dateStr → mood emoji
  const moodMap = new Map<string, string>();
  for (const t of thoughts) {
    const key = t.createdAt.slice(0, 10);
    if (!moodMap.has(key) && t.mood) {
      moodMap.set(key, t.mood);
    } else if (!moodMap.has(key)) {
      moodMap.set(key, '·');
    }
  }

  // Day grid
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun → we want 0=Mon
  const monFirst = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(monFirst).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center text-chocolate/60 text-lg">&lt;</button>
        <span className="text-[17px] font-semibold text-chocolate">{year}年{month + 1}月</span>
        <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center text-chocolate/60 text-lg">&gt;</button>
      </div>

      <div className="grid grid-cols-7 text-center mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-[11px] font-medium text-chocolate/50 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const mood = moodMap.get(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={`relative flex flex-col items-center justify-center rounded-lg py-1 ${
                isSelected ? 'bg-amber' : isToday ? 'bg-amber/15' : ''
              }`}
            >
              <span className={`text-[15px] ${isSelected ? 'text-cream-light font-semibold' : isToday ? 'text-amber font-semibold' : 'text-chocolate'}`}>
                {day}
              </span>
              {mood && (
                <span className="text-[11px] leading-none mt-0.5">
                  {mood}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
