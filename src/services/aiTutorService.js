// AI Tutor Service — Mock implementation
// Simulates Socratic AI responses

const RESPONSE_DELAY = 1500;

const socraticResponses = {
  initial: [
    "I noticed something interesting in your loop. How many elements are inside your `numbers` array?",
    "Before we look at the error, let's think about this together. How many values did you put inside the list?",
  ],
  after_5: [
    "That's right — 5 elements. If Python starts counting from **zero**, what would the first valid index be?",
    "Good. Now if there are 5 elements and indexing starts at 0, what are all the valid positions you can access?",
  ],
  after_wrong_1: [
    "Let's test that thought. What happens when we run `numbers[0]`? Try it in your head.",
    "Interesting idea! Let's check: if the list is `[10, 20, 30, 40, 50]`, what does `numbers[0]` give us?",
  ],
  after_0: [
    "Exactly! So the valid indexes are 0, 1, 2, 3, and 4. Now look at your loop — what's the largest index it tries to access?",
    "So if valid positions are 0 through 4, look at your `range()`. What's the last number it generates?",
  ],
  after_5_index: [
    "That's the problem. Index 5 doesn't exist when there are only 5 items (0 through 4). Can you adjust the loop so it stops at index 4?",
    "Right — index 5 goes out of bounds. How could you change `range(6)` so it only reaches valid indexes?",
  ],
  hint_1: "Think about what `len(numbers)` returns and how `range()` uses that value.",
  hint_2: "If `len(numbers)` is 5, then `range(5)` generates: 0, 1, 2, 3, 4. No index 5. Does that help?",
  hint_3: "Try changing `range(6)` to `range(len(numbers))`. What do you think will happen?",
  hint_4: "The fix is `range(len(numbers))`. This generates indices 0 through `len(numbers)-1`, which is always exactly the valid range.",
  explain_concept: `**Array Index Boundaries** is about understanding which positions are valid when accessing elements in a list.

In Python (and most languages), **indexing starts at 0**, not 1.

For a list with **n elements**:
- First valid index: **0**
- Last valid index: **n − 1**

So for \`[10, 20, 30, 40, 50]\` (5 elements):
- Valid: 0, 1, 2, 3, 4
- Invalid: 5, 6, ... (causes IndexError)

**Common mistake:** Using \`range(n+1)\` or \`range(len(arr)+1)\` — always one too many.`,
  review_thinking: (thinking) =>
    `I analyzed your explanation. You mentioned "${thinking.slice(0, 50)}..."

Here's what I noticed:
- **Good:** You identified the loop as the problem area
- **Gap:** The connection between \`range()\` boundary and valid indexes needs strengthening

The key insight is: \`range(6)\` generates 0,1,2,3,4,**5** — but index 5 doesn't exist in a 5-element list.`,
  challenge_intro: "Great! Let's test your understanding with a small challenge. Are you ready?",
  success: "That's correct! You've fixed the boundary issue. The loop now stops exactly at index 4 — the last valid position. 🎉",
};

let conversationHistory = [];
let apiKey = import.meta.env.VITE_AI_API_KEY || localStorage.getItem('ai_api_key') || 'BCnVjjUPblfTX8qRS6zGMTkZsMVKj0jkoHxr6BVNnFlbbQ7CTa3dJQQJ99CIACF24PCXJ3w3AAAAACOGrnQh';

export const aiTutorService = {
  getApiKey() {
    return apiKey;
  },

  setApiKey(key) {
    apiKey = key;
    if (key) {
      localStorage.setItem('ai_api_key', key);
    } else {
      localStorage.removeItem('ai_api_key');
    }
  },

  resetConversation() {
    conversationHistory = [];
  },

  getHistory() {
    return [...conversationHistory];
  },

  async sendMessage(userMessage, mode = 'socratic', context = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';
        const lowerMsg = userMessage.toLowerCase();
        const histLen = conversationHistory.length;
        const currentConcept = context?.misconception?.misconception;

        if (mode === 'explain') {
          response = currentConcept
            ? `**Focus Concept: ${currentConcept}**\n\n${socraticResponses.explain_concept}`
            : socraticResponses.explain_concept;
        } else if (mode === 'review') {
          response = socraticResponses.review_thinking(userMessage);
        } else if (mode === 'challenge') {
          response = socraticResponses.challenge_intro;
        } else {
          // Socratic mode
          if (histLen === 0) {
            response = socraticResponses.initial[0];
          } else if (lowerMsg.includes('5') && histLen <= 2) {
            response = socraticResponses.after_5[0];
          } else if ((lowerMsg.includes('1') || lowerMsg.includes('one')) && histLen <= 4) {
            response = socraticResponses.after_wrong_1[0];
          } else if (lowerMsg.includes('0') && histLen <= 4) {
            response = socraticResponses.after_0[0];
          } else if (lowerMsg.includes('0, 1, 2, 3, 4') || lowerMsg.includes('0 1 2 3 4')) {
            response = socraticResponses.after_0[0];
          } else if ((lowerMsg.includes('5') || lowerMsg.includes('index 5')) && histLen > 3) {
            response = socraticResponses.after_5_index[0];
          } else if (lowerMsg.includes('why')) {
            response = "That's exactly the right question to ask. What does `range(6)` actually produce? Can you list the numbers it generates?";
          } else if (lowerMsg.includes('don\'t know') || lowerMsg.includes('not sure') || lowerMsg.includes('help')) {
            response = socraticResponses.hint_1;
          } else {
            response = "Interesting thinking. Let me help guide you — if I asked you to count 5 objects starting from zero, what numbers would you use?";
          }
        }

        const msg = {
          role: 'ai',
          message: response,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          mode,
          apiKeyActive: !!apiKey,
        };

        conversationHistory.push({ role: 'student', message: userMessage });
        conversationHistory.push(msg);

        resolve(msg);
      }, RESPONSE_DELAY + Math.random() * 500);
    });
  },

  async getHint(hintLevel, concept = 'Array Index Boundaries') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hints = [
          socraticResponses.hint_1,
          socraticResponses.hint_2,
          socraticResponses.hint_3,
          socraticResponses.hint_4,
        ];
        resolve({
          hint: hints[Math.min(hintLevel - 1, hints.length - 1)],
          level: hintLevel,
          concept,
        });
      }, 800);
    });
  },

  async analyzeThinking(thinkingText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasLoop = thinkingText.toLowerCase().includes('loop');
        const hasIndex = thinkingText.toLowerCase().includes('index') || thinkingText.toLowerCase().includes('position');
        const hasBoundary = thinkingText.toLowerCase().includes('bound') || thinkingText.toLowerCase().includes('limit') || thinkingText.toLowerCase().includes('range');

        const conceptScore = Math.min(30 + (hasLoop ? 15 : 0) + (hasIndex ? 20 : 0) + (hasBoundary ? 17 : 0), 100);

        resolve({
          conceptUnderstanding: conceptScore,
          possibleMisconception: conceptScore < 70 ? 'Loop boundary condition' : null,
          confidence: conceptScore < 50 ? 'Low' : conceptScore < 75 ? 'Medium' : 'High',
          feedback: conceptScore < 60
            ? "Your thinking shows you've identified the loop as the problem. The next step is connecting the loop range to valid array indexes."
            : "Good reasoning! You're close — focus on the exact boundary where the loop goes out of valid range.",
        });
      }, 1200);
    });
  },
};
