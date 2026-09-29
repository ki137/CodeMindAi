// Mock student data for CodeMind AI

export const mockStudent = {
  id: 'student-001',
  name: 'Alex',
  email: 'alex@codemind.ai',
  level: 'Intermediate Beginner',
  avatar: null,
  joinedDate: '2026-09-01',
  preferredLanguage: 'Python',
  streak: 7,
  totalXP: 1240,
  weeklyXP: 180,
  masteryScore: 68,
  conceptsMastered: 14,
  conceptsDeveloping: 6,
  misconceptionsResolved: 9,
  totalChallenges: 34,
  totalSessions: 22,
  lastActive: '2026-09-27',
};

export const mockConcepts = [
  { id: 'variables', name: 'Variables', mastery: 92, status: 'mastered', mistakes: 2, lastAttempted: '2026-09-25', category: 'Fundamentals' },
  { id: 'data-types', name: 'Data Types', mastery: 87, status: 'mastered', mistakes: 3, lastAttempted: '2026-09-24', category: 'Fundamentals' },
  { id: 'operators', name: 'Operators', mastery: 80, status: 'mastered', mistakes: 4, lastAttempted: '2026-09-20', category: 'Fundamentals' },
  { id: 'conditions', name: 'Conditions', mastery: 84, status: 'mastered', mistakes: 5, lastAttempted: '2026-09-22', category: 'Control Flow' },
  { id: 'loops', name: 'Loops', mastery: 71, status: 'developing', mistakes: 8, lastAttempted: '2026-09-27', category: 'Control Flow' },
  { id: 'functions', name: 'Functions', mastery: 76, status: 'mastered', mistakes: 6, lastAttempted: '2026-09-23', category: 'Abstractions' },
  { id: 'arrays', name: 'Arrays', mastery: 58, status: 'developing', mistakes: 12, lastAttempted: '2026-09-27', category: 'Data Structures' },
  { id: 'indexing', name: 'Indexing', mastery: 52, status: 'developing', mistakes: 14, lastAttempted: '2026-09-27', category: 'Data Structures' },
  { id: 'index-boundaries', name: 'Index Boundaries', mastery: 35, status: 'needs-attention', mistakes: 18, lastAttempted: '2026-09-27', category: 'Data Structures', isCurrent: true },
  { id: 'scope', name: 'Scope', mastery: 65, status: 'developing', mistakes: 9, lastAttempted: '2026-09-21', category: 'Abstractions' },
  { id: 'recursion', name: 'Recursion', mastery: 42, status: 'developing', mistakes: 11, lastAttempted: '2026-09-19', category: 'Abstractions' },
  { id: 'data-structures', name: 'Data Structures', mastery: 35, status: 'needs-attention', mistakes: 16, lastAttempted: '2026-09-18', category: 'Advanced' },
  { id: 'strings', name: 'Strings', mastery: 78, status: 'mastered', mistakes: 5, lastAttempted: '2026-09-20', category: 'Data Structures' },
  { id: 'objects', name: 'Objects', mastery: 55, status: 'developing', mistakes: 10, lastAttempted: '2026-09-17', category: 'Advanced' },
];

export const mockMisconceptions = [
  {
    id: 'mc-001',
    concept: 'Array Index Boundaries',
    confidence: 78,
    confidenceLabel: 'Medium–High',
    status: 'active',
    evidence: [
      '5 repeated index errors across 4 sessions',
      '3 similar failed loop boundary fixes',
      '2 unsuccessful attempts after hints',
      'Debugging pattern shows consistent off-by-one error',
    ],
    detectedAt: '2026-09-27T09:15:00',
    attempts: 5,
    errorType: 'IndexError: list index out of range',
    signals: {
      errorFrequency: 80,
      recurringPattern: 70,
      debuggingBehavior: 80,
      conceptDependency: 60,
    },
  },
  {
    id: 'mc-002',
    concept: 'Loop Range Boundaries',
    confidence: 45,
    confidenceLabel: 'Low–Medium',
    status: 'resolved',
    evidence: [
      '3 off-by-one errors in range()',
      '2 fixed after Socratic session',
    ],
    detectedAt: '2026-09-24T14:30:00',
    resolvedAt: '2026-09-25T10:00:00',
    attempts: 3,
  },
  {
    id: 'mc-003',
    concept: 'Variable Scope in Functions',
    confidence: 60,
    confidenceLabel: 'Medium',
    status: 'resolved',
    evidence: [
      '4 NameError instances',
      '2 incorrect variable access patterns',
    ],
    detectedAt: '2026-09-21T11:00:00',
    resolvedAt: '2026-09-22T16:00:00',
    attempts: 4,
  },
];

