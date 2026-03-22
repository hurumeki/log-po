import { useState } from 'react';

export default function ContextMenu({ onEdit, onDelete, className = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(s => !s); }}
        className="text-slate-400 px-2 py-1 text-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        ⋯
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={e => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute right-0 top-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-sm overflow-hidden">
            <button
              onClick={e => { e.stopPropagation(); setOpen(false); onEdit(); }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-50"
            >
              ✏️ 編集
            </button>
            <button
              onClick={e => { e.stopPropagation(); setOpen(false); onDelete(); }}
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            >
              🗑 削除
            </button>
          </div>
        </>
      )}
    </div>
  );
}
