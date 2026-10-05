// Socratic Conversation Script for Index Boundary Misconception
// Implements the exact CodeMind AI Script specified for Hackathon Demo

export const INDEX_BOUNDARY_SCRIPT = {
  intro: {
    id: 'intro',
    message: `I noticed something interesting in your code. 👀\n\nYour program is trying to access a position that doesn't exist.\n\nBefore we fix the code, let's understand why this happened.\n\nCan I ask you a very simple question?`,
    options: [
      { id: 'understand', label: "Let's understand", nextStep: 'q1_apples' },
    ],
  },

  q1_apples: {
    id: 'q1_apples',
    message: `Imagine you have 5 apples 🍎🍎🍎🍎🍎.\n\nIf we start counting them from 0 instead of 1,\nwhat numbers would we give to the 5 apples?`,
    options: [
      { id: 'A', label: 'A) 1, 2, 3, 4, 5', nextStep: 'q1_A' },
      { id: 'B', label: 'B) 0, 1, 2, 3, 4', nextStep: 'q1_B' },
      { id: 'C', label: 'C) 0, 1, 2, 3, 4, 5', nextStep: 'q1_C' },
    ],
  },

  q1_B: {
    id: 'q1_B',
    message: `Exactly! 🎯\n\nSo if we have 5 apples and start counting from 0,\nthe positions are:\n\n0 → 🍎\n1 → 🍎\n2 → 🍎\n3 → 🍎\n4 → 🍎\n\nNow let's connect that idea to your Python list.`,
    options: [
      { id: 'to_q2', label: 'Connect to the Code →', nextStep: 'q2_code_count' },
    ],
  },

  q1_A: {
    id: 'q1_A',
    message: `That's a reasonable way to think about counting.\n\nNow let's look at something interesting.\n\nIf the first position is numbered 0,\nwhat number would the second position have?`,
    options: [
      { id: '1', label: '1', nextStep: 'q1_A_cont' },
    ],
  },

  q1_A_cont: {
    id: 'q1_A_cont',
    message: `Right!\n\nSo continue the pattern:\n\n0 → first\n1 → second\n2 → third\n3 → fourth\n?`,
    options: [
      { id: '4', label: '4', nextStep: 'q1_A_final' },
    ],
  },

  q1_A_final: {
    id: 'q1_A_final',
    message: `Exactly.\n\nSo with 5 items, the positions go from 0 to 4.\n\nNow let's connect that idea to your Python list.`,
    options: [
      { id: 'to_q2', label: 'Connect to the Code →', nextStep: 'q2_code_count' },
    ],
  },

  q1_C: {
    id: 'q1_C',
    message: `Let's test that idea.\n\nIf we have exactly 5 apples, how many positions should there be?\n\nWould having positions 0, 1, 2, 3, 4, 5 give us 5 positions or 6 positions?`,
    options: [
      { id: '6_pos', label: 'That would give 6 positions', nextStep: 'q1_C_cont' },
    ],
  },

  q1_C_cont: {
    id: 'q1_C_cont',
    message: `Let's count them together:\n\n0\n1\n2\n3\n4\n5\n\nThat's actually 6 positions.\n\nSo for 5 items, we only need positions 0 through 4.`,
    options: [
      { id: 'to_q2', label: 'Connect to the Code →', nextStep: 'q2_code_count' },
    ],
  },

  q2_code_count: {
    id: 'q2_code_count',
    message: `Great. Now let's look at your list:\n\n\`\`\`python\nnumbers = [10, 20, 30, 40, 50]\n\`\`\`\n\nHow many values are inside this list?`,
    options: [
      { id: '5', label: '5', nextStep: 'q2_first_pos' },
      { id: '4', label: '4', nextStep: 'q2_count_retry' },
      { id: '6', label: '6', nextStep: 'q2_count_retry' },
    ],
  },

  q2_count_retry: {
    id: 'q2_count_retry',
    message: `Look closely at the items separated by commas:\n\`10\`, \`20\`, \`30\`, \`40\`, \`50\`.\n\nThere are exactly 5 values in this list!`,
    options: [
      { id: '5', label: '5 values', nextStep: 'q2_first_pos' },
    ],
  },

  q2_first_pos: {
    id: 'q2_first_pos',
    message: `Correct. 👍\n\nNow, if Python starts indexing from 0,\nwhat should be the position of the first value?`,
    options: [
      { id: '0', label: '0', nextStep: 'q2_last_pos' },
      { id: '1', label: '1', nextStep: 'q2_first_retry' },
    ],
  },

  q2_first_retry: {
    id: 'q2_first_retry',
    message: `Remember that in Python indexing starts from zero, not one. So the first element is at index 0!`,
    options: [
      { id: '0', label: '0', nextStep: 'q2_last_pos' },
    ],
  },

  q2_last_pos: {
    id: 'q2_last_pos',
    message: `And what should be the position of the LAST value?`,
    options: [
      { id: '4', label: '4', nextStep: 'q3_loop' },
      { id: '5', label: '5', nextStep: 'q2_last_retry' },
    ],
  },

  q2_last_retry: {
    id: 'q2_last_retry',
    message: `Remember the apple counting analogy: 5 items counted from 0 gives positions 0, 1, 2, 3, 4. So the last valid position is 4!`,
    options: [
      { id: '4', label: '4', nextStep: 'q3_loop' },
    ],
  },

  q3_loop: {
    id: 'q3_loop',
    message: `Now look at the loop:\n\n\`\`\`python\nfor i in range(6):\n    print(numbers[i])\n\`\`\`\n\nYour loop is going through:\n0, 1, 2, 3, 4, 5\n\nBut your list has 5 values.\n\nWhat do you think happens when i becomes 5?`,
    options: [
      { id: 'A', label: 'A) Python finds the sixth value', nextStep: 'q3_wrong' },
      { id: 'B', label: 'B) Python cannot find that position', nextStep: 'q3_correct' },
      { id: 'C', label: 'C) Python automatically creates another value', nextStep: 'q3_wrong' },
    ],
  },

  q3_correct: {
    id: 'q3_correct',
    message: `Exactly! 🎯\n\nThere is no position 5 in a list containing only 5 elements.\n\nThe valid positions are:\n0, 1, 2, 3, 4\n\nSo when your loop reaches 5,\nPython tries to access something that doesn't exist.\n\nThat's why you received:\n\`IndexError: list index out of range\``,
    options: [
      { id: 'to_q4', label: 'Let me fix the loop →', nextStep: 'q4_fix' },
    ],
  },

  q3_wrong: {
    id: 'q3_wrong',
    message: `Let's check that idea.\n\nYour list contains:\n10, 20, 30, 40, 50 (5 values)\n\nNow let's label their positions starting from 0:\n\n0 → 10\n1 → 20\n2 → 30\n3 → 40\n4 → 50\n\nIs there a position 5? There isn't!\nSo Python cannot find that position and throws an IndexError.`,
    options: [
      { id: 'to_q4', label: 'Let me fix the loop →', nextStep: 'q4_fix' },
    ],
  },

  q4_fix: {
    id: 'q4_fix',
    message: `Now you understand the problem.\n\nCan you change the loop so that it only asks for positions that actually exist?`,
    options: [
      { id: 'fix_len', label: '🔧 Use range(len(numbers))', action: 'apply_fix_len', nextStep: 'fix_complete' },
      { id: 'fix_5', label: '🔧 Use range(5)', action: 'apply_fix_5', nextStep: 'fix_complete' },
    ],
  },

  fix_complete: {
    id: 'fix_complete',
    message: `Excellent! 🎉\n\nYou didn't just fix the error.\n\nYou discovered WHY the error happened.`,
    card: {
      type: 'concept_card',
      title: 'Array Index Boundaries',
      before: 'Needs Attention',
      after: 'Developing → Improving',
      understanding: 78,
      evidence: [
        'Identified zero-based indexing',
        'Identified valid index range (0 to n-1)',
        'Explained why index 5 fails in a 5-element list',
        'Successfully corrected the loop boundary',
      ],
    },
    options: [
      { id: 'to_mc1', label: 'Let’s test understanding with quick challenges →', nextStep: 'mc1' },
    ],
  },

  mc1: {
    id: 'mc1',
    message: `Let's make sure you've really understood it.\n\nHere's a quick challenge:\n\nYou have this list:\n\n\`\`\`python\nmarks = [80, 75, 92, 68]\n\`\`\`\n\nWhat are the valid indexes?`,
    options: [
      { id: 'A', label: 'A) 1, 2, 3, 4', nextStep: 'mc1_wrong' },
      { id: 'B', label: 'B) 0, 1, 2, 3', nextStep: 'mc1_correct' },
      { id: 'C', label: 'C) 0, 1, 2, 3, 4', nextStep: 'mc1_wrong' },
    ],
  },

  mc1_correct: {
    id: 'mc1_correct',
    message: `Perfect! Your understanding is improving. 🧠\n\n4 elements indexed from 0 gives valid indexes 0, 1, 2, and 3.`,
    options: [
      { id: 'to_mc2', label: 'Next Challenge →', nextStep: 'mc2' },
    ],
  },

  mc1_wrong: {
    id: 'mc1_wrong',
    message: `Let's think about it again.\n\nHow many values are there? 4.\n\nAnd if the first position is 0,\nwhat would the last valid position be? 3.\n\nSo valid indexes are 0, 1, 2, 3!`,
    options: [
      { id: 'to_mc2', label: 'Got it! Continue to Challenge 2 →', nextStep: 'mc2' },
    ],
  },

  mc2: {
    id: 'mc2',
    message: `Now find the problem in this code:\n\n\`\`\`python\nnames = ["Alex", "Sam", "John"]\n\nfor i in range(4):\n    print(names[i])\n\`\`\`\n\nWhat will happen?`,
    options: [
      { id: 'A', label: 'A) All 3 names will print successfully', nextStep: 'mc2_wrong' },
      { id: 'B', label: 'B) The program will try to access an index that doesn\'t exist', nextStep: 'mc2_why' },
      { id: 'C', label: 'C) Python will automatically add another name', nextStep: 'mc2_wrong' },
    ],
  },

  mc2_wrong: {
    id: 'mc2_wrong',
    message: `Not quite! \`names\` only has 3 elements (indexes 0, 1, 2). \`range(4)\` will try to access index 3, which doesn't exist!`,
    options: [
      { id: 'to_mc2_why', label: 'See Why →', nextStep: 'mc2_why' },
    ],
  },

  mc2_why: {
    id: 'mc2_why',
    message: `Why does this happen?`,
    options: [
      { id: 'why_1', label: 'Because range(4) goes 0 to 3, but the last valid index is 2', nextStep: 'mc2_correct' },
      { id: 'why_2', label: 'Because names has 4 elements', nextStep: 'mc2_why_clarify' },
    ],
  },

  mc2_why_clarify: {
    id: 'mc2_why_clarify',
    message: `Remember that \`names = ["Alex", "Sam", "John"]\` has 3 elements! The valid indexes are 0, 1, and 2. So accessing index 3 triggers an IndexError.`,
    options: [
      { id: 'to_mc3', label: 'Final Transfer Challenge →', nextStep: 'mc3' },
    ],
  },

  mc2_correct: {
    id: 'mc2_correct',
    message: `Spot on! With 3 elements, valid indexes are 0, 1, and 2. Index 3 is out of range.`,
    options: [
      { id: 'to_mc3', label: 'Final Transfer Challenge →', nextStep: 'mc3' },
    ],
  },

  mc3: {
    id: 'mc3',
    message: `Final challenge. 💡\n\nWrite a loop that prints every value in:\n\n\`\`\`python\nscores = [45, 67, 82, 91, 76]\n\`\`\`\n\nwithout causing an index error.`,
    options: [
      { id: 'mc3_len', label: '💻 for i in range(len(scores)): print(scores[i])', nextStep: 'mastered' },
      { id: 'mc3_5', label: '💻 for i in range(5): print(scores[i])', nextStep: 'mastered' },
    ],
  },

  mastered: {
    id: 'mastered',
    message: `🎉 Great work!\n\nYou've demonstrated that you understand:\n\n• Python uses zero-based indexing\n• The first index is 0\n• A list with 5 elements has indexes 0–4\n• Accessing index 5 causes an IndexError\n• Loop boundaries must match the available indexes\n\nThis misconception is now marked as:\n\n✓ **UNDERSTOOD**`,
    card: {
      type: 'mastery_card',
      title: 'KNOWLEDGE GRAPH UPDATED',
      path: 'Arrays → Indexing → Index Boundaries',
      status: 'Mastered 🏆',
      score: 95,
      resolved: true,
    },
  },
};

export const HINTS = [
  { level: 1, text: 'How many positions does your list have?' },
  { level: 2, text: 'Imagine 5 apples counted from zero: 0, 1, 2, 3, 4.' },
  { level: 3, text: 'Look at the largest value your loop generates: range(6) generates 0, 1, 2, 3, 4, 5.' },
  { level: 4, text: 'Your loop reaches index 5, but the highest valid index is 4. Change range(6) to range(len(numbers)).' },
];
