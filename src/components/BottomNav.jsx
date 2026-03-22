export default function BottomNav({ current, onChange }) {
  const tabs = [
    { key: 'mission', label: 'ミッション', icon: '🎮' },
    { key: 'calendar', label: 'カレンダー', icon: '🗓' },
    { key: 'rewards', label: '報酬', icon: '🎁' },
    { key: 'settings', label: '設定', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-800 border-t border-slate-700 flex z-50">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
            current === t.key
              ? 'text-yellow-400'
              : 'text-slate-400'
          }`}
        >
          <span className="text-xl">{t.icon}</span>
          <span className="text-xs">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
