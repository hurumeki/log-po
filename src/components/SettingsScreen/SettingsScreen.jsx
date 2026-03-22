import { useState } from 'react';
import { exportAllData, importAllData, clearHistory } from '../../db/db';

export default function SettingsScreen() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState('');

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
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
    showMessage('保存済み');
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
    showMessage('履歴を消去しました');
  }

  return (
    <div>
      {/* Page title */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">設定・データ管理</h1>
      </div>

      <div className="px-4 space-y-3">
        {/* Data management card */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-medium text-slate-500">データ管理 (ローカル)</h2>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={handleExport}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium"
            >
              全データをエクスポート (JSON)
            </button>
            <label className="block w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium text-center cursor-pointer">
              データをインポート
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 border border-red-400 text-red-500 rounded-xl text-sm font-medium"
            >
              履歴の消去 (ポイント維持)
            </button>
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-5 py-2 rounded-full text-sm z-50 flex items-center gap-2">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
