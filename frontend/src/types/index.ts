export type Platform = 'Instagram' | 'YouTube' | 'TikTok' | 'Twitter';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type CampaignStatus = 'Completed' | 'Active' | 'Planned';
export type CampaignType = 'Awareness' | 'Conversion' | 'Product Launch';
export type ScoreTier = 'Elite' | 'Premium' | 'Standard' | 'Rising';
export type SortOption = 'score' | 'alpha';

// ─── Influencer ─────────────────────────────────────────────────────────────

export interface InfluencerScores {
  authenticity: number;
  growth: number;
  campaign: number;
  brandCompatibility: number;
  audienceQuality: number;
  composite: number;
}

export interface Influencer {
  id: string;
  name: string;
  username: string;
  platform: Platform;
  followerCount: number;
  followingCount: number;
  engagementRate: number;
  niche: string[];
  location: string;
  verified: boolean;
  scores: InfluencerScores;
  joinedDate: string;
}

// ─── KPI Cards ───────────────────────────────────────────────────────────────

export interface KpiCardData {
  id: string;
  label: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  suffix?: string;
  prefix?: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface FollowerGrowthPoint {
  month: string;
  total: number;
  organic: number;
}

export interface EngagementPoint {
  week: string;
  rate: number;
  industryAvg: number;
}

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'campaign' | 'milestone' | 'evaluation' | 'alert';
}

// ─── Authenticity ─────────────────────────────────────────────────────────────

export interface RiskIndicator {
  id: string;
  label: string;
  risk: RiskLevel;
  description: string;
}

export interface AuthenticityData {
  overallScore: number;
  riskLevel: RiskLevel;
  fakeFollowerRisk: number;
  botEngagement: number;
  engagementAuthenticity: number;
  audienceQualityScore: number;
  followerComposition: {
    real: number;
    suspicious: number;
    bot: number;
  };
  riskIndicators: RiskIndicator[];
}

// ─── Growth ───────────────────────────────────────────────────────────────────

export interface GrowthForecast {
  period: '30d' | '60d' | '90d';
  label: string;
  predictedGrowth: number;
  confidence: number;
}

export interface GrowthDataPoint {
  date: string;
  actual?: number;
  predicted?: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  isProjected?: boolean;
}

export interface VelocityPoint {
  week: string;
  growth: number;
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

export interface CampaignSimulatorInputs {
  budget: number;
  campaignType: CampaignType;
  duration: number;
}

export interface CampaignMetrics {
  successProbability: number;
  estimatedReach: number;
  estimatedEngagement: number;
  predictedROI: number;
  avgCostPerEngagement: number;
}

export interface HistoricalCampaign {
  id: string;
  name: string;
  brand: string;
  reach: number;
  engagement: number;
  roi: number;
  status: CampaignStatus;
  date: string;
  type: CampaignType;
}

// ─── Brand Matching ───────────────────────────────────────────────────────────

export interface BrandCompatibility {
  audienceOverlap: number;
  contentStyle: number;
  engagementQuality: number;
  brandSafety: number;
}

export interface BrandMatch {
  id: string;
  name: string;
  industry: string[];
  matchScore: number;
  compatibility: BrandCompatibility;
  color: string;
  initials: string;
}

// ─── Ratefluencer Score ───────────────────────────────────────────────────────

export interface ScoreCategory {
  name: string;
  score: number;
  weight: number;
  industryAvg: number;
}

export interface ComparableInfluencer {
  id: string;
  name: string;
  score: number;
  platform: Platform;
  username: string;
}

export interface RatefluencerScoreData {
  composite: number;
  tier: ScoreTier;
  tierLabel: string;
  percentile: number;
  categories: ScoreCategory[];
  comparableInfluencers: ComparableInfluencer[];
  strengths: string[];
  improvementAreas: string[];
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  icon: string;
  href: string;
}
