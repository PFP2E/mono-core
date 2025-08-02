export interface NftCampaignRules {
  type: 'nft';
  collectionAddress: string;
  requireOwnership: boolean;
}

export interface OverlayCampaignRules {
  type: 'overlay';
  overlayAssetUrl: string;
}

export type CampaignRules = NftCampaignRules | OverlayCampaignRules;

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'nft' | 'overlay';
  rules: CampaignRules;
  reward_info?: {
    totalPool?: string;
    dailyRate?: string;
  };
  created_at: number;
}
