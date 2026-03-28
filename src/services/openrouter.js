// OpenRouter.ai Integration Service
// Tracks LLM costs, token usage, and model data for agent sessions

const STORAGE_KEY = 'openrouter_config';

class OpenRouterService {
  constructor() {
    this.apiKey = '';
    this.connected = false;
    this.error = null;
    this.listeners = new Set();
    this.costLog = [];
    this.sessionStats = {};
    this.totalCost = 0;

    // Restore config
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { apiKey } = JSON.parse(saved);
        if (apiKey) this.apiKey = apiKey;
      }
    } catch { /* ignore */ }
  }

  configure(apiKey) {
    this.apiKey = apiKey || '';
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey: this.apiKey }));
    this.notify();
  }

  async connect() {
    if (!this.apiKey) {
      this.error = 'No API key configured. Go to Settings and enter your OpenRouter API key.';
      this.connected = false;
      this.notify();
      return { success: false, error: this.error };
    }

    try {
      const resp = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(10000),
      });

      if (!resp.ok) {
        this.error = `OpenRouter returned ${resp.status} — check your API key.`;
        this.connected = false;
        this.notify();
        return { success: false, error: this.error };
      }

      const data = await resp.json();
      this.connected = true;
      this.error = null;
      this.totalCost = data.data?.usage || 0;
      this.notify();
      return { success: true, data };
    } catch (err) {
      this.error = err.name === 'TimeoutError'
        ? 'Connection timed out.'
        : `Connection failed: ${err.message}`;
      this.connected = false;
      this.notify();
      return { success: false, error: this.error };
    }
  }

  disconnect() {
    this.connected = false;
    this.error = null;
    this.notify();
  }

  async fetchActivity() {
    if (!this.connected || !this.apiKey) return [];

    try {
      const resp = await fetch('https://openrouter.ai/api/v1/activity', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(10000),
      });

      if (resp.ok) {
        const data = await resp.json();
        this.costLog = (data.data || []).slice(0, 50);
        this.notify();
        return this.costLog;
      }
      return this.costLog;
    } catch {
      return this.costLog;
    }
  }

  async fetchModels() {
    try {
      const resp = await fetch('https://openrouter.ai/api/v1/models', {
        signal: AbortSignal.timeout(10000),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.data || [];
      }
      return [];
    } catch {
      return [];
    }
  }

  // Log a token usage event (called by agents or manually)
  logUsage(agent, session, model, promptTokens, completionTokens, cost, activity) {
    const entry = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent,
      session,
      model,
      promptTokens,
      completionTokens,
      cost,
      activity,
    };
    this.costLog.unshift(entry);
    if (this.costLog.length > 100) this.costLog.length = 100;

    // Update session stats
    if (!this.sessionStats[session]) {
      this.sessionStats[session] = { totalTokens: 0, totalCost: 0, model, agent };
    }
    this.sessionStats[session].totalTokens += promptTokens + completionTokens;
    this.sessionStats[session].totalCost += cost;

    this.totalCost += cost;
    this.notify();
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
      error: this.error,
      apiKey: this.apiKey,
      hasConfig: Boolean(this.apiKey),
      costLog: this.costLog,
      sessionStats: this.sessionStats,
      totalCost: this.totalCost,
    };
  }
}

export const openRouter = new OpenRouterService();
