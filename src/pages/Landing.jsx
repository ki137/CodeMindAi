import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, GitBranch, Target, ArrowRight, Play,
  AlertTriangle, MessageCircle, Sparkles, ChevronRight,
  Code2, CheckCircle, Flame, Award, Zap, Terminal, ShieldCheck
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Layout/Navbar';
import './Landing.css';

gsap.registerPlugin(ScrollTrigger);

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

const growwShowcaseSteps = [
  {
    id: 1,
    tag: '01 · REAL-TIME PATTERN MONITORING',
    title: 'Code Mindfully. Detect Cognitive Gaps.',
    desc: 'As you write and execute code in our IDE, CodeMind analyzes not just runtime errors, but the cognitive path that led to them.',
    badge: 'IndexError Pattern Detected',
    badgeColor: 'orange',
  },
  {
    id: 2,
    tag: '02 · SOCRATIC INTERACTIVE CHAT',
    title: 'Guided Questions, Not Direct Answers.',
    desc: 'The Socratic AI Tutor prompts you with targeted micro-questions that challenge your assumptions until you discover the fix yourself.',
    badge: 'Socratic Tutor Active',
    badgeColor: 'teal',
  },
  {
    id: 3,
    tag: '03 · CONCEPT KNOWLEDGE GRAPH',
    title: 'Track Skill Mastery in Real Time.',
    desc: 'Watch your mental model evolve as detected misconceptions transform into verified programming concepts on your personalized graph.',
    badge: 'Mastery Score +25%',
    badgeColor: 'green',
  },
];

