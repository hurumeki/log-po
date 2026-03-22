import { useEffect, useRef } from 'react';
import { fireConfetti } from '../utils/confetti';

export default function RewardUnlockModal({ reward, onClose }) {
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
      <div className="bg-slate-800 rounded-2xl p-8 mx-4 text-center max-w-xs w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-yellow-400 text-2xl font-bold mb-2">目標達成！</h2>
        <p className="text-white text-lg mb-1">
          「{reward.title}」
        </p>
        <p className="text-slate-300 text-sm mb-6">が解禁されました！</p>
        <button
          onClick={onClose}
          className="bg-yellow-400 text-slate-800 font-bold px-8 py-2 rounded-full"
        >
          やった！
        </button>
      </div>
    </div>
  );
}
