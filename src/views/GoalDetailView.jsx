import { useState } from 'react';
import { useGoals } from '../store/GoalContext';
import EvalPanel from '../components/EvalPanel';
import { IMPORTANCE_LABELS } from '../config';
import { frequencyCategory } from '../utils/helpers';

export default function GoalDetailView({ goal, onBack }) {
  const { state, saveSelfEval, saveTeamEval } = useGoals();
  const [saving, setSaving] = useState(false);

  // Always get the latest version of the goal from state
  const current = state.goals.find((g) => g.rowNumber === goal.rowNumber) || goal;

  async function handleSaveSelf(status, comments) {
    setSaving(true);
    try {
      await saveSelfEval(current.rowNumber, status, comments);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTeam(status, comments) {
    setSaving(true);
    try {
      await saveTeamEval(current.rowNumber, status, comments);
    } finally {
      setSaving(false);
    }
  }

  const freqLabel = frequencyCategory(current);
  const importanceLabel = IMPORTANCE_LABELS[current.importance] || current.importance;

  return (
    <div className="goal-detail-view">
      <button className="back-btn" onClick={onBack}>← Back to Goals</button>

      <div className="goal-detail-card">
        <div className="goal-detail-header">
          <div className="goal-detail-meta">
            <span className={`importance-badge imp-${current.importance}`}>{importanceLabel}</span>
            <span className="goal-detail-category">{current.category}</span>
            {current.currentFocus && <span className="focus-badge">Current Focus</span>}
          </div>
          <h1 className="goal-detail-name">{current.goal}</h1>
          <div className="goal-detail-attrs">
            <div className="attr">
              <span className="attr-label">Frequency</span>
              <span className="attr-value">{freqLabel}</span>
            </div>
            {current.frequency.length > 0 && (
              <div className="attr">
                <span className="attr-label">When</span>
                <span className="attr-value">{current.frequency.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="goal-detail-evals">
          <EvalPanel
            title="Self Evaluation"
            status={current.selfStatus}
            comments={current.selfComments}
            updatedDate={current.selfUpdated}
            canEdit={state.canEditSelf}
            onSave={handleSaveSelf}
            saving={saving}
          />
          <EvalPanel
            title="Support Team Evaluation"
            status={current.teamStatus}
            comments={current.teamComments}
            updatedDate={current.teamUpdated}
            canEdit={state.canEditTeam}
            onSave={handleSaveTeam}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}
