import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getTotalPoints } from '../../db/db';
import AddRewardModal from './AddRewardModal';

export default function RewardsScreen() {
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

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
      {/* Header */}
      <div className="bg-slate-800 text-white px-4 py-4 sticky top-0 z-30">
        <div className="text-yellow-400 text-3xl font-bold">
          🪙 {totalPoints.toLocaleString()} pt
        </div>
        <div className="text-slate-400 text-sm mt-1">累計ポイント</div>
      </div>

      {/* Rewards list */}
      <div className="p-3 space-y-3">
        {rewards.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            <div className="text-4xl mb-3">🎁</div>
            <p>報酬がまだありません</p>
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
                unlocked
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-2xl">{unlocked ? '✨' : '🔒'}</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{r.title}</div>
                  <div className="text-sm text-slate-500">
                    必要: {r.requiredPoints.toLocaleString()} pt
                  </div>
                  {unlocked ? (
                    <div className="text-xs text-yellow-600 mt-1 font-medium">
                      GET! 🎉 {new Date(r.unlockedAt).toLocaleDateString('ja-JP')} 獲得
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="text-xs text-slate-400 mb-1">
                        あと {remaining.toLocaleString()} pt
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 text-right">{progress}%</div>
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
      <button
        onClick={() => { setEditingReward(null); setShowModal(true); }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-yellow-400 text-slate-800 rounded-full text-2xl font-bold shadow-lg flex items-center justify-center z-40"
      >
        +
      </button>

      {showModal && (
        <AddRewardModal
          editing={editingReward}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
