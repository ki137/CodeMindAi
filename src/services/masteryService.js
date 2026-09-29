// Mastery Service

export const masteryService = {
  updateMastery(conceptId, wasCorrect, hintsUsed = 0) {
    const base = wasCorrect ? 8 : -3;
    const hintPenalty = hintsUsed * 1.5;
    const delta = Math.max(base - hintPenalty, wasCorrect ? 2 : -3);
    return { delta: Math.round(delta * 10) / 10, conceptId };
  },

  getMasteryLabel(score) {
    if (score >= 85) return { label: 'Mastered', color: 'teal' };
    if (score >= 60) return { label: 'Developing', color: 'yellow' };
    if (score >= 40) return { label: 'Needs Practice', color: 'orange' };
    return { label: 'Needs Attention', color: 'orange' };
  },
};

// Challenge Service
export const challengeService = {
  async evaluateAnswer(challengeId, code, answer) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const correct =
          code.includes('range(len(') ||
          code.includes('range(5)') ||
          answer === '0, 1, 2, 3, 4' ||
          answer === '0-4';

        resolve({
          correct,
          xpEarned: correct ? 40 : 0,
          feedback: correct
            ? "Excellent! You correctly identified all valid indexes."
            : "Not quite. Remember: for a 5-element list, valid indexes are 0, 1, 2, 3, 4.",
          masteryDelta: correct ? 12 : -2,
          nextChallengeId: correct ? 'ch-002' : 'ch-001',
        });
      }, 1000);
    });
  },
};
