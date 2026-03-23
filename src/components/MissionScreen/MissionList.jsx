import MissionItem from './MissionItem';

export default function MissionList({ missions, onComplete, onUncomplete, onDelete, onEdit }) {
  // Build tree
  const roots = missions.filter(m => !m.parentId);

  if (roots.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="text-5xl mb-4">🎯</div>
        <p className="text-slate-500">ミッションがまだありません</p>
        <p className="text-sm mt-1 text-slate-500">右下の＋ボタンで追加しましょう！</p>
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
