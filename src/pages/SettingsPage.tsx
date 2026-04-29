import { useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import { db } from '../database/db';
import { exportAll } from '../utils/export';

export default function SettingsPage() {
  const { permissionGranted, requestPermission } = useLocation();
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('删除所有想法和批注？此操作不可撤销。')) return;
    setDeleting(true);
    await Promise.all([
      db.thoughts.clear(), db.annotations.clear(), db.tags.clear(),
      db.thoughtTags.clear(), db.media.clear(),
    ]);
    setDeleting(false);
  };

  return (
    <div className="flex flex-col h-full bg-cream px-4 pt-[max(env(safe-area-inset-top),16px)]">
      <h1 className="text-[28px] font-bold text-chocolate mt-2 mb-6">设置</h1>

      <div className="bg-cream-light rounded-[24px] p-4 mb-4 shadow-card">
        <h2 className="text-[17px] font-semibold text-chocolate mb-1">位置</h2>
        <p className="text-[15px] text-chocolate/60 leading-[22px] mb-2">
          {permissionGranted ? '已授权位置访问' : '未授权位置访问'}
        </p>
        {!permissionGranted && (
          <button onClick={requestPermission}
            className="bg-amber text-cream-light font-semibold rounded-lg px-4 py-2.5 text-[15px]">
            授权访问
          </button>
        )}
      </div>

      <div className="bg-cream-light rounded-[24px] p-4 mb-4 shadow-card">
        <h2 className="text-[17px] font-semibold text-chocolate mb-1">导出</h2>
        <p className="text-[15px] text-chocolate/60 leading-[22px] mb-2">导出所有想法为 JSON 和 Markdown 格式</p>
        <button onClick={async () => { setExporting(true); await exportAll(); setExporting(false); }}
          disabled={exporting}
          className="bg-amber text-cream-light font-semibold rounded-lg px-4 py-2.5 text-[15px] disabled:opacity-50">
          {exporting ? '导出中...' : '导出数据'}
        </button>
      </div>

      <div className="bg-cream-light rounded-[24px] p-4 mb-4 shadow-card">
        <h2 className="text-[17px] font-semibold text-chocolate mb-1">数据</h2>
        <p className="text-[15px] text-chocolate/60 leading-[22px] mb-2">永久删除所有数据</p>
        <button onClick={handleDelete} disabled={deleting}
          className="border border-coral text-coral font-semibold rounded-lg px-4 py-2.5 text-[15px]">
          {deleting ? '删除中...' : '删除所有数据'}
        </button>
      </div>

      <div className="bg-cream-light rounded-[24px] p-4 shadow-card">
        <h2 className="text-[17px] font-semibold text-chocolate mb-1">关于</h2>
        <p className="text-[15px] text-chocolate/60 leading-[22px]">想法记录 v1.0 — PWA</p>
      </div>
    </div>
  );
}
