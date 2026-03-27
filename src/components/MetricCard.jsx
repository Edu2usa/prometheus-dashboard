export function MetricCard({ label, value, indicator }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-indicator">{indicator}</div>
    </div>
  );
}
