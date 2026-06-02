import type { GrowthForecast, GrowthDataPoint, VelocityPoint } from '@/types';

export const growthForecasts: GrowthForecast[] = [
  { period: '30d', label: '30 Days', predictedGrowth: 12_400, confidence: 92 },
  { period: '60d', label: '60 Days', predictedGrowth: 28_700, confidence: 85 },
  { period: '90d', label: '90 Days', predictedGrowth: 51_200, confidence: 76 },
];

export const growthTimelineData: GrowthDataPoint[] = [
  { date: 'Dec 2025', actual: 1_260_000 },
  { date: 'Jan 2026', actual: 1_300_000 },
  { date: 'Feb 2026', actual: 1_350_000 },
  { date: 'Mar 2026', actual: 1_390_000 },
  { date: 'Apr 2026', actual: 1_440_000 },
  { date: 'May 2026', actual: 1_480_000 },
  {
    date: 'Jun 2026',
    predicted: 1_492_400,
    confidenceLow: 1_478_000,
    confidenceHigh: 1_506_800,
    isProjected: true,
  },
  {
    date: 'Jul 2026',
    predicted: 1_508_700,
    confidenceLow: 1_487_000,
    confidenceHigh: 1_530_400,
    isProjected: true,
  },
  {
    date: 'Aug 2026',
    predicted: 1_531_200,
    confidenceLow: 1_499_000,
    confidenceHigh: 1_563_400,
    isProjected: true,
  },
];

export const velocityData: VelocityPoint[] = [
  { week: 'Week 1', growth: 3200 },
  { week: 'Week 2', growth: 5800 },
  { week: 'Week 3', growth: 2100 },
  { week: 'Week 4', growth: 7400 },
  { week: 'Week 5', growth: 4900 },
  { week: 'Week 6', growth: 8200 },
  { week: 'Week 7', growth: 6100 },
  { week: 'Week 8', growth: 9300 },
];
