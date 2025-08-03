import { Router } from 'express';
import { db } from './db';
import type { Campaign } from '@pfp2e/sdk';
import { logger } from './lib/logger';

export const apiRouter = Router();

// OpenAPI Schema definitions for JSDoc
/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the campaign.
 *         name:
 *           type: string
 *           description: The name of the campaign.
 *         description:
 *           type: string
 *           description: A brief description of the campaign.
 *         type:
 *           type: string
 *           enum: [nft, overlay]
 *           description: The type of the campaign.
 *         reward_info:
 *           type: object
 *           description: Information about the campaign's rewards.
 *         created_at:
 *           type: integer
 *           description: Unix timestamp of when the campaign was created.
 *       example:
 *         id: "bayc-social-staking"
 *         name: "Bored Ape Yacht Club Social Staking"
 *         description: "Get rewarded for using your BAYC NFT as your PFP on Twitter/X."
 *         type: "nft"
 *         reward_info:
 *           totalPool: "1,000,000 $APE"
 *           dailyRate: "10,000 $APE"
 *         created_at: 1678886400
 */

/**
 * @swagger
 * /v1/campaigns:
 *   get:
 *     summary: Retrieve a list of all campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: A list of campaigns.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 *       500:
 *         description: Internal Server Error
 */
apiRouter.get('/campaigns', (req, res) => {
  logger.info('Request received: GET /v1/campaigns');
  try {
    const stmt = db.query('SELECT * FROM campaigns');
    const campaigns = stmt.all() as any[];
    logger.info(`Found ${campaigns.length} campaigns.`);

    // Parse the JSON fields before sending
    const parsedCampaigns = campaigns.map(c => ({
      ...c,
      reward_info: c.reward_info ? JSON.parse(c.reward_info) : undefined,
    }));

    res.json(parsedCampaigns);
  } catch (error) {
    logger.error('Failed to fetch campaigns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     responses:
 *       200:
 *         description: The campaign description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: The campaign was not found
 *       500:
 *         description: Internal Server Error
 */
apiRouter.get('/campaigns/:id', (req, res) => {
  const { id } = req.params;
  logger.info(`Request received: GET /v1/campaigns/${id}`);
  try {
    const stmt = db.prepare('SELECT * FROM campaigns WHERE id = ?');
    const campaign = stmt.get(id) as any;

    if (!campaign) {
      logger.warn(`Campaign not found: ${id}`);
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Parse the JSON fields
    if (campaign.reward_info) {
      campaign.reward_info = JSON.parse(campaign.reward_info);
    }
    logger.info(`Successfully fetched campaign: ${id}`);
    res.json(campaign);
  } catch (error) {
    logger.error(`Failed to fetch campaign ${id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/verifications:
 *   get:
 *     summary: Retrieve a list of all verifications, joined with user wallet addresses
 *     tags: [Verification]
 *     responses:
 *       200:
 *         description: A list of verifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal Server Error
 */
apiRouter.get('/verifications', (req, res) => {
  logger.info('Request received: GET /v1/verifications');
  try {
    const stmt = db.query(`
      SELECT
        v.id,
        v.user_id,
        u.wallet_address,
        v.campaign_id,
        v.epoch,
        v.verified_at
      FROM verifications v
      JOIN users u ON v.user_id = u.id
    `);
    const verifications = stmt.all();
    logger.info(`Found ${verifications.length} verifications.`);
    res.json(verifications);
  } catch (error) {
    logger.error('Failed to fetch verifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/target-pfps/{campaignId}:
 *   get:
 *     summary: Retrieve the set of target PFP hashes for a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     responses:
 *       200:
 *         description: A list of target PFP hashes.
 *       500:
 *         description: Internal Server Error
 */
apiRouter.get('/target-pfps/:campaignId', (req, res) => {
  const { campaignId } = req.params;
  logger.info(`Request received: GET /v1/target-pfps/${campaignId}`);
  try {
    const stmt = db.prepare('SELECT pfp_hash FROM target_pfps WHERE campaign_id = ?');
    const hashes = stmt.all(campaignId) as { pfp_hash: string }[];
    res.json(hashes.map(h => h.pfp_hash));
  } catch (error) {
    logger.error(`Failed to fetch target PFPs for campaign ${campaignId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *       500:
 *         description: Internal Server Error
 */
apiRouter.get('/users', (req, res) => {
  logger.info('Request received: GET /v1/users');
  try {
    const stmt = db.query('SELECT id, social_handle, wallet_address FROM users');
    const users = stmt.all();
    res.json(users);
  } catch (error) {
    logger.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
