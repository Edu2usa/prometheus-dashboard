// OpenClaw Integration Service
// Connects Prometheus Dashboard to Eduardo's OpenClaw AI system

const DEFAULT_POLL_INTERVAL = 30000; // 30s

class OpenClawService {
  constructor() {
    this.apiUrl = '';
    this.apiKey = '';
    this.connected = false;
    this.connecting = false;
    this.error = null;
    this.listeners = new Set();
    this.agentStatuses = {};
    this.activityLog = [];
    this.pollInterval = null;

    // Restore persisted config on init
    try {
      const saved = localStorage.getItem('openclaw_config');
      if (saved) {
        const { apiUrl, apiKey } = JSON.parse(saved);
        if (apiUrl) this.apiUrl = apiUrl;
        if (apiKey) this.apiKey = apiKey;
      }
    } catch {
      // ignore parse errors
    }
  }

  configure(apiUrl, apiKey) {
    this.apiUrl = (apiUrl || '').replace(/\/$/, '');
    this.apiKey = apiKey || '';
    // Persist config
    localStorage.setItem('openclaw_config', JSON.stringify({ apiUrl: this.apiUrl, apiKey: this.apiKey }));
    this.notify();
  }

  async connect() {
    if (!this.apiUrl) {
      this.error = 'No API URL configured. Go to Settings â OpenClaw Connection and enter your Pegasus server URL.';
      this.connected = false;
      this.notify();
      return { success: false, error: this.error };
    }

    this.connecting = true;
    this.error = null;
    this.notify();

    try {
      const resp = await fetch(`${this.apiUrl}/api/status`, {
        headers: this._headers(),
        signal: AbortSignal.timeout(10000),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        this.error = `Server returned ${resp.status}${text ? ': ' + text.slice(0, 200) : ''}`;
        this.connected = false;
        this.connecting = false;
        this.notify();
        return { success: false, error: this.error };
      }

      this.connected = true;
      this.connecting = false;
      this.error = null;
      this._startPolling();
      this.notify();
      return { success: true };
    } catch (err) {
      this.error = err.name === 'TimeoutError'
        ? 'Connection timed out â check that your Pegasus server is running.'
        : `Connection failed: ${err.message}`;
      this.connected = false;
      this.connecting = false;
      this.notify();
      return { success: false, error: this.error };
    }
  }

  disconnect() {
    this.connected = false;
    this.connecting = false;
    this.error = null;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.notify();
  }

  async sendCommand(command, context = {}) {
    if (!this.connected) {
      return { error: 'Not connected to OpenClaw. Connect first in Settings.' };
    }

    try {
      const resp = await fetch(`${this.apiUrl}/api/command`, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify({ command, ...context }),
        signal: AbortSignal.timeout(30000),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        return { error: `Command failed (${resp.status}): ${text.slice(0, 200)}` };
      }

      const data = await resp.json();
      this.activityLog.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: data.agent || 'SYSTEM',
        action: data.action || command,
        status: data.status || 'sent',
      });
      if (this.activityLog.length > 50) this.activityLog.length = 50;
      this.notify();
      return data;
    } catch (err) {
      return { error: err.name === 'TimeoutError' ? 'Command timed out.' : err.message };
    }
  }

  async getAgentStatuses() {
    if (!this.connected || !this.apiUrl) return this.agentStatuses;

    try {
      const resp = await fetch(`${this.apiUrl}/api/agents`, {
        headers: this._headers(),
        signal: AbortSignal.timeout(10000),
      });
      if (resp.ok) {
        this.agentStatuses = await resp.json();
        this.notify();
      }
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
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  getState() {
    return {
      connected: this.connected,
      connecting: this.connecting,
      error: this.error,
      apiUrl: this.apiUrl,
      hasConfig: Boolean(this.apiUrl),
      agentStatuses: this.agentStatuses,
      activityLog: this.activityLog.slice(0, 50),
    };
  }

  _headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this.apiKey) h['Authorization'] = `Bearer ${this.apiKey}`;
    return h;
  }

  _startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => this.getAgentStatuses(), DEFAULT_POLL_INTERVAL);
  }
}

export const openClaw = new OpenClawService();
