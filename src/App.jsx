import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { TasksBoard } from './pages/TasksBoard';
import { ContentPipeline } from './pages/ContentPipeline';
import { CalendarPage } from './pages/CalendarPage';
import { Memory } from './pages/Memory';
import { AITeam } from './pages/AITeam';
import { Contacts } from './pages/Contacts';
import { Settings } from './pages/Settings';

function AppContent() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(location.pathname);

  useEffect(() => {
    setActiveNav(location.pathname);
  }, [location.pathname]);

  return (
    <div className="app">
      <Sidebar activeNav={activeNav} />
      <main className="main-content">
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TasksBoard />} />
            <Route path="/content" element={<ContentPipeline />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/ai-team" element={<AITeam />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
