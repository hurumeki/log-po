import { useLanguage } from '../i18n/LanguageContext';

function MissionIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="w-6 h-6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function CalendarIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="w-6 h-6">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function GiftIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="w-6 h-6">
      <rect x="3" y="8" width="18" height="14" rx="1" />
      <line x1="12" y1="8" x2="12" y2="22" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 8C12 8 9 4 7 4a2 2 0 0 0 0 4h5" />
      <path d="M12 8C12 8 15 4 17 4a2 2 0 0 1 0 4h-5" />
    </svg>
  );
}

function SettingsIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} className="w-6 h-6">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function BottomNav({ current, onChange }) {
  const { t } = useLanguage();

  const tabs = [
    { key: 'mission', label: t.nav.mission, Icon: MissionIcon },
    { key: 'calendar', label: t.nav.calendar, Icon: CalendarIcon },
    { key: 'rewards', label: t.nav.rewards, Icon: GiftIcon },
    { key: 'settings', label: t.nav.settings, Icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] flex z-50 pb-[env(safe-area-inset-bottom)]">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors active:bg-slate-100 ${
            current === t.key ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <t.Icon active={current === t.key} />
          <span className="text-xs">{t.label}</span>
          {current === t.key && (
            <span className="w-1 h-1 rounded-full bg-indigo-600" />
          )}
        </button>
      ))}
    </nav>
  );
}
