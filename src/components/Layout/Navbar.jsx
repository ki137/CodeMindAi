import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Brain, Code2, Target, BarChart3, User, Zap, Flame, ChevronDown,
  Settings, BookOpen, LogOut, Menu, X, Sparkles, LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

const navLinks = [
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/ide', label: 'Practice', icon: Code2 },
  { to: '/challenges', label: 'Challenges', icon: Target },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();
  const { state, dispatch, addToast } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);
  const { student, isAuthenticated } = state;

  const isLanding = location.pathname === '/';

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    dispatch({ type: 'LOGOUT' });
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out. Click Sign In anytime to log back in.',
    });
  };

  const handleOpenAuth = () => {
    dispatch({ type: 'OPEN_AUTH_MODAL' });
  };

  return (
    <nav className={`navbar ${isLanding ? 'navbar-landing' : 'navbar-app'}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Brain size={18} color="white" />
          </div>
          <div className="logo-text">
            <span className="logo-name">CodeMind</span>
            <span className="logo-ai">AI</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        {!isLanding && (
          <div className="navbar-links">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname.startsWith(to) ? 'active' : ''}`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {isLanding && (
          <div className="navbar-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#demo" className="nav-link">Demo</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
          </div>
        )}

        {/* Right side */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              {/* XP */}
              <div className="xp-badge" title="Total XP Earned">
                <Zap size={13} color="var(--yellow-dark, #c9a800)" />
                <span>{student?.totalXP || 1240} XP</span>
              </div>

              {/* Streak */}
              <div className="streak-badge" title="Daily Streak">
                <Flame size={13} color="var(--orange)" />
                <span>{student?.streak || 7}d</span>
              </div>

              {/* Profile Icon with Dropdown on the Top Right */}
              <div className="profile-menu-wrapper" ref={profileRef}>
                <button
                  className="profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Profile menu"
                  id="profile-menu-button"
                >
                  <div className="avatar">
                    {student?.name ? student.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="profile-name">{student?.name || 'Learner'}</span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {profileOpen && (
                  <div className="profile-dropdown" onClick={() => setProfileOpen(false)}>
                    <div style={{ padding: '8px 12px', borderBottom: '2px solid #000000', marginBottom: 4 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#000000' }}>
                        {student?.name || 'Alex'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {student?.email || 'alex@codemind.ai'}
                      </div>
                    </div>
                    <Link to="/dashboard" className="dropdown-item">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item">
                      <User size={14} /> Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <Settings size={14} /> Settings
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-item dropdown-item-danger"
                      onClick={handleSignOut}
                      style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Signed Out: Show Sign In and Get Started buttons */}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleOpenAuth}
                id="sign-in-btn"
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleOpenAuth}
                id="get-started-btn"
              >
                <Sparkles size={14} />
                Get Started
              </button>
            </>
          )}

          {/* Mobile Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-nav-link ${location.pathname.startsWith(to) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {!isAuthenticated && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setMobileOpen(false);
                handleOpenAuth();
              }}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
