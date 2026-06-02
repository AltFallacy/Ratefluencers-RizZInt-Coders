import { apiClient } from './api';
import type {
  Influencer,
  AuthenticityData,
  GrowthForecast,
  GrowthDataPoint,
  CampaignMetrics,
  HistoricalCampaign,
  BrandMatch,
  RatefluencerScoreData,
} from '@/types';

// ─── Helper: map snake_case API → camelCase frontend types ───────────────────

function mapAuthenticity(raw: Record<string, unknown>): AuthenticityData {
  return {
    overallScore:           (raw.overall_score as number)           ?? 80,
    riskLevel:              (raw.risk_level as 'Low' | 'Medium' | 'High') ?? 'Low',
    fakeFollowerRisk:       (raw.fake_follower_risk as number)      ?? 15,
    botEngagement:          (raw.bot_engagement as number)          ?? 5,
    engagementAuthenticity: (raw.engagement_authenticity as number) ?? 85,
    audienceQualityScore:   (raw.audience_quality_score as number)  ?? 80,
    followerComposition:    (raw.follower_composition as { real: number; suspicious: number; bot: number }) ?? { real: 80, suspicious: 10, bot: 10 },
    riskIndicators:         (raw.risk_indicators as AuthenticityData['riskIndicators']) ?? [],
  };
}

function mapGrowthForecasts(raw: Record<string, unknown>[]): GrowthForecast[] {
  return (raw ?? []).map((f) => ({
    period:          f.period as '30d' | '60d' | '90d',
    label:           f.label as string,
    predictedGrowth: (f.predicted_growth ?? f.predictedGrowth) as number,
    confidence:      f.confidence as number,
  }));
}

function mapScore(raw: Record<string, unknown>): RatefluencerScoreData {
  return {
    composite:    (raw.composite as number)    ?? 80,
    tier:         (raw.tier as 'Elite' | 'Premium' | 'Standard' | 'Rising') ?? 'Standard',
    tierLabel:    (raw.tier_label ?? raw.tierLabel) as string ?? 'Standard Influencer',
    percentile:   (raw.percentile as number)   ?? 70,
    categories:   (raw.categories as RatefluencerScoreData['categories']) ?? [],
    comparableInfluencers: (raw.comparable_influencers ?? raw.comparableInfluencers) as RatefluencerScoreData['comparableInfluencers'] ?? [],
    strengths:    (raw.strengths as string[])          ?? [],
    improvementAreas: (raw.improvement_areas ?? raw.improvementAreas) as string[] ?? [],
  };
}

function mapBrandMatches(raw: Record<string, unknown>[]): BrandMatch[] {
  return (raw ?? []).map((b, i) => ({
    id:         (b.id as string)         ?? `brand-${i + 1}`,
    name:       (b.brand_name ?? b.name) as string,
    industry:   (b.industry as string[]) ?? [],
    matchScore: (b.match_score ?? b.matchScore) as number,
    compatibility: (b.compatibility as BrandMatch['compatibility']) ?? {
      audienceOverlap: 80, contentStyle: 80, engagementQuality: 80, brandSafety: 80,
    },
    color:      (b.color as string)      ?? '#7c3aed',
    initials:   (b.initials as string)   ?? 'BR',
  }));
}

function mapCampaign(raw: Record<string, unknown>): CampaignMetrics {
  return {
    successProbability:     (raw.success_probability ?? raw.successProbability) as number ?? 80,
    estimatedReach:         (raw.estimated_reach ?? raw.estimatedReach) as number         ?? 1_000_000,
    estimatedEngagement:    (raw.estimated_engagement ?? raw.estimatedEngagement) as number ?? 80_000,
    predictedROI:           (raw.predicted_roi ?? raw.predictedROI) as number             ?? 3.0,
    avgCostPerEngagement:   (raw.avg_cost_per_engagement ?? raw.avgCostPerEngagement) as number ?? 0.40,
  };
}

// ─── Service methods ─────────────────────────────────────────────────────────

