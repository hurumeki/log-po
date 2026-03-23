import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import AddRewardModal from './AddRewardModal';
import { useLanguage } from '../../i18n/LanguageContext';

export default function RewardsScreen() {
  const { lang, t } = useLanguage();
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

  if (!rewards) return <div className="p-4 text-center text-slate-500">{t.common.loading}</div>;

  async function handleDelete(reward) {
    await db.rewards.delete(reward.id);
  }

  return (
    <div>
      {/* Page title */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{t.rewards.title}</h1>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
          {t.rewards.holding}: {totalPoints.toLocaleString()} pt
        </span>
      </div>

      {/* Rewards list */}
      <div className="px-3 pb-20 space-y-3">
        {rewards.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            <div className="text-5xl mb-4">🎁</div>
            <p>{t.rewards.noRewards}</p>
            <p className="text-sm mt-1">{t.rewards.noRewardsHint}</p>
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
                unlocked ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 shadow-md shadow-amber-100/50' : 'bg-white shadow-md shadow-slate-200/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{unlocked ? '✨' : '🔒'}</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{r.title}</div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {t.rewards.required}: {r.requiredPoints.toLocaleString()} pt
                  </div>
                  {unlocked ? (
                    <div className="text-xs text-yellow-600 mt-1 font-medium">
                      {t.rewards.gotDate(new Date(r.unlockedAt).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US'))}
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-indigo-600 mb-1">
                        <span>{t.rewards.progress(progress)}</span>
                        <span>{t.rewards.remaining(remaining.toLocaleString())}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(t.rewards.deleteConfirm(r.title))) handleDelete(r);
                  }}
                  className="text-slate-400 hover:text-red-400 active:text-red-500 text-lg min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
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
