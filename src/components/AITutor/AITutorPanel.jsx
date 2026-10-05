import { useState, useRef, useEffect } from 'react';
import {
  Brain, X, Send, Sparkles, Lightbulb, BookOpen,
  Target, HelpCircle, ChevronRight, CheckCircle2,
  ArrowRight, Zap, Check, RotateCcw, Trophy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiTutorService } from '../../services/aiTutorService';
import { INDEX_BOUNDARY_SCRIPT, HINTS } from '../../services/socraticScriptService';
import './AITutorPanel.css';

const MODES = [
  { id: 'socratic', label: 'Guide Me', icon: Brain, desc: 'Socratic questions & hints' },
  { id: 'explain', label: 'Explain Concept', icon: BookOpen, desc: 'Clear concept explanation' },
  { id: 'hint', label: 'Give Hint', icon: Lightbulb, desc: 'One progressive hint' },
  { id: 'challenge', label: 'Challenge Me', icon: Target, desc: 'Related micro-problem' },
  { id: 'review', label: 'Review Thinking', icon: HelpCircle, desc: 'Analyze your reasoning' },
];

function renderMessage(text) {
  if (!text) return null;

  // Split by code blocks ```...``` first
  const blocks = text.split(/(```[\s\S]*?```)/g);

  return blocks.map((block, bIdx) => {
    if (block.startsWith('```') && block.endsWith('```')) {
      const lines = block.slice(3, -3).replace(/^(python|py)\n/, '');
      return (
        <pre
          key={bIdx}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            background: '#0C0F17',
            color: '#FFFFFF',
            padding: '8px 12px',
            borderRadius: 6,
            border: '2px solid #000000',
            margin: '8px 0',
            overflowX: 'auto',
            lineHeight: 1.5,
          }}
        >
          {lines}
        </pre>
      );
    }

    return (
      <span key={bIdx}>
        {block.split('\n').map((line, i) => {
          const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
          return (
            <span key={i}>
              {parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code
                      key={j}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(6,148,148,0.15)',
                        border: '1px solid rgba(0,0,0,0.15)',
                        padding: '1px 5px',
                        borderRadius: 4,
                        fontSize: '0.88em',
                        color: '#000000',
                        fontWeight: 700,
                      }}
                    >
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return part;
              })}
              {i < block.split('\n').length - 1 && <br />}
            </span>
          );
        })}
      </span>
    );
  });
}

