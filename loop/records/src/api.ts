import { Router } from 'express';
import { db } from './db';
import type { Campaign } from '@pfp2e/sdk';
import { logger } from './lib/logger';
import { keccak256 } from 'js-sha3';
import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';

export const apiRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The campaign ID.
 *         name:
 *           type: string
 *           description: The campaign name.
 *         description:
 *           type: string
 *           description: The campaign description.
 *         type:
 *           type: string
 *           enum: [nft, overlay]
 *           description: The campaign type.
 *         reward_info:
 *           type: object
 *           properties:
 *             totalPool:
 *               type: string
 *             dailyRate:
 *               type: string
 *         created_at:
 *           type: integer
 *           description: Creation timestamp.
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         social_platform:
 *           type: string
 *         social_handle:
 *           type: string
 *         wallet_address:
 *           type: string
 *         created_at:
 *           type: integer
 *     Verification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         campaign_id:
 *           type: string
 *         pfp_id:
 *           type: integer
 *         epoch:
 *           type: integer
 *         verified_at:
 *           type: integer
 *         onchain_receipt_tx_hash:
 *           type: string
 */

/**
 * @swagger
 * /v1/campaigns:
 *   get:
 *     summary: Retrieve a list of campaigns
 *     responses:
 *       200:
 *         description: A list of campaigns.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */
