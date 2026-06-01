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

// ─── Stub implementations (returns mock data via API in production) ────────────

export const influencerService = {
  /**
   * Fetch a single influencer profile by ID.
   * Currently stubbed — will call real API in production.
   */
  getById: async (id: string): Promise<Influencer> => {
    const { data } = await apiClient.get<Influencer>(`/influencers/${id}`);
    return data;
  },

  list: async (): Promise<Influencer[]> => {
    const { data } = await apiClient.get<Influencer[]>('/influencers');
    return data;
  },

  getAuthenticity: async (id: string): Promise<AuthenticityData> => {
    const { data } = await apiClient.get<AuthenticityData>(
      `/influencers/${id}/authenticity`
    );
    return data;
  },

  getGrowthForecasts: async (id: string): Promise<GrowthForecast[]> => {
    const { data } = await apiClient.get<GrowthForecast[]>(
      `/influencers/${id}/growth/forecasts`
    );
    return data;
  },

  getGrowthTimeline: async (id: string): Promise<GrowthDataPoint[]> => {
    const { data } = await apiClient.get<GrowthDataPoint[]>(
      `/influencers/${id}/growth/timeline`
    );
    return data;
  },

  getCampaignMetrics: async (id: string): Promise<CampaignMetrics> => {
    const { data } = await apiClient.get<CampaignMetrics>(
      `/influencers/${id}/campaign/metrics`
    );
    return data;
  },

  getHistoricalCampaigns: async (id: string): Promise<HistoricalCampaign[]> => {
    const { data } = await apiClient.get<HistoricalCampaign[]>(
      `/influencers/${id}/campaign/history`
    );
    return data;
  },

  getBrandMatches: async (id: string): Promise<BrandMatch[]> => {
    const { data } = await apiClient.get<BrandMatch[]>(
      `/influencers/${id}/brands`
    );
    return data;
  },

  getScore: async (id: string): Promise<RatefluencerScoreData> => {
    const { data } = await apiClient.get<RatefluencerScoreData>(
      `/influencers/${id}/score`
    );
    return data;
  },
};
