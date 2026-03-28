import { useState, useEffect } from 'react';

// Demo agent data — will be replaced by real OpenRouter/OpenClaw data when connected
const DEMO_AGENTS = [
  {
    id: 'wayne',
    name: 'Wayne',
    role: 'Foreman Agent & Operator',
    avatar: '\u{1F477}',
    color: '#00ff41',
    session: 'wny-7f3c2a1e',
    model: 'qwen3:8b',
    status: 'Working',
    statusColor: '#00ff41',
    lastActive: '12s ago',
    nextAction: { label: 'Check kanban board for blocked tasks', status: 'Queued ~1m', icon: '\u{1F504}' },
    currentAction: { label: 'Updating task STATUS-42 to "In Progress"', status: 'Active 2m', icon: '\u26A1' },
    pastActions: [
      { label: 'Resolved merge conflict in \`mission_control.py\`', time: '8m ago' },
      { label: 'Reviewed PR #87 and added comments', time: '12m ago' },
      { label: 'Pulled latest changes from main', time: '18m ago' },
    ],
    tokenUsage: { used: 128000, total: 256000 },
    contextWindow: 50,
    cost: 0.0241,
  },
  {
    id: 'mona',
    name: 'Mona',
    role: 'Coding Agent & Engineer',
    avatar: '\u{1F469}\u200D\u{1F4BB}',
    color: '#ff6b35',
    session: 'mon-9b8d4f11',
    model: 'qwen2.5-coder:14b',
    status: 'Working',
    statusColor: '#00ff41',
    lastActive: '7s ago',
    nextAction: { label: 'Implement kanban drag-and-drop with SQLite persistence', status: 'Queued ~2m', icon: '\u{1F534}' },
    currentAction: { label: 'Writing \`kanban_board.py\` \u2014 implementing move_task()', status: 'Active 9m', icon: '\u{1F4BB}' },
    pastActions: [
      { label: 'Created database schema for tasks and columns', time: '25m ago' },
      { label: 'Built FastAPI endpoints for task CRUD', time: '32m ago' },
      { label: 'Set up Alembic migrations', time: '45m ago' },
    ],
    tokenUsage: { used: 96000, total: 128000 },
    contextWindow: 75,
    cost: 0.0987,
  },
  {
    id: 'doc',
    name: 'Doc',
    role: 'Visual & QA Agent',
    avatar: '\u{1F916}',
    color: '#a78bfa',
    session: 'doc-a3f91d55',
    model: 'qwen3-vl:8b',
    status: 'Idle',
    statusColor: '#fbbf24',
    lastActive: '1m ago',
    nextAction: { label: 'Capture screenshot of Kanban board and check for UI issues', status: 'Queued', icon: '\u{1F4F8}' },
    currentAction: { label: 'Monitoring browser for user login and UI state changes', status: 'Idle', icon: '\u{1F441}\uFE0F' },
    pastActions: [
      { label: 'Validated responsive layout on /board', time: '3m ago' },
      { label: 'Checked auth flow \u2014 login modal OK', time: '7m ago' },
      { label: 'Captured screenshot: clean_dashboard.png', time: '15m ago' },
    ],
    tokenUsage: { used: 22000, total: 64000 },
    contextWindow: 34,
    cost: 0.0113,
  },
];

