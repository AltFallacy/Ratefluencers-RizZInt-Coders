import type { RatefluencerScoreData } from '@/types';

export const ratefluencerScore: RatefluencerScoreData = {
  composite: 91,
  tier: 'Elite',
  tierLabel: 'Elite Influencer',
  percentile: 96,
  categories: [
    { name: 'Authenticity', score: 87, weight: 25, industryAvg: 72 },
    { name: 'Growth Trajectory', score: 74, weight: 20, industryAvg: 63 },
    { name: 'Campaign Success', score: 91, weight: 25, industryAvg: 69 },
    { name: 'Brand Compatibility', score: 89, weight: 20, industryAvg: 71 },
    { name: 'Audience Quality', score: 93, weight: 10, industryAvg: 74 },
  ],
  comparableInfluencers: [
    {
      id: 'comp-001',
      name: 'Lena Voss',
      username: '@lenavoss',
      score: 89,
      platform: 'Instagram',
    },
    {
      id: 'comp-002',
      name: 'Derek Tran',
      username: '@derektran',
      score: 93,
      platform: 'YouTube',
    },
    {
      id: 'comp-003',
      name: 'Mia Fontaine',
      username: '@miafontaine',
      score: 88,
      platform: 'Instagram',
    },
  ],
  strengths: ['Campaign Success', 'Audience Quality'],
  improvementAreas: ['Growth Trajectory'],
};
