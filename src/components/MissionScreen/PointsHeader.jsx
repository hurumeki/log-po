export default function PointsHeader({ totalPoints, nextReward }) {
  return (
    <div className="bg-blue-600 text-white px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sticky top-0 z-30">
      <div className="text-sm text-blue-100 mb-1">現在の累計ポイント</div>
      <div className="flex items-center gap-2">
        <span className="text-3xl">🪙</span>
        <span className="text-3xl font-bold">{totalPoints.toLocaleString()} pt</span>
      </div>
      {nextReward && (
        <div className="mt-1 text-xs text-blue-100">
          次の目標: 「{nextReward.title}」まであと{(nextReward.requiredPoints - totalPoints).toLocaleString()}pt
        </div>
      )}
    </div>
  );
}
