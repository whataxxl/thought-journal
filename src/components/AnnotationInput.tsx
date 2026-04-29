import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  onSave: (content: string) => Promise<void>;
  placeholder?: string;
  onCancel?: () => void;
}

export default function AnnotationInput({ onSave, placeholder = '添加备注...', onCancel }: Props) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const t = text.trim();
    if (!t || saving) return;
    setSaving(true);
    await onSave(t);
    setText('');
    setSaving(false);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {onCancel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#007AFF] font-medium">{placeholder}</span>
          <button onClick={onCancel}><X size={18} className="text-gray-400" /></button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={onCancel ? '输入批注...' : placeholder}
          className="flex-1 text-[15px] bg-gray-100 rounded-lg px-3 py-2 outline-none resize-none min-h-[40px] max-h-[80px]"
          rows={2}
        />
        <button onClick={handleSave} disabled={saving}
          className="bg-[#007AFF] text-white font-semibold rounded-lg px-4 py-2 text-[15px] disabled:opacity-50">
          {saving ? '...' : '添加'}
        </button>
      </div>
    </div>
  );
}
