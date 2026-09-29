import { Link } from 'react-router-dom';
import {
  Flame, Brain, Target, CheckCircle, TrendingUp, AlertTriangle,
  ArrowRight, Code2, Clock, Star, Zap, BookOpen, Play
} from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { ProgressBar } from '../components/UI/ProgressBar';
import { useApp } from '../context/AppContext';
import { mockLearningHistory } from '../data/mockData';
import './Dashboard.css';

function StatCard({ icon: Icon, label, value, color = 'teal', sublabel }) {
  return (
    <div className={`stat-card card card-${color === 'orange' ? 'orange' : color === 'yellow' ? 'yellow' : 'teal'}`}>
      <div className={`stat-icon stat-icon-${color}`}>
        <Icon size={18} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sublabel && <div className="stat-sublabel">{sublabel}</div>}
      </div>
    </div>
  );
}

const historyIcons = {
  alert: AlertTriangle,
  message: Brain,
  challenge: Target,
  mastery: TrendingUp,
  star: Star,
  check: CheckCircle,
  trending: TrendingUp,
};

const historyColors = {
  alert: 'orange',
  message: 'teal',
  challenge: 'yellow',
  mastery: 'teal',
  star: 'yellow',
  check: 'teal',
  trending: 'teal',
};

export function Dashboard() {
  const { state } = useApp();
  const { student, concepts, currentMisconception } = state;

  const inProgressConcepts = concepts.filter(c => c.status === 'developing' || c.status === 'needs-attention').slice(0, 3);
  const currentBottleneck = concepts.find(c => c.isCurrent);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-page page">
      <Navbar />
      <div className="container dashboard-container">
        {/* Header */}
        <div className="dashboard-header animate-fadeIn">
          <div>
            <h1 className="dashboard-greeting">
              {greeting()}, {student.name} 👋
            </h1>
            <p className="dashboard-subtext">Let&apos;s strengthen your programming concepts.</p>
          </div>
          <Link to="/ide" className="btn btn-primary">
            <Code2 size={16} />
            Start Coding
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid animate-slideUp">
          <StatCard icon={Flame} label="Learning Streak" value={`${student.streak} days`} color="orange" sublabel="Keep it going!" />
          <StatCard icon={Brain} label="Overall Mastery" value={`${student.masteryScore}%`} color="teal" />
          <StatCard icon={CheckCircle} label="Concepts Mastered" value={student.conceptsMastered} color="teal" />
          <StatCard icon={TrendingUp} label="Developing" value={student.conceptsDeveloping} color="yellow" />
          <StatCard icon={Zap} label="Misconceptions Resolved" value={student.misconceptionsResolved} color="teal" sublabel="this month" />
        </div>

        <div className="dashboard-main">
          {/* Left Column */}
          <div className="dashboard-left">
            {/* Continue Learning */}
            <div className="panel animate-slideUp">
              <div className="panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={16} color="var(--teal)" />
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Continue Learning</h3>
                </div>
              </div>
              <div className="panel-body" style={{ padding: 'var(--space-4)' }}>
                {inProgressConcepts.map((concept, i) => (
                  <div key={concept.id} className="concept-progress-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="concept-progress-info">
                      <span className="concept-progress-name">{concept.name}</span>
                      <div className={`badge badge-${concept.status === 'needs-attention' ? 'orange' : 'yellow'}`}>
                        {concept.status === 'needs-attention' ? 'Needs Attention' : 'Developing'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <ProgressBar
                          value={concept.mastery}
                          color={concept.status === 'needs-attention' ? 'orange' : 'yellow'}
                        />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dark)', minWidth: 36 }}>
                        {concept.mastery}%
                      </span>
                    </div>
                    <Link to="/ide" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                      <Play size={12} />
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottleneck */}
            {currentBottleneck && (
              <div className="bottleneck-card card card-orange animate-slideUp">
                <div className="bottleneck-header">
                  <AlertTriangle size={16} color="var(--orange)" />
                  <span className="section-label" style={{ color: 'var(--orange)' }}>Current Bottleneck</span>
                </div>
                <h3 className="bottleneck-concept">{currentMisconception?.misconception || currentBottleneck.name}</h3>
                <p className="bottleneck-reason">
                  {currentMisconception
                    ? `AI detected with ${currentMisconception.confidence}% confidence: ${currentMisconception.description || 'Targeted guidance available in the IDE.'}`
                    : 'Repeated out-of-range indexing errors detected across 4 attempts. CodeMind identified this as a possible conceptual gap.'}
                </p>
                <div className="bottleneck-evidence">
                  <span className="badge badge-orange">{currentMisconception ? `${currentMisconception.confidence}% confidence` : '5 errors detected'}</span>
                  <span className="badge badge-orange">{currentMisconception ? 'Misconception active' : '3 failed fixes'}</span>
                </div>
                <Link to="/ide" className="btn btn-orange btn-sm" style={{ marginTop: 'var(--space-3)' }}>
                  Practice Now <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            {/* Recent Activity */}
            <div className="panel animate-slideUp">
              <div className="panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color="var(--teal)" />
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Recent Activity</h3>
                </div>
              </div>
              <div className="panel-body" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                {mockLearningHistory.slice(0, 5).map((item, i) => {
                  const Icon = historyIcons[item.icon] || CheckCircle;
                  const color = historyColors[item.icon] || 'teal';
                  return (
                    <div key={item.id} className="activity-item" style={{ animationDelay: `${i * 0.08}s` }}>
                      <div className={`activity-icon activity-icon-${color}`}>
                        <Icon size={13} />
                      </div>
                      <div className="activity-content">
                        <span className="activity-title">{item.title}</span>
                        <span className="activity-meta">{item.date} · {item.time}</span>
                      </div>
                    </div>
                  );
                })}
                <Link to="/history" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                  View Full History <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions animate-slideUp">
              <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-dark)' }}>Quick Actions</h3>
              <div className="quick-actions-grid">
                {[
                  { to: '/ide', icon: Code2, label: 'Code Editor', color: 'teal', desc: 'Open IDE' },
                  { to: '/challenges', icon: Target, label: 'Challenges', color: 'yellow', desc: 'Practice' },
                  { to: '/progress', icon: Brain, label: 'Knowledge Graph', color: 'pink', desc: 'Explore' },
                  { to: '/analytics', icon: TrendingUp, label: 'Analytics', color: 'orange', desc: 'Insights' },
                ].map(action => (
                  <Link key={action.to} to={action.to} className={`quick-action-card card card-${action.color === 'pink' ? 'pink' : action.color}`}>
                    <div className={`quick-action-icon quick-action-icon-${action.color}`}>
                      <action.icon size={18} />
                    </div>
                    <span className="quick-action-label">{action.label}</span>
                    <span className="quick-action-desc">{action.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
