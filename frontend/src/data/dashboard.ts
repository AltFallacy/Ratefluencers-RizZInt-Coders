import type { KpiCardData, FollowerGrowthPoint, EngagementPoint, ActivityEvent } from '@/types';

export const dashboardKpis: KpiCardData[] = [
  {
    id: 'kpi-authenticity',
    label: 'Authenticity Score',
    value: 87,
    trend: 4.6,
    trendLabel: '+4 pts this week',
    suffix: ' / 100',
  },
  {
    id: 'kpi-growth',
    label: 'Growth Score',
    value: 74,
    trend: 2.8,
    trendLabel: '+2 pts this week',
    suffix: ' / 100',
  },
  {
    id: 'kpi-campaign',
    label: 'Campaign Score',
    value: 91,
    trend: 8.3,
    trendLabel: '+7 pts this week',
    suffix: ' / 100',
  },
  {
    id: 'kpi-composite',
    label: 'Ratefluencer Score',
    value: 84,
    trend: 3.7,
    trendLabel: '+3 pts this week',
    suffix: ' / 100',
  },
];

export const followerGrowthData: FollowerGrowthPoint[] = [
  { month: 'Jun', total: 980_000, organic: 820_000 },
  { month: 'Jul', total: 1_020_000, organic: 847_000 },
  { month: 'Aug', total: 1_080_000, organic: 890_000 },
  { month: 'Sep', total: 1_110_000, organic: 910_000 },
  { month: 'Oct', total: 1_160_000, organic: 945_000 },
  { month: 'Nov', total: 1_200_000, organic: 970_000 },
  { month: 'Dec', total: 1_260_000, organic: 1_010_000 },
  { month: 'Jan', total: 1_300_000, organic: 1_040_000 },
  { month: 'Feb', total: 1_350_000, organic: 1_080_000 },
  { month: 'Mar', total: 1_390_000, organic: 1_100_000 },
  { month: 'Apr', total: 1_440_000, organic: 1_140_000 },
  { month: 'May', total: 1_480_000, organic: 1_175_000 },
];

export const engagementData: EngagementPoint[] = [
  { week: 'W1', rate: 4.2, industryAvg: 3.1 },
  { week: 'W2', rate: 5.1, industryAvg: 3.1 },
  { week: 'W3', rate: 3.8, industryAvg: 3.1 },
  { week: 'W4', rate: 6.3, industryAvg: 3.1 },
  { week: 'W5', rate: 4.7, industryAvg: 3.1 },
  { week: 'W6', rate: 5.4, industryAvg: 3.1 },
  { week: 'W7', rate: 4.9, industryAvg: 3.1 },
  { week: 'W8', rate: 5.8, industryAvg: 3.1 },
];

export const activityFeed: ActivityEvent[] = [
  {
    id: 'act-001',
    title: 'Campaign with Nike completed',
    description: 'Summer Fit campaign delivered 2.8M impressions with 4.1x ROI',
    timestamp: '2026-05-31T10:24:00Z',
    type: 'campaign',
  },
  {
    id: 'act-002',
    title: 'Authenticity re-evaluated',
    description: 'Score improved from 83 to 87 after bot cleanup detected',
    timestamp: '2026-05-30T14:52:00Z',
    type: 'evaluation',
  },
  {
    id: 'act-003',
    title: 'Milestone: 1.48M followers',
    description: 'Crossed 1.48 million total followers across platforms',
    timestamp: '2026-05-28T08:15:00Z',
    type: 'milestone',
  },
  {
    id: 'act-004',
    title: 'Growth spike detected',
    description: 'Unusual +42K follower gain in 48 hours — flagged for review',
    timestamp: '2026-05-26T19:37:00Z',
    type: 'alert',
  },
  {
    id: 'act-005',
    title: 'New brand match: Apple',
    description: 'Apple added with 88% compatibility score based on audience data',
    timestamp: '2026-05-24T11:08:00Z',
    type: 'evaluation',
  },
];
