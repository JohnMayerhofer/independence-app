export default function ProgressBar({ mastery = 0, partial = 0, open = 0, label, counts }) {
  return (
    <div className="progress-bar-wrap">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track">
        {mastery > 0 && (
          <div className="progress-segment seg-mastery" style={{ width: `${mastery}%` }} title={`Mastery ${mastery}%`} />
        )}
        {partial > 0 && (
          <div className="progress-segment seg-partial" style={{ width: `${partial}%` }} title={`Partial ${partial}%`} />
        )}
        {open > 0 && (
          <div className="progress-segment seg-open" style={{ width: `${open}%` }} title={`Open ${open}%`} />
        )}
        {mastery === 0 && partial === 0 && open === 0 && (
          <div className="progress-segment seg-empty" style={{ width: '100%' }} />
        )}
      </div>
      {counts && (
        <div className="progress-counts">
          <span className="count-mastery">{counts.masteryCount} Mastery</span>
          <span className="count-partial">{counts.partialCount} Partial</span>
          <span className="count-open">{counts.openCount} Open</span>
          <span className="count-total">of {counts.total}</span>
        </div>
      )}
    </div>
  );
}
