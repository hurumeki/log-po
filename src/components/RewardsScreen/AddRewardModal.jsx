import { useState, useEffect } from 'react';
import { db } from '../../db/db';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AddRewardModal({ editing, onClose }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [requiredPoints, setRequiredPoints] = useState(500);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setRequiredPoints(editing.requiredPoints);
    }
  }, [editing]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    if (editing) {
      await db.rewards.update(editing.id, {
        title: title.trim(),
        requiredPoints: Math.max(1, Number(requiredPoints) || 1),
      });
    } else {
      await db.rewards.add({
        title: title.trim(),
        requiredPoints: Math.max(1, Number(requiredPoints) || 1),
        unlockedAt: null,
      });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-[60]" onClick={onClose} onTouchMove={e => e.preventDefault()}>
      <div
        className="bg-white w-full rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-md mx-auto"
        onClick={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {editing ? t.addReward.editTitle : t.addReward.addTitle}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 block mb-1">{t.addReward.contentLabel}</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder={t.addReward.contentPlaceholder}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">{t.addReward.pointsLabel}</label>
            <input
              type="number"
              value={requiredPoints}
              onChange={e => setRequiredPoints(e.target.value)}
              min={1}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-600"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl"
            >
              {editing ? t.common.update : t.common.add}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
