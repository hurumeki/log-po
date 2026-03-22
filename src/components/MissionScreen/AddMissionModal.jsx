import { useState, useEffect } from 'react';
import { db } from '../../db/db';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function AddMissionModal({ missions, editing, onClose }) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [interval, setInterval] = useState('daily');
  const [weekday, setWeekday] = useState(1);
  const [points, setPoints] = useState(10);
  const [parentId, setParentId] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setMemo(editing.memo || '');
      setInterval(editing.interval);
      setWeekday(editing.weekday ?? 1);
      setPoints(editing.points);
      setParentId(editing.parentId ? String(editing.parentId) : '');
    }
  }, [editing]);

  // Only allow selecting non-leaf missions with depth < 2 as parents
  const possibleParents = missions.filter(m => m.depth < 2);

  async function handleSubmit(e) {
    e.preventDefault();
    const pid = parentId ? parseInt(parentId) : null;
    const parent = pid ? missions.find(m => m.id === pid) : null;
    const depth = parent ? parent.depth + 1 : 0;

    const data = {
      title: title.trim(),
      memo: memo.trim(),
      interval,
      weekday: interval === 'weekly' ? weekday : null,
      points: Number(points),
      parentId: pid,
      depth,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    if (editing) {
      await db.missions.update(editing.id, {
        title: data.title,
        memo: data.memo,
        interval: data.interval,
        weekday: data.weekday,
        points: data.points,
      });
    } else {
      await db.missions.add(data);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-[60]" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-md mx-auto max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {editing ? 'ミッション編集' : 'ミッション追加'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 block mb-1">タイトル *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="例：腕立て10回"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 block mb-1">メモ</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {!editing && (
            <div>
              <label className="text-sm text-slate-600 block mb-1">親カテゴリ（任意）</label>
              <select
                value={parentId}
                onChange={e => setParentId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">トップレベル</option>
                {possibleParents.map(m => (
                  <option key={m.id} value={m.id}>
                    {'　'.repeat(m.depth)}{m.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600 block mb-1">間隔</label>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInterval(v)}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                    interval === v
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  {v === 'daily' ? '日次' : v === 'weekly' ? '週次' : '月次'}
                </button>
              ))}
            </div>
          </div>

          {interval === 'weekly' && (
            <div>
              <label className="text-sm text-slate-600 block mb-1">基準曜日</label>
              <div className="flex gap-1">
                {WEEKDAYS.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setWeekday(i)}
                    className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                      weekday === i
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600 block mb-1">ポイント</label>
            <input
              type="number"
              value={points}
              onChange={e => setPoints(e.target.value)}
              min={1}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-600"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl"
            >
              {editing ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
