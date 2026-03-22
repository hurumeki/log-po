import { useState, useEffect } from 'react';
import { db, getUserData, setUserData, exportAllData, importAllData, clearHistory } from '../../db/db';

export default function SettingsScreen() {
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notifyTimes, setNotifyTimes] = useState(['08:00', '12:00', '21:00']);
  const [newTime, setNewTime] = useState('');
  const [notifSupported, setNotifSupported] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const supported = 'Notification' in window;
    setNotifSupported(supported);
    getUserData('notifyEnabled', false).then(setNotifyEnabled);
    getUserData('notifyTimes', ['08:00', '12:00', '21:00']).then(setNotifyTimes);
  }, []);

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleNotifyToggle(val) {
    if (val && notifSupported) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        showMessage('通知の許可が必要です');
        return;
      }
    }
    setNotifyEnabled(val);
    await setUserData('notifyEnabled', val);
  }

  async function handleAddTime() {
    if (!newTime || notifyTimes.includes(newTime)) return;
    const updated = [...notifyTimes, newTime].sort();
    setNotifyTimes(updated);
    await setUserData('notifyTimes', updated);
    setNewTime('');
  }

  async function handleRemoveTime(t) {
    const updated = notifyTimes.filter(x => x !== t);
    setNotifyTimes(updated);
    await setUserData('notifyTimes', updated);
  }

  async function handleExport() {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logpo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('バックアップを保存しました');
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      showMessage('データを復元しました');
    } catch {
      showMessage('ファイルの読み込みに失敗しました');
    }
    e.target.value = '';
  }

  async function handleClearHistory() {
    await clearHistory();
    setShowClearConfirm(false);
    showMessage('履歴を消去しました（累計ポイントは維持されています）');
  }

  return (
    <div>
      <div className="bg-slate-800 text-white px-4 py-4 sticky top-0 z-30">
        <h1 className="text-xl font-bold">⚙️ 設定</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Notification settings */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-700">🔔 リマインド通知</h2>
          </div>
          <div className="p-4 space-y-3">
            {!notifSupported && (
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                このブラウザは通知に対応していません
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">通知を有効にする</span>
              <button
                onClick={() => handleNotifyToggle(!notifyEnabled)}
                disabled={!notifSupported}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifyEnabled && notifSupported ? 'bg-yellow-400' : 'bg-slate-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  notifyEnabled && notifSupported ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {notifyEnabled && notifSupported && (
              <div className="space-y-2">
                <div className="text-sm text-slate-500">通知時刻</div>
                {notifyTimes.map(t => (
                  <div key={t} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{t}</span>
                    <button onClick={() => handleRemoveTime(t)} className="text-red-400 text-sm">削除</button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={handleAddTime}
                    className="bg-yellow-400 text-slate-800 px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    追加
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Data management */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-700">💾 データ管理</h2>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={handleExport}
              className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold"
            >
              📤 現在のデータをバックアップ (.json)
            </button>
            <label className="block w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold text-center cursor-pointer">
              📥 バックアップから復元
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-white rounded-xl border border-red-200 overflow-hidden">
          <div className="px-4 py-3 bg-red-50 border-b border-red-200">
            <h2 className="font-bold text-red-600">⚠️ データ消去</h2>
          </div>
          <div className="p-4">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 border border-red-300 text-red-600 rounded-xl text-sm"
            >
              🗑 過去の履歴を消去
            </button>
            <p className="text-xs text-slate-400 mt-2 text-center">
              ※累計ポイントは維持されます
            </p>
          </div>
        </section>
      </div>

      {/* Clear confirm dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full">
            <h3 className="font-bold text-slate-800 mb-2">履歴を消去しますか？</h3>
            <p className="text-sm text-slate-500 mb-4">
              過去の達成履歴がすべて削除されます。累計ポイントは維持されます。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                消去する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast message */}
      {message && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm z-50">
          {message}
        </div>
      )}
    </div>
  );
}
