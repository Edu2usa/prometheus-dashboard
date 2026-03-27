export function ActivityFeed() {
  const activities = [
    { time: '10:42 AM', agent: 'LEONIDAS', action: 'Completed: Client proposal for Riverside Plaza ✅', status: 'active' },
    { time: '10:38 AM', agent: 'TAXIS', action: 'Routing: New maintenance request → Team Alpha 🔄', status: 'active' },
    { time: '10:15 AM', agent: 'NEWS', action: 'Gathered: 3 industry updates for morning brief 📰', status: 'active' },
    { time: '09:50 AM', agent: 'AUDIT', action: 'Verified: March invoices batch #47 ✓', status: 'active' },
    { time: '09:30 AM', agent: 'Advisory Board', action: 'Standby: Awaiting Eduardo\'s next strategic query 💤', status: 'standby' },
  ];

  return (
    <div className="activity-feed">
      <div className="activity-feed-title">Live Activity Feed</div>
      {activities.map((activity, idx) => (
        <div key={idx} className="activity-item">
          <div className="activity-time">[{activity.time}]</div>
          <div className="activity-content">
            <span className="activity-agent">{activity.agent}</span> — {activity.action}
          </div>
        </div>
      ))}
    </div>
  );
}
