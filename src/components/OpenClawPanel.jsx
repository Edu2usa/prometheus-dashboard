import { useState, useEffect } from 'react';
import { useOpenClaw } from '../hooks/useOpenClaw';

export function OpenClawPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const { connected, mode, activityLog, connect, sendCommand } = useOpenClaw();

  // Auto-connect in demo mode on mount
  useEffect(() => {
    if (!connected) {
      connect();
    }
  }, []);

  const handleSend = async () => {
    if (!command.trim()) return;
    await sendCommand(command.trim());
    setCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="openclaw-command-bar">
      {isOpen && (
        <div className="openclaw-panel">
          <div className="openclaw-panel-header">
            <span className="openclaw-panel-title">OpenClaw Terminal</span>
            <span className="openclaw-panel-status">
              <span className={`status-dot ${connected ? '' : 'disconnected'}`}></span>
              {connected ? (mode === 'demo' ? 'Demo Mode' : 'Connected') : 'Disconnected'}
            </span>
          </div>
          <div className="openclaw-panel-body">
            {activityLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '12px' }}>
                No activity yet. Send a command to get started.
              </div>
            ) : (
              activityLog.slice(0, 20).map((item, idx) => (
                <div key={idx} className="openclaw-log-item">
                  <span className="openclaw-log-time">[{item.time}]</span>
                  <span className="openclaw-log-agent">{item.agent}</span>
                  <span style={{ color: '#555' }}>—</span>
                  <span className="openclaw-log-action"> {item.action}</span>
                  {item.status === 'completed' && <span style={{ marginLeft: '4px' }}>✅</span>}
                  {item.status === 'active' && <span style={{ marginLeft: '4px', color: '#ffd700' }}>⏳</span>}
                </div>
              ))
            )}
          </div>
          <div className="openclaw-panel-input">
            <input
              className="openclaw-input"
              placeholder="Send command to OpenClaw..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="openclaw-send" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
      <button
        className="openclaw-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="OpenClaw Terminal"
      >
        {isOpen ? '✕' : '🔮'}
      </button>
    </div>
  );
}
