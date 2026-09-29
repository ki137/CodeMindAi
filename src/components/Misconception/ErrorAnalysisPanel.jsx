import { AlertTriangle, Brain, ChevronDown, ChevronUp, Loader2, Target } from 'lucide-react';
import { useState } from 'react';
import { ProgressBar } from '../UI/ProgressBar';
import './ErrorAnalysisPanel.css';

export function ErrorAnalysisPanel({ misconception, detecting, onAskTutor }) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  if (detecting) {
    return (
      <div className="analysis-detecting">
        <div className="detecting-header">
          <Loader2 size={16} color="var(--yellow-dark, #c9a800)" className="animate-spin" />
          <span>Analyzing behavior patterns...</span>
        </div>
        <div className="detecting-steps">
          {['Scanning error history', 'Comparing repeated patterns', 'Evaluating misconception signals', 'Generating analysis report'].map((s, i) => (
            <div key={i} className="detecting-step animate-fadeIn" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="thinking-dot" style={{ width: 5, height: 5, animationDelay: `${i * 0.2}s` }} />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!misconception) {
    return (
      <div className="analysis-empty">
        <Brain size={28} color="var(--text-faint)" />
        <p style={{ margin: 0, fontSize: '0.875rem', textAlign: 'center', color: 'var(--text-faint)' }}>
          Keep coding. CodeMind watches for repeated patterns that may indicate a conceptual gap.
        </p>
        <span className="badge badge-gray">No misconception detected yet</span>
      </div>
    );
  }

  const { misconception: name, confidence, confidenceLabel, evidence, signals } = misconception;

  return (
    <div className="error-analysis-panel animate-fadeIn">
      {/* Header */}
      <div className="analysis-header">
        <AlertTriangle size={16} color="var(--orange)" />
        <span className="analysis-title">Possible Conceptual Issue</span>
        <span className={`badge badge-${confidence >= 70 ? 'orange' : 'yellow'} analysis-confidence`}>
          {confidence}% {confidenceLabel ? `(${confidenceLabel})` : ''} confidence
        </span>
      </div>

      <h3 className="analysis-concept">{name}</h3>
      <p className="analysis-support-text">
        We noticed a repeated pattern that may indicate confusion about array boundaries.
        This is evidence-based, not a judgement.
      </p>

      {/* Signals */}
      <div className="signals-grid">
        <div className="signal-item">
          <div className="signal-label">Error Frequency</div>
          <ProgressBar value={signals.errorFrequency} color="orange" height={6} />
          <span className="signal-pct">{signals.errorFrequency}%</span>
        </div>
        <div className="signal-item">
          <div className="signal-label">Recurring Pattern</div>
          <ProgressBar value={signals.recurringPattern} color="orange" height={6} />
          <span className="signal-pct">{signals.recurringPattern}%</span>
        </div>
        <div className="signal-item">
          <div className="signal-label">Debugging Behavior</div>
          <ProgressBar value={signals.debuggingBehavior} color="orange" height={6} />
          <span className="signal-pct">{signals.debuggingBehavior}%</span>
        </div>
        <div className="signal-item">
          <div className="signal-label">Concept Dependency</div>
          <ProgressBar value={signals.conceptDependency} color="yellow" height={6} />
          <span className="signal-pct">{signals.conceptDependency}%</span>
        </div>
      </div>

      {/* Evidence */}
      <div className="evidence-section">
        <button
          className="evidence-toggle"
          onClick={() => setEvidenceOpen(!evidenceOpen)}
        >
          <span>Why we think this</span>
          {evidenceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {evidenceOpen && (
          <div className="evidence-list animate-fadeIn">
            {evidence.map((e, i) => (
              <div key={i} className="evidence-item">
                <div className="evidence-dot" />
                <span>{e}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="analysis-actions">
        <button className="btn btn-primary btn-sm" onClick={onAskTutor}>
          <Brain size={14} />
          Ask AI Tutor
        </button>
        <button className="btn btn-secondary btn-sm">
          <Target size={14} />
          Try a Challenge
        </button>
      </div>
    </div>
  );
}
