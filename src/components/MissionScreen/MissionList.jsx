import MissionItem from './MissionItem';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MissionList({ missions, onComplete, onUncomplete, onDelete, onEdit, onMove }) {
  const { t } = useLanguage();
  // Build tree
  const roots = missions.filter(m => !m.parentId);

  if (roots.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="emptyG" x1="8" y1="35" x2="40" y2="8">
                <stop offset="0%" stopColor="#4338CA"/>
                <stop offset="50%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#C084FC"/>
              </linearGradient>
            </defs>
            <path d="M8 24 L19 35 L40 12" stroke="url(#emptyG)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M42 5 L43.5 10 L48 11.5 L43.5 13 L42 18 L40.5 13 L36 11.5 L40.5 10 Z" fill="#FCD34D"/>
            <path d="M34 1 L35 4 L38 5 L35 6 L34 9 L33 6 L30 5 L33 4 Z" fill="#FCD34D" opacity="0.6"/>
          </svg>
        </div>
        <p className="text-slate-500">{t.mission.noMissions}</p>
        <p className="text-sm mt-1 text-slate-500">{t.mission.noMissionsHint}</p>
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
          onMove={onMove}
        />
      ))}
    </div>
  );
}
