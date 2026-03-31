import StatusBadge from './StatusBadge';
import { IMPORTANCE_LABELS } from '../config';

export default function GoalCard({ goal, onClick }) {
  const importanceLabel = IMPORTANCE_LABELS[goal.importance] || goal.importance;

  return (
    <div className={`goal-card importance-${goal.importance}`} onClick={onClick}>
      <div className="goal-card-header">
        <div className="goal-card-meta">
          <span className={`importance-badge imp-${goal.importance}`}>{importanceLabel}</span>
          {goal.currentFocus && <span className="focus-badge">Focus</span>}
        </div>
        <span className="goal-category">{goal.category}</span>
      </div>
      <div className="goal-name">{goal.goal}</div>
      {goal.frequency.length > 0 && (
        <div className="goal-frequency">{goal.frequency.join(' · ')}</div>
      )}
      <div className="goal-card-evals">
        <div className="eval-mini">
          <span className="eval-mini-label">Self</span>
          <StatusBadge status={goal.selfStatus} size="sm" />
        </div>
        <div className="eval-mini">
          <span className="eval-mini-label">Team</span>
          <StatusBadge status={goal.teamStatus} size="sm" />
        </div>
      </div>
    </div>
  );
}
