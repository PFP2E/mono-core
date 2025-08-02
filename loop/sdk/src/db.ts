import { Database } from 'bun:sqlite';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../records.db');
export const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance.
db.exec('PRAGMA journal_mode = WAL;');

console.log(`Database connected at ${dbPath}`);
