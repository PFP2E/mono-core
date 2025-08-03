import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test';
import type { Server } from 'http';
import { Database } from 'bun:sqlite';
import fs from 'fs';
import path from 'path';

// Mock the database module BEFORE it's imported by the server/api.
// This ensures any module that imports `./db` will get our in-memory version.
mock.module('./db', () => {
  const db = new Database(':memory:');
  return { db };
});

// Now that the mock is set up, we can import the modules that use it.
import { startServer, stopServer } from './server';
import { db } from './db'; // This is our mocked, in-memory DB

describe('API Integration Tests', () => {
  let server: Server;
  let serverUrl: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test'; // Suppress verbose logging

    // Initialize the IN-MEMORY database with the schema
    const schemaPath = path.resolve(__dirname, 'db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);

    // Seed the in-memory DB with some data for the test
    db.prepare(
      'INSERT INTO campaigns (id, name, type, rules, reward_info, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run('test-campaign', 'Test Campaign', 'nft', '{}', null, Date.now());


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
    delete process.env.NODE_ENV;
  });

  it('GET /v1/campaigns should return a list of campaigns', async () => {
    const response = await fetch(`${serverUrl}/v1/campaigns`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(1);
    expect(body[0].name).toBe('Test Campaign');
  });
});