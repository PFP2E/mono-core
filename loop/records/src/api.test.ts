import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test';
import type { Server } from 'http';
import { Database } from 'bun:sqlite';
import fs from 'fs';
import path from 'path';

// Mock the database module BEFORE it's imported by the server/api.
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
  const CAMPAIGN_ID = 'test-campaign';

  beforeAll(() => {
    process.env.NODE_ENV = 'test'; // Suppress verbose logging

    // Initialize the IN-MEMORY database with the schema
    const schemaPath = path.resolve(__dirname, 'db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);

    // Seed the in-memory DB with some data for the test
    db.prepare(
      'INSERT INTO campaigns (id, name, type, created_at) VALUES (?, ?, ?, ?)'
    ).run(CAMPAIGN_ID, 'Test Campaign', 'nft', Date.now());

    db.prepare(
      'INSERT INTO users (social_platform, social_handle, wallet_address, created_at) VALUES (?, ?, ?, ?)'
    ).run('twitter', 'testuser', '0x123', Date.now());

    db.prepare(
      'INSERT INTO target_pfps (campaign_id, pfp_hash, description) VALUES (?, ?, ?)'
    ).run(CAMPAIGN_ID, 'hash123', 'Test PFP');


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

  it('GET /v1/users should return a list of users', async () => {
    const response = await fetch(`${serverUrl}/v1/users`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(1);
    expect(body[0].social_handle).toBe('testuser');
  });

  it('GET /v1/target-pfps/:campaignId should return a list of hashes', async () => {
    const response = await fetch(`${serverUrl}/v1/target-pfps/${CAMPAIGN_ID}`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(1);
    expect(body[0]).toBe('hash123');
  });
});
