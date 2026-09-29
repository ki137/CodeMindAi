import { createContext, useContext, useReducer, useCallback } from 'react';
import { mockStudent, mockConcepts, mockMisconceptions, mockChallenges } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  // Student
  student: mockStudent,
  concepts: mockConcepts,
  misconceptions: mockMisconceptions,
  challenges: mockChallenges,

  // IDE State
  currentCode: `numbers = [10, 20, 30, 40, 50]\n\nfor i in range(6):\n    print(numbers[i])`,
  currentLanguage: 'python',
  executionState: 'idle', // idle | running | analyzing | success | error
  executionResult: null,
  errorHistory: [],
  codeHistory: [],

  // Misconception
  currentMisconception: null,
  misconceptionDetecting: false,

  // AI Tutor
  aiTutorOpen: false,
  aiMode: 'socratic',
  conversation: [],
  aiThinking: false,
  hintLevel: 0,

  // Demo
  demoMode: false,
  demoStep: 0,

  // UI
  toasts: [],
  activeRoute: '/',

  // Mastery update animation
  masteryUpdate: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CODE': return { ...state, currentCode: action.payload };
    case 'SET_LANGUAGE': return { ...state, currentLanguage: action.payload };
    case 'SET_EXECUTION_STATE': return { ...state, executionState: action.payload };
    case 'SET_EXECUTION_RESULT': return { ...state, executionResult: action.payload };
    case 'ADD_ERROR': return {
      ...state,
      errorHistory: [...state.errorHistory, action.payload],
      codeHistory: [...state.codeHistory, state.currentCode],
    };
    case 'CLEAR_ERRORS': return { ...state, errorHistory: [], codeHistory: [] };
    case 'SET_MISCONCEPTION': return { ...state, currentMisconception: action.payload };
    case 'SET_MISCONCEPTION_DETECTING': return { ...state, misconceptionDetecting: action.payload };
    case 'TOGGLE_AI_TUTOR': return { ...state, aiTutorOpen: !state.aiTutorOpen };
    case 'OPEN_AI_TUTOR': return { ...state, aiTutorOpen: true };
    case 'SET_AI_MODE': return { ...state, aiMode: action.payload };
    case 'ADD_MESSAGE': return { ...state, conversation: [...state.conversation, action.payload] };
    case 'SET_AI_THINKING': return { ...state, aiThinking: action.payload };
    case 'INCREMENT_HINT': return { ...state, hintLevel: Math.min(state.hintLevel + 1, 4) };
    case 'RESET_HINTS': return { ...state, hintLevel: 0 };
    case 'SET_DEMO_MODE': return { ...state, demoMode: action.payload };
    case 'SET_DEMO_STEP': return { ...state, demoStep: action.payload };
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'UPDATE_CONCEPT_MASTERY': {
      const concepts = state.concepts.map(c =>
        c.id === action.payload.id
          ? { ...c, mastery: Math.min(Math.max(c.mastery + action.payload.delta, 0), 100) }
          : c
      );
      return { ...state, concepts, masteryUpdate: action.payload };
    }
    case 'CLEAR_MASTERY_UPDATE': return { ...state, masteryUpdate: null };
    case 'SET_ACTIVE_ROUTE': return { ...state, activeRoute: action.payload };
    case 'RESET_CONVERSATION': return { ...state, conversation: [], hintLevel: 0 };
    case 'LOAD_DEMO_SCENARIO': return {
      ...state,
      currentCode: `numbers = [10, 20, 30, 40, 50]\n\nfor i in range(6):\n    print(numbers[i])`,
      executionResult: null,
      currentMisconception: null,
      conversation: [],
      hintLevel: 0,
      errorHistory: [],
    };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  const value = { state, dispatch, addToast };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components, react/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
