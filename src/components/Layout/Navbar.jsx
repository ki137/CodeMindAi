import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Brain, Code2, Target, BarChart3, User, Zap, Flame, ChevronDown,
  Settings, BookOpen, LogOut, Menu, X, Sparkles
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
  const { state } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { student } = state;

  const isLanding = location.pathname === '/';

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
          {!isLanding && (
            <>
              {/* XP */}
              <div className="xp-badge">
                <Zap size={13} color="var(--yellow-dark, #c9a800)" />
                <span>{student.totalXP} XP</span>
              </div>

              {/* Streak */}
              <div className="streak-badge">
                <Flame size={13} color="var(--orange)" />
                <span>{student.streak}</span>
              </div>

              {/* Profile */}
              <div className="profile-menu-wrapper">
                <button
                  className="profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Profile menu"
                >
                  <div className="avatar">
                    {student.name.charAt(0)}
                  </div>
                  <span className="profile-name">{student.name}</span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {profileOpen && (
                  <div className="profile-dropdown" onClick={() => setProfileOpen(false)}>
                    <Link to="/profile" className="dropdown-item">
                      <User size={14} /> Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <Settings size={14} /> Settings
                    </Link>
                    <div className="dropdown-divider" />
                    <Link to="/" className="dropdown-item dropdown-item-danger">
                      <LogOut size={14} /> Sign Out
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {isLanding && (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                <Sparkles size={14} />
                Get Started
              </Link>
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
        </div>
      )}
    </nav>
  );
}