export const mockChallenges = [
  {
    id: 'ch-001',
    title: 'Valid Array Indexes',
    type: 'conceptual',
    difficulty: 'Basic',
    concept: 'Array Index Boundaries',
    misconceptionId: 'mc-001',
    description: 'An array contains 5 elements: [10, 20, 30, 40, 50]. List all the valid indexes you can use to access each element.',
    hint: 'Remember: Python starts counting from 0, not 1.',
    xpReward: 25,
    estimatedMinutes: 3,
    status: 'available',
    testCases: [
      { input: 'First valid index', expected: '0' },
      { input: 'Last valid index', expected: '4' },
    ],
  },
  {
    id: 'ch-002',
    title: 'Find the Loop Bug',
    type: 'debugging',
    difficulty: 'Application',
    concept: 'Array Index Boundaries',
    misconceptionId: 'mc-001',
    description: 'The following loop crashes. Find and fix the error:\n\nnumbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers) + 1):\n    print(numbers[i])',
    hint: 'Look carefully at the range() boundary.',
    xpReward: 40,
    estimatedMinutes: 5,
    status: 'available',
    starterCode: 'numbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers) + 1):\n    print(numbers[i])',
    solution: 'numbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers)):\n    print(numbers[i])',
  },
  {
    id: 'ch-003',
    title: 'Safe Array Traversal',
    type: 'implementation',
    difficulty: 'Transfer',
    concept: 'Array Index Boundaries',
    misconceptionId: 'mc-001',
    description: 'Write a loop that safely prints every element of any given list without causing an IndexError.',
    hint: 'Think about what len() returns vs. the last valid index.',
    xpReward: 60,
    estimatedMinutes: 8,
    status: 'locked',
    starterCode: '# Write your solution here\nmy_list = [5, 10, 15, 20, 25]\n',
  },
  {
    id: 'ch-004',
    title: 'Student Grade Processor',
    type: 'real-world',
    difficulty: 'Real World',
    concept: 'Array Index Boundaries',
    misconceptionId: 'mc-001',
    description: 'Process a list of student scores to find the highest, lowest, and average without any index errors.',
    hint: 'Use Python\'s built-in functions when possible.',
    xpReward: 80,
    estimatedMinutes: 12,
    status: 'locked',
  },
];

export const mockDebuggingTimeline = [
  {
    attempt: 1,
    code: 'numbers = [10,20,30,40,50]\nfor i in range(6):\n    print(numbers[i])',
    error: 'IndexError: list index out of range',
    timestamp: '09:12:05',
    analysis: 'Loop goes to index 5 but array only has indices 0-4',
  },
  {
    attempt: 2,
    code: 'numbers = [10,20,30,40,50]\nfor i in range(5+1):\n    print(numbers[i])',
    error: 'IndexError: list index out of range',
    timestamp: '09:18:32',
    analysis: 'Changed 6 to 5+1 — same logical error, different notation',
  },
  {
    attempt: 3,
    code: 'numbers = [10,20,30,40,50]\nfor i in range(1, 6):\n    print(numbers[i])',
    error: 'IndexError: list index out of range',
    timestamp: '09:25:11',
    analysis: 'Started at index 1, still tries to access index 5. Skipped index 0.',
  },
  {
    attempt: 4,
    code: 'numbers = [10,20,30,40,50]\nfor i in range(len(numbers)):\n    print(numbers[i])',
    error: null,
    timestamp: '09:38:44',
    analysis: 'Correct! len(numbers) returns 5, range(5) produces 0,1,2,3,4',
    success: true,
  },
];

export const mockLearningHistory = [
  { id: 'h-001', type: 'misconception', title: 'Array Index Boundaries misconception detected', time: '09:15', date: 'Today', icon: 'alert' },
  { id: 'h-002', type: 'session', title: 'Socratic AI session on Array Indexing', time: '09:30', date: 'Today', icon: 'message' },
  { id: 'h-003', type: 'challenge', title: 'Challenge: Find the Loop Bug — Started', time: '10:05', date: 'Today', icon: 'target' },
  { id: 'h-004', type: 'mastery', title: 'Loops mastery improved: 65% → 71%', time: '16:20', date: 'Yesterday', icon: 'trending' },
  { id: 'h-005', type: 'challenge', title: 'Loop Boundary Challenge completed (+40 XP)', time: '15:45', date: 'Yesterday', icon: 'star' },
  { id: 'h-006', type: 'misconception', title: 'Loop Range Boundaries — Resolved ✓', time: '10:30', date: '2 days ago', icon: 'check' },
  { id: 'h-007', type: 'session', title: 'Socratic session on Variable Scope', time: '14:00', date: '6 days ago', icon: 'message' },
];

