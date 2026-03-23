import { useState, useCallback, useMemo } from 'react';
import { db, addPoints, checkRewardUnlocks, getNotificationSettings } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import MissionList from './MissionList';
import AddMissionModal from './AddMissionModal';
import PointsHeader from './PointsHeader';
import { cancelScheduledNotification, scheduleNotification } from '../../utils/notification';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MissionScreen({ onRewardUnlocked, onPointsChanged }) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [popups, setPopups] = useState([]);

  const missions = useLiveQuery(() => db.missions.orderBy('id').toArray(), []);
  const rewards = useLiveQuery(() => db.rewards.orderBy('requiredPoints').toArray(), []);
  const totalPointsRow = useLiveQuery(() => db.userData.get('totalPoints'), []);
  const totalPoints = totalPointsRow?.value ?? 0;

  const nextReward = useMemo(() => {
    if (!rewards) return null;
    return rewards.find(r => !r.unlockedAt && r.requiredPoints > totalPoints) || null;
  }, [rewards, totalPoints]);

  const handleComplete = useCallback(async (mission) => {
    const now = new Date().toISOString();

    // Build hierarchy path for snapshot
    const hierarchy = [];
    let current = mission;
    while (current) {
      hierarchy.unshift(current.title);
      current = current.parentId
        ? await db.missions.get(current.parentId)
        : null;
    }

    // Save history snapshot
    await db.history.add({
      missionId: mission.id,
      snapshot: {
        title: mission.title,
        points: mission.points,
        hierarchy,
        interval: mission.interval,
      },
      achievedAt: now,
    });

    // Mark as completed
    await db.missions.update(mission.id, { completedAt: now });

    // Add points
    const newTotal = await addPoints(mission.points);
    onPointsChanged?.();

    // Show point popup
    const popupId = Date.now();
    setPopups(prev => [...prev, { id: popupId, pts: mission.points }]);
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== popupId)), 900);

    // Check reward unlocks
    const unlocked = await checkRewardUnlocks(newTotal);
    if (unlocked.length > 0) {
      onRewardUnlocked?.(unlocked[0]);
    }

    // Smart cancel: if all daily leaf missions are completed, cancel scheduled notification
    const allMissions = await db.missions.toArray();
    const incompleteDailyLeaves = allMissions.filter(m => {
      const isLeaf = !allMissions.some(c => c.parentId === m.id);
      return isLeaf && m.interval === 'daily' && !m.completedAt;
    });
    if (incompleteDailyLeaves.length === 0) {
      const { enabled } = await getNotificationSettings();
      if (enabled) cancelScheduledNotification();
    }
  }, [onPointsChanged, onRewardUnlocked]);

  const handleUncomplete = useCallback(async (mission) => {
    await db.missions.update(mission.id, { completedAt: null });

    // Subtract points
    await addPoints(-mission.points);
    onPointsChanged?.();

    // Remove the most recent history entry for this mission
    const historyEntries = await db.history
      .where('missionId').equals(mission.id)
      .reverse().sortBy('achievedAt');
    if (historyEntries.length > 0) {
      await db.history.delete(historyEntries[0].id);
    }

    // Reschedule notification since there are now incomplete tasks
    const { enabled, time } = await getNotificationSettings();
    if (enabled && time) {
      scheduleNotification(() => db.missions.toArray(), time);
    }
  }, [onPointsChanged]);

  const handleDelete = useCallback(async (mission) => {
    // Delete all descendants (history entries are kept for calendar records)
    const deleteRecursive = async (id) => {
      const children = await db.missions.where('parentId').equals(id).toArray();
      for (const child of children) {
        await deleteRecursive(child.id);
      }
      await db.missions.delete(id);
    };
    await deleteRecursive(mission.id);
  }, []);

  if (!missions) return <div className="p-4 text-center text-slate-500">{t.common.loading}</div>;

  return (
    <div className="relative">
      <PointsHeader totalPoints={totalPoints} nextReward={nextReward} />
      <MissionList
        missions={missions}
        onComplete={handleComplete}
        onUncomplete={handleUncomplete}
        onDelete={handleDelete}
        onEdit={(m) => { setEditingMission(m); setShowModal(true); }}
      />

      {/* FAB */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-40">
        <button
          onClick={() => { setEditingMission(null); setShowModal(true); }}
          className="absolute bottom-0 right-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-full text-2xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center pointer-events-auto"
        >
          +
        </button>
      </div>

      {/* Point popups */}
      {popups.map(p => (
        <div
          key={p.id}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 point-pop text-yellow-400 text-2xl font-bold pointer-events-none z-50 drop-shadow-lg"
        >
          +{p.pts}pt!!
        </div>
      ))}

      {showModal && (
        <AddMissionModal
          missions={missions}
          editing={editingMission}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
