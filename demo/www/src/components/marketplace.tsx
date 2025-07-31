import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { campaigns } from '@/lib/mock-data';

const ApyIndicator = ({ color }: { color: 'green' | 'orange' }) => (
  <div className="w-3 h-3 flex items-center justify-center">
    <div className={`w-1.5 h-[5px] ${color === 'green' ? 'bg-green-500' : 'bg-orange-700'}`} />
  </div>
);

export const Marketplace = () => {
  return (
    <div className="py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-8">Marketplace</h2>
      <div className="w-full max-w-6xl mx-auto overflow-x-auto">
        <Card className="min-w-[1024px] rounded-3xl border-border bg-card/50 overflow-hidden">
          <CardHeader className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b border-border">
            <div className="col-span-4 text-muted-foreground text-sm font-medium">Campaign</div>
            <div className="col-span-2 text-muted-foreground text-sm font-medium">Participants</div>
            <div className="col-span-2 text-muted-foreground text-sm font-medium">Reward Pool</div>
            <div className="col-span-2 text-muted-foreground text-sm font-medium">Daily Reward</div>
            <div className="col-span-2 text-muted-foreground text-sm font-medium">NFT floor APY</div>
          </CardHeader>

          <CardContent className="p-0">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="grid grid-cols-12 gap-4 items-center px-4 py-4 border-b border-border last:border-b-0">
                <div className="col-span-4 flex items-center gap-4">
                  <img className="w-16 h-16 rounded-xl" src={campaign.imageUrl} alt={campaign.name.replace('<br/>', ' ')} />
                  <div className="text-card-foreground text-base font-medium leading-snug" dangerouslySetInnerHTML={{ __html: campaign.name }} />
                </div>
                <div className="col-span-2 text-card-foreground text-base font-medium leading-snug">{campaign.participants.toLocaleString()}</div>
                <div className="col-span-2 text-card-foreground text-base font-medium leading-snug">{campaign.rewardPool}</div>
                <div className="col-span-2 text-card-foreground text-base font-medium leading-snug">{campaign.dailyReward}</div>
                <div className="col-span-2 flex items-center justify-end gap-4">
                  <div className="flex items-center gap-1">
                    <ApyIndicator color={campaign.apyColor} />
                    <div className="text-card-foreground text-base font-medium leading-snug">{campaign.apy}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button disabled={!campaign.fundable} variant="secondary" size="sm">Fund</Button>
                    <Button disabled={!campaign.claimable} size="sm">Claim</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
