import { useMemo } from 'react';
import { useGoals } from '../store/GoalContext';
import ProgressBar from '../components/ProgressBar';
import { progressPercent, groupBy, frequencyCategory } from '../utils/helpers';
import { IMPORTANCE_LABELS } from '../config';

function Section({ title, children }) {
  return (
    <section className="progress-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function ProgressView() {
  const { state } = useGoals();
  const { goals, loading, authed } = state;

  const withSelf = useMemo(() => goals.filter((g) => g.selfStatus), [goals]);
  const withTeam = useMemo(() => goals.filter((g) => g.teamStatus), [goals]);

  const overallSelf = useMemo(() => progressPercent(goals.map(g => ({ ...g, s: g.selfStatus })), 'selfStatus'), [goals]);
  const overallTeam = useMemo(() => progressPercent(goals.map(g => ({ ...g, s: g.teamStatus })), 'teamStatus'), [goals]);

  const byCategory = useMemo(() => {
    const map = groupBy(goals, (g) => g.category);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [goals]);

  const byImportance = useMemo(() => {
    const order = { must: 0, should: 1, nice: 2 };
    const map = groupBy(goals, (g) => g.importance);
    return [...map.entries()].sort((a, b) => (order[a[0]] ?? 9) - (order[b[0]] ?? 9));
  }, [goals]);

  const byFrequency = useMemo(() => {
    const order = { Daily: 0, Weekly: 1, Monthly: 2, Yearly: 3, Other: 4 };
    const map = groupBy(goals, frequencyCategory);
    return [...map.entries()].sort((a, b) => (order[a[0]] ?? 9) - (order[b[0]] ?? 9));
  }, [goals]);

  const focusGoals = useMemo(() => goals.filter((g) => g.currentFocus), [goals]);

  if (!authed) return <div className="view-empty">Sign in to view progress.</div>;
  if (loading) return <div className="view-loading">Loading...</div>;
  if (!goals.length) return <div className="view-empty">No goals loaded.</div>;

  return (
    <div className="progress-view">

      {focusGoals.length > 0 && (
        <Section title="Current Focus">
          <div className="focus-goals-list">
            {focusGoals.map((g) => (
              <div key={g.rowNumber} className="focus-goal-row">
                <div className="focus-goal-info">
                  <span className={`importance-badge imp-${g.importance}`}>{IMPORTANCE_LABELS[g.importance]}</span>
                  <span className="focus-goal-category">{g.category}</span>
                  <span className="focus-goal-name">{g.goal}</span>
                </div>
                <div className="focus-goal-evals">
                  <div className="eval-mini-row">
                    <span className="eval-mini-label">Self</span>
                    <span className={`status-badge status-${(g.selfStatus || 'empty').toLowerCase()} size-sm`}>{g.selfStatus || '—'}</span>
                  </div>
                  <div className="eval-mini-row">
                    <span className="eval-mini-label">Team</span>
                    <span className={`status-badge status-${(g.teamStatus || 'empty').toLowerCase()} size-sm`}>{g.teamStatus || '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Overall Progress">
        <div className="overall-stats">
          <div className="stat-card">
            <div className="stat-number">{goals.length}</div>
            <div className="stat-label">Total Goals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{withSelf.length}</div>
            <div className="stat-label">Self Evaluated</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{withTeam.length}</div>
            <div className="stat-label">Team Evaluated</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{focusGoals.length}</div>
            <div className="stat-label">In Focus</div>
          </div>
        </div>
        <div className="overall-bars">
          <ProgressBar label="Self Evaluation" {...overallSelf} counts={overallSelf} />
          <ProgressBar label="Support Team Evaluation" {...overallTeam} counts={overallTeam} />
        </div>
      </Section>

      <Section title="Progress by Category">
        <div className="breakdown-list">
          {byCategory.map(([category, catGoals]) => {
            const selfStats = progressPercent(catGoals, 'selfStatus');
            const teamStats = progressPercent(catGoals, 'teamStatus');
            return (
              <div key={category} className="breakdown-row">
                <div className="breakdown-label">
                  <span className="breakdown-name">{category}</span>
                  <span className="breakdown-count">{catGoals.length} goals</span>
                </div>
                <ProgressBar label="Self" {...selfStats} />
                <ProgressBar label="Team" {...teamStats} />
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Progress by Importance">
        <div className="breakdown-list">
          {byImportance.map(([importance, impGoals]) => {
            const selfStats = progressPercent(impGoals, 'selfStatus');
            const teamStats = progressPercent(impGoals, 'teamStatus');
            return (
              <div key={importance} className="breakdown-row">
                <div className="breakdown-label">
                  <span className={`importance-badge imp-${importance}`}>{IMPORTANCE_LABELS[importance] || importance}</span>
                  <span className="breakdown-count">{impGoals.length} goals</span>
                </div>
                <ProgressBar label="Self" {...selfStats} />
                <ProgressBar label="Team" {...teamStats} />
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Progress by Frequency">
        <div className="breakdown-list">
          {byFrequency.map(([freq, freqGoals]) => {
            const selfStats = progressPercent(freqGoals, 'selfStatus');
            const teamStats = progressPercent(freqGoals, 'teamStatus');
            return (
              <div key={freq} className="breakdown-row">
                <div className="breakdown-label">
                  <span className="breakdown-name">{freq}</span>
                  <span className="breakdown-count">{freqGoals.length} goals</span>
                </div>
                <ProgressBar label="Self" {...selfStats} />
                <ProgressBar label="Team" {...teamStats} />
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
