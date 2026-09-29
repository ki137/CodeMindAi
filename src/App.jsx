import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/UI/Toast';

// Pages
import { LandingPage } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { IDEPage } from './pages/IDEPage';
import { ProgressPage } from './pages/ProgressPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LearnPage } from './pages/LearnPage';
import { ProfilePage } from './pages/ProfilePage';

// Demo
import { DemoModePanel } from './components/Demo/DemoMode';

// Navbar already imported inside each page

import { Play } from 'lucide-react';
import './App.css';

function AppInner() {
  const [showDemo, setShowDemo] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ide" element={<IDEPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/history" element={<Navigate to="/profile" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer />

      {/* Demo / Judge Button */}
      {!isLanding && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 200,
          alignItems: 'flex-end',
        }}>
          <button
            className="btn btn-orange"
            style={{ borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-orange)', fontWeight: 700 }}
            onClick={() => setShowDemo(true)}
            id="judge-demo-btn"
            title="Run Judge Demo"
          >
            <Play size={15} />
            Judge Demo
          </button>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', textAlign: 'right' }}>
            BYTEATHON 2026 · BYT03
          </div>
        </div>
      )}

      {showDemo && <DemoModePanel onClose={() => setShowDemo(false)} />}
    </>
  );
}

// Simple Settings page inline
function SettingsPage() {
  return (
    <div className="page" style={{ paddingBottom: 48 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ margin: '0 0 24px', fontSize: '1.75rem', fontWeight: 800 }}>Settings</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {[
            {
              title: 'AI Tutor Behavior', items: [
                { label: 'Default Mode', type: 'select', options: ['Socratic', 'Explain', 'Hint', 'Challenge'], val: 'Socratic' },
                { label: 'Auto-open on error', type: 'toggle', val: true },
                { label: 'Max hints per session', type: 'select', options: ['2', '3', '4', 'Unlimited'], val: '4' },
              ]
            },
            {
              title: 'Editor', items: [
                { label: 'Font Size', type: 'select', options: ['12px', '13px', '14px', '15px', '16px'], val: '14px' },
                { label: 'Tab Size', type: 'select', options: ['2', '4'], val: '4' },
                { label: 'Auto-complete', type: 'toggle', val: true },
                { label: 'Line Numbers', type: 'toggle', val: true },
              ]
            },
            {
              title: 'Learning', items: [
                { label: 'Daily Goal (minutes)', type: 'select', options: ['15', '30', '45', '60'], val: '30' },
                { label: 'Misconception alerts', type: 'toggle', val: true },
                { label: 'Mastery notifications', type: 'toggle', val: true },
              ]
            },
            {
              title: 'Privacy', items: [
                { label: 'Save session history', type: 'toggle', val: true },
                { label: 'Analytics tracking', type: 'toggle', val: false },
              ]
            },
          ].map(section => (
            <div key={section.title} className="card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>{section.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {section.items.map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.label}</span>
                    {item.type === 'toggle' ? (
                      <div style={{
                        width: 40, height: 22, borderRadius: 11,
                        background: item.val ? 'var(--teal)' : 'var(--border-light)',
                        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                      }}>
                        <div style={{
                          position: 'absolute', top: 3, left: item.val ? 20 : 3, width: 16, height: 16,
                          background: 'white', borderRadius: '50%', transition: 'left 0.2s',
                        }} />
                      </div>
                    ) : (
                      <select className="input" style={{ width: 120, padding: '4px 8px', fontSize: '0.8125rem' }}>
                        {item.options.map(o => <option key={o} selected={o === item.val}>{o}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  );
}
