import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Play, X, AlertTriangle, CheckCircle,
  Loader2, Sparkles, Target, TrendingUp, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './DemoMode.css';

const DEMO_STEPS = [
  { id: 1, title: 'Student Runs Code', desc: 'Alex runs the array loop code', icon: Play, color: 'teal' },
  { id: 2, title: 'IndexError Detected', desc: 'list index out of range appears', icon: AlertTriangle, color: 'orange' },
  { id: 3, title: 'Behavior Analysis', desc: 'CodeMind analyzes repeated pattern', icon: Brain, color: 'yellow' },
  { id: 4, title: 'Misconception Identified', desc: 'Array Index Boundaries (78% confidence)', icon: AlertTriangle, color: 'orange' },
  { id: 5, title: 'Socratic AI Opens', desc: 'AI asks guiding questions', icon: Sparkles, color: 'teal' },
  { id: 6, title: 'Student Explains Thinking', desc: '"I think the loop goes too far..."', icon: Brain, color: 'pink' },
  { id: 7, title: 'Progressive Hint', desc: 'Hint 2/4: Focus on range() boundary', icon: Zap, color: 'yellow' },
  { id: 8, title: 'Micro-Challenge Unlocked', desc: 'Find the Loop Bug challenge appears', icon: Target, color: 'yellow' },
  { id: 9, title: 'Challenge Solved', desc: 'Alex fixes range(6) → range(len(...))', icon: CheckCircle, color: 'teal' },
  { id: 10, title: 'Mastery Updated', desc: 'Index Boundaries: 35% → 47%', icon: TrendingUp, color: 'teal' },
];

const COLOR_MAP = {
  teal: { bg: 'var(--teal-10)', color: 'var(--teal)', border: 'var(--teal-20)' },
  orange: { bg: 'var(--orange-10)', color: 'var(--orange)', border: 'var(--orange-20)' },
  yellow: { bg: 'var(--yellow-10)', color: '#a07c00', border: 'var(--yellow-20)' },
  pink: { bg: 'var(--pink-10)', color: 'var(--pink-dark)', border: 'rgba(255,192,203,0.4)' },
};

export function DemoModePanel({ onClose }) {
  const { dispatch, addToast } = useApp();
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const runDemo = useCallback(async () => {
    setRunning(true);
    setCurrentStep(0);
    setCompleted(false);
    dispatch({ type: 'LOAD_DEMO_SCENARIO' });
    dispatch({ type: 'SET_DEMO_MODE', payload: true });

    for (let i = 0; i < DEMO_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 1200));
      setCurrentStep(i + 1);

      if (i === 1) {
        dispatch({ type: 'SET_EXECUTION_STATE', payload: 'error' });
        dispatch({
          type: 'SET_EXECUTION_RESULT',
          payload: { output: '10\n20\n30\n40\n50', error: 'IndexError: list index out of range', exitCode: 1, executionTime: '0.042s' },
        });
        dispatch({ type: 'ADD_ERROR', payload: 'IndexError: list index out of range' });
        dispatch({ type: 'ADD_ERROR', payload: 'IndexError: list index out of range' });
        dispatch({ type: 'ADD_ERROR', payload: 'IndexError: list index out of range' });
      }

      if (i === 3) {
        dispatch({
          type: 'SET_MISCONCEPTION',
          payload: {
            detected: true,
            misconception: 'Array Index Boundaries',
            confidence: 78,
            confidenceLabel: 'Medium–High',
            evidence: ['5 IndexError instances', '3 failed fix attempts', 'Off-by-one pattern confirmed'],
            signals: { errorFrequency: 80, recurringPattern: 70, debuggingBehavior: 80, conceptDependency: 60 },
          },
        });
        addToast({ type: 'warning', title: 'Misconception Detected', message: 'Array Index Boundaries (78% confidence)' });
      }

      if (i === 4) {
        dispatch({ type: 'OPEN_AI_TUTOR' });
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            role: 'ai',
            message: "I noticed something interesting in your loop. How many elements are inside your `numbers` array?",
            timestamp: '09:15',
          },
        });
      }

      if (i === 8) {
        dispatch({ type: 'SET_EXECUTION_STATE', payload: 'success' });
        dispatch({
          type: 'SET_EXECUTION_RESULT',
          payload: { output: '10\n20\n30\n40\n50', error: null, exitCode: 0, executionTime: '0.038s' },
        });
        addToast({ type: 'success', title: '🎉 Code Fixed!', message: 'No more IndexError.' });
      }

      if (i === 9) {
        dispatch({ type: 'UPDATE_CONCEPT_MASTERY', payload: { id: 'index-boundaries', delta: 12 } });
        setTimeout(() => dispatch({ type: 'CLEAR_MASTERY_UPDATE' }), 4000);
        addToast({ type: 'success', title: 'Mastery Updated!', message: 'Index Boundaries improved!' });
      }
    }

    setCompleted(true);
    setRunning(false);
    navigate('/ide');
  }, [dispatch, navigate, addToast]);

  return (
    <div className="demo-overlay">
      <div className="demo-panel animate-slideUp">
        {/* Header */}
        <div className="demo-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: 'var(--teal)', borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-dark)' }}>Judge Demo Mode</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BYTEATHON 2026 — BYT03 — Complete flow in ~2 minutes</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Flow Diagram */}
        <div className="demo-flow">
          <div className="demo-flow-label">
            <span className="section-label">CodeMind Learning Flow</span>
          </div>
          <div className="demo-steps-grid">
            {DEMO_STEPS.map((step) => {
              const cfg = COLOR_MAP[step.color];
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className={`demo-step-card ${isActive ? 'demo-step-active' : ''} ${isDone ? 'demo-step-done' : ''}`}
                  style={{
                    borderColor: isActive ? cfg.color : isDone ? 'var(--teal-20)' : 'var(--border-light)',
                    background: isActive ? cfg.bg : isDone ? 'rgba(6,148,148,0.04)' : 'var(--bg-card)',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 'var(--radius-md)',
                    background: isDone ? 'var(--teal-10)' : cfg.bg,
                    color: isDone ? 'var(--teal)' : cfg.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isDone ? <CheckCircle size={14} /> : isActive ? <Loader2 size={14} className="animate-spin" /> : <step.icon size={14} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>{step.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        {running && (
          <div style={{ padding: '0 var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Demo Progress</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal)' }}>{currentStep}/{DEMO_STEPS.length}</span>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill progress-fill-teal" style={{ width: `${(currentStep / DEMO_STEPS.length) * 100}%` }} />
            </div>
          </div>
        )}

        {completed && (
          <div style={{ padding: 'var(--space-4) var(--space-5)', background: 'var(--teal-10)', margin: '0 var(--space-5)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={18} color="var(--teal)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--teal)' }}>
              Demo complete! The IDE shows the full flow. Opening IDE...
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="demo-panel-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Skip Demo</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-orange"
              onClick={runDemo}
              disabled={running}
            >
              {running ? (
                <><Loader2 size={15} className="animate-spin" /> Running Demo...</>
              ) : (
                <><Play size={15} /> {completed ? 'Run Again' : 'Run Full Demo'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
