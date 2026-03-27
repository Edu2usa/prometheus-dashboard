import { useState } from 'react';
import { useOpenClaw } from '../hooks/useOpenClaw';

export function OpenClawPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const { connected, connecting, error, hasConfig, activityLog, connect, sendCommand } = useOpenClaw();

  const handleSend = async () => {
    if (!command.trim()) return;
    const result = await sendCommand(command.trim());
    if (result?.error) {
      // Could display inline â for now just log
      console.warn('[OpenClaw]', result.error);
    }
    setCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const statusLabel = connecting
    ? 'Connecting...'
    : connected
    ? 'Connected'
    : hasConfig
    ? 'Disconnected'
    : 'Not Configured';

  const statusClass = connecting ? '' : connected ? '' : 'disconnected';

  return (
    <div className="openclaw-command-bar">
      {isOpen && (
        <div className="openclaw-panel">
          <div className="openclaw-panel-header">
            <span className="openclaw-panel-title">OpenClaw Terminal</span>
            <span className="openclaw-panel-status">
              <span className={`status-dot ${statusClass}`}></span>
              {statusLabel}
            </span>
          </div>
          <div className="openclaw-panel-body">
            {!hasConfig ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '12px' }}>
                No API configured. Go to <strong style={{ color: '#888' }}>Settings â OpenClaw Connection</strong> to enter your Pegasus server URL.
              </div>
            ) : !connected && !connecting ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                {error && (
                  <div style={{ color: '#ff4444', fontSize: '12px', marginBottom: '12px' }}>{error}</div>
                )}
                <button
                  onClick={connect}
                  style={{
                    background: '#00ff41',
                    color: '#0a0a0a',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                  }}
                >
                  Connect to OpenClaw
                </button>
              </div>
            ) : connecting ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '12px' }}>
                Connecting to Pegasus server...
              </div>
            ) : activityLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '12px' }}>
                Connected. Send a command to get started.
              </div>
            ) : (
              activityLog.slice(0, 20).map((item, idx) => (
                <div key={idx} className="openclaw-log-item">
                  <span className="openclaw-log-time">[{item.time}]</span>
                  <span className="openclaw-log-agent">{item.agent}</span>
                  <span style={{ color: '#555' }}>â</span>
                  <span className="openclaw-log-action"> {item.action}</span>
                  {item.status === 'completed' && <span style={{ marginLeft: '4px' }}>â</span>}
                  {item.status === 'active' && <span style={{ marginLeft: '4px', color: '#ffd700' }}>â³</span>}
                </div>
              ))
            )}
          </div>
          {connected && (
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
          )}
        </div>
      )}
      <button
        className="openclaw-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="OpenClaw Terminal"
      >
        {isOpen ? 'â' : 'ð®'}
      </button>
    </div>
  );
}