export const mockWeeklyAnalytics = {
  hintsRequired: [78, 72, 68, 56, 50, 38, 31],
  challengeSuccess: [45, 52, 60, 65, 70, 72, 78],
  masteryProgress: [52, 55, 58, 60, 63, 66, 68],
  misconceptionsDetected: [3, 2, 1, 2, 1, 0, 1],
  misconceptionsResolved: [0, 1, 2, 1, 1, 2, 1],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sessionsPerDay: [2, 3, 1, 4, 2, 1, 3],
};

export const mockAchievements = [
  { id: 'a-001', icon: '🔥', name: '7 Day Streak', description: 'Coded 7 days in a row', earned: true, earnedDate: '2026-09-27' },
  { id: 'a-002', icon: '🧠', name: 'Concept Master', description: 'Mastered 10 concepts', earned: true, earnedDate: '2026-09-20' },
  { id: 'a-003', icon: '💡', name: 'Independent Thinker', description: 'Solved 5 challenges without hints', earned: true, earnedDate: '2026-09-22' },
  { id: 'a-004', icon: '🎯', name: 'Hint-Free Solver', description: 'Completed a full session without hints', earned: false },
  { id: 'a-005', icon: '⚡', name: 'Fast Debugger', description: 'Fixed a bug in under 2 minutes', earned: false },
  { id: 'a-006', icon: '🏆', name: 'Misconception Crusher', description: 'Resolved 10 misconceptions', earned: false },
  { id: 'a-007', icon: '🐛', name: 'First Debug', description: 'Fixed your first runtime error', earned: true, earnedDate: '2026-09-03' },
];

export const mockDemoCode = `numbers = [10, 20, 30, 40, 50]

for i in range(6):
    print(numbers[i])`;

export const mockSocraticConversation = [
  {
    role: 'ai',
    message: "I noticed something interesting in your loop. How many elements are inside your `numbers` array?",
    timestamp: '09:15:32',
  },
  {
    role: 'student',
    message: "5.",
    timestamp: '09:16:01',
  },
  {
    role: 'ai',
    message: "That's right — 5 elements. If Python starts counting from **zero**, what would the valid indexes be?",
    timestamp: '09:16:08',
  },
  {
    role: 'student',
    message: "Maybe 1, 2, 3, 4, 5?",
    timestamp: '09:16:45',
  },
  {
    role: 'ai',
    message: "Let's test that thought. If the first element is at position 0, what would the positions look like?\n\n`numbers[0]` → 10\n`numbers[1]` → 20\n...",
    timestamp: '09:16:52',
  },
  {
    role: 'student',
    message: "Oh... 0, 1, 2, 3, 4.",
    timestamp: '09:17:30',
  },
  {
    role: 'ai',
    message: "Exactly! So the last valid index is **4**. Now look at your loop — what is the largest index it tries to access?",
    timestamp: '09:17:38',
  },
];

export const knowledgeGraphNodes = [
  { id: 'programming', label: 'Programming', x: 300, y: 250, status: 'root', size: 50 },
  { id: 'variables', label: 'Variables', x: 120, y: 100, status: 'mastered', size: 38 },
  { id: 'conditions', label: 'Conditions', x: 480, y: 100, status: 'mastered', size: 36 },
  { id: 'loops', label: 'Loops', x: 180, y: 220, status: 'developing', size: 36 },
  { id: 'functions', label: 'Functions', x: 420, y: 200, status: 'mastered', size: 36 },
  { id: 'arrays', label: 'Arrays', x: 160, y: 340, status: 'developing', size: 36 },
  { id: 'indexing', label: 'Indexing', x: 200, y: 440, status: 'developing', size: 34 },
  { id: 'index-boundaries', label: 'Index Boundaries', x: 280, y: 530, status: 'needs-attention', size: 34 },
  { id: 'scope', label: 'Scope', x: 440, y: 320, status: 'developing', size: 32 },
  { id: 'recursion', label: 'Recursion', x: 520, y: 420, status: 'developing', size: 32 },
  { id: 'data-structures', label: 'Data Structures', x: 80, y: 460, status: 'needs-attention', size: 30 },
  { id: 'strings', label: 'Strings', x: 360, y: 440, status: 'mastered', size: 30 },
];

export const knowledgeGraphEdges = [
  { from: 'programming', to: 'variables' },
  { from: 'programming', to: 'conditions' },
  { from: 'programming', to: 'loops' },
  { from: 'programming', to: 'functions' },
  { from: 'variables', to: 'scope' },
  { from: 'loops', to: 'arrays' },
  { from: 'functions', to: 'scope' },
  { from: 'functions', to: 'recursion' },
  { from: 'arrays', to: 'indexing' },
  { from: 'arrays', to: 'data-structures' },
  { from: 'indexing', to: 'index-boundaries' },
  { from: 'arrays', to: 'strings' },
];
