import { useEffect } from 'react';

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
        className="text-blue-600 underline break-all"
        onClick={e => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const INTERVAL_LABELS = {
  daily: '日次 (毎日)',
  weekly: '週次 (毎週)',
  monthly: '月次 (毎月)',
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function MissionDetailPopup({ mission, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const intervalLabel = mission.interval === 'weekly' && mission.weekday != null
    ? `${INTERVAL_LABELS.weekly} (${WEEKDAYS[mission.weekday]}曜)`
    : INTERVAL_LABELS[mission.interval] || '';

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
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">{intervalLabel}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">🪙 +{mission.points} pt</span>
          </div>

          {mission.memo ? (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-medium text-slate-500 mb-1">詳細メモ</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
                <LinkifiedText text={mission.memo} />
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-400">詳細メモはありません</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 border border-slate-300 rounded-xl text-slate-600 text-sm"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
