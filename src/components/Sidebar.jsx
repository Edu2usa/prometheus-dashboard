import { Link } from 'react-router-dom';

export function Sidebar({ activeNav }) {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '⚡' },
    { path: '/tasks', label: 'Tasks Board', icon: '📋' },
    { path: '/content', label: 'Content Pipeline', icon: '📝' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/memory', label: 'Memory', icon: '🧠' },
    { path: '/ai-team', label: 'AI Team', icon: '🤖' },
    { path: '/contacts', label: 'Contacts', icon: '👥' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

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
            <span className="status-dot"></span>
            Online
          </div>
        </div>
      </div>
    </aside>
  );
}
