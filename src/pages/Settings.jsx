import { useState, useEffect } from 'react';
import { agents, getStatusColor } from '../data/agents';

export function Settings() {
  const [agentConfig, setAgentConfig] = useState({});
  const [cronJobs, setCronJobs] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('agentConfig');
    if (saved) {
      setAgentConfig(JSON.parse(saved));
    } else {
      const defaultConfig = {};
      agents.execution.forEach((agent) => {
        defaultConfig[agent.id] = agent.status;
      });
      setAgentConfig(defaultConfig);
    }

    const savedCrons = localStorage.getItem('cronJobs');
    if (savedCrons) {
      setCronJobs(JSON.parse(savedCrons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('agentConfig', JSON.stringify(agentConfig));
  }, [agentConfig]);

  const handleAgentToggle = (agentId) => {
    const statuses = ['dormant', 'pending', 'active'];
    const currentStatus = agentConfig[agentId] || 'dormant';
    const currentIdx = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];

    setAgentConfig({
      ...agentConfig,
      [agentId]: nextStatus,
    });
  };

  const integrations = [
    { name: 'Telegram (OpenClaw)', status: 'connected' },
    { name: 'GitHub', status: 'connected' },
    { name: 'Vercel', status: 'connected' },
    { name: 'Notion', status: 'disconnected' },
    { name: 'Slack', status: 'disconnected' },
    { name: 'Google Calendar', status: 'disconnected' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: '#e0e0e0' }}>
        Settings
      </h1>

      <div className="settings-sections">
        {/* Agent Configuration */}
        <div className="settings-section">
          <h3 className="settings-section-title">🤖 Executor Agent Configuration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {agents.execution.map((agent) => (
              <div key={agent.id} className="settings-item">
                <div className="settings-label">
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    {agent.icon} {agent.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{agent.role}</div>
                </div>
                <div
                  className="toggle-switch"
                  onClick={() => handleAgentToggle(agent.id)}
                  style={{
                    background:
                      agentConfig[agent.id] === 'active'
                        ? '#00ff41'
                        : agentConfig[agent.id] === 'pending'
                        ? '#ffd700'
                        : '#1a1a1a',
                    borderColor:
                      agentConfig[agent.id] === 'active'
                        ? '#00ff41'
                        : agentConfig[agent.id] === 'pending'
                        ? '#ffd700'
                        : '#2a2a2a',
                  }}
                >
                  <div className="toggle-switch-thumb"></div>
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: getStatusColor(agentConfig[agent.id] || 'dormant'),
                    textTransform: 'uppercase',
                    fontWeight: '600',
                  }}
                >
                  {agentConfig[agent.id] || 'dormant'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="settings-section">
          <h3 className="settings-section-title">🔗 Integrations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {integrations.map((integration, idx) => (
              <div key={idx} className="settings-item">
                <div className="settings-label">{integration.name}</div>
                <div className="integration-status">
                  <div
                    className={`status-indicator ${integration.status === 'connected' ? 'connected' : 'disconnected'}`}
                  ></div>
                  <span style={{ fontSize: '12px', color: '#888', textTransform: 'capitalize' }}>
                    {integration.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="settings-section">
          <h3 className="settings-section-title">ℹ️ System Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div className="settings-label">App Version</div>
              <div className="settings-value">1.0.0</div>
            </div>
            <div>
              <div className="settings-label">Last Sync</div>
              <div className="settings-value">Just now</div>
            </div>
            <div>
              <div className="settings-label">Total Agents</div>
              <div className="settings-value">148 XQUADS agents</div>
            </div>
            <div>
              <div className="settings-label">Database</div>
              <div className="settings-value">localStorage (Client-side)</div>
            </div>
            <div>
              <div className="settings-label">Environment</div>
              <div className="settings-value">Production</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cron Jobs */}
      <div
        style={{
          marginTop: '32px',
          background: '#141414',
          border: '1px solid #1e1e1e',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="settings-section-title">⏰ Cron Jobs</h3>
          <button
            style={{
              background: '#00ff41',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px',
            }}
          >
            + Add Cron Job
          </button>
        </div>

        {cronJobs.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#555',
              fontSize: '13px',
            }}
          >
            No scheduled cron jobs configured yet
          </div>
        ) : (
          <table className="settings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Schedule</th>
                <th>Last Run</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cronJobs.map((job, idx) => (
                <tr key={idx}>
                  <td>{job.name}</td>
                  <td>{job.schedule}</td>
                  <td>{job.lastRun || 'Never'}</td>
                  <td>
                    <span
                      style={{
                        padding: '2px 6px',
                        background: '#1a1a1a',
                        borderRadius: '3px',
                        fontSize: '11px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {job.status || 'enabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Advanced Settings */}
      <div
        style={{
          marginTop: '32px',
          background: '#141414',
          border: '1px solid #1e1e1e',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <h3 className="settings-section-title">⚙️ Advanced Settings</h3>
        <div style={{ marginTop: '16px', color: '#888', fontSize: '13px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
              <span>Enable debug mode</span>
            </label>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
              <span>Auto-backup to localStorage</span>
            </label>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span>Enable notifications</span>
            </label>
          </div>
        </div>
        <button
          style={{
            marginTop: '20px',
            background: '#1a1a1a',
            color: '#e0e0e0',
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Clear All Data & Reset
        </button>
      </div>
    </div>
  );
}
