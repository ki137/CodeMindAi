import { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play, RotateCcw, ChevronDown, FileCode, Folder,
  AlertTriangle, CheckCircle, Loader2,
  Sparkles, Bug, ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compilerService } from '../services/compilerService';
import { misconceptionService } from '../services/misconceptionService';
import { AITutorPanel } from '../components/AITutor/AITutorPanel';
import { ErrorAnalysisPanel } from '../components/Misconception/ErrorAnalysisPanel';
import { MasteryUpdateBanner } from '../components/UI/MasteryUpdateBanner';
import { INDEX_BOUNDARY_SCRIPT } from '../services/socraticScriptService';
import './IDE.css';

const DEFAULT_CODE = `numbers = [10, 20, 30, 40, 50]

for i in range(6):
    print(numbers[i])`;

const FILE_CONTENTS = {
  'main.py': DEFAULT_CODE,
  'arrays.py': `# Working with array indices safely
data = ["alpha", "beta", "gamma", "delta"]

# Iterating safely using len()
for i in range(len(data)):
    print(f"Index {i}: {data[i]}")`,
  'loops.py': `# Loop boundary demonstration
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in range(len(matrix)):
    for col in range(len(matrix[row])):
        print(matrix[row][col], end=" ")
    print()`,
  'practice.py': `# Practice: Calculate the sum of elements
scores = [88, 92, 79, 95, 100]
total = 0

for i in range(len(scores)):
    total += scores[i]

print("Total sum:", total)`,
};

const files = [
  { name: 'main.py', icon: FileCode, active: true },
  { name: 'arrays.py', icon: FileCode },
  { name: 'loops.py', icon: FileCode },
  { name: 'practice.py', icon: FileCode },
];

const languages = [
  { id: 'python', label: 'Python 3.11', flag: '🐍' },
  { id: 'javascript', label: 'JavaScript ES2024', flag: '🟨' },
  { id: 'java', label: 'Java 21', flag: '☕' },
  { id: 'cpp', label: 'C++ 17', flag: '⚙️' },
];

