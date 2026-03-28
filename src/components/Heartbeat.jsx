import { useState, useEffect } from 'react';
import { agents as agentData, getStatusColor } from '../data/agents';

const AGENT_COLORS = {
  leonidas: '#00ff41',
  taxis: '#ff6b35',
  news: '#a78bfa',
  audit: '#00ccff',
  fetch: '#fbbf24',
  vault: '#ff4444',
  wall: '#36d399',
  guide: '#f472b6',
  clock: '#818cf8',
  nike: '#fb923c',
  vital: '#22d3ee',
  turbo: '#e879f9',
  oracle: '#84cc16',
};

const AGENT_MODELS = {
  leonidas: 'qwen3:8b',
  taxis: 'qwen3:8b',
  news: 'qwen2.5-coder:14b',
  audit: 'qwen3-vl:8b',
  fetch: 'qwen3:8b',
  vault: 'qwen2.5-coder:14b',
  wall: 'qwen3:8b',
  guide: 'qwen3-vl:8b',
  clock: 'qwen3:8b',
  nike: 'qwen2.5-coder:14b',
  vital: 'qwen3-vl:8b',
  turbo: 'qwen3:8b',
  oracle: 'qwen2.5-coder:14b',
};

const SESSION_IDS = {
  leonidas: 'leo-7f3c2a1e',
  taxis: 'tax-9b8d4f11',
  news: 'nws-a3f91d55',
  audit: 'aud-c2e7b308',
  fetch: 'ftc-d1a04e92',
  vault: 'vlt-e5f3c7a1',
  wall: 'wll-f8b2d6c4',
  guide: 'gde-01a9e3f7',
  clock: 'clk-23b7f156',
  nike: 'nke-45d8a290',
  vital: 'vtl-67e9b3c4',
  turbo: 'trb-89f0c4d8',
  oracle: 'orc-ab12d5e6',
};

const TOKEN_DATA = {
  leonidas: { used: 184000, total: 256000, cost: 0.0482 },
  taxis: { used: 142000, total: 256000, cost: 0.0341 },
  news: { used: 96000, total: 128000, cost: 0.0287 },
  audit: { used: 118000, total: 256000, cost: 0.0195 },
  fetch: { used: 38000, total: 256000, cost: 0.0072 },
  vault: { used: 24000, total: 256000, cost: 0.0045 },
  wall: { used: 31000, total: 256000, cost: 0.0061 },
  guide: { used: 0, total: 256000, cost: 0 },
  clock: { used: 0, total: 256000, cost: 0 },
  nike: { used: 0, total: 256000, cost: 0 },
  vital: { used: 0, total: 256000, cost: 0 },
  turbo: { used: 0, total: 256000, cost: 0 },
  oracle: { used: 0, total: 256000, cost: 0 },
};

const CURRENT_ACTIONS = {
  leonidas: 'Coordinating task queue across all active agents',
  taxis: 'Distributing incoming tasks to agent pool',
  news: 'Scanning intelligence feeds for relevant updates',
  audit: 'Running quality checks on recent deliverables',
  fetch: 'Warming up data retrieval pipelines',
  vault: 'Initializing secure storage protocols',
  wall: 'Configuring security perimeter rules',
  guide: 'Agent dormant',
  clock: 'Agent dormant',
  nike: 'Agent dormant',
  vital: 'Agent dormant',
  turbo: 'Agent dormant',
  oracle: 'Agent dormant',
};

function buildHeartbeatAgents(executionAgents) {
  return executionAgents.map(function(agent) {
    var isActive = agent.status === 'active';
    var isPending = agent.status === 'pending';
    var statusLabel = isActive ? 'Working' : isPending ? 'Standby' : 'Idle';
    var tokens = TOKEN_DATA[agent.id] || { used: 0, total: 256000, cost: 0 };
    var pct = tokens.total > 0 ? Math.round((tokens.used / tokens.total) * 100) : 0;

    return {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      avatar: agent.icon,
      color: AGENT_COLORS[agent.id] || '#888',
      session: SESSION_IDS[agent.id] || agent.id,
      model: AGENT_MODELS[agent.id] || 'qwen3:8b',
      status: statusLabel,
      statusColor: getStatusColor(agent.status),
      lastActive: agent.lastActive,
      nextAction: {
        label: isActive ? 'Awaiting next task from queue' : isPending ? 'Queued for activation' : 'No tasks scheduled',
        status: isActive ? 'Queued ~1m' : isPending ? 'Pending' : 'Inactive',
        icon: isActive ? '\uD83D\uDD04' : isPending ? '\uD83D\uDD36' : '\u23F8\uFE0F',
      },
      currentAction: {
        label: CURRENT_ACTIONS[agent.id] || 'Agent dormant',
        status: isActive ? 'Active' : isPending ? 'Pending' : 'Idle',
        icon: isActive ? '\u26A1' : isPending ? '\uD83D\uDD36' : '\uD83D\uDCA4',
      },
      pastActions: [],
      tokenUsage: { used: tokens.used, total: tokens.total },
      contextWindow: pct,
      cost: tokens.cost,
    };
  });
}