export const influencerService = {
  /**
   * Fetch a single influencer profile by ID.
   */
  getById: async (id: string): Promise<Influencer> => {
    const { data } = await apiClient.get<Influencer>(`/analyze/influencers/${id}`);
    return data;
  },

  list: async (): Promise<Influencer[]> => {
    const { data } = await apiClient.get<Influencer[]>('/analyze/influencers');
    return data;
  },

  getAuthenticity: async (id: string): Promise<AuthenticityData> => {
    // Fetch full influencer then run authenticity prediction
    const inf = await influencerService.getById(id);
    const payload = _toInfluencerInput(inf);
    const { data } = await apiClient.post('/authenticity/predict', payload);
    return mapAuthenticity(data as Record<string, unknown>);
  },

  getGrowthForecasts: async (id: string): Promise<GrowthForecast[]> => {
    const inf = await influencerService.getById(id);
    const payload = _toInfluencerInput(inf);
    const { data } = await apiClient.post<{ forecasts: Record<string, unknown>[] }>('/growth/predict', payload);
    return mapGrowthForecasts(data.forecasts ?? []);
  },

  getGrowthTimeline: async (id: string): Promise<GrowthDataPoint[]> => {
    const inf = await influencerService.getById(id);
    const payload = _toInfluencerInput(inf);
    const { data } = await apiClient.post<{ timeline: GrowthDataPoint[] }>('/growth/predict', payload);
    return (data.timeline ?? []) as GrowthDataPoint[];
  },

  getCampaignMetrics: async (id: string): Promise<CampaignMetrics> => {
    const inf = await influencerService.getById(id);
    const payload = { influencer: _toInfluencerInput(inf) };
    const { data } = await apiClient.post('/score/compute', payload);
    const raw = (data as Record<string, unknown>).campaign_simulation as Record<string, unknown> ?? data as Record<string, unknown>;
    return mapCampaign(raw);
  },

  getHistoricalCampaigns: async (_id: string): Promise<HistoricalCampaign[]> => {
    // Historical campaign data is not yet seeded in the DB — return empty for now.
    // The frontend falls back to mock data via the hook.
    return [];
  },

  getBrandMatches: async (id: string): Promise<BrandMatch[]> => {
    const inf = await influencerService.getById(id);
    const payload = {
      influencer: _toInfluencerInput(inf),
      brands: _defaultBrandInputs(),
    };
    const { data } = await apiClient.post<{ brands: Record<string, unknown>[] }>('/brands/match', payload);
    return mapBrandMatches(data.brands ?? []);
  },

  getScore: async (id: string): Promise<RatefluencerScoreData> => {
    const inf = await influencerService.getById(id);
    const payload = { influencer: _toInfluencerInput(inf) };
    const { data } = await apiClient.post('/score/compute', payload);
    return mapScore(data as Record<string, unknown>);
  },
};

// ─── Private helpers ─────────────────────────────────────────────────────────

/** Convert a stored Influencer profile to the InfluencerInput shape expected by ML endpoints. */
function _toInfluencerInput(inf: Influencer): Record<string, unknown> {
  return {
    influencer_id:          inf.id,
    username:               inf.username.replace('@', ''),
    niche:                  inf.niche[0]?.toLowerCase() ?? 'lifestyle',
    platform:               inf.platform,
    country:                'US',
    tier:                   _getTier(inf.followerCount),
    is_verified:            inf.verified,
    followers:              inf.followerCount,
    following:              inf.followingCount,
    total_posts:            1200,
    account_age_days:       2600,
    avg_likes:              inf.followerCount * (inf.engagementRate / 100) * 0.9,
    avg_comments:           inf.followerCount * (inf.engagementRate / 100) * 0.08,
    avg_shares:             inf.followerCount * (inf.engagementRate / 100) * 0.03,
    avg_saves:              inf.followerCount * (inf.engagementRate / 100) * 0.05,
    avg_views:              inf.followerCount * 0.3,
    avg_reel_plays:         inf.followerCount * 0.22,
    post_frequency:         4,
    story_frequency:        8,
    peak_posting_hour:      19,
    comment_quality_ratio:  0.79,
    posting_consistency:    0.85,
    like_spike_variance:    0.21,
    growth_velocity:        5.2,
    audience_quality_score: inf.scores.audienceQuality ?? 80,
    avg_likes_7d:           inf.followerCount * (inf.engagementRate / 100) * 0.9,
    avg_comments_7d:        inf.followerCount * (inf.engagementRate / 100) * 0.08,
    engagement_rate_7d:     inf.engagementRate,
    posts_this_week:        4,
  };
}

function _getTier(followers: number): string {
  if (followers >= 1_000_000) return 'mega';
  if (followers >= 100_000)   return 'macro';
  if (followers >= 10_000)    return 'micro';
  return 'nano';
}

function _defaultBrandInputs() {
  return [
    { brand_name: 'Nike',    category: 'fitness',  target_age_min: 18, target_age_max: 35, target_gender: 'all', min_followers: 100000, max_followers: 5000000, budget_tier: 'premium', country_focus: 'US' },
    { brand_name: 'Adidas',  category: 'fitness',  target_age_min: 18, target_age_max: 35, target_gender: 'all', min_followers: 100000, max_followers: 5000000, budget_tier: 'premium', country_focus: 'US' },
    { brand_name: 'Apple',   category: 'tech',     target_age_min: 22, target_age_max: 45, target_gender: 'all', min_followers: 500000, max_followers: 10000000, budget_tier: 'premium', country_focus: 'GLOBAL' },
    { brand_name: 'GoPro',   category: 'lifestyle',target_age_min: 18, target_age_max: 40, target_gender: 'all', min_followers: 50000,  max_followers: 2000000, budget_tier: 'mid',     country_focus: 'US' },
    { brand_name: 'Samsung', category: 'tech',     target_age_min: 20, target_age_max: 45, target_gender: 'all', min_followers: 500000, max_followers: 10000000, budget_tier: 'premium', country_focus: 'GLOBAL' },
    { brand_name: 'Spotify', category: 'lifestyle',target_age_min: 16, target_age_max: 35, target_gender: 'all', min_followers: 100000, max_followers: 5000000, budget_tier: 'mid',     country_focus: 'GLOBAL' },
  ];
}
