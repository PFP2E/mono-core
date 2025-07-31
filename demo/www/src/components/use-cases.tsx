import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const useCases = [
  {
    title: "For NFT Projects",
    description: "Instantly transform a static JPEG into an active, reward-bearing asset. Create a powerful incentive for holders to publicly align with the project, increasing its visibility and strengthening the community."
  },
  {
    title: "For Brands",
    description: "Enable 'Wear-to-Earn' campaigns that directly link visual support to tangible rewards. For the first time, get a clear YES/NO answer on who is actively representing your brand visually."
  },
  {
    title: "For Creators",
    description: "Monetize your own 'visual real estate' through fan overlays and digital merch. Launch a campaign and reward your true fans directly, bypassing traditional platform fees."
  },
  {
    title: "For Gaming & Metaverse",
    description: "Bridge the gap between a user's in-game identity and their social identity. Reward players for representing the game on their social profiles, creating a powerful marketing loop."
  }
];

export const UseCases = () => {
  return (
    <div className="py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-8">Use Cases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {useCases.map((useCase) => (
          <Card key={useCase.title} className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-primary">{useCase.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{useCase.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};