import { useState } from 'react';
import { DEPTH } from '../../constants';
import ContextMenu from './ContextMenu';
import MissionDetailPopup from './MissionDetailPopup';

const INTERVAL_LABELS = {
  daily: '日次',
  weekly: '週次',
  monthly: '月次',
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function MissionItem({ mission, missions, onComplete, onUncomplete, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(true);
  const [bouncing, setBouncing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

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

  // Count all descendant leaf tasks for delete confirmation
  function countDescendantTasks(parentId) {
    const kids = missions.filter(m => m.parentId === parentId);
    let count = 0;
    for (const kid of kids) {
      const grandkids = missions.filter(m => m.parentId === kid.id);
      if (grandkids.length === 0) count++;
      else count += countDescendantTasks(kid.id);
    }
    return count;
  }

  function handleDeleteWithConfirm() {
    if (isLeaf) {
      if (window.confirm(`「${mission.title}」を削除しますか？`)) onDelete(mission);
    } else {
      const taskCount = countDescendantTasks(mission.id);
      const label = mission.depth === DEPTH.CATEGORY ? 'カテゴリ' : 'サブカテゴリ';
      if (window.confirm(`「${mission.title}」を削除しますか？\n\nこの${label}内の${taskCount}件のミッションもすべて削除されます。`)) onDelete(mission);
    }
  }

  // depth 0: category section header (uses div instead of button to avoid nested interactive elements)
  if (mission.depth === DEPTH.CATEGORY && !isLeaf) {
    return (
      <div className="mt-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(e => !e)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(v => !v); } }}
          className="w-full flex items-center justify-between px-4 py-1.5 text-left hover:bg-slate-50 cursor-pointer"
        >
          <span className="font-semibold text-slate-700 text-sm">{mission.title}</span>
          <div className="flex items-center gap-1">
            <ContextMenu
              onEdit={() => onEdit(mission)}
              onDelete={handleDeleteWithConfirm}
            />
            <span className="text-slate-400 text-xs">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>

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
      <div className="mx-4 mt-0.5 mb-0.5">
        <div className="flex items-center justify-between pl-3 py-0 border-l-2 border-blue-500">
          <span className="font-medium text-slate-600 text-xs">{mission.title}</span>
          <ContextMenu
            onEdit={() => onEdit(mission)}
            onDelete={handleDeleteWithConfirm}
            size="small"
          />
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
  const indentClass = mission.depth === DEPTH.CATEGORY ? 'mx-3' : mission.depth === DEPTH.SUBCATEGORY ? 'mx-4' : 'mx-5';

  return (
    <div className={`${indentClass} mb-2 bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3`}>
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

      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowDetail(true)}>
        <div className={`font-semibold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {mission.title}
        </div>
        {mission.memo && (
          <div className={`text-xs mt-0.5 truncate ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
            {mission.memo}
          </div>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full ${isCompleted ? 'text-slate-400 bg-slate-100' : 'text-blue-600 bg-blue-50'}`}>
          {intervalLabel}
        </span>
      </div>

      <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${isCompleted ? 'text-slate-400 bg-slate-100' : 'text-blue-600 bg-blue-50'}`}>
        +{mission.points} pt
      </span>

      <ContextMenu
        onEdit={() => onEdit(mission)}
        onDelete={handleDeleteWithConfirm}
        className="flex-shrink-0"
      />

      {showDetail && (
        <MissionDetailPopup
          mission={mission}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
