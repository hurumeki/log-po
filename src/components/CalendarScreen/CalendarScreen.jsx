import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

export default function CalendarScreen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);

  const history = useLiveQuery(() => db.history.toArray(), []);

  if (!history) return <div className="p-4 text-center text-slate-500">読み込み中...</div>;

  // Group history by date
  const byDate = {};
  for (const h of history) {
    const dateStr = new Date(h.achievedAt).toISOString().slice(0, 10);
    if (!byDate[dateStr]) byDate[dateStr] = [];
    byDate[dateStr].push(h);
  }

  const { firstDay, daysInMonth } = getMonthDays(year, month);
  const todayStr = toDateStr(now);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  const selectedEntries = selected ? (byDate[selected] || []) : [];

  const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const DAY_NAMES = ['日','月','火','水','木','金','土'];

  return (
    <div>
      {/* Header */}
      <div className="bg-slate-800 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <button onClick={prevMonth} className="text-yellow-400 text-xl px-2">‹</button>
        <span className="font-bold text-lg">{year}年 {MONTH_NAMES[month]}</span>
        <button onClick={nextMonth} className="text-yellow-400 text-xl px-2">›</button>
      </div>

      {/* Calendar */}
      <div className="p-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((d, i) => (
            <div key={i} className={`text-center text-xs py-1 font-medium ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-500'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entries = byDate[dateStr] || [];
            const hasActivity = entries.length > 0;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selected;
            const dayOfWeek = (firstDay + i) % 7;

            return (
              <button
                key={day}
                onClick={() => setSelected(isSelected ? null : dateStr)}
                className={`flex flex-col items-center py-1 rounded-lg transition-colors ${
                  isSelected ? 'bg-yellow-400' : isToday ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm ${
                  isSelected ? 'text-slate-800 font-bold' :
                  dayOfWeek === 0 ? 'text-red-400' :
                  dayOfWeek === 6 ? 'text-blue-400' :
                  'text-slate-700'
                }`}>
                  {day}
                </span>
                {hasActivity && (
                  <span className="text-xs">💮</span>
                )}
                {hasActivity && (
                  <span className={`text-xs ${isSelected ? 'text-slate-700' : 'text-yellow-600'}`}>
                    {entries.reduce((s, e) => s + (e.snapshot?.points || 0), 0)}pt
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="px-3 slide-down">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-3">
              {selected.replace(/-/g, '/')} の達成記録
            </h3>
            {selectedEntries.length === 0 ? (
              <p className="text-slate-400 text-sm">この日の記録はありません</p>
            ) : (
              <ul className="space-y-2">
                {selectedEntries.map(e => (
                  <li key={e.id} className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">✓</span>
                    <span className="flex-1 text-slate-700">
                      {e.snapshot?.hierarchy?.join(' › ') || e.snapshot?.title}
                    </span>
                    <span className="text-yellow-600 text-xs">{e.snapshot?.points}pt</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
