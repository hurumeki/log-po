import { useLanguage } from '../../i18n/LanguageContext';

export default function PointsHeader({ totalPoints, nextReward }) {
  const { t } = useLanguage();
  const progress = nextReward
    ? Math.min(100, Math.round((totalPoints / nextReward.requiredPoints) * 100))
    : 0;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-5 pt-[max(1.25rem,env(safe-area-inset-top))] sticky top-0 z-30 rounded-b-2xl">
      <div className="text-sm text-indigo-100 mb-1">{t.points.currentTotal}</div>
      <div className="flex items-center gap-2">
        <span className="text-4xl">🪙</span>
        <span className="text-3xl font-bold tracking-tight">{totalPoints.toLocaleString()} pt</span>
      </div>
      {nextReward && (
        <div className="mt-2">
          <div className="text-xs text-indigo-100 mb-1">
            {t.points.nextGoal(nextReward.title, (nextReward.requiredPoints - totalPoints).toLocaleString())}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