export function LandingPage() {
  const landingRef = useRef(null);
  const heroRef = useRef(null);
  const heroIdeRef = useRef(null);
  const pinnedSectionRef = useRef(null);
  const pinnedVisualRef = useRef(null);
  const statsRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  // Counter state values
  const [stat1, setStat1] = useState(0);
  const [stat2, setStat2] = useState(0);
  const [stat3, setStat3] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTimeline
        .fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo('.hero-title-line', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, '-=0.5')
        .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-cta-btn', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.3');

      // 2. Hero IDE Parallax Scroll Effect (subtle translateY without changing opacity)
      if (heroIdeRef.current) {
        gsap.to(heroIdeRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: 60,
          scale: 0.98,
        });
      }

      // 3. Counter ScrollTrigger
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { s1: 0, s2: 0, s3: 0 };
          gsap.to(obj, {
            s1: 9,
            s2: 68,
            s3: 7,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              setStat1(Math.floor(obj.s1));
              setStat2(Math.floor(obj.s2));
              setStat3(Math.floor(obj.s3));
            },
          });
        },
      });

      // 4. Learning Loop Items Reveal
      gsap.fromTo(
        '.loop-step',
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.loop-section',
            start: 'top 80%',
          },
        }
      );

      // 5. Groww-style Pinned Scroll Showcase (Sticky Card Pinning)
      const steps = gsap.utils.toArray('.pinned-text-step');
      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });


      // 7. Demo CTA Card Reveal
      gsap.fromTo(
        '.cta-card',
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
          },
        }
      );

    }, landingRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page" ref={landingRef}>
      <Navbar />

      {/* Hero */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="status-dot" />
              <span>BYTEATHON 2026 — BYT03</span>
              <span className="hero-badge-sep">·</span>
              <span>Uncover Programming Misconceptions</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-title-line">Understand How You</span>
              <br />
              <span className="hero-title-line hero-title-teal">Think</span>
              <span className="hero-title-line">. Not Just How You </span>
              <span className="hero-title-line hero-title-orange">Code</span>.
            </h1>

            <p className="hero-subtitle">
              An intelligent coding environment that detects hidden programming misconceptions
              and helps students build real conceptual understanding through Socratic AI guidance.
            </p>

            <div className="hero-cta">
              <Link to="/dashboard" className="btn btn-primary btn-lg hero-cta-btn">
                <Brain size={18} />
                Start Learning
                <ArrowRight size={16} />
              </Link>
              <Link to="/ide" className="btn btn-secondary btn-lg hero-cta-btn">
                <Play size={16} />
                Explore Demo
              </Link>
            </div>

            <div className="hero-stats" ref={statsRef}>
              <div className="hero-stat">
                <span className="hero-stat-num">{stat1}+</span>
                <span className="hero-stat-label">Misconceptions Detected</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">{stat2}%</span>
                <span className="hero-stat-label">Mastery Improvement</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">{stat3} days</span>
                <span className="hero-stat-label">Learning Streak</span>
              </div>
            </div>
          </div>

          {/* IDE Preview with 3D Tilt */}
          <div className="hero-ide-preview" ref={heroIdeRef}>
            <IDEPreview />
          </div>
        </div>
      </section>

      {/* Infinite Horizontal Marquee Learning Loop Section */}
      <section className="loop-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">THE LEARNING LOOP</span>
            <h2>How CodeMind Works</h2>
            <p>Every coding session follows an intelligent learning cycle designed to build genuine understanding.</p>
          </div>
        </div>

        <div className="loop-marquee-container">
          <div className="loop-marquee-track">
            {[...learningLoop, ...learningLoop, ...learningLoop, ...learningLoop].map((step, i) => (
              <div key={`${step.label}-${i}`} className="loop-step">
                <div className={`loop-step-icon loop-icon-${step.color}`}>
                  <step.icon size={20} />
                </div>
                <span className="loop-step-label">{step.label}</span>
                <ChevronRight size={16} color="#000000" className="loop-arrow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GROWW-STYLE PINNED SHOWCASE SECTION */}
      <section className="groww-pinned-section" ref={pinnedSectionRef} id="showcase">
        <div className="container">
          <div className="groww-section-header">
            <span className="section-label">INTERACTIVE SHOWCASE</span>
            <h2>Experience CodeMind as You Scroll</h2>
            <p>See how real-time error monitoring, Socratic chat, and knowledge tracking interact seamlessly.</p>
          </div>

          <div className="groww-showcase-grid">
            {/* Left Column: Scrollable Steps */}
            <div className="groww-steps-column">
              {growwShowcaseSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`pinned-text-step ${activeStep === index ? 'step-active' : ''}`}
                >
                  <span className="step-tag">{step.tag}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                  <div className="step-indicator-bar">
                    <div
                      className="step-progress-fill"
                      style={{ width: activeStep === index ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Fixed Pinned Visual */}
            <div className="groww-visual-column">
              <div className="groww-pinned-visual" ref={pinnedVisualRef}>
                <GrowwVisualMockup activeStep={activeStep} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neo-Brutalist Scroll Stack Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CORE FEATURES</span>
            <h2>We Don't Just Detect Wrong Code.</h2>
            <p className="features-subtitle">We detect wrong understanding.</p>
          </div>

          <div className="scroll-stack-wrapper">
            {features.map((f, i) => (
              <div
                key={f.number}
                className="scroll-stack-card"
                style={{
                  top: `calc(110px + ${i * 32}px)`,
                  zIndex: i + 1,
                }}
              >
                <div className="stack-card-header">
                  <div className="stack-card-number">{f.number}</div>
                  <div className="stack-card-icon">
                    <f.icon size={24} color="#FFFFFF" />
                  </div>
                </div>

                <div className="stack-card-body">
                  <h3 className="stack-card-title">{f.title}</h3>
                  <p className="stack-card-desc">{f.description}</p>
                </div>

                <div className="stack-card-footer">
                  <Link to="/ide" className="stack-card-btn">
                    SEE IT IN ACTION
                    <ArrowRight size={16} />
                  </Link>
                </div>
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

      {/* CTA Section */}
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

// Fixed Right-side Dynamic Visual Component for Groww Pinned Showcase
function GrowwVisualMockup({ activeStep }) {
  return (
    <div className="groww-mockup-card">
      <div className="mockup-header">
        <div className="mockup-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="mockup-header-title">
          {activeStep === 0 && 'Live IDE Execution Monitor'}
          {activeStep === 1 && 'Socratic AI Tutor Drawer'}
          {activeStep === 2 && 'Knowledge Graph Mastery Tracker'}
        </span>
        <span className={`badge badge-${activeStep === 0 ? 'orange' : activeStep === 1 ? 'teal' : 'green'}`} style={{ marginLeft: 'auto' }}>
          {growwShowcaseSteps[activeStep].badge}
        </span>
      </div>

      <div className="mockup-content">
        {/* Step 0: Real-time Code Monitor */}
        {activeStep === 0 && (
          <div className="mockup-step-view animate-fadeIn">
            <div className="mockup-code-window">
              <div className="code-line"><span className="code-kw">numbers</span> = [10, 20, 30, 40, 50]</div>
              <div className="code-line"><span className="code-kw">for</span> i <span className="code-kw">in</span> <span className="code-fn">range</span>(<span className="code-err">6</span>):</div>
              <div className="code-line code-indent"><span className="code-fn">print</span>(numbers[i])</div>
            </div>
            <div className="mockup-alert-box">
              <div className="alert-header">
                <AlertTriangle size={16} color="var(--orange)" />
                <span>IndexError: list index out of range</span>
              </div>
              <p className="alert-desc">Pattern match: Attempting index 5 in 5-element array.</p>
            </div>
          </div>
        )}

        {/* Step 1: Socratic AI Drawer */}
        {activeStep === 1 && (
          <div className="mockup-step-view animate-fadeIn">
            <div className="socratic-chat-mock">
              <div className="chat-bubble chat-ai">
                <div className="chat-avatar"><Brain size={12} color="white" /></div>
                <div className="chat-text">
                  "How many elements are inside your <code>numbers</code> array?"
                </div>
              </div>
              <div className="chat-bubble chat-user">
                <div className="chat-text">"There are 5 elements."</div>
              </div>
              <div className="chat-bubble chat-ai">
                <div className="chat-avatar"><Brain size={12} color="white" /></div>
                <div className="chat-text">
                  "If indexing starts at <strong>0</strong>, what is the valid index range?"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Knowledge Graph */}
        {activeStep === 2 && (
          <div className="mockup-step-view animate-fadeIn">
            <div className="knowledge-mock">
              <div className="concept-row">
                <div className="concept-info">
                  <span className="concept-name">Array Index Boundaries</span>
                  <span className="badge badge-teal">92% Mastered</span>
                </div>
                <div className="concept-bar"><div className="concept-fill" style={{ width: '92%' }} /></div>
              </div>
              <div className="concept-row">
                <div className="concept-info">
                  <span className="concept-name">Loop Boundary Conditions</span>
                  <span className="badge badge-teal">85% Mastered</span>
                </div>
                <div className="concept-bar"><div className="concept-fill" style={{ width: '85%' }} /></div>
              </div>
              <div className="mastery-unlocked-card">
                <Award size={20} color="var(--teal)" />
                <div>
                  <div className="unlocked-title">Mastery Badge Unlocked! 🎉</div>
                  <div className="unlocked-subtitle">Array Boundary Expert · Micro-challenge unlocked</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
        <div className="ide-error-banner-tag">
          <AlertTriangle size={12} />
          <span>Error Detected</span>
        </div>
      </div>
      <div className="ide-preview-body">
        <div className="ide-preview-editor">
          <pre className="code-block" style={{ fontSize: '0.8125rem', margin: 0, borderRadius: 0, background: '#0C0F17', color: '#FFFFFF', lineHeight: 1.8 }}>
            <span className="code-variable" style={{ color: '#93C5FD' }}>numbers</span>{' = ['}
            <span className="code-number" style={{ color: '#6EE7B7' }}>10</span>, <span className="code-number" style={{ color: '#6EE7B7' }}>20</span>, <span className="code-number" style={{ color: '#6EE7B7' }}>30</span>, <span className="code-number" style={{ color: '#6EE7B7' }}>40</span>, <span className="code-number" style={{ color: '#6EE7B7' }}>50</span>{']'}
            {'\n\n'}
            <span className="code-keyword" style={{ color: '#F472B6', fontWeight: 800 }}>for</span>{' i '}
            <span className="code-keyword" style={{ color: '#F472B6', fontWeight: 800 }}>in</span>{' '}
            <span className="code-function" style={{ color: '#60A5FA', fontWeight: 700 }}>range</span>{'('}
            <span className="code-error" style={{ background: '#EF4444', color: '#FFFFFF', padding: '1px 6px', borderRadius: 4, fontWeight: 900 }}>6</span>{'): '}
            <span className="code-comment" style={{ color: '#F87171', fontWeight: 600 }}>  ← Issue here</span>
            {'\n    '}
            <span className="code-function" style={{ color: '#60A5FA', fontWeight: 700 }}>print</span>{'(numbers[i])'}
          </pre>
        </div>
        <div className="ide-preview-output">
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, letterSpacing: '0.05em', marginBottom: 8 }}>OUTPUT CONSOLE</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#E2E8F0', lineHeight: 1.8 }}>
            10{'\n'}20{'\n'}30{'\n'}40{'\n'}50
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: '#FEF2F2',
            fontWeight: 700,
            marginTop: 10,
            padding: '8px 10px',
            background: 'rgba(239, 68, 68, 0.25)',
            borderRadius: 6,
            border: '2px solid #EF4444',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <AlertTriangle size={14} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>IndexError: list index out of range</span>
          </div>
        </div>
      </div>
      <div className="ide-preview-ai">
        <div className="ide-preview-ai-header">
          <div className="status-dot" style={{ background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#38BDF8' }}>CodeMind Socratic Tutor</span>
          <span style={{ fontSize: '0.7rem', background: '#0284C7', color: '#FFFFFF', padding: '1px 6px', borderRadius: 4, fontWeight: 700, marginLeft: 'auto' }}>AI GUIDE</span>
        </div>
        <div className="ide-preview-ai-msg">
          💬 &quot;How many elements are inside your array? Look at the range bound vs the maximum valid index.&quot;
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
        ].map((s) => (
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
