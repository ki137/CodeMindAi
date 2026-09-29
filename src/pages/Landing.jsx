import { Link } from 'react-router-dom';
import {
  Brain, GitBranch, Target, ArrowRight, Play,
  AlertTriangle, MessageCircle, Sparkles, ChevronRight,
  Code2, CheckCircle
} from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import './Landing.css';

const features = [
  {
    number: '01',
    icon: AlertTriangle,
    title: 'Misconception Detection',
    description: 'CodeMind observes your coding patterns across sessions and identifies repeated conceptual errors — not just syntax mistakes.',
    color: 'orange',
  },
  {
    number: '02',
    icon: MessageCircle,
    title: 'Socratic AI Tutor',
    description: 'Instead of giving you the answer, the AI asks targeted questions to guide you to discover the solution yourself.',
    color: 'teal',
  },
  {
    number: '03',
    icon: GitBranch,
    title: 'Learner Knowledge Graph',
    description: 'An interactive map of your programming concepts showing mastery levels, dependencies, and learning gaps.',
    color: 'yellow',
  },
  {
    number: '04',
    icon: Target,
    title: 'Adaptive Micro-Challenges',
    description: 'Personalized challenges generated based on your specific detected misconceptions — not generic practice problems.',
    color: 'pink',
  },
];

const learningLoop = [
  { label: 'Code', icon: Code2, color: 'teal' },
  { label: 'Error', icon: AlertTriangle, color: 'orange' },
  { label: 'Insight', icon: Brain, color: 'yellow' },
  { label: 'Guidance', icon: MessageCircle, color: 'teal' },
  { label: 'Practice', icon: Target, color: 'pink' },
  { label: 'Mastery', icon: CheckCircle, color: 'teal' },
];

