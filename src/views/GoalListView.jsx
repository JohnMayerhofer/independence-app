import { useState, useMemo } from 'react';
import { useGoals } from '../store/GoalContext';
import GoalCard from '../components/GoalCard';
import { frequencyCategory } from '../utils/helpers';
import { IMPORTANCE_LEVELS, IMPORTANCE_LABELS } from '../config';

const SORT_OPTIONS = ['Category', 'Importance', 'Frequency'];

export default function GoalListView({ onSelectGoal }) {
  const { state } = useGoals();
  const { goals, loading, error } = state;
  const [sortBy, setSortBy] = useState('Category');
  const [filterImportance, setFilterImportance] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('');
  const [filterFocus, setFilterFocus] = useState(false);
  const [search, setSearch] = useState('');

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

  // Group by primary sort key
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

      {[...grouped.entries()].map(([group, groupGoals]) => (
        <div key={group} className="goal-group">
          <div className="goal-group-header">
            <h3>{group}</h3>
            <span className="goal-group-count">{groupGoals.length}</span>
          </div>
          <div className="goal-grid">
            {groupGoals.map((g) => (
              <GoalCard key={`${g.rowNumber}`} goal={g} onClick={() => onSelectGoal(g)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