function buildCostLog(heartbeatAgents) {
  var activeAgents = heartbeatAgents.filter(function(a) { return a.status === 'Working' || a.status === 'Standby'; });
  var activities = {
    leonidas: ['Dispatched task batch #47 to agent pool', 'Resolved priority conflict between TAXIS and NEWS', 'Updated mission control status board'],
    taxis: ['Assigned task STATUS-42 to AUDIT agent', 'Rebalanced task queue priorities', 'Completed sprint planning sync'],
    news: ['Parsed 12 intelligence feeds for actionable items', 'Flagged 3 high-priority updates for review', 'Updated threat assessment report'],
    audit: ['Validated output quality for deliverable D-091', 'Ran compliance check on data pipeline', 'Flagged inconsistency in report #34'],
    fetch: ['Retrieved dataset from external API endpoint', 'Cached market data for quick access'],
    vault: ['Rotated encryption keys for storage vault', 'Backed up secure credentials'],
    wall: ['Updated firewall rules for new service', 'Scanned for unauthorized access attempts'],
  };

  var log = [];
  var baseHour = 14;
  var baseMin = 32;
  var baseSec = 45;

  activeAgents.forEach(function(agent, idx) {
    var agentActivities = activities[agent.id] || ['Processing tasks'];
    agentActivities.forEach(function(activity, j) {
      var sec = baseSec - (idx * 12 + j * 27);
      var min = baseMin;
      while (sec < 0) { sec += 60; min--; }
      var timeStr = String(baseHour).padStart(2, '0') + ':' + String(min).padStart(2, '0') + ':' + String(Math.abs(sec) % 60).padStart(2, '0');

      var promptTokens = Math.floor(1500 + Math.random() * 4000);
      var completionTokens = Math.floor(800 + Math.random() * 3000);
      var cost = parseFloat(((promptTokens + completionTokens) * 0.0000015).toFixed(4));

      log.push({
        time: timeStr,
        agent: agent.name,
        avatar: agent.avatar,
        session: agent.session,
        model: agent.model,
        promptTokens: promptTokens,
        completionTokens: completionTokens,
        cost: cost,
        activity: activity,
      });
    });
  });

  log.sort(function(a, b) { return b.time.localeCompare(a.time); });
  return log.slice(0, 10);
}

