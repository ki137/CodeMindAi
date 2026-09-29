import { useState, useRef, useEffect } from 'react';
import {
  Brain, X, Send, Sparkles, Lightbulb, BookOpen,
  Target, HelpCircle, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiTutorService } from '../../services/aiTutorService';
import './AITutorPanel.css';

const MODES = [
  { id: 'socratic', label: 'Guide Me', icon: Brain, desc: 'Socratic questions & hints' },
  { id: 'explain', label: 'Explain Concept', icon: BookOpen, desc: 'Clear concept explanation' },
  { id: 'hint', label: 'Give Hint', icon: Lightbulb, desc: 'One progressive hint' },
  { id: 'challenge', label: 'Challenge Me', icon: Target, desc: 'Related micro-problem' },
  { id: 'review', label: 'Review Thinking', icon: HelpCircle, desc: 'Analyze your reasoning' },
];

function renderMessage(text) {
  // Simple markdown-like rendering: **bold**, `code`, \n as line breaks
  return text
    .split('\n')
    .map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={j} style={{ fontFamily: 'var(--font-mono)', background: 'rgba(6,148,148,0.12)', padding: '1px 5px', borderRadius: 4, fontSize: '0.85em' }}>{part.slice(1, -1)}</code>;
            }
            return part;
          })}
          {i < text.split('\n').length - 1 && <br />}
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

  // Add initial greeting if no conversation
  useEffect(() => {
    if (conversation.length === 0 && currentMisconception) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'ai',
          message: "I noticed something interesting in your loop. How many elements are inside your `numbers` array?",
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          mode: 'socratic',
        },
      });
    } else if (conversation.length === 0) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'ai',
          message: "Hello! I'm your Socratic AI tutor. Run your code and I'll help you understand any errors through guided questions — not by giving you the answer directly. 💡",
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          mode: 'socratic',
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || state.aiThinking) return;
    const userMsg = input.trim();
    setInput('');

    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'student', message: userMsg, timestamp: new Date().toLocaleTimeString() } });
    dispatch({ type: 'SET_AI_THINKING', payload: true });

    try {
      const response = await aiTutorService.sendMessage(userMsg, mode, { misconception: currentMisconception });
      dispatch({ type: 'ADD_MESSAGE', payload: response });
    } catch {
      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'ai', message: 'Let me think about that differently. What part of the error message stands out to you?', timestamp: new Date().toLocaleTimeString() } });
    } finally {
      dispatch({ type: 'SET_AI_THINKING', payload: false });
    }
  };

  const getHint = async () => {
    const nextLevel = hintLevel + 1;
    setHintLevel(nextLevel);
    dispatch({ type: 'SET_AI_THINKING', payload: true });

    try {
      const response = await aiTutorService.getHint(nextLevel);
      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'ai', message: `**Hint ${nextLevel}/4:** ${response.hint}`, timestamp: new Date().toLocaleTimeString(), mode: 'hint' } });
      if (nextLevel >= 4) {
        addToast({ type: 'info', message: "You've reached the maximum hint level. Try to apply what you've learned!" });
      }
    } finally {
      dispatch({ type: 'SET_AI_THINKING', payload: false });
    }
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
          timestamp: new Date().toLocaleTimeString(),
          mode: 'review',
        },
      });
      setShowThinking(false);
      setThinkingInput('');
    } finally {
      setAnalyzingThinking(false);
    }
  };

  const selectedMode = MODES.find(m => m.id === mode);

  return (
    <div className="ai-tutor-panel">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-logo">
            <Brain size={16} color="white" />
          </div>
          <div>
            <div className="ai-title">CodeMind AI</div>
            <div className="ai-subtitle">Socratic Tutor</div>
          </div>
        </div>
        <div className="ai-header-right">
          <div className="ai-status">
            <span className="status-dot" />
            <span>Learning with you</span>
          </div>
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
          <span className="section-label">HINT LEVEL</span>
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
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`ai-message ai-message-${msg.role}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {msg.role === 'ai' && (
              <div className="ai-message-avatar">
                <Brain size={12} color="white" />
              </div>
            )}
            <div className={`ai-bubble ai-bubble-${msg.role}`}>
              <div className="ai-bubble-text">{renderMessage(msg.message)}</div>
              {msg.timestamp && <div className="ai-bubble-time">{msg.timestamp}</div>}
            </div>
            {msg.role === 'student' && (
              <div className="student-avatar">A</div>
            )}
          </div>
        ))}

        {aiThinking && (
          <div className="ai-message ai-message-ai">
            <div className="ai-message-avatar">
              <Brain size={12} color="white" />
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
              {hintLevel >= 4 ? 'No more hints' : 'Need a Hint?'}
            </button>
          </div>
          <div className="ai-input-row">
            <textarea
              className="ai-input-field"
              placeholder="Reply to CodeMind AI..."
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
