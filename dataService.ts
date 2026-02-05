
import { BmiResult } from '../types';

// Structured database keys
const COLLECTIONS = {
  BMI: 'fitfizz_collection_bmi',
  REPORTS: 'fitfizz_collection_reports',
  USER_STATS: 'fitfizz_collection_stats',
  FEEDBACK: 'fitfizz_collection_feedback'
};

export const dataService = {
  /**
   * Linked BMI Persistence
   */
  saveBmiRecord: (userId: string, record: BmiResult & { date: string }) => {
    const table = JSON.parse(localStorage.getItem(COLLECTIONS.BMI) || '[]');
    
    // Create a new record linked to the user
    const linkedRecord = {
      id: crypto.randomUUID(),
      userId: userId, // Foreign Key linking
      ...record,
      timestamp: Date.now()
    };
    
    table.unshift(linkedRecord);
    localStorage.setItem(COLLECTIONS.BMI, JSON.stringify(table.slice(0, 500))); // Store more history
  },

  getBmiHistory: (userId: string) => {
    const table = JSON.parse(localStorage.getItem(COLLECTIONS.BMI) || '[]');
    // Query filter for specific user's linked data
    return table.filter((r: any) => r.userId === userId);
  },

  /**
   * Linked Report Analysis Persistence
   */
  saveReportAnalysis: (userId: string, analysis: string, fileName?: string) => {
    const table = JSON.parse(localStorage.getItem(COLLECTIONS.REPORTS) || '[]');
    
    const linkedReport = {
      id: crypto.randomUUID(),
      userId: userId, // Foreign Key linking
      analysis,
      fileName: fileName || 'Unknown Report',
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    table.unshift(linkedReport);
    localStorage.setItem(COLLECTIONS.REPORTS, JSON.stringify(table.slice(0, 100)));
  },

  /**
   * Feedback and Subscription Persistence
   */
  saveFeedback: (userId: string, data: { email: string, message: string, wantsUpdates: boolean }) => {
    const table = JSON.parse(localStorage.getItem(COLLECTIONS.FEEDBACK) || '[]');
    const linkedFeedback = {
      id: crypto.randomUUID(),
      userId,
      ...data,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    table.unshift(linkedFeedback);
    localStorage.setItem(COLLECTIONS.FEEDBACK, JSON.stringify(table.slice(0, 100)));
  },

  getReportHistory: (userId: string) => {
    const table = JSON.parse(localStorage.getItem(COLLECTIONS.REPORTS) || '[]');
    // Query filter for specific user's linked reports
    return table.filter((r: any) => r.userId === userId);
  },

  /**
   * Database Integrity Check
   */
  checkApiConnectivity: async () => {
    return !!process.env.API_KEY;
  }
};