function AgentCard(_ref) {
  var agent = _ref.agent;
  var expanded = useState(false);
  var isExpanded = expanded[0];
  var setExpanded = expanded[1];
  var pct = Math.round((agent.tokenUsage.used / agent.tokenUsage.total) * 100);
  var barColor = pct > 75 ? '#ff6b35' : pct > 50 ? '#fbbf24' : '#00ff41';
  var usedK = (agent.tokenUsage.used / 1000).toFixed(0) + 'K';
  var totalK = (agent.tokenUsage.total / 1000).toFixed(0) + 'K';

  return (
    <div className="hb-agent-card" style={{ borderColor: agent.color + '33' }}>
      <div className="hb-agent-top" onClick={function() { setExpanded(!isExpanded); }} style={{ cursor: 'pointer' }}>
        <div className="hb-agent-header">
          <span className="hb-agent-avatar">{agent.avatar}</span>
          <div className="hb-agent-identity">
            <div className="hb-agent-name">
              {agent.name}
              <span className="hb-badge" style={{ background: agent.color + '22', color: agent.color, border: '1px solid ' + agent.color + '44' }}>AGENT</span>
            </div>
            <div className="hb-agent-role">{agent.role}</div>
          </div>
          <span style={{ color: '#555', fontSize: '16px' }}>{isExpanded ? '\u25BE' : '\u203A'}</span>
        </div>

        <div className="hb-agent-meta-row">
          <span className="hb-meta-label">SESSION</span>
          <span className="hb-meta-value">{agent.session}</span>
          <span className="hb-meta-label" style={{ marginLeft: '16px' }}>LLM</span>
          <span className="hb-meta-value">{agent.model}</span>
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

        <div className="hb-action-item" style={{ background: agent.status === 'Working' ? '#0a1a0a' : '#1a1a1a' }}>
          <span className="hb-action-icon">{agent.currentAction.icon}</span>
          <div className="hb-action-content">
            <div className="hb-action-label" style={{ color: agent.status === 'Working' ? '#00ff41' : '#888' }}>Current Action</div>
            <div className="hb-action-text">{agent.currentAction.label}</div>
          </div>
          <span className="hb-action-badge" style={{
            background: agent.status === 'Working' ? '#00ff4122' : '#2a2a2a',
            color: agent.status === 'Working' ? '#00ff41' : '#888',
            border: agent.status === 'Working' ? '1px solid #00ff4144' : '1px solid #2a2a2a',
          }}>{agent.currentAction.status}</span>
        </div>

        {isExpanded && agent.pastActions.length > 0 && (
          <div className="hb-past-actions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="hb-action-label">Past Actions</span>
              <span style={{ fontSize: '11px', color: '#00ff41', cursor: 'pointer' }}>View all &rarr;</span>
            </div>
            {agent.pastActions.map(function(a, i) {
              return (
                <div key={i} className="hb-past-action-item">
                  <span style={{ color: '#00ff41', marginRight: '6px' }}>{'\u2713'}</span>
                  <span style={{ flex: 1, color: '#ccc' }}>{a.label}</span>
                  <span style={{ color: '#555', fontSize: '11px', whiteSpace: 'nowrap' }}>{a.time}</span>
                </div>
              );
            })}
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
          <span>{'\uD83E\uDDE0'} Context Window {agent.contextWindow}%</span>
          <span>{'\uD83D\uDCB0'} Cost ${agent.cost.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}

function TokenCostFeed(_ref2) {
  var costLog = _ref2.costLog;
  var viewRange = _ref2.viewRange;
  var setViewRange = _ref2.setViewRange;

  return (
    <div className="hb-cost-feed">
      <div className="hb-cost-header">
        <div>
          <div className="hb-cost-title">{'\uD83D\uDCC8'} Token Cost Feed</div>
          <div className="hb-cost-subtitle">Live usage and cost across all active LLM sessions</div>
        </div>
        <div className="hb-cost-view-select">
          <span style={{ color: '#888', fontSize: '12px', marginRight: '8px' }}>View:</span>
          <select value={viewRange} onChange={function(e) { setViewRange(e.target.value); }} className="hb-select">
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
            {costLog.map(function(entry, i) {
              return (
                <tr key={i}>
                  <td style={{ fontFamily: "'Courier New', monospace", color: '#888', whiteSpace: 'nowrap' }}>{entry.time}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span>{entry.avatar}</span>
                      <span style={{ fontWeight: 500 }}>{entry.agent}</span>
                    </span>
                  </td>
                  <td style={{ color: '#888' }}>{entry.session}</td>
                  <td style={{ color: '#a78bfa' }}>{entry.model}</td>
                  <td>
                    <span style={{ color: '#00ff41' }}>{'\u2191'} {(entry.promptTokens / 1000).toFixed(1)}K</span>
                    {' '}
                    <span style={{ color: '#ff6b35' }}>{'\u2193'} {(entry.completionTokens / 1000).toFixed(1)}K</span>
                  </td>
                  <td style={{ color: '#fbbf24', fontFamily: "'Courier New', monospace" }}>${entry.cost.toFixed(4)}</td>
                  <td style={{ color: '#ccc', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.activity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Heartbeat() {
  var hbAgentsState = useState(function() { return buildHeartbeatAgents(agentData.execution); });
  var hbAgents = hbAgentsState[0];

  var costLogState = useState(function() { return buildCostLog(hbAgents); });
  var costLog = costLogState[0];

  var viewRangeState = useState('1h');
  var viewRange = viewRangeState[0];
  var setViewRange = viewRangeState[1];

  var lastUpdatedState = useState('just now');
  var lastUpdated = lastUpdatedState[0];
  var setLastUpdated = lastUpdatedState[1];

  useEffect(function() {
    var interval = setInterval(function() {
      setLastUpdated('just now');
    }, 30000);
    return function() { clearInterval(interval); };
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
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff41', display: 'inline-block' }}></span>
            System Operational
          </span>
        </div>
      </div>

      <div className="hb-agents-grid">
        {hbAgents.map(function(agent) {
          return <AgentCard key={agent.id} agent={agent} />;
        })}
      </div>

      <TokenCostFeed costLog={costLog} viewRange={viewRange} setViewRange={setViewRange} />
    </div>
  );
}
