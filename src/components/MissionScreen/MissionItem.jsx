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

  // Count all descendant tasks for delete confirmation
  function countDescendantTasks(parentId) {
    const kids = missions.filter(m => m.parentId === parentId);
    let count = 0;
    for (const kid of kids) {
      const grandkids = missions.filter(m => m.parentId === kid.id);
      if (grandkids.length === 0) count++; // leaf = task
      else count += countDescendantTasks(kid.id);
    }
    return count;
  }

  // depth 0: category section header
  if (mission.depth === 0 && !isLeaf) {
    return (
      <div className="mt-2">
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between px-4 py-1.5 text-left hover:bg-slate-50 relative"
        >
          <span className="font-semibold text-slate-700 text-sm">{mission.title}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(s => !s); }}
              className="text-slate-400 px-2 py-1 text-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              ⋯
            </button>
            <span className="text-slate-400 text-xs">{expanded ? '▼' : '▶'}</span>
          </div>
          {showMenu && (
            <div className="absolute right-8 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-sm overflow-hidden">
              <button
                onClick={e => { e.stopPropagation(); setShowMenu(false); onEdit(mission); }}
                className="block w-full text-left px-4 py-2 hover:bg-slate-50"
              >
                ✏️ 編集
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowMenu(false);
                  const taskCount = countDescendantTasks(mission.id);
                  if (window.confirm(`「${mission.title}」を削除しますか？\n\nこのカテゴリ内の${taskCount}件のミッションもすべて削除されます。`)) onDelete(mission);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
              >
                🗑 削除
              </button>
            </div>
          )}
        </button>

        {expanded && (
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

  // depth 1: sub-group header with left blue border
  if (!isLeaf) {
    return (
      <div className="mx-4 mt-1 mb-1">
        <div className="flex items-center justify-between pl-3 py-1 border-l-2 border-blue-500 relative">
          <span className="font-medium text-slate-600 text-sm">{mission.title}</span>
          <button
            onClick={() => setShowMenu(s => !s)}
            className="text-slate-400 px-2 py-1 text-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ⋯
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-sm overflow-hidden">
              <button
                onClick={() => { setShowMenu(false); onEdit(mission); }}
                className="block w-full text-left px-4 py-2 hover:bg-slate-50"
              >
                ✏️ 編集
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  const taskCount = countDescendantTasks(mission.id);
                  if (window.confirm(`「${mission.title}」を削除しますか？\n\nこのサブカテゴリ内の${taskCount}件のミッションもすべて削除されます。`)) onDelete(mission);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
              >
                🗑 削除
              </button>
            </div>
          )}
        </div>

        <div className="mt-1 space-y-2">
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
      </div>
    );
  }

  // leaf: task card
  const indentClass = mission.depth === 0 ? 'mx-3' : mission.depth === 1 ? 'mx-4' : 'mx-5';

  return (
    <div className={`${indentClass} mb-2 bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3 relative`}>
      <button
        onClick={handleCheck}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isCompleted
            ? 'bg-blue-600 border-blue-600'
            : 'border-slate-300 bg-white'
        } ${bouncing ? 'check-bounce' : ''}`}
      >
        {isCompleted && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {mission.title}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${isCompleted ? 'text-slate-400 bg-slate-100' : 'text-blue-600 bg-blue-50'}`}>
          {intervalLabel}
        </span>
      </div>

      <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${isCompleted ? 'text-slate-400 bg-slate-100' : 'text-blue-600 bg-blue-50'}`}>
        +{mission.points} pt
      </span>

      <button
        onClick={() => setShowMenu(s => !s)}
        className="text-slate-400 px-1 text-sm flex-shrink-0"
      >
        ⋯
      </button>

      {showMenu && (
        <div className="absolute right-2 top-10 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-sm overflow-hidden">
          <button
            onClick={() => { setShowMenu(false); onEdit(mission); }}
            className="block w-full text-left px-4 py-2 hover:bg-slate-50"
          >
            ✏️ 編集
          </button>
          <button
            onClick={() => { setShowMenu(false); if (window.confirm(`「${mission.title}」を削除しますか？`)) onDelete(mission); }}
            className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
          >
            🗑 削除
          </button>
        </div>
      )}
    </div>
  );
}
