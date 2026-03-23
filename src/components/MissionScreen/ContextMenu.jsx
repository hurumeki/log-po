import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ContextMenu({ onEdit, onDelete, className = '', size = 'default' }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  function handleToggle(e) {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(s => !s);
  }

  const sizeClass = size === 'small'
    ? 'min-w-[44px] min-h-[36px] py-0'
    : 'min-w-[44px] min-h-[44px] py-1';

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`text-slate-400 px-2 text-sm flex items-center justify-center ${sizeClass}`}
      >
        ⋯
      </button>
      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={e => { e.stopPropagation(); setOpen(false); }} />
          <div
            className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-[9999] text-sm overflow-hidden whitespace-nowrap"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              onClick={e => { e.stopPropagation(); setOpen(false); onEdit(); }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-50"
            >
              {t.contextMenu.edit}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setOpen(false); onDelete(); }}
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            >
              {t.contextMenu.delete}
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
