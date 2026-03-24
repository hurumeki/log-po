import { useState, useEffect } from 'react';
import { version } from '../../../package.json';
import { exportAllData, importAllData, clearHistory, getNotificationSettings, setNotificationEnabled, setNotificationTime } from '../../db/db';
import { isNotificationSupported, requestPermission, getPermissionStatus, scheduleNotification, cancelScheduledNotification } from '../../utils/notification';
import { db } from '../../db/db';
import { useLanguage } from '../../i18n/LanguageContext';

export default function SettingsScreen() {
  const { lang, setLang, t } = useLanguage();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState('21:00');
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [notifSupported] = useState(isNotificationSupported);

  useEffect(() => {
    getNotificationSettings().then(({ enabled, time }) => {
      setNotifEnabled(enabled);
      setNotifTime(time);
    });
    if (notifSupported) {
      setPermissionStatus(getPermissionStatus());
    }
  }, [notifSupported]);

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleToggleNotification(enabled) {
    if (enabled) {
      const result = await requestPermission();
      setPermissionStatus(result);
      if (result !== 'granted') {
        showMessage(t.settings.notifPermRequired);
        return;
      }
      await setNotificationEnabled(true);
      setNotifEnabled(true);
      scheduleNotification(() => db.missions.toArray(), notifTime);
      showMessage(t.settings.notifOn);
    } else {
      await setNotificationEnabled(false);
      setNotifEnabled(false);
      cancelScheduledNotification();
      showMessage(t.settings.notifOff);
    }
  }

  async function handleTimeChange(time) {
    setNotifTime(time);
    await setNotificationTime(time);
    if (notifEnabled) {
      scheduleNotification(() => db.missions.toArray(), time);
    }
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
    showMessage(t.settings.exported);
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      showMessage(t.settings.imported);
    } catch {
      showMessage(t.settings.importError);
    }
    e.target.value = '';
  }

  async function handleClearHistory() {
    await clearHistory();
    setShowClearConfirm(false);
    showMessage(t.settings.historyCleared);
  }

  return (
    <div>
      {/* Page title */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">{t.settings.title}</h1>
      </div>

      <div className="px-4 space-y-3">
        {/* Language settings card */}
        <section className="bg-white rounded-xl shadow-md shadow-slate-200/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-medium text-slate-500">{t.settings.languageSection}</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700">{t.settings.languageLabel}</div>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setLang('ja')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    lang === 'ja'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  日本語
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    lang === 'en'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notification settings card */}
        {notifSupported && (
          <section className="bg-white rounded-xl shadow-md shadow-slate-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h2 className="text-sm font-medium text-slate-500">{t.settings.notificationSection}</h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">{t.settings.reminderLabel}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{t.settings.reminderDesc}</div>
                </div>
                <button
                  onClick={() => handleToggleNotification(!notifEnabled)}
                  className={`relative inline-flex items-center w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                    notifEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Time picker */}
              {notifEnabled && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-700">{t.settings.notifTime}</div>
                  <input
                    type="time"
                    value={notifTime}
                    onChange={e => handleTimeChange(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              )}

              {/* Permission denied warning */}
              {permissionStatus === 'denied' && (
                <p className="text-xs text-red-500">
                  {t.settings.notifBlocked}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Data management card */}
        <section className="bg-white rounded-xl shadow-md shadow-slate-200/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-medium text-slate-500">{t.settings.dataSection}</h2>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={handleExport}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium active:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 2a1 1 0 011 1v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 10.586V3a1 1 0 011-1z"/><path d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
              {t.settings.exportBtn}
            </button>
            <label className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium cursor-pointer active:bg-slate-200 flex items-center justify-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 18a1 1 0 01-1-1v-7.586l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 9.414V17a1 1 0 01-1 1z"/><path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
              {t.settings.importBtn}
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 border-2 border-red-300 text-red-600 bg-red-50 rounded-xl text-sm font-medium active:bg-red-100 flex items-center justify-center gap-2 mt-1"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {t.settings.clearHistoryBtn}
            </button>
          </div>
        </section>
        {/* Version */}
        <p className="text-center text-xs text-slate-400 py-2">
          {t.settings.versionLabel} v{version}
        </p>
      </div>

      {/* Clear confirm dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full">
            <h3 className="font-bold text-slate-800 mb-2">{t.settings.clearConfirmTitle}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {t.settings.clearConfirmDesc}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-600"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                {t.settings.clearConfirmBtn}
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