export function AITutorPanel({ onClose }) {
  const { state, dispatch, addToast } = useApp();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('socratic');
  const [modeOpen, setModeOpen] = useState(false);
  const [thinkingInput, setThinkingInput] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [thinkingResult, setThinkingResult] = useState(null);
  const [analyzingThinking, setAnalyzingThinking] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const messagesEndRef = useRef(null);

  const { conversation, aiThinking, currentMisconception } = state;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, aiThinking]);

  // Initialize Socratic flow if empty or if new misconception
  useEffect(() => {
    if (conversation.length === 0) {
      const scriptStart = INDEX_BOUNDARY_SCRIPT.intro;
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'ai',
          stepId: scriptStart.id,
          message: scriptStart.message,
          options: scriptStart.options,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          mode: 'socratic',
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectOption = (option) => {
    if (aiThinking) return;

    // 1. Add student message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'student',
        message: option.label,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    });

    // 2. Execute any linked IDE action
    if (option.action === 'apply_fix_len') {
      const fixedCode = `numbers = [10, 20, 30, 40, 50]\n\nfor i in range(len(numbers)):\n    print(numbers[i])`;
      dispatch({ type: 'SET_CODE', payload: fixedCode });
      addToast({ type: 'success', title: 'Applied Fix', message: 'for i in range(len(numbers))' });
    } else if (option.action === 'apply_fix_5') {
      const fixedCode = `numbers = [10, 20, 30, 40, 50]\n\nfor i in range(5):\n    print(numbers[i])`;
      dispatch({ type: 'SET_CODE', payload: fixedCode });
      addToast({ type: 'success', title: 'Applied Fix', message: 'for i in range(5)' });
    }

    // 3. Progress to next step in Socratic script
    if (option.nextStep && INDEX_BOUNDARY_SCRIPT[option.nextStep]) {
      const nextStepData = INDEX_BOUNDARY_SCRIPT[option.nextStep];
      dispatch({ type: 'SET_AI_THINKING', payload: true });

      setTimeout(() => {
        dispatch({ type: 'SET_AI_THINKING', payload: false });
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            role: 'ai',
            stepId: nextStepData.id,
            message: nextStepData.message,
            options: nextStepData.options,
            card: nextStepData.card,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            mode: 'socratic',
          },
        });

        // Trigger concept mastery updates if a milestone card is reached
        if (nextStepData.card?.type === 'concept_card') {
          dispatch({
            type: 'UPDATE_CONCEPT_MASTERY',
            payload: { id: 'index-boundaries', delta: 25 },
          });
          addToast({
            type: 'success',
            title: 'Concept Understood! 🎉',
            message: 'Array Index Boundaries mastery +25%',
          });
        }

        if (nextStepData.card?.type === 'mastery_card') {
          dispatch({
            type: 'UPDATE_CONCEPT_MASTERY',
            payload: { id: 'index-boundaries', delta: 25 },
          });
          if (currentMisconception) {
            dispatch({
              type: 'SET_MISCONCEPTION',
              payload: { ...currentMisconception, status: 'resolved' },
            });
          }
          addToast({
            type: 'success',
            title: '🏆 Misconception Mastered!',
            message: 'Array Index Boundaries marked as UNDERSTOOD (+50 XP)',
          });
        }
      }, 500);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || aiThinking) return;
    const userMsg = input.trim();
    const lower = userMsg.toLowerCase();
    setInput('');

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'student',
        message: userMsg,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    });

    dispatch({ type: 'SET_AI_THINKING', payload: true });

    // Find the latest AI message stepId to respond contextually
    const lastAiMsg = [...conversation].reverse().find(m => m.role === 'ai');
    const currentStepId = lastAiMsg?.stepId || 'intro';

    setTimeout(() => {
      dispatch({ type: 'SET_AI_THINKING', payload: false });

      // Intelligent mapping of freeform typed responses to script steps
      let targetStep = null;

      if (currentStepId === 'intro') {
        targetStep = 'q1_apples';
      } else if (currentStepId === 'q1_apples') {
        if (lower.includes('b') || lower.includes('0') || lower.includes('0, 1, 2, 3, 4') || lower.includes('0 1 2 3 4')) {
          targetStep = 'q1_B';
        } else if (lower.includes('a') || lower.includes('1, 2, 3, 4, 5')) {
          targetStep = 'q1_A';
        } else {
          targetStep = 'q1_C';
        }
      } else if (currentStepId === 'q1_A') {
        targetStep = lower.includes('1') ? 'q1_A_cont' : 'q1_A_cont';
      } else if (currentStepId === 'q1_A_cont') {
        targetStep = 'q1_A_final';
      } else if (currentStepId === 'q1_A_final' || currentStepId === 'q1_B' || currentStepId === 'q1_C_cont') {
        targetStep = 'q2_code_count';
      } else if (currentStepId === 'q2_code_count') {
        if (lower.includes('5') || lower.includes('five')) {
          targetStep = 'q2_first_pos';
        } else {
          targetStep = 'q2_count_retry';
        }
      } else if (currentStepId === 'q2_first_pos') {
        if (lower.includes('0') || lower.includes('zero')) {
          targetStep = 'q2_last_pos';
        } else {
          targetStep = 'q2_first_retry';
        }
      } else if (currentStepId === 'q2_last_pos') {
        if (lower.includes('4') || lower.includes('four')) {
          targetStep = 'q3_loop';
        } else {
          targetStep = 'q2_last_retry';
        }
      } else if (currentStepId === 'q3_loop') {
        if (lower.includes('b') || lower.includes('cannot') || lower.includes('not exist') || lower.includes('doesn\'t exist')) {
          targetStep = 'q3_correct';
        } else {
          targetStep = 'q3_wrong';
        }
      } else if (currentStepId === 'q3_correct' || currentStepId === 'q3_wrong') {
        targetStep = 'q4_fix';
      } else if (currentStepId === 'q4_fix') {
        if (lower.includes('len') || lower.includes('range(len')) {
          const fixedCode = `numbers = [10, 20, 30, 40, 50]\n\nfor i in range(len(numbers)):\n    print(numbers[i])`;
          dispatch({ type: 'SET_CODE', payload: fixedCode });
          targetStep = 'fix_complete';
        } else if (lower.includes('5') || lower.includes('range(5)')) {
          const fixedCode = `numbers = [10, 20, 30, 40, 50]\n\nfor i in range(5):\n    print(numbers[i])`;
          dispatch({ type: 'SET_CODE', payload: fixedCode });
          targetStep = 'fix_complete';
        } else {
          targetStep = 'q4_fix';
        }
      } else if (currentStepId === 'fix_complete') {
        targetStep = 'mc1';
      } else if (currentStepId === 'mc1') {
        if (lower.includes('b') || lower.includes('0, 1, 2, 3') || lower.includes('0 1 2 3')) {
          targetStep = 'mc1_correct';
        } else {
          targetStep = 'mc1_wrong';
        }
      } else if (currentStepId === 'mc1_correct' || currentStepId === 'mc1_wrong') {
        targetStep = 'mc2';
      } else if (currentStepId === 'mc2') {
        if (lower.includes('b') || lower.includes('not exist') || lower.includes('doesn\'t exist')) {
          targetStep = 'mc2_why';
        } else {
          targetStep = 'mc2_wrong';
        }
      } else if (currentStepId === 'mc2_why' || currentStepId === 'mc2_wrong') {
        targetStep = 'mc2_correct';
      } else if (currentStepId === 'mc2_correct' || currentStepId === 'mc2_why_clarify') {
        targetStep = 'mc3';
      } else if (currentStepId === 'mc3') {
        targetStep = 'mastered';
      }

      if (targetStep && INDEX_BOUNDARY_SCRIPT[targetStep]) {
        const stepData = INDEX_BOUNDARY_SCRIPT[targetStep];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            role: 'ai',
            stepId: stepData.id,
            message: stepData.message,
            options: stepData.options,
            card: stepData.card,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            mode: 'socratic',
          },
        });

        if (stepData.card?.type === 'concept_card') {
          dispatch({
            type: 'UPDATE_CONCEPT_MASTERY',
            payload: { id: 'index-boundaries', delta: 25 },
          });
        }
        if (stepData.card?.type === 'mastery_card') {
          dispatch({
            type: 'UPDATE_CONCEPT_MASTERY',
            payload: { id: 'index-boundaries', delta: 25 },
          });
        }
      } else {
        // Fallback friendly socratic reply
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            role: 'ai',
            message: `That's a thoughtful question! Let's connect it back to the loop: in a 5-element list \`numbers = [10, 20, 30, 40, 50]\`, what is the highest valid index you can access?`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            mode: 'socratic',
          },
        });
      }
    }, 550);
  };

  const getHint = () => {
    const nextLevel = Math.min(hintLevel + 1, 4);
    setHintLevel(nextLevel);
    dispatch({ type: 'SET_AI_THINKING', payload: true });

    setTimeout(() => {
      dispatch({ type: 'SET_AI_THINKING', payload: false });
      const hint = HINTS[nextLevel - 1];
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'ai',
          message: `💡 **Hint Level ${hint.level}/4:**\n\n${hint.text}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          mode: 'hint',
        },
      });
      if (nextLevel >= 4) {
        addToast({ type: 'info', message: "Maximum hint level reached. Apply the fix in your loop!" });
      }
    }, 450);
  };

  const handleRestartScript = () => {
    const scriptStart = INDEX_BOUNDARY_SCRIPT.intro;
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'ai',
        stepId: scriptStart.id,
        message: scriptStart.message,
        options: scriptStart.options,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mode: 'socratic',
      },
    });
    addToast({ type: 'info', message: 'Socratic dialogue restarted from beginning' });
  };

  const analyzeThinking = async () => {
    if (!thinkingInput.trim()) return;
    setAnalyzingThinking(true);
    try {
      const result = await aiTutorService.analyzeThinking(thinkingInput);
      setThinkingResult(result);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'ai',
          message: `I analyzed your reasoning:\n\n**Concept Understanding:** ${result.conceptUnderstanding}%\n\n${result.feedback}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          mode: 'review',
        },
      });
      setShowThinking(false);
      setThinkingInput('');
    } finally {
      setAnalyzingThinking(false);
    }
  };

  const selectedMode = MODES.find(m => m.id === mode) || MODES[0];

  return (
    <div className="ai-tutor-panel">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-logo" style={{ background: '#069494' }}>
            <Brain size={18} color="white" />
          </div>
          <div>
            <div className="ai-title">CodeMind AI</div>
            <div className="ai-subtitle">Socratic Programming Tutor</div>
          </div>
        </div>
        <div className="ai-header-right">
          <div className="ai-status">
            <span className="status-dot" style={{ background: '#10B981' }} />
            <span>Active Tutor</span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleRestartScript}
            title="Restart Socratic Dialogue"
            style={{ padding: '4px 6px', fontSize: '0.72rem' }}
          >
            <RotateCcw size={12} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close tutor">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="ai-mode-bar">
        <button className="ai-mode-btn" onClick={() => setModeOpen(!modeOpen)}>
          <selectedMode.icon size={13} />
          {selectedMode.label}
          <ChevronRight size={12} style={{ transform: modeOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {modeOpen && (
          <div className="ai-mode-dropdown">
            {MODES.map(m => (
              <button
                key={m.id}
                className={`ai-mode-option ${mode === m.id ? 'active' : ''}`}
                onClick={() => { setMode(m.id); setModeOpen(false); }}
              >
                <m.icon size={14} />
                <div>
                  <div className="ai-mode-option-label">{m.label}</div>
                  <div className="ai-mode-option-desc">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hint Level Bar */}
      {hintLevel > 0 && (
        <div className="hint-level-bar">
          <span className="section-label" style={{ color: '#000000', fontWeight: 900 }}>HINT LEVEL</span>
          <div className="hint-dots">
            {[1, 2, 3, 4].map(l => (
              <div key={l} className={`hint-dot ${l <= hintLevel ? 'active' : ''}`} />
            ))}
          </div>
          <span className="hint-level-label">{hintLevel} / 4</span>
        </div>
      )}

      {/* Messages */}
      <div className="ai-messages">
        {conversation.map((msg, i) => {
          const isLatestAi = msg.role === 'ai' && i === conversation.length - 1;

          return (
            <div
              key={i}
              className={`ai-message ai-message-${msg.role}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {msg.role === 'ai' && (
                <div className="ai-message-avatar" style={{ background: '#069494' }}>
                  <Brain size={14} color="white" />
                </div>
              )}

              <div className={`ai-bubble ai-bubble-${msg.role}`}>
                <div className="ai-bubble-text">{renderMessage(msg.message)}</div>

                {/* Concept Understood Milestone Card */}
                {msg.card?.type === 'concept_card' && (
                  <div className="concept-understood-card">
                    <div className="concept-understood-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={16} />
                        <span className="concept-understood-badge">Concept Understood</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>78% Mastery</span>
                    </div>
                    <div className="concept-understood-body">
                      <div className="concept-understood-title">{msg.card.title}</div>
                      <div className="concept-understood-status-row">
                        <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                        <span className="badge badge-orange" style={{ textDecoration: 'line-through' }}>{msg.card.before}</span>
                        <ArrowRight size={12} />
                        <span className="badge badge-teal">{msg.card.after}</span>
                      </div>
                      <ul className="concept-understood-evidence">
                        {msg.card.evidence.map((ev, evIdx) => (
                          <li key={evIdx}>
                            <Check size={13} color="#069494" style={{ flexShrink: 0 }} />
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Mastered State Card */}
                {msg.card?.type === 'mastery_card' && (
                  <div className="mastery-card">
                    <div className="mastery-card-header" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Trophy size={15} color="#D97706" />
                      <span>{msg.card.title}</span>
                    </div>
                    <div className="mastery-card-body">
                      <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#000000' }}>
                        {msg.card.path}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <span className="badge badge-teal" style={{ background: '#069494', color: '#FFFFFF', fontWeight: 800 }}>
                          ✓ Misconception Resolved
                        </span>
                        <span style={{ fontWeight: 900, color: '#000000', fontSize: '0.9rem' }}>
                          Score: {msg.card.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Socratic Interactive Option Buttons */}
                {isLatestAi && msg.options && msg.options.length > 0 && !aiThinking && (
                  <div className="ai-options-container">
                    {msg.options.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`ai-option-btn ${opt.action ? 'btn-action-fix' : ''}`}
                        onClick={() => handleSelectOption(opt)}
                      >
                        <Zap size={13} color={opt.action ? '#D97706' : '#069494'} style={{ flexShrink: 0 }} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {msg.timestamp && <div className="ai-bubble-time">{msg.timestamp}</div>}
              </div>

              {msg.role === 'student' && (
                <div className="student-avatar" style={{ background: '#FF8243' }}>A</div>
              )}
            </div>
          );
        })}

        {aiThinking && (
          <div className="ai-message ai-message-ai">
            <div className="ai-message-avatar" style={{ background: '#069494' }}>
              <Brain size={14} color="white" />
            </div>
            <div className="ai-bubble ai-bubble-ai">
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 0' }}>
                <div className="thinking-dot" />
                <div className="thinking-dot" />
                <div className="thinking-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Thinking Input */}
      {showThinking ? (
        <div className="thinking-input-area">
          <div className="thinking-label">
            <Sparkles size={13} color="var(--teal)" />
            Explain Your Thinking
          </div>
          <textarea
            className="input"
            placeholder="I think the loop is wrong because..."
            value={thinkingInput}
            onChange={e => setThinkingInput(e.target.value)}
            style={{ minHeight: 80, fontSize: '0.875rem' }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={analyzeThinking} disabled={analyzingThinking}>
              {analyzingThinking ? 'Analyzing...' : 'Analyze My Thinking'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowThinking(false)}>Cancel</button>
          </div>
          {thinkingResult && (
            <div className="thinking-result">
              <div className="thinking-result-row">
                <span>Concept Understanding</span>
                <span style={{ color: 'var(--teal)', fontWeight: 700 }}>{thinkingResult.conceptUnderstanding}%</span>
              </div>
              {thinkingResult.possibleMisconception && (
                <div className="thinking-result-row">
                  <span>Possible Misconception</span>
                  <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{thinkingResult.possibleMisconception}</span>
                </div>
              )}
              <div className="thinking-result-row">
                <span>Confidence</span>
                <span className={`badge badge-${thinkingResult.confidence === 'Low' ? 'orange' : 'teal'}`}>
                  {thinkingResult.confidence}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Input Area */
        <div className="ai-input-area">
          <div className="ai-input-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setShowThinking(true)} title="Explain your thinking">
              <Sparkles size={13} />
              My Thinking
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={getHint}
              disabled={hintLevel >= 4 || aiThinking}
              title="Get a progressive hint"
            >
              <Lightbulb size={13} />
              {hintLevel >= 4 ? 'Level 4/4 Hint Given' : 'Need a Hint?'}
            </button>
          </div>
          <div className="ai-input-row">
            <textarea
              className="ai-input-field"
              placeholder="Reply to CodeMind AI or select an option above..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={aiThinking}
              rows={2}
              aria-label="Chat input"
              id="ai-chat-input"
            />
            <button
              className="ai-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || aiThinking}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="ai-input-hint">Press Enter to send · Shift+Enter for new line</div>
        </div>
      )}
    </div>
  );
}
