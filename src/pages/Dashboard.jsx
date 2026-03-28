import { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { Heartbeat } from '../components/Heartbeat';

const TABS = [
  { id: 'heartbeat', label: 'Heartbeat', icon: '💓' },
  { id: 'overview', label: 'Overview', icon: '📊' },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('heartbeat');

  return (
    <div>
      {/* Tab navigation */}
      <div className="dash-tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'heartbeat' && <Heartbeat />}

      {activeTab === 'overview' && (
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
      )}
    </div>
  );
}
