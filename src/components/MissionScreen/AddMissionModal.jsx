import { useState, useEffect, useMemo } from 'react';
import { db } from '../../db/db';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const PRESET_CATEGORIES = [
  { emoji: '💪', name: '運動・健康' },
  { emoji: '📚', name: '学習・勉強' },
  { emoji: '🏠', name: '家事・生活' },
  { emoji: '💼', name: '仕事・キャリア' },
  { emoji: '🌟', name: 'カスタム' },
];

export default function AddMissionModal({ missions, editing, onClose }) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [interval, setInterval] = useState('daily');
  const [weekday, setWeekday] = useState(1);
  const [points, setPoints] = useState(10);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  // Get existing categories (depth 0) and subcategories (depth 1)
  const existingCategories = useMemo(() => {
    if (!missions) return [];
    return missions.filter(m => m.depth === 0 && missions.some(c => c.parentId === m.id));
  }, [missions]);

  // Also include depth-0 missions that are standalone (no children yet) as potential categories
  const allCategories = useMemo(() => {
    if (!missions) return [];
    return missions.filter(m => m.depth === 0);
  }, [missions]);

  const existingSubcategories = useMemo(() => {
    if (!missions || !categoryName) return [];
    const cat = allCategories.find(c => c.title === categoryName);
    if (!cat) return [];
    // Only include depth-1 missions that have children (actual sub-groups), not leaf tasks
    return missions.filter(m => m.parentId === cat.id && m.depth === 1 && missions.some(c => c.parentId === m.id));
  }, [missions, categoryName, allCategories]);

  // Check if editing a category/subcategory (non-leaf with children)
  const isEditingCategory = editing && editing.depth < 2 && missions.some(m => m.parentId === editing.id);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setMemo(editing.memo || '');
      setInterval(editing.interval);
      setWeekday(editing.weekday ?? 1);
      setPoints(editing.points);

      // Resolve category and subcategory names from hierarchy
      if (editing.depth === 2 && editing.parentId) {
        const parent = missions.find(m => m.id === editing.parentId);
        if (parent) {
          setSubcategoryName(parent.title);
          if (parent.parentId) {
            const grandparent = missions.find(m => m.id === parent.parentId);
            if (grandparent) setCategoryName(grandparent.title);
          }
        }
      } else if (editing.depth === 1 && editing.parentId) {
        const parent = missions.find(m => m.id === editing.parentId);
        if (parent) setCategoryName(parent.title);
        setSubcategoryName('');
      } else if (editing.depth === 0) {
        setCategoryName(editing.title);
        setSubcategoryName('');
      }
    }
  }, [editing, missions]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (editing) {
      if (isEditingCategory) {
        await db.missions.update(editing.id, { title: title.trim() });
      } else {
        await db.missions.update(editing.id, {
          title: title.trim(),
          memo: memo.trim(),
          interval,
          weekday: interval === 'weekly' ? weekday : null,
          points: Number(points),
        });
      }
      onClose();
      return;
    }

    // Find or create category (depth 0)
    let parentId = null;
    if (categoryName.trim()) {
      let category = allCategories.find(c => c.title === categoryName.trim());
      if (!category) {
        const catId = await db.missions.add({
          title: categoryName.trim(),
          memo: '',
          interval: 'daily',
          weekday: null,
          points: 0,
          parentId: null,
          depth: 0,
          completedAt: null,
          createdAt: new Date().toISOString(),
        });
        category = { id: catId, depth: 0 };
      }
      parentId = category.id;

      // Find or create subcategory (depth 1)
      if (subcategoryName.trim()) {
        const subs = missions.filter(m => m.parentId === category.id && m.depth === 1);
        let subcategory = subs.find(s => s.title === subcategoryName.trim());
        if (!subcategory) {
          const subId = await db.missions.add({
            title: subcategoryName.trim(),
            memo: '',
            interval: 'daily',
            weekday: null,
            points: 0,
            parentId: category.id,
            depth: 1,
            completedAt: null,
            createdAt: new Date().toISOString(),
          });
          subcategory = { id: subId, depth: 1 };
        }
        parentId = subcategory.id;
      }
    }

    const depth = parentId
      ? (subcategoryName.trim() ? 2 : 1)
      : 0;

    await db.missions.add({
      title: title.trim(),
      memo: memo.trim(),
      interval,
      weekday: interval === 'weekly' ? weekday : null,
      points: Number(points),
      parentId,
      depth,
      completedAt: null,
      createdAt: new Date().toISOString(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-[60]" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-md mx-auto max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditingCategory
              ? (editing.depth === 0 ? 'カテゴリを編集' : 'サブカテゴリを編集')
              : editing ? 'ミッションを編集' : 'ミッションを追加'}
          </h2>
          <button onClick={onClose} className="text-slate-400 text-xl w-10 h-10 flex items-center justify-center">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category-only edit: just the name */}
          {isEditingCategory && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  {editing.depth === 0 ? 'カテゴリ名' : 'サブカテゴリ名'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-600"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl"
                >
                  更新
                </button>
              </div>
            </>
          )}

          {/* Category */}
          {!editing && !isEditingCategory && (
            <div className="relative">
              <label className="text-sm font-medium text-slate-700 block mb-1">カテゴリ (大項目)</label>
              <input
                type="text"
                value={categoryName}
                onChange={e => { setCategoryName(e.target.value); setShowCategoryDropdown(true); }}
                onFocus={() => setShowCategoryDropdown(true)}
                onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                placeholder="例: 運動・健康"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-slate-50"
              />
              {showCategoryDropdown && (allCategories.length > 0 || PRESET_CATEGORIES.length > 0) && (
                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-30 mt-1 max-h-48 overflow-y-auto">
                  {allCategories
                    .filter(c => !categoryName || c.title.includes(categoryName))
                    .map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { setCategoryName(c.title); setShowCategoryDropdown(false); }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-slate-700"
                      >
                        {c.title}
                      </button>
                    ))}
                  {PRESET_CATEGORIES
                    .filter(p => !allCategories.some(c => c.title === `${p.emoji} ${p.name}`))
                    .filter(p => !categoryName || `${p.emoji} ${p.name}`.includes(categoryName))
                    .map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { setCategoryName(`${p.emoji} ${p.name}`); setShowCategoryDropdown(false); }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-slate-400"
                      >
                        {p.emoji} {p.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Subcategory */}
          {!editing && !isEditingCategory && categoryName.trim() && (
            <div className="relative">
              <label className="text-sm font-medium text-slate-700 block mb-1">サブカテゴリ (中項目)</label>
              <input
                type="text"
                value={subcategoryName}
                onChange={e => { setSubcategoryName(e.target.value); setShowSubcategoryDropdown(true); }}
                onFocus={() => setShowSubcategoryDropdown(true)}
                onBlur={() => setTimeout(() => setShowSubcategoryDropdown(false), 200)}
                placeholder="例: 新しい習慣"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-slate-50"
              />
              {showSubcategoryDropdown && existingSubcategories.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-30 mt-1 max-h-48 overflow-y-auto">
                  {existingSubcategories
                    .filter(s => !subcategoryName || s.title.includes(subcategoryName))
                    .map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { setSubcategoryName(s.title); setShowSubcategoryDropdown(false); }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-slate-700"
                      >
                        {s.title}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Task name */}
          {!isEditingCategory && (
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">タスク名 (ミッションの内容) *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="例: 腕立て10回"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </div>
          )}

          {/* Interval */}
          {!isEditingCategory && (
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">間隔 (周期)</label>
            <select
              value={interval}
              onChange={e => setInterval(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-slate-50 appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
            >
              <option value="daily">日次 (毎日)</option>
              <option value="weekly">週次 (毎週)</option>
              <option value="monthly">月次 (毎月)</option>
            </select>
          </div>
          )}

          {!isEditingCategory && interval === 'weekly' && (
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">基準曜日</label>
              <div className="flex gap-1">
                {WEEKDAYS.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setWeekday(i)}
                    className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                      weekday === i
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Points */}
          {!isEditingCategory && (
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">獲得ポイント</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <input
                type="number"
                value={points}
                onChange={e => setPoints(e.target.value)}
                min={1}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              <span className="text-sm text-slate-500 font-medium">pt</span>
            </div>
          </div>
          )}

          {!isEditingCategory && (
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-600"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl"
            >
              {editing ? '更新' : '追加'}
            </button>
          </div>
          )}
        </form>
      </div>
    </div>
  );
}