apiRouter.get('/campaigns', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM campaigns');
    const campaigns = stmt.all();
    res.json(campaigns);
  } catch (error) {
    logger.error('Failed to fetch campaigns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/campaigns/{id}:
 *   get:
 *     summary: Retrieve a single campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single campaign.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 */
apiRouter.get('/campaigns/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM campaigns WHERE id = ?');
    const campaign = stmt.get(req.params.id);
    if (campaign) {
      res.json(campaign);
    } else {
      res.status(404).json({ error: 'Campaign not found' });
    }
  } catch (error) {
    logger.error(`Failed to fetch campaign ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/verifications:
 *   get:
 *     summary: Retrieve a list of verifications
 *     responses:
 *       200:
 *         description: A list of verifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Verification'
 */
apiRouter.get('/verifications', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM verifications');
    const verifications = stmt.all();
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
 *     summary: Retrieve a list of target PFP hashes for a campaign
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of PFP hashes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
apiRouter.get('/target-pfps/:campaignId', (req, res) => {
  try {
    const stmt = db.prepare('SELECT pfp_hash FROM target_pfps WHERE campaign_id = ?');
    const hashes = stmt.all(req.params.campaignId).map((row: any) => row.pfp_hash);
    res.json(hashes);
  } catch (error) {
    logger.error(`Failed to fetch target PFPs for campaign ${req.params.campaignId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
apiRouter.get('/users', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM users');
    const users = stmt.all();
    res.json(users);
  } catch (error) {
    logger.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// =============================================================================
// NEW ENDPOINTS
// =============================================================================

/**
 * @swagger
 * /v1/verifications:
 *   post:
 *     summary: Record a batch of new verifications for an epoch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignId:
 *                 type: string
 *               epoch:
 *                 type: number
 *               verifiedHandles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Verifications recorded successfully.
 */
apiRouter.post('/verifications', (req, res) => {
  const { campaignId, epoch, verifiedHandles } = req.body;
  logger.info(`Request received: POST /v1/verifications for campaign ${campaignId}, epoch ${epoch}`);

  if (!campaignId || !epoch || !Array.isArray(verifiedHandles)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const recordVerifications = db.transaction((verifications: string[]) => {
      const userStmt = db.prepare('SELECT id FROM users WHERE social_handle = ?');
      const pfpStmt = db.prepare('INSERT INTO pfps (user_id, source_url, captured_at, pfp_hash) VALUES (?, ?, ?, ?) RETURNING id');
      const verificationStmt = db.prepare('INSERT INTO verifications (user_id, campaign_id, pfp_id, epoch, verified_at) VALUES (?, ?, ?, ?, ?)');
      
      let count = 0;
      for (const handle of verifications) {
        const user = userStmt.get(handle) as { id: number } | undefined;
        if (user) {
          // In a real system, the oracle would provide the actual URL and hash.
          // For the hackathon, we'll use a mock hash based on the handle.
          const mockPfpHash = keccak256(`mock-pfp-for-${handle}-epoch-${epoch}`);
          const pfpResult = pfpStmt.get(user.id, 'http://mock.url/pfp.png', Date.now(), mockPfpHash) as { id: number };
          verificationStmt.run(user.id, campaignId, pfpResult.id, epoch, Date.now());
          count++;
        } else {
          logger.warn(`Could not find user with handle: ${handle} to record verification.`);
        }
      }
      return count;
    });

    const insertedCount = recordVerifications(verifiedHandles);
    logger.info(`Successfully recorded ${insertedCount} verifications.`);
    res.status(201).json({ message: `Recorded ${insertedCount} verifications` });

  } catch (error) {
    logger.error(`Failed to record verifications for campaign ${campaignId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /v1/user-status/{socialHandle}:
 *   get:
 *     summary: Get the verification status of a user across all campaigns
 *     parameters:
 *       - in: path
 *         name: socialHandle
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status details.
 *       404:
 *         description: User not found.
 */
apiRouter.get('/user-status/:socialHandle', (req, res) => {
    const { socialHandle } = req.params;
    logger.info(`Request received: GET /v1/user-status/${socialHandle}`);
    try {
        const userStmt = db.prepare('SELECT * FROM users WHERE social_handle = ?');
        const user = userStmt.get(socialHandle) as any;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const verificationStmt = db.prepare(`
            SELECT campaign_id, MAX(epoch) as latest_epoch
            FROM verifications
            WHERE user_id = ?
            GROUP BY campaign_id
        `);
        const verifications = verificationStmt.all(user.id) as any[];

        // In a real app, we'd check the live contract here. For the demo, we'll assume not claimed.
        const response = {
            user,
            campaigns: verifications.map(v => ({
                campaignId: v.campaign_id,
                latestEpoch: v.latest_epoch,
                isClaimable: true // Mocked for demo
            }))
        };

        res.json(response);
    } catch (error) {
        logger.error(`Failed to fetch user status for ${socialHandle}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /v1/proof/{campaignId}/{socialHandle}:
 *   get:
 *     summary: Get a Merkle proof for a user to claim rewards for a campaign
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: socialHandle
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The Merkle proof and reward details.
 *       404:
 *         description: User or verification not found.
 */
apiRouter.get('/proof/:campaignId/:socialHandle', (req, res) => {
    const { campaignId, socialHandle } = req.params;
    logger.info(`Request received: GET /v1/proof/${campaignId}/${socialHandle}`);
    try {
        // This is a simplified version for the hackathon.
        // It reconstructs the tree from the verifications table for the latest epoch.
        const epochStmt = db.prepare('SELECT MAX(epoch) as latest_epoch FROM verifications WHERE campaign_id = ?');
        const epochResult = epochStmt.get(campaignId) as { latest_epoch: number | null };

        if (epochResult?.latest_epoch === null) {
            return res.status(404).json({ error: 'No verifications found for this campaign' });
        }
        const latestEpoch = epochResult.latest_epoch;

        const verificationsStmt = db.prepare(`
            SELECT u.social_handle, u.wallet_address
            FROM verifications v
            JOIN users u ON v.user_id = u.id
            WHERE v.campaign_id = ? AND v.epoch = ?
        `);
        const verifications = verificationsStmt.all(campaignId, latestEpoch) as any[];

        const rewardAmount = ethers.parseEther('100'); // This should be dynamic in a real app

        const leaves = verifications.map(v =>
            ethers.solidityPackedKeccak256(["string", "uint256"], [v.social_handle, rewardAmount])
        );
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

        const userLeaf = ethers.solidityPackedKeccak256(["string", "uint256"], [socialHandle, rewardAmount]);
        const proof = tree.getHexProof(userLeaf);

        if (proof.length === 0 && !tree.getHexRoot().includes(userLeaf)) {
             return res.status(404).json({ error: 'User is not eligible for a reward in this epoch' });
        }

        res.json({
            epoch: latestEpoch,
            amount: rewardAmount.toString(),
            proof,
        });
    } catch (error) {
        logger.error(`Failed to generate proof for ${socialHandle} in campaign ${campaignId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
