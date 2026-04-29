import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import ThoughtCard from '../components/ThoughtCard';
import Calendar from '../components/Calendar';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { thoughts } = useThoughts('all');
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const byDate = useMemo(() =>
    selectedDate ? thoughts.filter((t) => t.createdAt.startsWith(selectedDate)) : [],
  [thoughts, selectedDate]);

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] px-4 pt-[max(env(safe-area-inset-top),16px)]">
      <h1 className="text-[28px] font-bold text-black mt-2 mb-4">日历</h1>

      <div className="overflow-y-auto flex-1 pb-4">
        <Calendar
          thoughts={thoughts}
          year={year} month={month}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={prevMonth} onNextMonth={nextMonth}
        />

        {selectedDate && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{selectedDate}</p>
            {byDate.map((t) => (
              <ThoughtCard key={t.id} thought={t} onClick={() => navigate(`/thought/${t.id}`)} />
            ))}
            {byDate.length === 0 && <p className="text-center text-gray-400 mt-4">这一天没有想法</p>}
          </div>
        )}
      </div>
    </div>
  );
}