export function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-fadeIn">
              <span className="status-dot" />
              <span>BYTEATHON 2026 — BYT03</span>
              <span className="hero-badge-sep">·</span>
              <span>Uncover Programming Misconceptions</span>
            </div>

            <h1 className="hero-title animate-slideUp">
              Understand How You{' '}
              <span className="hero-title-teal">Think</span>.
              <br />
              Not Just How You{' '}
              <span className="hero-title-orange">Code</span>.
            </h1>

            <p className="hero-subtitle animate-slideUp" style={{ animationDelay: '0.1s' }}>
              An intelligent coding environment that detects hidden programming misconceptions
              and helps students build real conceptual understanding through Socratic AI guidance.
            </p>

            <div className="hero-cta animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                <Brain size={18} />
                Start Learning
                <ArrowRight size={16} />
              </Link>
              <Link to="/ide" className="btn btn-secondary btn-lg">
                <Play size={16} />
                Explore Demo
              </Link>
            </div>

            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="hero-stat">
                <span className="hero-stat-num">9+</span>
                <span className="hero-stat-label">Misconceptions Detected</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">68%</span>
                <span className="hero-stat-label">Mastery Improvement</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">7 days</span>
                <span className="hero-stat-label">Learning Streak</span>
              </div>
            </div>
          </div>

          {/* IDE Preview */}
          <div className="hero-ide-preview animate-slideUp" style={{ animationDelay: '0.25s' }}>
            <IDEPreview />
          </div>
        </div>
      </section>

      {/* Learning Loop */}
      <section className="loop-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">The Learning Loop</span>
            <h2>How CodeMind Works</h2>
            <p>Every coding session follows an intelligent learning cycle designed to build genuine understanding.</p>
          </div>
          <div className="loop-steps">
            {learningLoop.map((step, i) => (
              <div key={step.label} className="loop-step">
                <div className={`loop-step-icon loop-icon-${step.color}`}>
                  <step.icon size={20} />
                </div>
                <span className="loop-step-label">{step.label}</span>
                {i < learningLoop.length - 1 && (
                  <ChevronRight size={16} color="var(--text-faint)" className="loop-arrow" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Core Features</span>
            <h2>We Don't Just Detect Wrong Code.</h2>
            <p className="features-subtitle">We detect wrong understanding.</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={f.number}
                className={`feature-card card card-${f.color === 'pink' ? 'pink' : f.color}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-number">{f.number}</div>
                <div className={`feature-icon-wrapper feature-icon-${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.description}</p>
                <Link to="/ide" className={`feature-link feature-link-${f.color}`}>
                  See it in action <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Scenario */}
      <section className="demo-section" id="demo">
        <div className="container">
          <div className="demo-inner">
            <div className="demo-text">
              <span className="section-label">Live Demo</span>
              <h2>Watch CodeMind in Action</h2>
              <p>
                Follow Alex — an intermediate student — as CodeMind detects a repeated
                misconception about array indexing and guides them to understanding.
              </p>
              <div className="demo-steps">
                {['Student runs code with IndexError', 'CodeMind detects repeated pattern', 'Socratic AI asks guiding questions', 'Student discovers the concept', 'Mastery updated — challenge unlocked'].map((s, i) => (
                  <div key={i} className="demo-step">
                    <div className="demo-step-num">{i + 1}</div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <Link to="/ide" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-6)' }}>
                <Sparkles size={16} />
                Try the Demo
              </Link>
            </div>
            <div className="demo-visual">
              <MisconceptionPreview />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-icon">
              <Brain size={36} color="white" />
            </div>
            <h2 className="cta-title">Ready to Understand How You Think?</h2>
            <p className="cta-desc">
              Join students who are building genuine programming understanding — not just passing tests.
            </p>
            <div className="cta-btns">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Start Learning Free
                <ArrowRight size={16} />
              </Link>
              <Link to="/ide" className="btn btn-secondary btn-lg">
                View the IDE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="logo-icon" style={{ width: 28, height: 28 }}>
                <Brain size={14} color="white" />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>CodeMind AI</span>
            </div>
            <p className="footer-byline">BYTEATHON 2026 — BYT03 · Built for hackathon demonstration.</p>
            <div className="footer-links">
              <span className="badge badge-teal">Demo Mode Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IDEPreview() {
  return (
    <div className="ide-preview">
      <div className="ide-preview-topbar">
        <div className="ide-preview-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="ide-preview-title">main.py — CodeMind AI</span>
        <span className="badge badge-orange" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
          <AlertTriangle size={10} /> Error Detected
        </span>
      </div>
      <div className="ide-preview-body">
        <div className="ide-preview-editor">
          <pre className="code-block" style={{ fontSize: '0.75rem', margin: 0, borderRadius: 0 }}>
            <span className="code-variable">numbers</span>{' = ['}
            <span className="code-number">10</span>, <span className="code-number">20</span>, <span className="code-number">30</span>, <span className="code-number">40</span>, <span className="code-number">50</span>{']'}
            {'\n\n'}
            <span className="code-keyword">for</span>{' i '}
            <span className="code-keyword">in</span>{' '}
            <span className="code-function">range</span>{'('}
            <span className="code-error">6</span>{'): '}
            <span className="code-comment">  ← Issue here</span>
            {'\n    '}
            <span className="code-function">print</span>{'(numbers[i])'}
          </pre>
        </div>
        <div className="ide-preview-output">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginBottom: 6 }}>OUTPUT</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.8 }}>
            10{'\n'}20{'\n'}30{'\n'}40{'\n'}50
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ff5555', marginTop: 6, padding: '6px 8px', background: 'rgba(255,85,85,0.1)', borderRadius: 6, borderLeft: '2px solid #ff5555' }}>
            IndexError: list index out of range
          </div>
        </div>
      </div>
      <div className="ide-preview-ai">
        <div className="ide-preview-ai-header">
          <div className="status-dot" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--teal)' }}>CodeMind Socratic Tutor</span>
        </div>
        <div className="ide-preview-ai-msg">
          💬 &quot;How many elements are inside your array?&quot;
        </div>
      </div>
    </div>
  );
}

function MisconceptionPreview() {
  return (
    <div className="misconception-preview card card-orange">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <AlertTriangle size={18} color="var(--orange)" />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--orange)', textTransform: 'uppercase' }}>
          Possible Misconception
        </span>
        <span className="badge badge-orange" style={{ marginLeft: 'auto' }}>78% confidence</span>
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 12 }}>
        Array Index Boundaries
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Error Frequency', pct: 80 },
          { label: 'Recurring Pattern', pct: 70 },
          { label: 'Debugging Behavior', pct: 80 },
        ].map(s => (
          <div key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--orange)' }}>{s.pct}%</span>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill progress-fill-orange" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(255,130,67,0.08)', borderRadius: 10, fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        &quot;We noticed a repeated pattern that may indicate confusion about array boundaries.&quot;
      </div>
    </div>
  );
}
