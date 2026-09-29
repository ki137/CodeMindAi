import { Navbar } from '../components/Layout/Navbar';
import { useApp } from '../context/AppContext';
import { mockWeeklyAnalytics, mockDebuggingTimeline } from '../data/mockData';
import { ProgressBar } from '../components/UI/ProgressBar';
import { TrendingUp, AlertTriangle, CheckCircle, Brain, Zap, Target } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import './AnalyticsPage.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
      }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-dark)' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: 0, fontSize: '0.8rem', color: p.color }}>
            {p.name}: {p.value}{typeof p.value === 'number' && p.name.includes('%') ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const chartData = mockWeeklyAnalytics.labels.map((label, i) => ({
  day: label,
  hints: mockWeeklyAnalytics.hintsRequired[i],
  success: mockWeeklyAnalytics.challengeSuccess[i],
  mastery: mockWeeklyAnalytics.masteryProgress[i],
  detected: mockWeeklyAnalytics.misconceptionsDetected[i],
  resolved: mockWeeklyAnalytics.misconceptionsResolved[i],
}));

export function AnalyticsPage() {
  const { state } = useApp();
  const { student, concepts } = state;

  const sortedConcepts = [...concepts].sort((a, b) => b.mastery - a.mastery);

  return (
    <div className="analytics-page page">
      <Navbar />
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
        <div className="analytics-header animate-fadeIn">
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.75rem', fontWeight: 800 }}>Learning Analytics</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Track your progress, hint dependency, and misconception resolution over time.
            </p>
          </div>
          <div className="analytics-summary-stats">
            <div className="a-stat">
              <span className="a-stat-val" style={{ color: 'var(--teal)' }}>{student.masteryScore}%</span>
              <span className="a-stat-lbl">Overall Mastery</span>
            </div>
            <div className="a-stat-sep" />
            <div className="a-stat">
              <span className="a-stat-val" style={{ color: 'var(--orange)' }}>+12%</span>
              <span className="a-stat-lbl">This Week</span>
            </div>
            <div className="a-stat-sep" />
            <div className="a-stat">
              <span className="a-stat-val" style={{ color: '#a07c00' }}>{student.streak}</span>
              <span className="a-stat-lbl">Day Streak</span>
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Hint Dependency Chart - MOST IMPORTANT */}
          <div className="analytics-card card col-span-2 animate-slideUp">
            <div className="analytics-card-header">
              <div>
                <div className="analytics-card-title">
                  <Brain size={16} color="var(--teal)" />
                  Hint Dependency Over Time
                </div>
                <p className="analytics-card-desc">
                  Shows whether you're solving problems independently. Decreasing % = real learning.
                </p>
              </div>
              <span className="badge badge-teal">Key Metric</span>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="hintsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--orange)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-faint)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-faint)' }} domain={[0, 100]} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="hints" name="Hints Required %" stroke="var(--orange)" fill="url(#hintsGrad)" strokeWidth={2.5} dot={{ fill: 'var(--orange)', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="hint-week-comparison">
              {[
                { week: 'Week 1', pct: 78 },
                { week: 'Week 2', pct: 56 },
                { week: 'Week 3', pct: 31 },
              ].map(w => (
                <div key={w.week} className="hint-week-item">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.week}</span>
                  <div className="progress-bar" style={{ height: 6, flex: 1 }}>
                    <div className="progress-fill progress-fill-orange" style={{ width: `${w.pct}%` }} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--orange)', minWidth: 34 }}>{w.pct}%</span>
                </div>
              ))}
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--teal)', fontWeight: 600 }}>
                ↓ 47% reduction in hint dependency. You&apos;re becoming more independent!
              </p>
            </div>
          </div>

          {/* Mastery Progress */}
          <div className="analytics-card card animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="analytics-card-header">
              <div className="analytics-card-title">
                <TrendingUp size={16} color="var(--teal)" />
                Mastery Progress
              </div>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-faint)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-faint)' }} domain={[40, 80]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="mastery" name="Mastery %" stroke="var(--teal)" strokeWidth={2.5} dot={{ fill: 'var(--teal)', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Challenge Success Rate */}
          <div className="analytics-card card animate-slideUp" style={{ animationDelay: '0.15s' }}>
            <div className="analytics-card-header">
              <div className="analytics-card-title">
                <Target size={16} color="var(--yellow-dark, #c9a800)" />
                Challenge Success Rate
              </div>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-faint)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-faint)' }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="success" name="Success %" fill="var(--yellow-dark, #c9a800)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Misconceptions Chart */}
          <div className="analytics-card card animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="analytics-card-header">
              <div className="analytics-card-title">
                <AlertTriangle size={16} color="var(--orange)" />
                Misconceptions
              </div>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-faint)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-faint)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="detected" name="Detected" fill="var(--orange)" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="resolved" name="Resolved" fill="var(--teal)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Debugging Timeline */}
          <div className="analytics-card card animate-slideUp col-span-2" style={{ animationDelay: '0.25s' }}>
            <div className="analytics-card-header">
              <div className="analytics-card-title">
                <Zap size={16} color="var(--orange)" />
                Debugging Behavior Timeline
              </div>
              <p className="analytics-card-desc">
                How CodeMind observes your debugging pattern to detect misconceptions.
              </p>
            </div>
            <div className="debugging-timeline">
              {mockDebuggingTimeline.map((item, i) => (
                <div key={i} className={`timeline-item ${item.success ? 'timeline-success' : 'timeline-error'}`}>
                  <div className="timeline-connector">
                    <div className={`timeline-dot ${item.success ? 'timeline-dot-success' : 'timeline-dot-error'}`} />
                    {i < mockDebuggingTimeline.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-attempt">Attempt {item.attempt}</span>
                      <span className="timeline-time">{item.timestamp}</span>
                      {item.success ? (
                        <span className="badge badge-teal"><CheckCircle size={10} /> Success</span>
                      ) : (
                        <span className="badge badge-orange"><AlertTriangle size={10} /> Failed</span>
                      )}
                    </div>
                    <div className="timeline-code">
                      <code>{item.code.split('\n')[1]?.trim()}</code>
                    </div>
                    {item.error && (
                      <div className="timeline-error-msg">{item.error}</div>
                    )}
                    <div className="timeline-analysis">{item.analysis}</div>
                  </div>
                </div>
              ))}
              <div className="timeline-misconception-badge">
                <Brain size={14} color="var(--orange)" />
                <span>CodeMind detected: Possible misconception — Array Index Boundaries</span>
                <span className="badge badge-orange">78% confidence</span>
              </div>
            </div>
          </div>

          {/* Concept Mastery Table */}
          <div className="analytics-card card col-span-2 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="analytics-card-title" style={{ marginBottom: 16 }}>
              <CheckCircle size={16} color="var(--teal)" />
              Concept Mastery Overview
            </div>
            <div className="concept-mastery-table">
              {sortedConcepts.map(c => (
                <div key={c.id} className="concept-mastery-row">
                  <div className="concept-mastery-name">{c.name}</div>
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={c.mastery}
                      color={c.status === 'mastered' ? 'teal' : c.status === 'developing' ? 'yellow' : 'orange'}
                      height={6}
                    />
                  </div>
                  <span className="concept-mastery-pct" style={{
                    color: c.status === 'mastered' ? 'var(--teal)' : c.status === 'developing' ? '#a07c00' : 'var(--orange)',
                  }}>
                    {c.mastery}%
                  </span>
                  <span className={`badge badge-${c.status === 'mastered' ? 'teal' : c.status === 'developing' ? 'yellow' : 'orange'}`}
                    style={{ fontSize: '0.65rem' }}>
                    {c.status === 'mastered' ? '✓ Mastered' : c.status === 'developing' ? 'Developing' : 'Needs Work'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
