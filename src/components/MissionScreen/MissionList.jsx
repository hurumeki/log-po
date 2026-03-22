import { useState } from 'react';
import MissionItem from './MissionItem';

export default function MissionList({ missions, onComplete, onUncomplete, onDelete, onEdit }) {
  // Build tree
  const roots = missions.filter(m => !m.parentId);

  if (roots.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="text-4xl mb-3">🎯</div>
        <p>ミッションがまだありません</p>
        <p className="text-sm mt-1">右下の＋ボタンで追加しましょう！</p>
      </div>
    );
  }

  return (
    <div className="py-2 pb-20">
      {roots.map(root => (
        <MissionItem
          key={root.id}
          mission={root}
          missions={missions}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
