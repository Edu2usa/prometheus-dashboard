// OpenClaw Integration Service
// Connects Prometheus Dashboard to Eduardo's OpenClaw AI system

class OpenClawService {
  constructor() {
    this.apiUrl = '';
    this.apiKey = '';
    this.connected = false;
    this.listeners = new Set();
    this.agentStatuses = {};
    this.activityLog = [];
    this.pollInterval = null;
  }

  configure(apiUrl, apiKey) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async connect() {
    if (!this.apiUrl) {
      // Mock mode - simulate connection
      this.connected = true;
      this._startMockPolling();
      this.notify();
      return { success: true, mode: 'demo' };
    }

    try {
      const resp = await fetch(`${this.apiUrl}/api/status`, {
        headers: this._headers(),
      });
      if (resp.ok) {
        this.connected = true;
        this._startPolling();
        this.notify();
        return { success: true, mode: 'live' };
      }
      return { success: false, error: 'Server returned ' + resp.status };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  disconnect() {
    this.connected = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.notify();
  }

  async sendCommand(command, context = {}) {
    if (!this.apiUrl) {
      // Mock response
      const mockResponse = {
        id: Date.now(),
        command,
        status: 'received',
        agent: context.agent || 'LEONIDAS',
        timestamp: new Date().toISOString(),
        response: `[DEMO] Command "${command}" routed to ${context.agent || 'LEONIDAS'}. In live mode, this would execute through OpenClaw.`
      };
      this.activityLog.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: mockResponse.agent,
        action: `Processing: ${command}`,
        status: 'active'
      });
      this.notify();
      return mockResponse;
    }

    try {
      const resp = await fetch(`${this.apiUrl}/api/command`, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify({ command, ...context }),
      });
      const data = await resp.json();
      this.activityLog.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: data.agent || 'SYSTEM',
        action: data.action || command,
        status: data.status || 'sent'
      });
      this.notify();
      return data;
    } catch (err) {
      return { error: err.message };
    }
  }

  async getAgentStatuses() {
    if (!this.apiUrl) return this.agentStatuses;

    try {
      const resp = await fetch(`${this.apiUrl}/api/agents`, {
        headers: this._headers(),
      });
      this.agentStatuses = await resp.json();
      this.notify();
      return this.agentStatuses;
    } catch {
      return this.agentStatuses;
    }
  }

  getActivityLog() {
    return this.activityLog;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  getState() {
    return {
      connected: this.connected,
      apiUrl: this.apiUrl,
      agentStatuses: this.agentStatuses,
      activityLog: this.activityLog.slice(0, 50),
      mode: this.apiUrl ? 'live' : 'demo',
    };
  }

  _headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this.apiKey) h['Authorization'] = `Bearer ${this.apiKey}`;
    return h;
  }

  _startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => this.getAgentStatuses(), 30000);
  }

  _startMockPolling() {
    const mockAgents = ['LEONIDAS', 'TAXIS', 'HERMES', 'ATLAS', 'NEXUS', 'ORACLE', 'SENTINEL', 'KRONOS', 'DYNAMO', 'CYPHER', 'VANGUARD', 'PROMETHEUS'];
    const mockActions = [
      'Scanning maintenance pipeline',
      'Routing new client request',
      'Generating compliance report',
      'Analyzing revenue metrics',
      'Monitoring system health',
      'Processing content queue',
      'Auditing schedule conflicts',
      'Evaluating lead quality',
      'Optimizing resource allocation',
      'Syncing with external APIs',
    ];

    // Generate initial statuses
    mockAgents.forEach(name => {
      this.agentStatuses[name] = {
        status: Math.random() > 0.3 ? 'active' : 'idle',
        lastAction: mockActions[Math.floor(Math.random() * mockActions.length)],
        lastSeen: new Date().toISOString(),
      };
    });

    // Initial activity
    for (let i = 0; i < 5; i++) {
      const agent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
      this.activityLog.push({
        time: new Date(Date.now() - i * 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent,
        action: mockActions[Math.floor(Math.random() * mockActions.length)],
        status: Math.random() > 0.5 ? 'completed' : 'active'
      });
    }

    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      const agent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
      const action = mockActions[Math.floor(Math.random() * mockActions.length)];

      this.agentStatuses[agent] = {
        status: 'active',
        lastAction: action,
        lastSeen: new Date().toISOString(),
      };

      this.activityLog.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent,
        action,
        status: Math.random() > 0.5 ? 'completed' : 'active'
      });

      if (this.activityLog.length > 50) this.activityLog.pop();

      // Randomly set some agents to idle
      const randomAgent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
      if (this.agentStatuses[randomAgent]) {
        this.agentStatuses[randomAgent].status = Math.random() > 0.4 ? 'active' : 'idle';
      }

      this.notify();
    }, 15000);
  }
}

export const openClaw = new OpenClawService();
