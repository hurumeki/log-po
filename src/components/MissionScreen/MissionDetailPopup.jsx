import { useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const URL_REGEX = /(https?:\/\/[^\s<>"\]））]+)/g;

function LinkifiedText({ text }) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    URL_REGEX.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 underline break-all"
        onClick={e => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const INTERVAL_COLORS = {
  daily: 'text-sky-600 bg-sky-50',
  weekly: 'text-violet-600 bg-violet-50',
  monthly: 'text-amber-700 bg-amber-50',
};

export default function MissionDetailPopup({ mission, onClose }) {
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const intervalLabel = mission.interval === 'weekly' && mission.weekday != null
    ? t.interval.weeklyDayFull(t.weekdays[mission.weekday])
    : t.interval[mission.interval + 'Full'] || '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] px-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-800 flex-1 min-w-0 break-words">{mission.title}</h2>
          <button onClick={onClose} className="text-slate-400 text-xl w-8 h-8 flex items-center justify-center flex-shrink-0 ml-2">&times;</button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              INTERVAL_COLORS[mission.interval] || 'text-sky-600 bg-sky-50'
            }`}>{intervalLabel}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">🪙 +{mission.points} pt</span>
          </div>

          {mission.memo ? (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-medium text-slate-500 mb-1">{t.detail.memoLabel}</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
                <LinkifiedText text={mission.memo} />
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-400">{t.detail.noMemo}</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 border border-slate-300 rounded-xl text-slate-600 text-sm"
        >
          {t.common.close}
        </button>
      </div>
    </div>
  );
}
