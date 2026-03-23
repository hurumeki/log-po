import { useState } from 'react';
import { DEPTH } from '../../constants';
import ContextMenu from './ContextMenu';
import MissionDetailPopup from './MissionDetailPopup';
import { useLanguage } from '../../i18n/LanguageContext';

const INTERVAL_COLORS = {
  daily: 'text-sky-600 bg-sky-50',
  weekly: 'text-violet-600 bg-violet-50',
  monthly: 'text-amber-700 bg-amber-50',
};

export default function MissionItem({ mission, missions, onComplete, onUncomplete, onDelete, onEdit, onMove }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(true);
  const [bouncing, setBouncing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const children = missions.filter(m => m.parentId === mission.id);
  const isLeaf = children.length === 0;
  const isCompleted = !!mission.completedAt;

  const siblings = missions
    .filter(m => m.parentId === mission.parentId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const siblingIdx = siblings.findIndex(s => s.id === mission.id);
  const canMoveUp = siblingIdx > 0;
  const canMoveDown = siblingIdx < siblings.length - 1;

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
    ? t.interval.weeklyDay(t.weekdays[mission.weekday])
    : t.interval[mission.interval] || '';

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
      if (window.confirm(t.mission.deleteConfirm(mission.title))) onDelete(mission);
    } else {
      const taskCount = countDescendantTasks(mission.id);
      const label = mission.depth === DEPTH.CATEGORY ? t.mission.category : t.mission.subcategory;
      if (window.confirm(t.mission.deleteGroupConfirm(mission.title, label, taskCount))) onDelete(mission);
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
              onMoveUp={canMoveUp ? () => onMove(mission, 'up') : null}
              onMoveDown={canMoveDown ? () => onMove(mission, 'down') : null}
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
                onMove={onMove}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // depth 1: sub-group header with left indigo accent (collapsible)
  if (!isLeaf) {
    return (
      <div className="mt-0.5 mb-0.5">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(e => !e)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(v => !v); } }}
          className="flex items-center justify-between px-4 py-1 cursor-pointer hover:bg-slate-50"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-0.5 h-4 bg-indigo-400 rounded-full flex-shrink-0" />
            <span className="font-medium text-slate-600 text-xs">{mission.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <ContextMenu
              onEdit={() => onEdit(mission)}
              onDelete={handleDeleteWithConfirm}
              onMoveUp={canMoveUp ? () => onMove(mission, 'up') : null}
              onMoveDown={canMoveDown ? () => onMove(mission, 'down') : null}
              size="small"
            />
            <span className="text-slate-400 text-xs">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>

        {expanded && (
          <div className="slide-down mt-1 space-y-2">
            {children.map(child => (
              <MissionItem
                key={child.id}
                mission={child}
                missions={missions}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
                onDelete={onDelete}
                onEdit={onEdit}
                onMove={onMove}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // leaf: task card
  const indentClass = 'mx-4';

  return (
    <div className={`${indentClass} mb-2 ${isCompleted ? 'bg-emerald-50/50' : 'bg-white'} rounded-xl shadow-md shadow-slate-200/50 p-3 flex items-center gap-3`}>
      <button
        onClick={handleCheck}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isCompleted
            ? 'bg-emerald-500 border-emerald-500'
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
        <span className={`text-xs px-2 py-0.5 rounded-full ${isCompleted ? 'text-slate-400 bg-slate-100' : INTERVAL_COLORS[mission.interval] || 'text-sky-600 bg-sky-50'}`}>
          {intervalLabel}
        </span>
      </div>

      <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${isCompleted ? 'text-slate-400 bg-slate-100' : 'text-amber-700 bg-amber-50'}`}>
        +{mission.points} pt
      </span>

      <ContextMenu
        onEdit={() => onEdit(mission)}
        onDelete={handleDeleteWithConfirm}
        onMoveUp={canMoveUp ? () => onMove(mission, 'up') : null}
        onMoveDown={canMoveDown ? () => onMove(mission, 'down') : null}
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
