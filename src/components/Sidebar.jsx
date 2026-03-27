import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOpenClaw } from '../hooks/useOpenClaw';

export function Sidebar({ activeNav }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { connected, mode } = useOpenClaw();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '⚡' },
    { path: '/tasks', label: 'Tasks', icon: '📋' },
    { path: '/content', label: 'Content', icon: '📝' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/memory', label: 'Memory', icon: '🧠' },
    { path: '/ai-team', label: 'AI Team', icon: '🤖' },
    { path: '/contacts', label: 'Contacts', icon: '👥' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  // Mobile: bottom tab bar with 5 main items + more menu
  const primaryTabs = navItems.slice(0, 4);
  const moreItems = navItems.slice(4);

  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <header className="mobile-topbar">
          <div className="sidebar-logo" style={{ fontSize: '16px' }}>PROMETHEUS</div>
          <div className="mobile-status">
            <span className={`status-dot ${connected ? '' : 'disconnected'}`}></span>
            <span style={{ fontSize: '10px', color: connected ? '#00ff41' : '#888' }}>
              {connected ? (mode === 'demo' ? 'DEMO' : 'LIVE') : 'OFF'}
            </span>
          </div>
        </header>

        {/* Mobile Bottom Tab Bar */}
        <nav className="mobile-tabbar">
          {primaryTabs.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-tab ${activeNav === item.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-tab-icon">{item.icon}</span>
              <span className="mobile-tab-label">{item.label}</span>
            </Link>
          ))}
          <button
            className={`mobile-tab ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="mobile-tab-icon">☰</span>
            <span className="mobile-tab-label">More</span>
          </button>
        </nav>

        {/* More Menu Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-more-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-more-menu" onClick={(e) => e.stopPropagation()}>
              {moreItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-more-item ${activeNav === item.path ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="mobile-more-footer">
                <div className="sidebar-avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>E</div>
                <span style={{ color: '#e0e0e0', fontSize: '13px' }}>Eduardo</span>
                <span className="status-dot" style={{ marginLeft: 'auto' }}></span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar (unchanged)
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">PROMETHEUS</div>
        <div className="sidebar-subtitle">Preferred Maintenance Inc</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${activeNav === item.path ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">E</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Eduardo</div>
          <div className="sidebar-status">
            <span className={`status-dot ${connected ? '' : 'disconnected'}`}></span>
            {connected ? (mode === 'demo' ? 'Demo Mode' : 'Live') : 'Offline'}
          </div>
        </div>
      </div>
    </aside>
  );
}
