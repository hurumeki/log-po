export default function PointsHeader({ totalPoints, nextReward }) {
  const progress = nextReward
    ? Math.min(100, Math.round((totalPoints / nextReward.requiredPoints) * 100))
    : 100;

  return (
    <div className="bg-slate-800 text-white px-4 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-400 text-3xl font-bold">
          🪙 {totalPoints.toLocaleString()} pt
        </span>
      </div>
      {nextReward && (
        <div className="text-xs text-slate-400 mb-1">
          次の報酬: 「{nextReward.title}」まで
          {(nextReward.requiredPoints - totalPoints).toLocaleString()}pt
        </div>
      )}
      <div className="w-full bg-slate-600 rounded-full h-2">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