export function IDEPage() {
  const { state, dispatch, addToast } = useApp();
  const [code, setCode] = useState(() => (state.demoMode ? DEFAULT_CODE : state.currentCode || DEFAULT_CODE));
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [activeFile, setActiveFile] = useState('main.py');
  const [outputTab, setOutputTab] = useState('output'); // output | tests | analysis
  const outputRef = useRef(null);
  const prevDemoRef = useRef(state.demoMode);

  const {
    executionState, executionResult, currentMisconception,
    aiTutorOpen, errorHistory, masteryUpdate, conversation
  } = state;

  // Sync editor code to context
  useEffect(() => {
    dispatch({ type: 'SET_CODE', payload: code });
  }, [code, dispatch]);

  // Sync external code updates (e.g. from Socratic AI tutor option fixes) into editor
  useEffect(() => {
    if (state.currentCode && state.currentCode !== code) {
      setCode(state.currentCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentCode]);

  // Load demo code when demo mode toggles on
  useEffect(() => {
    if (state.demoMode && !prevDemoRef.current) {
      setCode(DEFAULT_CODE);
      setActiveFile('main.py');
    }
    prevDemoRef.current = state.demoMode;
  }, [state.demoMode]);

  const handleRun = useCallback(async () => {
    dispatch({ type: 'SET_EXECUTION_STATE', payload: 'running' });
    dispatch({ type: 'SET_EXECUTION_RESULT', payload: null });

    try {
      const result = await compilerService.runCode(code, selectedLang.id);
      dispatch({ type: 'SET_EXECUTION_RESULT', payload: result });

      if (result.error) {
        dispatch({ type: 'ADD_ERROR', payload: result.error });
        dispatch({ type: 'SET_EXECUTION_STATE', payload: 'error' });
        setOutputTab('output');

        const isIndexBoundaryError = result.error.includes('IndexError') || result.error.includes('out of range');

        if (isIndexBoundaryError) {
          dispatch({ type: 'SET_EXECUTION_STATE', payload: 'analyzing' });
          dispatch({ type: 'SET_MISCONCEPTION_DETECTING', payload: true });

          setTimeout(async () => {
            const analysis = await misconceptionService.analyzeError(
              [...errorHistory, result.error],
              [code]
            );
            dispatch({ type: 'SET_MISCONCEPTION_DETECTING', payload: false });
            dispatch({ type: 'SET_EXECUTION_STATE', payload: 'error' });

            const detectedMisconception = {
              ...analysis,
              detected: true,
              misconception: 'Array Index Boundaries',
              concept: 'Array Index Boundaries',
              confidence: Math.max(analysis.confidence || 84, 84),
              confidenceLabel: 'Medium–High',
            };
            dispatch({ type: 'SET_MISCONCEPTION', payload: detectedMisconception });

            // Automatically open the Socratic AI Tutor panel
            dispatch({ type: 'OPEN_AI_TUTOR' });

            // Initialize the Socratic conversation script if not already started
            if (conversation.length === 0 || conversation[0]?.stepId !== 'intro') {
              dispatch({
                type: 'ADD_MESSAGE',
                payload: {
                  role: 'ai',
                  stepId: INDEX_BOUNDARY_SCRIPT.intro.id,
                  message: INDEX_BOUNDARY_SCRIPT.intro.message,
                  options: INDEX_BOUNDARY_SCRIPT.intro.options,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  mode: 'socratic',
                },
              });
            }

            addToast({
              type: 'warning',
              title: 'Misconception Detected: Array Index Boundaries',
              message: 'CodeMind AI Tutor opened to guide you step-by-step.',
            });
          }, 350);
        } else if (errorHistory.length >= 2) {
          dispatch({ type: 'SET_EXECUTION_STATE', payload: 'analyzing' });
          dispatch({ type: 'SET_MISCONCEPTION_DETECTING', payload: true });

          setTimeout(async () => {
            const analysis = await misconceptionService.analyzeError(
              [...errorHistory, result.error],
              [code]
            );
            dispatch({ type: 'SET_MISCONCEPTION_DETECTING', payload: false });
            dispatch({ type: 'SET_EXECUTION_STATE', payload: 'error' });

            if (analysis.detected) {
              dispatch({ type: 'SET_MISCONCEPTION', payload: analysis });
              setOutputTab('analysis');
              addToast({
                type: 'warning',
                title: 'Misconception Detected',
                message: `Possible: ${analysis.misconception} (${analysis.confidence}% confidence)`,
              });
            }
          }, 400);
        } else {
          addToast({ type: 'warning', title: 'Error Detected', message: result.error });
        }
      } else {
        dispatch({ type: 'SET_EXECUTION_STATE', payload: 'success' });
        if (currentMisconception && currentMisconception.status !== 'resolved') {
          dispatch({
            type: 'UPDATE_CONCEPT_MASTERY',
            payload: { id: 'index-boundaries', delta: 25 },
          });
          setTimeout(() => dispatch({ type: 'CLEAR_MASTERY_UPDATE' }), 4000);
          addToast({ type: 'success', title: '🎉 Execution Passed!', message: 'Array Index Boundaries mastery increased!' });
        } else {
          addToast({ type: 'success', title: 'Execution Successful', message: `Completed in ${result.executionTime}` });
        }
      }
    } catch {
      dispatch({ type: 'SET_EXECUTION_STATE', payload: 'error' });
      dispatch({ type: 'SET_EXECUTION_RESULT', payload: { error: 'Execution failed. Please try again.' } });
    }

    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [code, selectedLang, dispatch, addToast, errorHistory, masteryUpdate, conversation, currentMisconception]);

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    dispatch({ type: 'SET_EXECUTION_STATE', payload: 'idle' });
    dispatch({ type: 'SET_EXECUTION_RESULT', payload: null });
    dispatch({ type: 'CLEAR_ERRORS' });
    dispatch({ type: 'SET_MISCONCEPTION', payload: null });
    addToast({ type: 'info', message: 'Editor reset to default code.' });
  };

  const handleFileChange = (fileName) => {
    setActiveFile(fileName);
    if (FILE_CONTENTS[fileName]) {
      setCode(FILE_CONTENTS[fileName]);
    }
  };

  const stateConfig = {
    idle: { label: 'Ready', color: 'gray', icon: null },
    running: { label: 'Running...', color: 'teal', icon: Loader2 },
    analyzing: { label: 'Analyzing Behavior...', color: 'yellow', icon: Loader2 },
    success: { label: 'Passed', color: 'teal', icon: CheckCircle },
    error: { label: 'Error Detected', color: 'orange', icon: AlertTriangle },
  };
  const sc = stateConfig[executionState] || stateConfig.idle;

  return (
    <div className="ide-page">
      {/* Secondary IDE Bar */}
      <div className="ide-topbar">
        <div className="ide-topbar-left">
          {/* Language Selector */}
          <div className="lang-selector-wrapper">
            <button
              className="lang-selector"
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Select language"
            >
              <span>{selectedLang.flag}</span>
              <span>{selectedLang.label}</span>
              <ChevronDown size={13} />
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {languages.map(l => (
                  <button
                    key={l.id}
                    className={`lang-option ${selectedLang.id === l.id ? 'active' : ''}`}
                    onClick={() => { setSelectedLang(l); setLangOpen(false); }}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="ide-topbar-sep" />

          {/* File indicator */}
          <div className="file-indicator">
            <FileCode size={13} color="var(--teal)" />
            <span>{activeFile}</span>
          </div>

          {/* Execution status */}
          <div className={`exec-status exec-status-${sc.color}`}>
            {sc.icon && <sc.icon size={12} className={executionState === 'running' || executionState === 'analyzing' ? 'animate-spin' : ''} />}
            {sc.label}
          </div>
        </div>

        <div className="ide-topbar-right">
          <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset code">
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch({ type: aiTutorOpen ? 'TOGGLE_AI_TUTOR' : 'OPEN_AI_TUTOR' })}
            title="Toggle AI Tutor"
            style={{ color: aiTutorOpen ? 'var(--teal)' : undefined }}
          >
            <Sparkles size={14} />
            AI Tutor
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleRun}
            disabled={executionState === 'running' || executionState === 'analyzing'}
            id="run-btn"
          >
            {executionState === 'running' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            {executionState === 'running' ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Main IDE Layout */}
      <div className={`ide-layout ${aiTutorOpen ? 'ide-layout-split' : ''}`}>
        {/* Left: File Explorer */}
        <div className="ide-explorer">
          <div className="explorer-header">
            <Folder size={13} color="var(--text-faint)" />
            <span>EXPLORER</span>
          </div>
          <div className="explorer-files">
            {files.map(f => (
              <button
                key={f.name}
                className={`explorer-file ${activeFile === f.name ? 'active' : ''}`}
                onClick={() => handleFileChange(f.name)}
              >
                <f.icon size={13} />
                <span>{f.name}</span>
              </button>
            ))}
          </div>
          <div className="explorer-section-label">CONCEPTS</div>
          <div className="explorer-files">
            {['Index Boundaries', 'Array Access', 'Loop Range'].map(c => (
              <div key={c} className="explorer-concept">
                <Bug size={11} />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Editor + Output */}
        <div className="ide-center">
          {/* Code Editor */}
          <div className="code-editor-wrapper">
            <div className="editor-topbar">
              <span className="editor-filename">{activeFile}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>DEMO</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Ctrl+Enter to run</span>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="editor-body editor-body-monaco">
              <Editor
                height="100%"
                defaultLanguage={selectedLang.id === 'cpp' ? 'cpp' : selectedLang.id === 'java' ? 'java' : selectedLang.id === 'javascript' ? 'javascript' : 'python'}
                language={selectedLang.id === 'cpp' ? 'cpp' : selectedLang.id === 'java' ? 'java' : selectedLang.id === 'javascript' ? 'javascript' : 'python'}
                value={code}
                theme="vs-dark"
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 4,
                  insertSpaces: true,
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                  lineHeight: 22,
                  renderLineHighlight: 'all',
                  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  bracketPairColorization: { enabled: true },
                  folding: true,
                  foldingHighlight: true,
                  glyphMargin: false,
                  overviewRulerLanes: 0,
                }}
                onMount={(editor, monaco) => {
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                    handleRun();
                  });
                  // Highlight error line if present
                  if (executionResult?.errorLine) {
                    editor.deltaDecorations([], [{
                      range: new monaco.Range(executionResult.errorLine, 1, executionResult.errorLine, 1),
                      options: { isWholeLine: true, className: 'monaco-error-line' }
                    }]);
                  }
                }}
                aria-label="Code editor"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="output-panel" ref={outputRef}>
            <div className="output-tabs">
              <button
                className={`output-tab ${outputTab === 'output' ? 'active' : ''}`}
                onClick={() => setOutputTab('output')}
              >
                <Play size={12} /> Output
              </button>
              <button
                className={`output-tab ${outputTab === 'tests' ? 'active' : ''}`}
                onClick={() => setOutputTab('tests')}
              >
                <ClipboardList size={12} /> Tests
              </button>
              <button
                className={`output-tab ${outputTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setOutputTab('analysis')}
                style={currentMisconception ? { color: 'var(--orange)' } : {}}
              >
                <AlertTriangle size={12} />
                Analysis
                {currentMisconception && <span className="tab-dot" />}
              </button>
            </div>

            <div className="output-content">
              {outputTab === 'output' && <OutputView result={executionResult} state={executionState} />}
              {outputTab === 'tests' && <TestCasesView code={code} />}
              {outputTab === 'analysis' && (
                <ErrorAnalysisPanel
                  misconception={currentMisconception}
                  detecting={state.misconceptionDetecting}
                  onAskTutor={() => dispatch({ type: 'OPEN_AI_TUTOR' })}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Tutor */}
        {aiTutorOpen && (
          <div className="ide-ai-panel">
            <AITutorPanel onClose={() => dispatch({ type: 'TOGGLE_AI_TUTOR' })} />
          </div>
        )}
      </div>

      {/* Mastery Update Banner */}
      {masteryUpdate && <MasteryUpdateBanner update={masteryUpdate} />}
    </div>
  );
}

/* ─── Output View ─── */
function OutputView({ result, state: execState }) {
  if (execState === 'idle') {
    return (
      <div className="output-empty">
        <Play size={24} color="var(--text-faint)" />
        <p>Click <strong>Run Code</strong> or press <kbd>Ctrl+Enter</kbd> to execute.</p>
      </div>
    );
  }

  if (execState === 'running') {
    return (
      <div className="output-running">
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 12 }}>
          <Loader2 size={16} color="var(--teal)" className="animate-spin" />
          <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.875rem' }}>Executing code...</span>
        </div>
        <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '50%' }} />
      </div>
    );
  }

  if (execState === 'analyzing') {
    return (
      <div className="output-analyzing">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <Loader2 size={16} color="var(--yellow-dark, #c9a800)" className="animate-spin" />
          <span style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.875rem' }}>Analyzing coding behavior...</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['Scanning error patterns...', 'Comparing with previous attempts...', 'Checking for misconception signals...'].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', animationDelay: `${i * 0.3}s` }} className="animate-fadeIn">
              <div className="thinking-dot" style={{ animationDelay: `${i * 0.2}s` }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="output-result">
      {result.output && (
        <div className="output-section">
          <div className="output-section-label">
            <CheckCircle size={12} color="var(--teal)" /> STDOUT
            <span className="output-time">{result.executionTime}</span>
          </div>
          <pre className="output-text">{result.output}</pre>
        </div>
      )}
      {result.error && (
        <div className="output-section output-error-section">
          <div className="output-section-label" style={{ color: 'var(--orange)' }}>
            <AlertTriangle size={12} /> STDERR
          </div>
          <pre className="output-error-text">{result.error}</pre>
          <div className="error-hint">
            💡 See the <strong>Analysis</strong> tab for insights about this error.
          </div>
        </div>
      )}
      {execState === 'success' && !result.error && (
        <div className="output-success-banner">
          <CheckCircle size={16} color="var(--teal)" />
          All output generated successfully. No errors detected.
        </div>
      )}
    </div>
  );
}

/* ─── Test Cases View ─── */
function TestCasesView({ code }) {
  const tests = [
    { id: 1, desc: 'Prints first element (index 0)', expected: '10', status: 'pass' },
    { id: 2, desc: 'Prints all 5 elements', expected: '10 20 30 40 50', status: 'pass' },
    { id: 3, desc: 'No IndexError on last element', expected: 'No Error', status: 'pass' },
    { id: 4, desc: 'Handles index boundary correctly', expected: 'index ≤ 4', status: code.includes('range(6)') ? 'fail' : 'pass' },
    { id: 5, desc: 'Works with len() based range', expected: 'range(len(...))', status: code.includes('len(') ? 'pass' : 'fail' },
  ];
  const passed = tests.filter(t => t.status === 'pass').length;

  return (
    <div className="tests-view">
      <div className="tests-summary">
        <span className="tests-score" style={{ color: passed === tests.length ? 'var(--teal)' : 'var(--orange)' }}>
          {passed}/{tests.length} Passed
        </span>
        <div className="progress-bar" style={{ height: 6, flex: 1, maxWidth: 200 }}>
          <div
            className="progress-fill"
            style={{
              width: `${(passed / tests.length) * 100}%`,
              background: passed === tests.length ? 'var(--teal)' : 'var(--orange)',
            }}
          />
        </div>
      </div>
      <div className="tests-list">
        {tests.map(t => (
          <div key={t.id} className={`test-item test-item-${t.status}`}>
            <div className={`test-status-dot ${t.status}`} />
            <div className="test-info">
              <span className="test-desc">{t.desc}</span>
              <span className="test-expected">Expected: <code>{t.expected}</code></span>
            </div>
            <span className={`badge ${t.status === 'pass' ? 'badge-teal' : 'badge-orange'}`}>
              {t.status === 'pass' ? '✓ Pass' : '✗ Fail'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
