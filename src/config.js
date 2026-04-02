export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const SHEET_ID = import.meta.env.VITE_SHEET_ID || '';
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets openid email profile';

export const SHEET_NAMES = {
  PORTFOLIO: 'Independence Goal Portfolio',
  INTENT: 'Intent',
  PRINCIPLES: 'Executive Function First Principles',
  DEFINITIONS: 'Definitions',
};

// Data rows start at row 3 (rows 1-2 are merged headers)
export const DATA_START_ROW = 3;

// Column indices (0-based) for the Independence Goal Portfolio sheet
export const COLS = {
  CURRENT_FOCUS: 0,   // A
  CATEGORY: 1,        // B
  GOAL: 2,            // C
  IMPORTANCE: 3,      // D
  MORNING: 4,         // E
  EVENING: 5,         // F
  VARIOUS: 6,         // G
  WEEKLY: 7,          // H
  MONTHLY: 8,         // I
  YEARLY: 9,          // J
  // K is spacer (10)
  SELF_STATUS: 11,    // L
  SELF_COMMENTS: 12,  // M
  SELF_UPDATED: 13,   // N
  // O is spacer (14)
  TEAM_STATUS: 15,    // P
  TEAM_COMMENTS: 16,  // Q
  TEAM_UPDATED: 17,   // R
};

export const SELF_EVAL_USER = 'samuelmayerhofer@gmail.com';

export const STATUS_VALUES = ['Open', 'Partial', 'Mastery'];

export const IMPORTANCE_LEVELS = ['must', 'should', 'nice'];

export const IMPORTANCE_LABELS = {
  must: 'Must',
  should: 'Should',
  nice: 'Nice',
};

export const FUNDAMENTAL_GOALS = [
  { name: 'Safety', description: 'Physical wellbeing and security in all environments.' },
  { name: 'Health', description: 'Physical and mental health through consistent habits.' },
  { name: 'Financial Viability', description: 'Earning, budgeting, and spending wisely to sustain independent living.' },
  { name: 'Independence', description: 'Doing things without prompting or coaching consistently.' },
  { name: 'Purpose', description: 'Meaningful work and activities that give life direction.' },
  { name: 'Happiness', description: 'Relationships, experiences, and joy in daily life.' },
];

export const FIRST_PRINCIPLES = [
  { name: 'Self-Initiation', description: 'Taking action without being reminded or prompted.' },
  { name: 'Consistency', description: 'Doing the right thing reliably, not just occasionally.' },
  { name: 'Planning', description: 'Thinking ahead and organizing time and resources effectively.' },
  { name: 'Self-Monitoring', description: 'Recognizing when something needs to be done and checking your own work.' },
  { name: 'Adaptability', description: 'Adjusting to changes and recovering from setbacks.' },
  { name: 'Emotional Regulation', description: 'Managing feelings in a way that supports positive outcomes.' },
];