const DEMO_COST_LOG = [
  { time: '14:32:45', agent: 'Wayne', avatar: '\u{1F477}', session: 'wny-7f3c2a1e', model: 'qwen3:8b', promptTokens: 2100, completionTokens: 1400, cost: 0.0024, activity: 'Updated task status and added comment' },
  { time: '14:32:18', agent: 'Mona', avatar: '\u{1F469}\u200D\u{1F4BB}', session: 'mon-9b8d4f11', model: 'qwen2.5-coder:14b', promptTokens: 5300, completionTokens: 3800, cost: 0.0087, activity: 'Wrote kanban_board.py (move_task function)' },
  { time: '14:31:52', agent: 'Doc', avatar: '\u{1F916}', session: 'doc-a3f91d55', model: 'qwen3-vl:8b', promptTokens: 1200, completionTokens: 780, cost: 0.0011, activity: 'Analyzed screenshot: UI looks good, no issues found' },
  { time: '14:30:10', agent: 'Wayne', avatar: '\u{1F477}', session: 'wny-7f3c2a1e', model: 'qwen3:8b', promptTokens: 1800, completionTokens: 900, cost: 0.0019, activity: 'Pulled latest git changes and resolved conflict' },
  { time: '14:28:33', agent: 'Mona', avatar: '\u{1F469}\u200D\u{1F4BB}', session: 'mon-9b8d4f11', model: 'qwen2.5-coder:14b', promptTokens: 4200, completionTokens: 5100, cost: 0.0102, activity: 'Created FastAPI endpoint for task CRUD' },
  { time: '14:25:01', agent: 'Doc', avatar: '\u{1F916}', session: 'doc-a3f91d55', model: 'qwen3-vl:8b', promptTokens: 2400, completionTokens: 1100, cost: 0.0018, activity: 'Validated responsive layout breakpoints' },
];

