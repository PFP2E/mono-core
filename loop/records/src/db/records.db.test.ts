import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import fs from 'fs';
import path from 'path';

describe('Database Schema and Integrity', () => {
  let db: Database;

  // Read the schema once
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  beforeEach(() => {
    // Use an in-memory database for each test to ensure isolation
    db = new Database(':memory:');
    // Enable foreign key constraint enforcement
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(schema);
  });

  afterEach(() => {
    db.close();
  });

  it('should create all tables and indexes successfully', () => {
    const tablesQuery = db.query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
    const tables = tablesQuery.all() as { name: string }[];
    const tableNames = tables.map((t) => t.name);
    expect(tableNames).toContain('campaigns');
    expect(tableNames).toContain('users');
    expect(tableNames).toContain('pfps');
    expect(tableNames).toContain('verifications');

    const indexesQuery = db.query("SELECT name FROM sqlite_master WHERE type='index' ORDER BY name;");
    const indexes = indexesQuery.all() as { name: string }[];
    const indexNames = indexes.map((i) => i.name);
    expect(indexNames).toContain('idx_users_social_handle');
    expect(indexNames).toContain('idx_verifications_campaign_id');
    expect(indexNames).toContain('idx_verifications_user_id');
  });

  it('should insert and retrieve a user', () => {
    const now = Date.now();
    const insertStmt = db.query(
      'INSERT INTO users (social_platform, social_handle, wallet_address, created_at) VALUES (?, ?, ?, ?) RETURNING id'
    );
    const { id: newId } = insertStmt.get('twitter', 'testuser', '0x123', now) as { id: number };
    expect(newId).toBeGreaterThan(0);

    const selectStmt = db.query('SELECT * FROM users WHERE id = ?');
    const user = selectStmt.get(newId) as any;

    expect(user).toBeDefined();
    expect(user.social_handle).toBe('testuser');
    expect(user.wallet_address).toBe('0x123');
  });

  it('should enforce uniqueness on user social handle and platform', () => {
    const now = Date.now();
    const insertStmt = db.query(
      'INSERT INTO users (social_platform, social_handle, created_at) VALUES (?, ?, ?)'
    );
    insertStmt.run('twitter', 'uniqueuser', now);

    // Attempting to insert the same user should throw an error
    expect(() => {
      insertStmt.run('twitter', 'uniqueuser', now);
    }).toThrow('UNIQUE constraint failed: users.social_platform, users.social_handle');
  });

  it('should successfully create a full verification record with foreign keys', () => {
    const now = Date.now();

    // 1. Create a user
    const { id: userId } = db.query('INSERT INTO users (social_platform, social_handle, created_at) VALUES (?, ?, ?) RETURNING id')
      .get('twitter', 'verified_user', now) as { id: number };

    // 2. Create a campaign
    db.query('INSERT INTO campaigns (id, name, type, rules, created_at) VALUES (?, ?, ?, ?, ?)')
      .run('test-campaign', 'Test Campaign', 'nft', '{"type":"nft","collectionAddress":"0x0","requireOwnership":false}', now);

    // 3. Create a PFP record
    const { id: pfpId } = db.query('INSERT INTO pfps (user_id, source_url, captured_at, ahash, colorhist) VALUES (?, ?, ?, ?, ?) RETURNING id')
      .get(userId, 'http://example.com/pfp.png', now, 'ahash123', 'colorhist123') as { id: number };

    // 4. Create the verification record linking them all
    const verificationResult = db.query('INSERT INTO verifications (user_id, campaign_id, pfp_id, verified_at) VALUES (?, ?, ?, ?)')
      .run(userId, 'test-campaign', pfpId, now);
    
    // .run() returns an object with changes and lastInsertRowid
    expect(verificationResult.changes).toBe(1);
  });

  it('should fail to create a verification with a non-existent user_id', () => {
    const now = Date.now();
    db.query('INSERT INTO campaigns (id, name, type, rules, created_at) VALUES (?, ?, ?, ?, ?)')
      .run('test-campaign', 'Test Campaign', 'nft', '{"type":"nft","collectionAddress":"0x0","requireOwnership":false}', now);
    
    const insertVerification = () => {
        // Note: pfp_id=1 also does not exist, but user_id is checked first
        db.query('INSERT INTO verifications (user_id, campaign_id, pfp_id, verified_at) VALUES (?, ?, ?, ?)')
          .run(999, 'test-campaign', 1, now); // 999 is a non-existent user_id
    };

    expect(insertVerification).toThrow('FOREIGN KEY constraint failed');
  });
});
