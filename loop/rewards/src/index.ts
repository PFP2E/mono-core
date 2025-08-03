import { OpenAPI, CampaignsService } from '@pfp2e/sdk/client';

// Configure the API client to point to the running records service
OpenAPI.BASE = process.env.RECORDS_API_URL || 'http://localhost:8787';

async function main() {
  console.log('Rewards service starting...');
  console.log(`Connecting to records API at: ${OpenAPI.BASE}`);

  try {
    // Fetch all campaigns from the records service
    const campaigns = await CampaignsService.getV1Campaigns();

    if (!campaigns || campaigns.length === 0) {
      console.log('No campaigns found. Nothing to process.');
      return;
    }

    console.log(`Found ${campaigns.length} campaigns. Processing...`);

    // In a real scenario, we would iterate through campaigns and verifications
    // to calculate rewards. For now, we just log the campaign names.
    for (const campaign of campaigns) {
      console.log(`- Processing campaign: ${campaign.name}`);
    }

    console.log('Rewards service finished successfully.');
  } catch (error) {
    console.error('Failed to fetch data from the records API:');
    console.error(error);
    process.exit(1);
  }
}

// Execute the main function
main();