function AgentCard({ agent }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((agent.tokenUsage.used / agent.tokenUsage.total) * 100);
  const barColor = pct > 75 ? '#ff6b35' : pct > 50 ? '#fbbf24' : '#00ff41';
  const usedK = (agent.tokenUsage.used / 1000).toFixed(0) + 'K';
  const totalK = (agent.tokenUsage.total / 1000).toFixed(0) + 'K';

  return (
    <div className="hb-agent-card" style={{ borderColor: agent.color + '33' }}>
      <div className="hb-agent-top" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <div className="hb-agent-header">
          <span className="hb-agent-avatar">{agent.avatar}</span>
          <div className="hb-agent-identity">
            <div className="hb-agent-name">
              {agent.name}
              <span className="hb-badge" style={{ background: agent.color + '22', color: agent.color, border: \`1px solid \${agent.color}44\` }}>AGENT</span>
            </div>
            <div className="hb-agent-role">{agent.role}</div>
          </div>
          <span style={{ color: '#555', fontSize: '16px' }}>{expanded ? '\u25BE' : '\u203A'}</span>
        </div>

        <div className="hb-agent-meta-row">
          <span className="hb-meta-label">SESSION</span>
          <span className="hb-meta-value">{agent.session} \u{1F4CB}</span>
          <span className="hb-meta-label" style={{ marginLeft: '16px' }}>LLM</span>
          <span className="hb-meta-value">{agent.model} \u270F\uFE0F</span>
        </div>

        <div className="hb-agent-meta-row">
          <span className="hb-meta-label">STATUS</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: agent.statusColor, display: 'inline-block' }}></span>
            <span style={{ color: '#e0e0e0' }}>{agent.status}</span>
            <span style={{ color: '#555' }}>{agent.lastActive}</span>
          </span>
        </div>
      </div>

      <div className="hb-actions">
        <div className="hb-action-item">
          <span className="hb-action-icon">{agent.nextAction.icon}</span>
          <div className="hb-action-content">
            <div className="hb-action-label">Next Action</div>
            <div className="hb-action-text">{agent.nextAction.label}</div>
          </div>
          <span className="hb-action-badge" style={{ background: '#2a2a2a', color: '#888' }}>{agent.nextAction.status}</span>
        </div>

        <div className="hb-action-item" style={{ background: '#0a1a0a' }}>
          <span className="hb-action-icon">{agent.currentAction.icon}</span>
          <div className="hb-action-content">
            <div className="hb-action-label" style={{ color: '#00ff41' }}>Current Action</div>
            <div className="hb-action-text">{agent.currentAction.label}</div>
          </div>
          <span className="hb-action-badge" style={{ background: '#00ff4122', color: '#00ff41', border: '1px solid #00ff4144' }}>{agent.currentAction.status}</span>
        </div>

        {expanded && (
          <div className="hb-past-actions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="hb-action-label">Past Actions</span>
              <span style={{ fontSize: '11px', color: '#00ff41', cursor: 'pointer' }}>View all \u2192</span>
            </div>
            {agent.pastActions.map((a, i) => (
              <div key={i} className="hb-past-action-item">
                <span style={{ color: '#00ff41', marginRight: '6px' }}>\u2713</span>
                <span style={{ flex: 1, color: '#ccc' }}>{a.label}</span>
                <span style={{ color: '#555', fontSize: '11px', whiteSpace: 'nowrap' }}>{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hb-token-section">
        <div className="hb-token-header">
          <span className="hb-meta-label">TOKEN USAGE</span>
          <span style={{ fontSize: '12px', color: '#e0e0e0' }}>{usedK} / {totalK}</span>
        </div>
        <div className="hb-token-bar-bg">
          <div className="hb-token-bar-fill" style={{ width: pct + '%', background: barColor }}></div>
        </div>
        <div className="hb-token-footer">
          <span>\u{1F9E0} Context Window {agent.contextWindow}%</span>
          <span>\u{1F4B0} Cost \${agent.cost.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}

function TokenCostFeed({ costLog, viewRange, setViewRange }) {
  return (
    <div className="hb-cost-feed">
      <div className="hb-cost-header">
        <div>
          <div className="hb-cost-title">\u{1F4C8} Token Cost Feed</div>
          <div className="hb-cost-subtitle">Live usage and cost across all active LLM sessions</div>
        </div>
        <div className="hb-cost-view-select">
          <span style={{ color: '#888', fontSize: '12px', marginRight: '8px' }}>View:</span>
          <select value={viewRange} onChange={(e) => setViewRange(e.target.value)} className="hb-select">
            <option value="1h">Last 1h</option>
            <option value="6h">Last 6h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
          </select>
        </div>
      </div>

      <div className="hb-cost-table-wrap">
        <table className="hb-cost-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>AGENT</th>
              <th>SESSION</th>
              <th>MODEL</th>
              <th>TOKENS</th>
              <th>COST</th>
              <th>ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
            {costLog.map((entry, i) => (
              <tr key={i}>
                <td style={{ fontFamily: "'Courier New', monospace", color: '#888', whiteSpace: 'nowrap' }}>{entry.time}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>{entry.avatar}</span>
                    <span style={{ fontWeight: 500 }}>{entry.agent}</span>
                  </span>
                </td>
                <td style={{ color: '#888' }}>{entry.session} \u{1F4CB}</td>
                <td style={{ color: '#a78bfa' }}>{entry.model}</td>
                <td>
                  <span style={{ color: '#00ff41' }}>\u2191 {(entry.promptTokens / 1000).toFixed(1)}K</span>
                  {' '}
                  <span style={{ color: '#ff6b35' }}>\u2193 {(entry.completionTokens / 1000).toFixed(1)}K</span>
                </td>
                <td style={{ color: '#fbbf24', fontFamily: "'Courier New', monospace" }}>\${entry.cost.toFixed(4)}</td>
                <td style={{ color: '#ccc', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Heartbeat() {
  const [agents] = useState(DEMO_AGENTS);
  const [costLog] = useState(DEMO_COST_LOG);
  const [viewRange, setViewRange] = useState('1h');
  const [lastUpdated, setLastUpdated] = useState('just now');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated('just now');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hb-container">
      <div className="hb-page-header">
        <div>
          <h2 className="hb-page-title">Heartbeat</h2>
          <span className="hb-page-subtitle">Live Agent & LLM Sessions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#555' }}>Last updated: {lastUpdated}</span>
          <span className="hb-system-badge">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }}></span>
            System Operational
          </span>
        </div>
      </div>

      <div className="hb-agents-grid">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <TokenCostFeed costLog={costLog} viewRange={viewRange} setViewRange={setViewRange} />
    </div>
  );
}
