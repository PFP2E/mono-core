// src/hooks/useUserCampaigns.ts
'use client'

import { useState, useEffect } from 'react';
import { useXSession } from './useXSession';

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
        const res = await fetch(`/api/records/user-status/${session.username}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch user status');
        }
        const data: UserStatus = await res.json();
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
