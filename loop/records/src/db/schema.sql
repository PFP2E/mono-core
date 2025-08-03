-- Campaigns Table: Stores campaign definitions.
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'nft' or 'overlay'
  reward_info TEXT, -- JSON blob for informational reward data
  created_at INTEGER NOT NULL
);

-- Target PFPs Table: The ground truth for a campaign.
CREATE TABLE IF NOT EXISTS target_pfps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id TEXT NOT NULL,
  pfp_hash TEXT NOT NULL,
  description TEXT, -- e.g., "BAYC #1234" or "Judge: vitalik.eth"
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  UNIQUE(campaign_id, pfp_hash)
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
  pfp_hash TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Verifications Table: Links users and campaigns for successful verifications within an epoch.
CREATE TABLE IF NOT EXISTS verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  campaign_id TEXT NOT NULL,
  pfp_id INTEGER NOT NULL,
  epoch INTEGER NOT NULL, -- The epoch number for this verification
  verified_at INTEGER NOT NULL,
  onchain_receipt_tx_hash TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  FOREIGN KEY (pfp_id) REFERENCES pfps(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_target_pfps_hash ON target_pfps(pfp_hash);
CREATE INDEX IF NOT EXISTS idx_verifications_user_id_epoch ON verifications(user_id, epoch);
CREATE INDEX IF NOT EXISTS idx_users_social_handle ON users(social_handle);