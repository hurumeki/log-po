import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import AddRewardModal from './AddRewardModal';

export default function RewardsScreen() {
  const [showModal, setShowModal] = useState(false);

  const rewards = useLiveQuery(() =>
    db.rewards.orderBy('requiredPoints').toArray(),
    []
  );
  const totalPointsRow = useLiveQuery(() =>
    db.userData.get('totalPoints'),
    []
  );
  const totalPoints = totalPointsRow?.value ?? 0;

  if (!rewards) return <div className="p-4 text-center text-slate-500">読み込み中...</div>;

  async function handleDelete(reward) {
    await db.rewards.delete(reward.id);
  }

  return (
    <div>
      {/* Page title */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">ご褒美リスト</h1>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          所持: {totalPoints.toLocaleString()} pt
        </span>
      </div>

      {/* Rewards list */}
      <div className="px-3 pb-3 space-y-3">
        {rewards.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            <div className="text-4xl mb-3">🎁</div>
            <p>ご褒美がまだありません</p>
            <p className="text-sm mt-1">右下の＋ボタンで追加しましょう！</p>
          </div>
        )}
        {rewards.map(r => {
          const unlocked = !!r.unlockedAt;
          const progress = Math.min(100, Math.round((totalPoints / r.requiredPoints) * 100));
          const remaining = Math.max(0, r.requiredPoints - totalPoints);

          return (
            <div
              key={r.id}
              className={`rounded-xl border p-4 transition-all ${
                unlocked ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{unlocked ? '✨' : '🔒'}</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{r.title}</div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    必要: {r.requiredPoints.toLocaleString()} pt
                  </div>
                  {unlocked ? (
                    <div className="text-xs text-yellow-600 mt-1 font-medium">
                      GET! 🎉 {new Date(r.unlockedAt).toLocaleDateString('ja-JP')} 獲得
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-blue-600 mb-1">
                        <span>進行度 {progress}%</span>
                        <span>あと {remaining.toLocaleString()} pt</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(r)}
                  className="text-slate-300 hover:text-red-400 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-40">
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-0 right-4 w-14 h-14 bg-yellow-400 text-slate-800 rounded-full text-2xl font-bold shadow-lg flex items-center justify-center pointer-events-auto"
        >
          +
        </button>
      </div>

      {showModal && (
        <AddRewardModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
