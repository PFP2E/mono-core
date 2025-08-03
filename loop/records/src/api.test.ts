import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { startServer, stopServer } from './server';
import type { Server } from 'http';
import { db } from './db';
import fs from 'fs';
import path from 'path';

describe('API Integration Tests', () => {
  let server: Server;
  let serverUrl: string;

  beforeAll(() => {
    // Initialize the database with the schema before starting the server
    const schemaPath = path.resolve(__dirname, 'db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    
    // Start the server on a random available port (port 0)
    server = startServer(0);
    const address = server.address();
    if (typeof address === 'string' || address === null) {
      throw new Error('Server address is not a valid address object');
    }
    serverUrl = `http://localhost:${address.port}`;
  });

  afterAll(async () => {
    await stopServer();
  });

  it('GET /v1/campaigns should return a list of campaigns', async () => {
    const response = await fetch(`${serverUrl}/v1/campaigns`);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
