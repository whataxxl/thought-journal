import { Routes, Route } from 'react-router-dom';
import TabBar from './components/TabBar';
import TodayPage from './pages/TodayPage';
import AllPage from './pages/AllPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import ThoughtDetailPage from './pages/ThoughtDetailPage';

export default function App() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/all" element={<AllPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/thought/:id" element={<ThoughtDetailPage />} />
        </Routes>
      </div>
      <Routes>
        <Route path="/" element={<TabBar />} />
        <Route path="/all" element={<TabBar />} />
        <Route path="/calendar" element={<TabBar />} />
        <Route path="/settings" element={<TabBar />} />
        <Route path="/thought/:id" element={null} />
      </Routes>
    </div>
  );
}
