import { useState } from 'react';

const INTERVAL_LABELS = {
  daily: '日次',
  weekly: '週次',
  monthly: '月次',
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function MissionItem({ mission, missions, onComplete, onUncomplete, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const children = missions.filter(m => m.parentId === mission.id);
  const isLeaf = children.length === 0;
  const isCompleted = !!mission.completedAt;

  const indentClass = mission.depth === 0 ? 'pl-3' : mission.depth === 1 ? 'pl-8' : 'pl-14';

  function handleCheck() {
    if (isCompleted) {
      onUncomplete(mission);
    } else {
      setBouncing(true);
      setTimeout(() => setBouncing(false), 400);
      onComplete(mission);
    }
  }

  const intervalLabel = mission.interval === 'weekly' && mission.weekday != null
    ? `週次:${WEEKDAYS[mission.weekday]}曜`
    : INTERVAL_LABELS[mission.interval] || '';

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 ${indentClass} hover:bg-slate-100 relative`}
      >
        {/* Expand/collapse or checkbox */}
        {isLeaf ? (
          <button
            onClick={handleCheck}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isCompleted
                ? 'bg-yellow-400 border-yellow-400'
                : 'border-slate-400 bg-white'
            } ${bouncing ? 'check-bounce' : ''}`}
          >
            {isCompleted && <span className="text-slate-800 text-sm">✓</span>}
          </button>
        ) : (
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-6 h-6 flex items-center justify-center text-slate-500 flex-shrink-0"
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}

        {/* Title */}
        <span
          className={`flex-1 text-sm font-medium ${
            isCompleted ? 'line-through text-slate-400' : 'text-slate-700'
          } ${!isLeaf ? 'font-semibold text-slate-800' : ''}`}
        >
          {mission.title}
        </span>

        {/* Badges */}
        {isLeaf && (
          <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
            {mission.points}pt
          </span>
        )}
        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
          {intervalLabel}
        </span>

        {/* Context menu */}
        <button
          onClick={() => setShowMenu(s => !s)}
          className="text-slate-400 px-1 text-sm"
        >
          ⋯
        </button>

        {showMenu && (
          <div className="absolute right-2 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-sm overflow-hidden">
            <button
              onClick={() => { setShowMenu(false); onEdit(mission); }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-50"
            >
              ✏️ 編集
            </button>
            <button
              onClick={() => { setShowMenu(false); onDelete(mission); }}
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            >
              🗑 削除
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {!isLeaf && expanded && (
        <div className="slide-down">
          {children.map(child => (
            <MissionItem
              key={child.id}
              mission={child}
              missions={missions}
              onComplete={onComplete}
              onUncomplete={onUncomplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
