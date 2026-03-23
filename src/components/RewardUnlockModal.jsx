import { useEffect, useRef } from 'react';
import { fireConfetti } from '../utils/confetti';
import { useLanguage } from '../i18n/LanguageContext';

export default function RewardUnlockModal({ reward, onClose }) {
  const { t } = useLanguage();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    fireConfetti();
    const timer = setTimeout(() => onCloseRef.current(), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 mx-4 text-center max-w-xs w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-yellow-400 text-2xl font-bold mb-2">{t.rewardUnlock.achieved}</h2>
        <p className="text-white text-lg mb-1">
          「{reward.title}」
        </p>
        <p className="text-slate-300 text-sm mb-6">{t.rewardUnlock.unlocked}</p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-amber-400 to-yellow-400 shadow-lg shadow-amber-400/30 text-slate-800 font-bold px-8 py-2 rounded-full"
        >
          {t.rewardUnlock.hooray}
        </button>
      </div>
    </div>
  );
}
