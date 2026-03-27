import { MetricCard } from '../components/MetricCard';
import { ActivityFeed } from '../components/ActivityFeed';

export function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#e0e0e0' }}>
        Mission Control Dashboard
      </h1>

      <div className="metrics-grid">
        <MetricCard label="Active Tasks" value="12" indicator="🟢 All on track" />
        <MetricCard label="Content Pipeline" value="3" indicator="In draft stage" />
        <MetricCard label="Upcoming Events" value="2" indicator="Next 48 hours" />
        <MetricCard label="Agent Activity" value="4" indicator="🟢 Active now" />
      </div>

      <ActivityFeed />
    </div>
  );
}
