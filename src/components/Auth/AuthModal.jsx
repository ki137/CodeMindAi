import { useState, useEffect } from 'react';
import {
  Brain, X, Mail, Lock, User, Eye, EyeOff,
  Sparkles, ArrowRight, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockStudent } from '../../data/mockData';
import './AuthModal.css';

export function AuthModal() {
  const { state, dispatch, addToast } = useApp();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('alex@codemind.ai');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Alex');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && state.authModalOpen) {
        dispatch({ type: 'CLOSE_AUTH_MODAL' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.authModalOpen, dispatch]);

  if (!state.authModalOpen) return null;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_AUTH_MODAL' });
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'LOGIN',
        payload: {
          ...mockStudent,
          name: 'Alex',
          email: 'alex@codemind.ai',
        },
      });
      addToast({
        type: 'success',
        title: 'Signed in as Alex',
        message: 'Welcome back! Your profile and progress are now active.',
      });
      setLoading(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const userName = tab === 'signup' ? (name || 'New Learner') : (name || 'Alex');
      const userEmail = email || 'learner@codemind.ai';
      dispatch({
        type: 'LOGIN',
        payload: {
          ...mockStudent,
          name: userName,
          email: userEmail,
        },
      });
      addToast({
        type: 'success',
        title: tab === 'signup' ? 'Account Created!' : 'Welcome Back!',
        message: `Signed in as ${userName}. Check your profile on the top right.`,
      });
      setLoading(false);
    }, 350);
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="auth-brand-title">CodeMind AI</h2>
              <p className="auth-brand-subtitle">
                {tab === 'signin' ? 'Sign in to access your learning profile' : 'Create your CodeMind account'}
              </p>
            </div>
          </div>
          <button className="auth-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${tab === 'signin' ? 'active' : ''}`}
            onClick={() => setTab('signin')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
            type="button"
          >
            Create Account
          </button>
        </div>

        {/* Body */}
        <div className="auth-body">
          {/* 1-Click Instant Demo Login Banner */}
          <div className="auth-demo-card">
            <div className="auth-demo-info">
              <div className="auth-demo-avatar">A</div>
              <div>
                <div className="auth-demo-text">Quick Demo Learner</div>
                <div className="auth-demo-subtext">Alex · 1,240 XP · 7d Streak</div>
              </div>
            </div>
            <button
              type="button"
              className="auth-demo-btn"
              onClick={handleDemoSignIn}
              disabled={loading}
            >
              <Zap size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
              Instant Sign In
            </button>
          </div>

          <div className="auth-divider">or continue with email</div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="alex@codemind.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <Sparkles size={16} />
              {loading ? 'Signing in...' : tab === 'signin' ? 'Sign In to CodeMind' : 'Get Started Free'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Social login buttons */}
          <div className="auth-social-btns">
            <button
              type="button"
              className="auth-social-btn"
              onClick={handleDemoSignIn}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27A7.18 7.18 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.26A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="auth-social-btn"
              onClick={handleDemoSignIn}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
