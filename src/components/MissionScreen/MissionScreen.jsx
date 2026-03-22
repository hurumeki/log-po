import { useState, useEffect, useCallback } from 'react';
import { db, getTotalPoints, addPoints, checkRewardUnlocks } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import MissionList from './MissionList';
import AddMissionModal from './AddMissionModal';
import PointsHeader from './PointsHeader';

export default function MissionScreen({ onRewardUnlocked, onPointsChanged }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [nextReward, setNextReward] = useState(null);
  const [popups, setPopups] = useState([]);

  const missions = useLiveQuery(() => db.missions.orderBy('id').toArray(), []);
  const rewards = useLiveQuery(() => db.rewards.orderBy('requiredPoints').toArray(), []);

  useEffect(() => {
    getTotalPoints().then(setTotalPoints);
  }, [missions]);

  useEffect(() => {
    if (!rewards || !totalPoints) {
      setNextReward(null);
      return;
    }
    const next = rewards.find(r => !r.unlockedAt && r.requiredPoints > totalPoints);
    setNextReward(next || null);
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
    setTotalPoints(newTotal);
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
  }, [onPointsChanged, onRewardUnlocked]);

  const handleUncomplete = useCallback(async (mission) => {
    await db.missions.update(mission.id, { completedAt: null });
  }, []);

  const handleDelete = useCallback(async (mission) => {
    // Delete all descendants first
    const deleteRecursive = async (id) => {
      const children = await db.missions.where('parentId').equals(id).toArray();
      for (const child of children) {
        await deleteRecursive(child.id);
      }
      await db.missions.delete(id);
    };
    await deleteRecursive(mission.id);
  }, []);

  if (!missions) return <div className="p-4 text-center text-slate-500">読み込み中...</div>;

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
      <button
        onClick={() => { setEditingMission(null); setShowModal(true); }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-yellow-400 text-slate-800 rounded-full text-2xl font-bold shadow-lg flex items-center justify-center z-40"
      >
        +
      </button>

      {/* Point popups */}
      {popups.map(p => (
        <div
          key={p.id}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 point-pop text-yellow-400 text-2xl font-bold pointer-events-none z-50"
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
