import { useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import { db } from '../database/db';
import { exportAll } from '../utils/export';

export default function SettingsPage() {
  const { permissionGranted, requestPermission } = useLocation();
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete all thoughts and annotations? This cannot be undone.')) return;
    setDeleting(true);
    await Promise.all([
      db.thoughts.clear(), db.annotations.clear(), db.tags.clear(),
      db.thoughtTags.clear(), db.media.clear(),
    ]);
    setDeleting(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] px-4 pt-[max(env(safe-area-inset-top),16px)]">
      <h1 className="text-[28px] font-bold text-black mt-2 mb-6">Settings</h1>

      <div className="bg-white rounded-xl p-4 mb-4">
        <h2 className="text-[17px] font-semibold text-black mb-1">Location</h2>
        <p className="text-[15px] text-gray-500 leading-[22px] mb-2">
          {permissionGranted ? 'Location access is granted.' : 'Location access is not granted.'}
        </p>
        {!permissionGranted && (
          <button onClick={requestPermission}
            className="bg-[#007AFF] text-white font-semibold rounded-lg px-4 py-2.5 text-[15px]">
            Grant Access
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <h2 className="text-[17px] font-semibold text-black mb-1">Export</h2>
        <p className="text-[15px] text-gray-500 leading-[22px] mb-2">Export all thoughts as JSON and Markdown.</p>
        <button onClick={async () => { setExporting(true); await exportAll(); setExporting(false); }}
          disabled={exporting}
          className="bg-[#007AFF] text-white font-semibold rounded-lg px-4 py-2.5 text-[15px] disabled:opacity-50">
          {exporting ? 'Exporting...' : 'Export Data'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <h2 className="text-[17px] font-semibold text-black mb-1">Data</h2>
        <p className="text-[15px] text-gray-500 leading-[22px] mb-2">Permanently delete all data.</p>
        <button onClick={handleDelete} disabled={deleting}
          className="border border-red-500 text-red-500 font-semibold rounded-lg px-4 py-2.5 text-[15px]">
          {deleting ? 'Deleting...' : 'Delete All Data'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-4">
        <h2 className="text-[17px] font-semibold text-black mb-1">About</h2>
        <p className="text-[15px] text-gray-500 leading-[22px]">Thought Journal v1.0 — PWA</p>
      </div>
    </div>
  );
}
