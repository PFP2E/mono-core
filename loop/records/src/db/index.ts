import { Database } from 'bun:sqlite';
import path from 'path';

// Allow overriding the DB path for testing purposes.
// This is crucial for running tests in parallel without file conflicts.
const dbFileName = process.env.DB_FILE || 'records.db';
const dbPath = path.resolve(__dirname, `../../${dbFileName}`);

export const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance.
db.exec('PRAGMA journal_mode = WAL;');

// Avoid logging during test runs to keep test output clean.
if (process.env.NODE_ENV !== 'test') {
  console.log(`Database connected at ${dbPath}`);
}