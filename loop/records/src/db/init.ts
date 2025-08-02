import fs from 'fs';
import path from 'path';
import { db } from '@pfp2e/sdk';

const schemaPath = path.resolve(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

try {
  db.exec(schema);
  console.log('Database schema initialized successfully.');
} catch (error) {
  console.error('Failed to initialize database schema:');
  console.error(error);
  process.exit(1);
}
