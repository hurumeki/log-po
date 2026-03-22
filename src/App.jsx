import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import MissionScreen from './components/MissionScreen/MissionScreen';
import CalendarScreen from './components/CalendarScreen/CalendarScreen';
import RewardsScreen from './components/RewardsScreen/RewardsScreen';
import SettingsScreen from './components/SettingsScreen/SettingsScreen';
import RewardUnlockModal from './components/RewardUnlockModal';
import { runResetCheck, getNotificationSettings, db } from './db/db';
import { scheduleNotification, isNotificationSupported } from './utils/notification';

export default function App() {
  const [tab, setTab] = useState('mission');
  const [unlockedReward, setUnlockedReward] = useState(null);
  const [pointsKey, setPointsKey] = useState(0);

  useEffect(() => {
    runResetCheck().then(async () => {
      if (!isNotificationSupported()) return;
      const { enabled, time } = await getNotificationSettings();
      if (enabled && Notification.permission === 'granted') {
        scheduleNotification(() => db.missions.toArray(), time);
      }
    });
  }, []);

  function handleRewardUnlocked(reward) {
    setUnlockedReward(reward);
  }

  function handlePointsChanged() {
    setPointsKey(k => k + 1);
  }

  return (
    <div className="flex flex-col min-h-svh bg-slate-50 w-full">
      <main className="flex-1 overflow-y-auto pb-20">
        {tab === 'mission' && (
          <MissionScreen
            key={pointsKey}
            onRewardUnlocked={handleRewardUnlocked}
            onPointsChanged={handlePointsChanged}
          />
        )}
        {tab === 'calendar' && <CalendarScreen />}
        {tab === 'rewards' && <RewardsScreen key={pointsKey} />}
        {tab === 'settings' && <SettingsScreen />}
      </main>
      <BottomNav current={tab} onChange={setTab} />
      {unlockedReward && (
        <RewardUnlockModal
          reward={unlockedReward}
          onClose={() => setUnlockedReward(null)}
        />
      )}
    </div>
  );
}
