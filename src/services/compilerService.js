// Compiler Service — Mock implementation
// Simulates code execution for Python with realistic error detection

const EXECUTION_DELAY = 1200; // ms

const pythonOutputMap = {
  'numbers = [10, 20, 30, 40, 50]\n\nfor i in range(6):\n    print(numbers[i])': {
    output: '10\n20\n30\n40\n50',
    error: 'IndexError: list index out of range',
    errorLine: 3,
    exitCode: 1,
    executionTime: '0.042s',
  },
  'numbers = [10, 20, 30, 40, 50]\n\nfor i in range(len(numbers)):\n    print(numbers[i])': {
    output: '10\n20\n30\n40\n50',
    error: null,
    exitCode: 0,
    executionTime: '0.038s',
  },
  'numbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers) + 1):\n    print(numbers[i])': {
    output: '1\n2\n3\n4\n5',
    error: 'IndexError: list index out of range',
    errorLine: 2,
    exitCode: 1,
    executionTime: '0.040s',
  },
  'numbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers)):\n    print(numbers[i])': {
    output: '1\n2\n3\n4\n5',
    error: null,
    exitCode: 0,
    executionTime: '0.035s',
  },
};

// Default run for unknown code
const simulateGenericRun = (code) => {
  const hasIndexError = code.includes('range(6)') || code.includes('range(len') && code.includes('+ 1');
  if (hasIndexError) {
    return {
      output: '10\n20\n30\n40\n50',
      error: 'IndexError: list index out of range',
      errorLine: code.split('\n').findIndex(l => l.includes('range')) + 1,
      exitCode: 1,
      executionTime: '0.041s',
    };
  }

  if (code.includes('print(') || code.trim().length > 10) {
    const lines = code.split('\n').filter(l => l.includes('print('));
    if (lines.length > 0) {
      return {
        output: 'Code executed successfully.',
        error: null,
        exitCode: 0,
        executionTime: '0.039s',
      };
    }
  }

  return {
    output: '',
    error: null,
    exitCode: 0,
    executionTime: '0.010s',
  };
};

export const compilerService = {
  async runCode(code, language = 'python') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedCode = code.trim();
        const result = pythonOutputMap[normalizedCode] || simulateGenericRun(normalizedCode);
        resolve({
          ...result,
          language,
          timestamp: new Date().toISOString(),
          mode: 'DEMO',
        });
      }, EXECUTION_DELAY);
    });
  },

  async runTests(code, testCases) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = testCases.map((tc, i) => ({
          ...tc,
          passed: i < Math.floor(testCases.length * 0.6),
          actual: i < Math.floor(testCases.length * 0.6) ? tc.expected : 'IndexError',
        }));
        resolve(results);
      }, EXECUTION_DELAY * 1.5);
    });
  },

  getLanguages() {
    return [
      { id: 'python', name: 'Python', version: '3.11', icon: '🐍' },
      { id: 'javascript', name: 'JavaScript', version: 'ES2024', icon: '🟨' },
      { id: 'java', name: 'Java', version: '21', icon: '☕' },
      { id: 'cpp', name: 'C++', version: 'C++17', icon: '⚙️' },
    ];
  },
};
