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
  const [selected, setSelected] = useState(toDateStr(now));

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
      {/* Page title */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">達成カレンダー</h1>
          <div className="flex items-center gap-1 text-slate-600">
            <button onClick={prevMonth} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 text-lg">‹</button>
            <span className="text-sm font-medium">{year}年{MONTH_NAMES[month]}</span>
            <button onClick={nextMonth} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 text-lg">›</button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-3 pb-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((d, i) => (
            <div key={i} className={`text-center text-xs py-1 font-medium ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
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
                  isToday ? 'bg-blue-600' : isSelected ? 'bg-blue-100' : hasActivity ? 'hover:bg-slate-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm font-medium ${
                  isToday ? 'text-white' :
                  isSelected ? 'text-blue-700' :
                  dayOfWeek === 0 ? 'text-red-400' :
                  dayOfWeek === 6 ? 'text-blue-400' :
                  'text-slate-700'
                }`}>
                  {day}
                </span>
                {hasActivity && (
                  <span className="text-xs">💮</span>
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-700">
                {selected.replace(/-/g, '/')} の記録
              </h3>
              <span className="text-sm text-green-600 font-medium">
                {selectedEntries.length}件達成 🌸
              </span>
            </div>
            {selectedEntries.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-2">達成記録はありません</p>
            ) : (
              <ul className="space-y-2">
                {selectedEntries.map(e => (
                  <li key={e.id} className="flex items-center gap-2 text-sm">
                    <span className="text-blue-500">✓</span>
                    <span className="flex-1 text-slate-700">
                      {e.snapshot?.hierarchy?.join(' › ') || e.snapshot?.title}
                    </span>
                    <span className="text-blue-600 text-xs">{e.snapshot?.points}pt</span>
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
