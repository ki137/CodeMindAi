import { Navbar } from '../components/Layout/Navbar';
import { useApp } from '../context/AppContext';
import { mockAchievements, mockLearningHistory } from '../data/mockData';
import { ProgressBar } from '../components/UI/ProgressBar';
import { Flame, Brain, Target, Star, TrendingUp, AlertTriangle, CheckCircle, MessageCircle, Clock } from 'lucide-react';

const historyIconMap = {
  alert: AlertTriangle,
  message: MessageCircle,
  challenge: Target,
  mastery: TrendingUp,
  star: Star,
  check: CheckCircle,
  trending: TrendingUp,
};

export function ProfilePage() {
  const { state } = useApp();
  const { student, concepts } = state;

  return (
    <div className="page" style={{ paddingBottom: 48 }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          {/* Left: Profile Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Profile */}
            <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--teal)', color: 'white',
                fontSize: '2rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                {student.name.charAt(0)}
              </div>
              <h2 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800 }}>{student.name}</h2>
              <p style={{ margin: '0 0 16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{student.level}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-teal">🐍 Python</span>
                <span className="badge badge-gray">Byteathon 2026</span>
              </div>
            </div>

            {/* Stats */}
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 700 }}>Stats</h3>
              {[
                { label: 'Learning Streak', val: `${student.streak} days`, icon: Flame, color: 'orange' },
                { label: 'Total Challenges', val: student.totalChallenges, icon: Target, color: 'yellow' },
                { label: 'Concepts Mastered', val: student.conceptsMastered, icon: Brain, color: 'teal' },
                { label: 'Misconceptions Resolved', val: student.misconceptionsResolved, icon: CheckCircle, color: 'teal' },
                { label: 'Total XP', val: student.totalXP, icon: Star, color: 'yellow' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: `var(--${s.color}-10)`, color: `var(--${s.color})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <s.icon size={14} />
                  </div>
                  <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Privacy */}
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                🔒 Your learning history is used only to personalize your practice.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Export Learning Data', 'Clear Session History', 'Delete Learning Data'].map(a => (
                  <button key={a} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>{a}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Overall Mastery */}
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 700 }}>My Mastery</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                {concepts.slice(0, 8).map(c => (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dark)' }}>{c.name}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: c.status === 'mastered' ? 'var(--teal)' : c.status === 'developing' ? '#a07c00' : 'var(--orange)' }}>
                        {c.mastery}%
                      </span>
                    </div>
                    <ProgressBar value={c.mastery} color={c.status === 'mastered' ? 'teal' : c.status === 'developing' ? 'yellow' : 'orange'} height={5} />
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 700 }}>Achievements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
                {mockAchievements.map(a => (
                  <div key={a.id} className={`card ${!a.earned ? 'card-locked' : ''}`} style={{
                    padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center',
                    opacity: a.earned ? 1 : 0.4, transition: 'opacity 0.2s',
                    border: a.earned ? '1px solid var(--teal-20)' : '1px solid var(--border-light)',
                    background: a.earned ? 'var(--teal-10)' : 'var(--bg-elevated)',
                  }}>
                    <span style={{ fontSize: '1.75rem' }}>{a.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: a.earned ? 'var(--text-dark)' : 'var(--text-faint)' }}>{a.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>{a.description}</span>
                    {a.earned && a.earnedDate && (
                      <span className="badge badge-teal" style={{ fontSize: '0.6rem', alignSelf: 'center' }}>Earned</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '0.9375rem', fontWeight: 700 }}>Learning History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockLearningHistory.map(item => {
                  const Icon = historyIconMap[item.icon] || CheckCircle;
                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--radius-md)',
                        background: 'var(--teal-10)', color: 'var(--teal)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon size={13} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-dark)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                          <Clock size={11} /> {item.date} · {item.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
