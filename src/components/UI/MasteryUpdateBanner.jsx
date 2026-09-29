import { TrendingUp, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function MasteryUpdateBanner({ update }) {
  const { state } = useApp();
  const concept = state.concepts.find(c => c.id === update?.id);
  if (!concept || !update) return null;

  const oldMastery = concept.mastery - (update.delta || 0);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'var(--bg-card)',
        border: '1.5px solid var(--teal-20)',
        borderRadius: 'var(--radius-2xl)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: 'var(--shadow-lg)',
        animation: 'bounceIn 0.5s ease',
        minWidth: 300,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-xl)',
        background: 'var(--teal-10)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CheckCircle size={22} color="var(--teal)" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
          🎉 Concept Improved!
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          {concept.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{Math.round(oldMastery)}%</span>
          <TrendingUp size={14} color="var(--teal)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--teal)' }}>{concept.mastery}%</span>
          <span className="badge badge-teal">+{update.delta}%</span>
        </div>
      </div>
    </div>
  );
}
