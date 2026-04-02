import { useState, useMemo, useCallback, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useGoals } from '../store/GoalContext';
import GoalCard from '../components/GoalCard';
import SortableGroup from '../components/SortableGroup';
import SortableGoalCard from '../components/SortableGoalCard';
import { useLocalOrder } from '../hooks/useLocalOrder';
import { frequencyCategory } from '../utils/helpers';
import { IMPORTANCE_LEVELS, IMPORTANCE_LABELS } from '../config';

const SORT_OPTIONS = ['Category', 'Importance', 'Frequency'];

export default function GoalListView({ onSelectGoal }) {
  const { state } = useGoals();
  const { goals, loading, error, user } = state;
  const [sortBy, setSortBy] = useState('Category');
  const [filterImportance, setFilterImportance] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('');
  const [filterFocus, setFilterFocus] = useState(false);
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const stringUser = (user?.email || 'anonymous').toLowerCase();

  useEffect(() => {
    const key = `independenceapp_collapsed_groups_${stringUser}_${sortBy}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setCollapsedGroups(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Failed to restore collapsed group state', err);
    }
  }, [stringUser, sortBy]);

  useEffect(() => {
    const key = `independenceapp_collapsed_groups_${stringUser}_${sortBy}`;
    try {
      localStorage.setItem(key, JSON.stringify(collapsedGroups));
    } catch {
      // ignore localStorage errors
    }
  }, [collapsedGroups, stringUser, sortBy]);
  const groupOrder = useLocalOrder('goal_group_order', `${stringUser}_${sortBy}`);
  const goalOrder = useLocalOrder('goal_item_order', `${stringUser}_${sortBy}`);

  const importanceOrder = { must: 0, should: 1, nice: 2 };

  const filtered = useMemo(() => {
    let result = goals;
    if (filterImportance) result = result.filter((g) => g.importance === filterImportance);
    if (filterFrequency) result = result.filter((g) => frequencyCategory(g) === filterFrequency);
    if (filterFocus) result = result.filter((g) => g.currentFocus);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((g) =>
        g.goal.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [goals, filterImportance, filterFrequency, filterFocus, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'Category') arr.sort((a, b) => a.category.localeCompare(b.category) || a.goal.localeCompare(b.goal));
    if (sortBy === 'Importance') arr.sort((a, b) => (importanceOrder[a.importance] ?? 9) - (importanceOrder[b.importance] ?? 9));
    if (sortBy === 'Frequency') arr.sort((a, b) => frequencyCategory(a).localeCompare(frequencyCategory(b)));
    return arr;
  }, [filtered, sortBy]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const g of sorted) {
      let key;
      if (sortBy === 'Category') key = g.category;
      else if (sortBy === 'Importance') key = IMPORTANCE_LABELS[g.importance] || g.importance;
      else if (sortBy === 'Frequency') key = frequencyCategory(g);
      else key = 'All Goals';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(g);
    }
    return map;
  }, [sorted, sortBy]);

  const orderedGroupEntries = useMemo(() => {
    const entries = [...grouped.entries()];
    return groupOrder.applyOrder(entries, ([key]) => key);
  }, [grouped, groupOrder]);

  const orderedGroupGoals = useMemo(() => {
    const map = new Map();
    for (const [group, groupGoals] of orderedGroupEntries) {
      const ordered = goalOrder.applyOrder(groupGoals, (item) => `${group}|${item.rowNumber}`);
      map.set(group, ordered);
    }
    return map;
  }, [orderedGroupEntries, goalOrder]);

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over || active.id === over.id) return;
      const keys = orderedGroupEntries.map(([key]) => key);
      const oldIndex = keys.indexOf(active.id);
      const newIndex = keys.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const newOrder = arrayMove(keys, oldIndex, newIndex);
      groupOrder.setOrder(newOrder);
    },
    [orderedGroupEntries, groupOrder]
  );

  const handleGoalDragEnd = useCallback(
    ({ active, over }, group) => {
      if (!over || active.id === over.id) return;
      const groupGoals = orderedGroupGoals.get(group) || [];
      const ids = groupGoals.map((g) => `${group}|${g.rowNumber}`);
      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const newGroupIds = arrayMove(ids, oldIndex, newIndex);
      const allGoalIds = [];
      for (const [grp, goalsForGroup] of orderedGroupGoals) {
        if (grp === group) {
          allGoalIds.push(...newGroupIds);
        } else {
          allGoalIds.push(...goalsForGroup.map((g) => `${grp}|${g.rowNumber}`));
        }
      }
      goalOrder.setOrder(allGoalIds);
    },
    [orderedGroupGoals, goalOrder]
  );

  const toggleGroup = useCallback((group) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  }, []);

  if (!state.authed) {
    return (
      <div className="view-empty">
        <p>Sign in with Google to view your independence goals.</p>
      </div>
    );
  }

  if (loading) return <div className="view-loading">Loading goals...</div>;
  if (error) return <div className="view-error">{error}</div>;

  return (
    <div className="goal-list-view">
      <div className="list-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search goals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="toolbar-controls">
          <div className="control-group">
            <label>Sort</label>
            <div className="sort-btns">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={`sort-btn ${sortBy === s ? 'active' : ''}`}
                  onClick={() => setSortBy(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <label>Filter</label>
            <div className="filter-controls">
              <label className="focus-toggle focus-toggle-large">
                <input type="checkbox" checked={filterFocus} onChange={(e) => setFilterFocus(e.target.checked)} />
                Current Focus only
              </label>
              <select value={filterImportance} onChange={(e) => setFilterImportance(e.target.value)}>
                <option value="">All Importance</option>
                {IMPORTANCE_LEVELS.map((l) => (
                  <option key={l} value={l}>{IMPORTANCE_LABELS[l]}</option>
                ))}
              </select>
              <select value={filterFrequency} onChange={(e) => setFilterFrequency(e.target.value)}>
                <option value="">All Frequency</option>
                {['Daily', 'Weekly', 'Monthly', 'Yearly', 'Other'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="view-empty">No goals match your filters.</div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext
          items={orderedGroupEntries.map(([group]) => group)}
          strategy={verticalListSortingStrategy}
        >
          {orderedGroupEntries.map(([group]) => {
            const groupGoals = orderedGroupGoals.get(group) || [];
            const isCollapsed = !!collapsedGroups[group];
            return (
              <SortableGroup key={group} id={group}>
                {(dragHandle) => (
                  <>
                    <div className="goal-group-header">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group)}
                        className="group-collapse-button"
                        aria-label={isCollapsed ? `Expand ${group}` : `Collapse ${group}`}
                      >
                        {isCollapsed ? '▸' : '▾'}
                      </button>
                      <h3 {...dragHandle} style={{ cursor: 'grab' }}>{group}</h3>
                      <span className="goal-group-count">{groupGoals.length}</span>
                    </div>
                    <DndContext sensors={sensors} onDragEnd={(event) => handleGoalDragEnd(event, group)} collisionDetection={closestCenter}>
                      <SortableContext
                        items={groupGoals.map((g) => `${group}|${g.rowNumber}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className={`goal-grid ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                          {groupGoals.map((g) => (
                            <SortableGoalCard
                              key={`${group}|${g.rowNumber}`}
                              id={`${group}|${g.rowNumber}`}
                              goal={g}
                              onClick={() => onSelectGoal(g)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </>
                )}
              </SortableGroup>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
