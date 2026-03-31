import { COLS } from '../config';

export function parseGoalRow(row, rowIndex) {
  const get = (i) => (row[i] || '').toString().trim();
  const checked = (i) => get(i) === '✓' || get(i) === 'TRUE' || get(i) === '1';

  const frequency = [];
  const dailyParts = [];
  if (checked(COLS.MORNING)) dailyParts.push('Morning');
  if (checked(COLS.EVENING)) dailyParts.push('Evening');
  if (checked(COLS.VARIOUS)) dailyParts.push('Various');
  if (dailyParts.length) frequency.push(`Daily (${dailyParts.join(', ')})`);
  if (checked(COLS.WEEKLY)) frequency.push('Weekly');
  if (checked(COLS.MONTHLY)) frequency.push('Monthly');
  if (checked(COLS.YEARLY)) frequency.push('Yearly');

  return {
    rowNumber: rowIndex + 1, // 1-based sheet row
    currentFocus: checked(COLS.CURRENT_FOCUS),
    category: get(COLS.CATEGORY),
    goal: get(COLS.GOAL),
    importance: get(COLS.IMPORTANCE).toLowerCase(),
    frequency,
    frequencyRaw: {
      morning: checked(COLS.MORNING),
      evening: checked(COLS.EVENING),
      various: checked(COLS.VARIOUS),
      weekly: checked(COLS.WEEKLY),
      monthly: checked(COLS.MONTHLY),
      yearly: checked(COLS.YEARLY),
    },
    selfStatus: get(COLS.SELF_STATUS),
    selfComments: get(COLS.SELF_COMMENTS),
    selfUpdated: get(COLS.SELF_UPDATED),
    teamStatus: get(COLS.TEAM_STATUS),
    teamComments: get(COLS.TEAM_COMMENTS),
    teamUpdated: get(COLS.TEAM_UPDATED),
  };
}

export function statusScore(status) {
  if (status === 'Mastery') return 2;
  if (status === 'Partial') return 1;
  return 0; // Open or empty
}

export function progressPercent(goals, statusKey) {
  const scored = goals.filter((g) => g[statusKey]);
  if (!scored.length) return { mastery: 0, partial: 0, open: 0 };
  const mastery = scored.filter((g) => g[statusKey] === 'Mastery').length;
  const partial = scored.filter((g) => g[statusKey] === 'Partial').length;
  const open = scored.filter((g) => g[statusKey] === 'Open').length;
  const total = scored.length;
  return {
    mastery: Math.round((mastery / total) * 100),
    partial: Math.round((partial / total) * 100),
    open: Math.round((open / total) * 100),
    masteryCount: mastery,
    partialCount: partial,
    openCount: open,
    total,
  };
}

export function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

export function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function todayString() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function frequencyCategory(goal) {
  const r = goal.frequencyRaw;
  if (r.morning || r.evening || r.various) return 'Daily';
  if (r.weekly) return 'Weekly';
  if (r.monthly) return 'Monthly';
  if (r.yearly) return 'Yearly';
  return 'Other';
}
