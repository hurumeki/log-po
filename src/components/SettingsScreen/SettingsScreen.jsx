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
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium active:bg-blue-700 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 2a1 1 0 011 1v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 10.586V3a1 1 0 011-1z"/><path d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
              全データをエクスポート (JSON)
            </button>
            <label className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium cursor-pointer active:bg-slate-200 flex items-center justify-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 18a1 1 0 01-1-1v-7.586l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 9.414V17a1 1 0 01-1 1z"/><path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
              データをインポート
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 border border-red-400 text-red-500 rounded-xl text-sm font-medium active:bg-red-50 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-50 flex justify-center">
          <div className="bg-slate-700 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2 pointer-events-auto">
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
