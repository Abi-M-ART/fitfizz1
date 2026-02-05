
export interface User {
  id: string;
  username: string;
  isLoggedIn: boolean;
}

export type View = 'SPLASH' | 'LOGIN' | 'SIGNIN' | 'DASHBOARD' | 'BMI' | 'CHAT' | 'REPORT' | 'REMINDERS' | 'FEEDBACK' | 'IMAGE_EDIT';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: any[];
  thinking?: string;
}

export interface BmiResult {
  bmi: number;
  category: string;
  color: string;
}

export interface FeedbackEntry {
  id: string;
  user: string;
  comment: string;
  response: string;
  date: string;
}

export interface Reminder {
  id: string;
  time: string;
  text: string;
  cuisineHint: string;
}
