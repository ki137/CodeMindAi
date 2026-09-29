export function ProgressBar({ value, max = 100, color = 'teal', height = 8, animated = true, showLabel = false }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="progress-bar" style={{ height }}>
        <div
          className={`progress-fill progress-fill-${color}`}
          style={{
            width: `${pct}%`,
            transition: animated ? 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

export function ConceptProgressBar({ concept }) {
  const { mastery, status } = concept;
  const color = status === 'mastered' ? 'teal' : status === 'developing' ? 'yellow' : 'orange';

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>{concept.name}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: `var(--${color})` }}>{mastery}%</span>
      </div>
      <ProgressBar value={mastery} color={color} />
    </div>
  );
}
