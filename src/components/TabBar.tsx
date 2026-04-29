import { useNavigate, useLocation } from 'react-router-dom';
import { Pencil, List, CalendarDays, Settings } from 'lucide-react';

const TABS = [
  { path: '/', label: '今天', icon: Pencil },
  { path: '/all', label: '全部', icon: List },
  { path: '/calendar', label: '日历', icon: CalendarDays },
  { path: '/settings', label: '设置', icon: Settings },
] as const;

export default function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom,0px)]">
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <button key={path} onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center py-2">
            <Icon size={24} color={active ? '#007AFF' : '#8E8E93'} />
            <span className={`text-[10px] font-semibold mt-0.5 ${active ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
