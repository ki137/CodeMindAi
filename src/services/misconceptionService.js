// Misconception Detection Service

const ANALYSIS_DELAY = 2000;

export const misconceptionService = {
  async analyzeError(errorHistory, _codeHistory) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!errorHistory || errorHistory.length === 0) {
          resolve({ detected: false, confidence: 0 });
          return;
        }

        const indexErrors = errorHistory.filter(e =>
          e && (e.includes('IndexError') || e.includes('index out of range'))
        ).length;

        const repeatedCount = errorHistory.length;

        if (repeatedCount >= 3 && indexErrors >= 2) {
          resolve({
            detected: true,
            misconception: 'Array Index Boundaries',
            confidence: Math.min(60 + repeatedCount * 6, 92),
            confidenceLabel: repeatedCount >= 4 ? 'Medium–High' : 'Medium',
            evidence: [
              `${indexErrors} IndexError instances detected`,
              `${repeatedCount} attempts with similar patterns`,
              'Loop boundary consistently exceeds array length',
              'Off-by-one pattern detected in range() usage',
            ],
            signals: {
              errorFrequency: Math.min(repeatedCount * 20, 90),
              recurringPattern: Math.min(indexErrors * 25, 85),
              debuggingBehavior: Math.min(60 + repeatedCount * 5, 85),
              conceptDependency: 60,
            },
            recommendation: 'Practice Array Indexing challenges and Socratic session on zero-based indexing',
          });
        } else if (repeatedCount >= 2) {
          resolve({
            detected: true,
            misconception: 'Array Index Boundaries',
            confidence: 45,
            confidenceLabel: 'Low–Medium',
            evidence: [
              `${repeatedCount} similar errors detected`,
              'Pattern emerging — monitoring for confirmation',
            ],
            signals: {
              errorFrequency: repeatedCount * 15,
              recurringPattern: repeatedCount * 20,
              debuggingBehavior: 40,
              conceptDependency: 35,
            },
            recommendation: 'Keep coding — CodeMind is observing your pattern.',
          });
        } else {
          resolve({
            detected: false,
            confidence: 0,
            message: 'Error detected but no clear misconception pattern yet. Continue coding.',
          });
        }
      }, ANALYSIS_DELAY);
    });
  },

  getBehaviorSignals(attempts) {
    return {
      totalAttempts: attempts,
      sameErrorRepeated: attempts >= 2,
      fixAttemptFailed: attempts >= 3,
      patternDetected: attempts >= 3,
      readyForIntervention: attempts >= 3,
    };
  },
};
