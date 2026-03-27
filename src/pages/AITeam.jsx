import { useState } from 'react';
import { agents, getStatusColor } from '../data/agents';

export function AITeam() {
  const [expandedSquad, setExpandedSquad] = useState(null);

  const renderAgentCards = (agentList) => {
    return (
      <div className="agent-cards">
        {agentList.map((agent) => (
          <div
            key={agent.id}
            className="agent-card"
            onClick={() =>
              agent.agents
                ? setExpandedSquad(expandedSquad === agent.id ? null : agent.id)
                : null
            }
            style={{ cursor: agent.agents ? 'pointer' : 'default' }}
          >
            <div className="agent-header">
              <div className="agent-icon">{agent.icon}</div>
              <div className="agent-info">
                <div className="agent-name">{agent.name}</div>
                <div className="agent-role">{agent.squad || agent.role}</div>
              </div>
            </div>

            <div className="agent-status">
              <div
                className="status-dot"
                style={{ background: getStatusColor(agent.status) }}
              ></div>
              <span style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                {agent.status}
              </span>
            </div>

            <div className="agent-meta">
              {agent.agentCount && (
                <div>
                  <span className="agent-count">{agent.agentCount}</span> agents
                </div>
              )}
              <div style={{ marginTop: '4px', fontSize: '10px', color: '#555' }}>
                Last active: {agent.lastActive}
              </div>
            </div>

            {expandedSquad === agent.id && agent.agents && (
              <div className="agent-list">
                {agent.agents.map((subAgent, idx) => (
                  <div key={idx} className="agent-list-item">
                    <div>
                      <div className="agent-list-name">{subAgent.name}</div>
                      <div className="agent-list-role">{subAgent.role}</div>
                    </div>
                    <div
                      className="status-dot"
                      style={{ background: getStatusColor(subAgent.status) }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="ai-team-header">
        <h1 className="ai-team-title">XQUADS AI Operating System</h1>
        <div className="ai-team-subtitle">
          148 Agents | 11 Squads | 3 Layers
          <br />
          Advisors think. Tacticians plan. Prometheus delivers. Eduardo decides.
        </div>
      </div>

      <div className="layer-section">
        <h2 className="layer-title">🏛️ Strategic Layer — 30 Agents (Advisory)</h2>
        {renderAgentCards(agents.strategic)}
      </div>

      <div className="layer-section">
        <h2 className="layer-title">📊 Tactical Layer — 106 Agents (Planning & Execution)</h2>
        {renderAgentCards(agents.tactical)}
      </div>

      <div className="layer-section">
        <h2 className="layer-title">⚡ Execution Layer — 12 Agents (Task Handlers)</h2>
        <div style={{ marginBottom: '20px', fontSize: '13px', color: '#888' }}>
          Click any agent above to expand their squad and see all team members.
        </div>
        {renderAgentCards(agents.execution)}
      </div>
    </div>
  );
}
