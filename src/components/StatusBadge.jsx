export default function StatusBadge({ status, size = 'md' }) {
  if (!status) return <span className={`status-badge status-empty size-${size}`}>—</span>;
  const cls = status.toLowerCase();
  return <span className={`status-badge status-${cls} size-${size}`}>{status}</span>;
}
