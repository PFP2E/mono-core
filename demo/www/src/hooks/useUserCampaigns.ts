// src/hooks/useUserCampaigns.ts
'use client'

import { useState, useEffect } from 'react';
import { useXSession } from './useXSession';
import { DefaultService } from '@pfp2e/sdk/client';

interface CampaignStatus {
  campaignId: string;
  latestEpoch: number;
  isClaimable: boolean;
}

interface UserStatus {
  user: {
    id: number;
    social_platform: string;
    social_handle: string;
    wallet_address: string;
  };
  campaigns: CampaignStatus[];
}

export function useUserCampaigns() {
  const { session } = useXSession();
  const [campaigns, setCampaigns] = useState<CampaignStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserStatus() {
      if (!session?.username) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Note: The SDK function is generated from the path parameters, so it becomes getV1UserStatus.
        const data: UserStatus = await DefaultService.getV1UserStatus(session.username);
        setCampaigns(data.campaigns || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserStatus();
  }, [session?.username]);

  return { campaigns, isLoading, error };
}
