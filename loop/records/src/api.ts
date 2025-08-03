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
 *         rules:
 *           type: object
 *           description: The rules governing the campaign.
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
 *         rules:
 *           type: "nft"
 *           collectionAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
 *           requireOwnership: true
 *         reward_info:
 *           totalPool: "1,000,000 $APE"
 *           dailyRate: "10,000 $APE"
 *         created_at: 1678886400
 *     VerificationRequest:
 *       type: object
 *       required:
 *         - campaignId
 *         - user
 *       properties:
 *         campaignId:
 *           type: string
 *           description: The ID of the campaign to verify against.
 *         user:
 *           type: object
 *           required:
 *             - twitter
 *           properties:
 *             twitter:
 *               type: string
 *               description: The user's Twitter handle.
 *     VerificationResponse:
 *       type: object
 *       properties:
 *         staked:
 *           type: boolean
 *           description: Whether the user is successfully verified for the campaign.
 *         timestamp:
 *           type: integer
 *           description: The Unix timestamp of the verification.
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
      rules: JSON.parse(c.rules),
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
    campaign.rules = JSON.parse(campaign.rules);
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
 * /v1/verify:
 *   post:
 *     summary: Verify a user's PFP against a campaign
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationRequest'
 *     responses:
 *       200:
 *         description: Verification status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationResponse'
 *       400:
 *         description: Bad Request - Missing parameters
 */
apiRouter.post('/verify', (req, res) => {
  const { campaignId, user } = req.body;
  logger.info('Request received: POST /v1/verify', { campaignId, user });

  if (!campaignId || !user || !user.twitter) {
    logger.warn('Verification request missing required parameters.');
    return res.status(400).json({ error: 'Missing campaignId or user.twitter in request body' });
  }

  // TODO: Implement full verification logic
  // 1. Fetch campaign from DB to get rules
  // 2. Fetch user's PFP from Twitter
  // 3. Compare PFP against campaign rules
  // 4. Write to DB tables (users, pfps, verifications)

  logger.info(`Placeholder verification for ${user.twitter} on campaign ${campaignId}`);

  res.json({
    staked: true, // Placeholder
    timestamp: Math.floor(Date.now() / 1000),
  });
});
