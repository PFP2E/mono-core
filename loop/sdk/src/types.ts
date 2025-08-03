export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'nft' | 'overlay';
  reward_info?: {
    totalPool?: string;
    dailyRate?: string;
  };
  created_at: number;
}