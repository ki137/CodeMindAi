import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap, Clock, Lock, CheckCircle, ChevronRight, Brain, AlertTriangle, Play } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { useApp } from '../context/AppContext';
import { mockChallenges } from '../data/mockData';
import { challengeService } from '../services/masteryService';
import './ChallengesPage.css';

const DIFFICULTY_CONFIG = {
  Basic: { color: 'teal', badge: 'badge-teal' },
  Application: { color: 'yellow', badge: 'badge-yellow' },
  Transfer: { color: 'orange', badge: 'badge-orange' },
  'Real World': { color: 'pink', badge: 'badge-pink' },
};

export function ChallengesPage() {
  const { state, dispatch, addToast } = useApp();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentMisconception = state.currentMisconception;

  const handleStartChallenge = (ch) => {
    if (ch.status === 'locked') {
      addToast({ type: 'warning', message: 'Complete earlier challenges to unlock this one.' });
      return;
    }
    setActiveChallenge(ch);
    setAnswer(ch.starterCode || '');
    setSubmitted(false);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await challengeService.evaluateAnswer(activeChallenge.id, answer, answer);
      setResult(res);
      setSubmitted(true);

      if (res.correct) {
        dispatch({
          type: 'UPDATE_CONCEPT_MASTERY',
          payload: { id: 'index-boundaries', delta: res.masteryDelta },
        });
        setTimeout(() => dispatch({ type: 'CLEAR_MASTERY_UPDATE' }), 4000);
        addToast({ type: 'success', title: `+${res.xpEarned} XP`, message: 'Challenge completed! Mastery updated.' });
      } else {
        addToast({ type: 'warning', title: 'Not quite', message: res.feedback });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="challenges-page page">
      <Navbar />
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
        <div className="challenges-header animate-fadeIn">
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.75rem', fontWeight: 800 }}>Adaptive Challenges</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Challenges generated based on your detected misconceptions — not generic practice.
            </p>
          </div>
        </div>

        {/* Misconception Banner */}
        {currentMisconception && (
          <div className="misconception-banner animate-slideUp">
            <AlertTriangle size={18} color="var(--orange)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9375rem' }}>
                Challenges generated for: {currentMisconception.misconception}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                These 4 challenges progressively target your specific conceptual gap.
              </div>
            </div>
            <span className="badge badge-orange" style={{ marginLeft: 'auto' }}>
              {currentMisconception.confidence}% confidence
            </span>
          </div>
        )}

        <div className="challenges-layout">
          {/* Challenge List */}
          <div className="challenges-list">
            {mockChallenges.map((ch, i) => {
              const cfg = DIFFICULTY_CONFIG[ch.difficulty] || DIFFICULTY_CONFIG.Basic;
              const isActive = activeChallenge?.id === ch.id;

              return (
                <div
                  key={ch.id}
                  className={`challenge-card card ${isActive ? 'challenge-card-active' : ''} ${ch.status === 'locked' ? 'challenge-card-locked' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="challenge-card-header">
                    <div className="challenge-num">{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ flex: 1 }}>
                      <div className="challenge-title">{ch.title}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                        <span className={`badge ${cfg.badge}`}>{ch.difficulty}</span>
                        <span className="badge badge-gray">{ch.type}</span>
                      </div>
                    </div>
                    {ch.status === 'locked' ? (
                      <Lock size={16} color="var(--text-faint)" />
                    ) : (
                      <ChevronRight size={16} color="var(--teal)" />
                    )}
                  </div>

                  <p className="challenge-desc">{ch.description.slice(0, 90)}{ch.description.length > 90 ? '...' : ''}</p>

                  <div className="challenge-meta">
                    <div className="challenge-meta-item">
                      <Zap size={12} color="var(--yellow-dark, #c9a800)" />
                      {ch.xpReward} XP
                    </div>
                    <div className="challenge-meta-item">
                      <Clock size={12} color="var(--text-faint)" />
                      ~{ch.estimatedMinutes} min
                    </div>
                    <div className="challenge-meta-item">
                      <Brain size={12} color="var(--teal)" />
                      {ch.concept}
                    </div>
                  </div>

                  <button
                    className={`btn ${ch.status === 'locked' ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                    onClick={() => handleStartChallenge(ch)}
                    disabled={ch.status === 'locked'}
                    style={{ alignSelf: 'flex-start', marginTop: 4 }}
                  >
                    {ch.status === 'locked' ? (
                      <><Lock size={13} /> Locked</>
                    ) : (
                      <><Play size={13} /> Start Challenge</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Challenge Panel */}
          <div className="challenge-work-panel">
            {activeChallenge ? (
              <div className="challenge-work animate-fadeIn">
                <div className="challenge-work-header">
                  <div>
                    <span className={`badge ${DIFFICULTY_CONFIG[activeChallenge.difficulty]?.badge}`}>
                      {activeChallenge.difficulty}
                    </span>
                    <h3 style={{ margin: '8px 0 0', fontSize: '1.125rem', fontWeight: 800 }}>
                      {activeChallenge.title}
                    </h3>
                  </div>
                </div>

                <div className="challenge-description">
                  <pre style={{ fontFamily: 'var(--font-sans)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.7 }}>
                    {activeChallenge.description}
                  </pre>
                </div>

                {/* Code input */}
                <div className="challenge-code-area">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Your Answer
                  </div>
                  <textarea
                    className="challenge-textarea"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Type your answer or code here..."
                    disabled={submitted && result?.correct}
                  />
                </div>

                {/* Hint */}
                <div className="challenge-hint">
                  <span style={{ color: 'var(--yellow-dark, #c9a800)' }}>💡</span>
                  <span>Hint: {activeChallenge.hint}</span>
                </div>

                {/* Result */}
                {result && (
                  <div className={`challenge-result challenge-result-${result.correct ? 'success' : 'fail'} animate-bounceIn`}>
                    {result.correct ? (
                      <CheckCircle size={18} color="var(--teal)" />
                    ) : (
                      <AlertTriangle size={18} color="var(--orange)" />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {result.correct ? '✓ Correct!' : '✗ Not quite right'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{result.feedback}</div>
                      {result.correct && (
                        <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                          <span className="badge badge-teal">+{result.xpEarned} XP</span>
                          <span className="badge badge-teal">+{result.masteryDelta}% Mastery</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting || (submitted && result?.correct)}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {submitting ? 'Evaluating...' : submitted && result?.correct ? '✓ Completed' : 'Submit Answer'}
                  </button>
                  {submitted && !result?.correct && (
                    <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setResult(null); }}>
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="challenge-empty">
                <Target size={36} color="var(--text-faint)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-dark)' }}>Select a Challenge</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280 }}>
                  Choose a challenge from the list. Personalized challenges are generated based on your detected misconceptions.
                </p>
                {!currentMisconception && (
                  <Link to="/ide" className="btn btn-primary btn-sm">
                    <Brain size={14} />
                    Run code first to unlock personalized challenges
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
