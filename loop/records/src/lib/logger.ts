// src/lib/logger.ts
export const logger = {
  info: (message: string, data?: object) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  warn: (message: string, data?: object) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
  }
};
