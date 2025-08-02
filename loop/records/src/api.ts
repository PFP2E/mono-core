import { Router } from 'express';
import { db } from '@pfp2e/sdk';
import type { Campaign } from '@pfp2e/sdk';

export const apiRouter = Router();

/**
 * GET /v1/campaigns
 * Returns a list of all campaigns.
 */
apiRouter.get('/campaigns', (req, res) => {
  try {
    const stmt = db.query('SELECT * FROM campaigns');
    const campaigns = stmt.all() as any[];

    // Parse the JSON fields before sending
    const parsedCampaigns = campaigns.map(c => ({
      ...c,
      rules: JSON.parse(c.rules),
      reward_info: c.reward_info ? JSON.parse(c.reward_info) : undefined,
    }));

    res.json(parsedCampaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /v1/campaigns/:id
 * Returns a single campaign by its ID.
 */
apiRouter.get('/campaigns/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM campaigns WHERE id = ?');
    const campaign = stmt.get(id) as any;

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Parse the JSON fields
    campaign.rules = JSON.parse(campaign.rules);
    if (campaign.reward_info) {
      campaign.reward_info = JSON.parse(campaign.reward_info);
    }

    res.json(campaign);
  } catch (error) {
    console.error(`Failed to fetch campaign ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /v1/verify
 * Verifies a user's PFP against a campaign.
 * (Placeholder implementation)
 */
apiRouter.post('/verify', (req, res) => {
  const { campaignId, user } = req.body;

  if (!campaignId || !user || !user.twitter) {
    return res.status(400).json({ error: 'Missing campaignId or user.twitter in request body' });
  }

  // TODO: Implement full verification logic
  // 1. Fetch campaign from DB to get rules
  // 2. Fetch user's PFP from Twitter
  // 3. Compare PFP against campaign rules
  // 4. Write to DB tables (users, pfps, verifications)

  console.log(`Placeholder verification for ${user.twitter} on campaign ${campaignId}`);

  res.json({
    staked: true, // Placeholder
    timestamp: Math.floor(Date.now() / 1000),
  });
});
