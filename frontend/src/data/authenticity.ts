import type { AuthenticityData } from '@/types';

export const authenticityData: AuthenticityData = {
  overallScore: 87,
  riskLevel: 'Low',
  fakeFollowerRisk: 12,
  botEngagement: 4,
  engagementAuthenticity: 91,
  audienceQualityScore: 83,
  followerComposition: {
    real: 79,
    suspicious: 9,
    bot: 12,
  },
  riskIndicators: [
    {
      id: 'ri-001',
      label: 'Sudden Follower Spike',
      risk: 'Medium',
      description: 'A 42K follower gain in 48 hours detected on May 26 — likely from viral content but warrants monitoring.',
    },
    {
      id: 'ri-002',
      label: 'Low Comment-to-Like Ratio',
      risk: 'Low',
      description: 'Comment-to-like ratio of 1:38 is slightly below the 1:30 benchmark but within acceptable range.',
    },
    {
      id: 'ri-003',
      label: 'Geographic Anomaly',
      risk: 'Low',
      description: '6% of followers originate from regions inconsistent with audience demographics.',
    },
    {
      id: 'ri-004',
      label: 'Bot Engagement Detected',
      risk: 'Low',
      description: '4% of engagement interactions flagged as automated or low-quality bot activity.',
    },
    {
      id: 'ri-005',
      label: 'Audience Authenticity',
      risk: 'Low',
      description: '91% of engagement is classified as authentic human interaction. Industry average is 84%.',
    },
  ],
};
