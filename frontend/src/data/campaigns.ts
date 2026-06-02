import type { CampaignMetrics, HistoricalCampaign } from '@/types';

export const defaultCampaignMetrics: CampaignMetrics = {
  successProbability: 91,
  estimatedReach: 2_400_000,
  estimatedEngagement: 187_000,
  predictedROI: 4.2,
  avgCostPerEngagement: 0.38,
};

export const historicalCampaigns: HistoricalCampaign[] = [
  {
    id: 'camp-001',
    name: 'Summer Fit Challenge',
    brand: 'Nike',
    reach: 2_800_000,
    engagement: 214_000,
    roi: 4.1,
    status: 'Completed',
    date: '2026-04-10',
    type: 'Awareness',
  },
  {
    id: 'camp-002',
    name: 'Capture Everything',
    brand: 'GoPro',
    reach: 1_600_000,
    engagement: 138_000,
    roi: 3.7,
    status: 'Completed',
    date: '2026-02-20',
    type: 'Product Launch',
  },
  {
    id: 'camp-003',
    name: 'Spring Essentials Drop',
    brand: 'Adidas',
    reach: 2_100_000,
    engagement: 189_000,
    roi: 4.8,
    status: 'Completed',
    date: '2025-12-05',
    type: 'Conversion',
  },
  {
    id: 'camp-004',
    name: 'Sound of Summer',
    brand: 'Spotify',
    reach: 3_200_000,
    engagement: 247_000,
    roi: 2.9,
    status: 'Active',
    date: '2026-05-15',
    type: 'Awareness',
  },
  {
    id: 'camp-005',
    name: 'Shot on iPhone',
    brand: 'Apple',
    reach: 4_500_000,
    engagement: 312_000,
    roi: 5.6,
    status: 'Planned',
    date: '2026-06-20',
    type: 'Product Launch',
  },
];

// Simulator: recalculate metrics based on inputs
export function calculateCampaignMetrics(
  budget: number,
  duration: number,
  campaignType: 'Awareness' | 'Conversion' | 'Product Launch'
): CampaignMetrics {
  const typeMultipliers: Record<string, number> = {
    Awareness: 1.0,
    Conversion: 0.85,
    'Product Launch': 1.15,
  };
  const multiplier = typeMultipliers[campaignType] ?? 1.0;
  const durationFactor = Math.min(duration / 30, 2.5);
  const budgetFactor = Math.log10(budget + 1) / Math.log10(50001);

  const reach = Math.round(1_000_000 * multiplier * durationFactor * budgetFactor * 1.2);
  const engagement = Math.round(reach * 0.078);
  const roi = parseFloat((2.5 + multiplier * budgetFactor * 3).toFixed(1));
  const cpe = parseFloat((budget / Math.max(engagement, 1)).toFixed(2));
  const prob = Math.min(95, Math.round(70 + multiplier * budgetFactor * 30));

  return {
    successProbability: prob,
    estimatedReach: reach,
    estimatedEngagement: engagement,
    predictedROI: roi,
    avgCostPerEngagement: cpe,
  };
}
