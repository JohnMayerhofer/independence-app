import { useState } from 'react';
import { STATUS_VALUES } from '../config';
import StatusBadge from './StatusBadge';

export default function EvalPanel({ title, status, comments, updatedDate, canEdit, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [draftStatus, setDraftStatus] = useState(status || '');
  const [draftComments, setDraftComments] = useState(comments || '');

  function handleEdit() {
    setDraftStatus(status || '');
    setDraftComments(comments || '');
    setEditing(true);
  }

  async function handleSave() {
    await onSave(draftStatus, draftComments);
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  return (
    <div className="eval-panel">
      <div className="eval-panel-header">
        <h3>{title}</h3>
        {canEdit && !editing && (
          <button className="btn btn-sm" onClick={handleEdit}>Edit</button>
        )}
      </div>

      {editing ? (
        <div className="eval-form">
          <div className="eval-field">
            <label>Status</label>
            <div className="status-options">
              {STATUS_VALUES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`status-option-btn ${draftStatus === s ? 'active' : ''} status-${s.toLowerCase()}`}
                  onClick={() => setDraftStatus(s)}
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                className={`status-option-btn ${draftStatus === '' ? 'active' : ''} status-empty`}
                onClick={() => setDraftStatus('')}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="eval-field">
            <label>Comments</label>
            <textarea
              value={draftComments}
              onChange={(e) => setDraftComments(e.target.value)}
              rows={3}
              placeholder="Add notes..."
            />
          </div>
          <div className="eval-actions">
            <button className="btn" onClick={handleCancel} disabled={saving}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="eval-display">
          <div className="eval-row">
            <StatusBadge status={status} />
            {updatedDate && <span className="eval-date">Updated {updatedDate}</span>}
          </div>
          {comments && <p className="eval-comments">{comments}</p>}
          {!status && !comments && canEdit && (
            <p className="eval-empty">No evaluation yet. Click Edit to add one.</p>
          )}
          {!status && !comments && !canEdit && (
            <p className="eval-empty">No evaluation yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
