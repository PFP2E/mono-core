-- Campaigns Table: Stores campaign definitions.
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'nft' or 'overlay'
  rules TEXT NOT NULL, -- JSON blob for campaign-specific rules
  reward_info TEXT, -- JSON blob for informational reward data
  created_at INTEGER NOT NULL
);

-- Users Table: Stores unique user profiles.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  social_platform TEXT NOT NULL,
  social_handle TEXT NOT NULL,
  wallet_address TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(social_platform, social_handle)
);

-- PFPs Table: Stores a historical log of captured profile pictures.
CREATE TABLE IF NOT EXISTS pfps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  source_url TEXT NOT NULL,
  captured_at INTEGER NOT NULL,
  ahash TEXT NOT NULL,
  colorhist TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, ahash)
);

-- Verifications Table: Links users, campaigns, and pfps for successful verifications.
CREATE TABLE IF NOT EXISTS verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  campaign_id TEXT NOT NULL,
  pfp_id INTEGER NOT NULL,
  verified_at INTEGER NOT NULL,
  onchain_receipt_tx_hash TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  FOREIGN KEY (pfp_id) REFERENCES pfps(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_campaign_id ON verifications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_users_social_handle ON users(social_handle);
