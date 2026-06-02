import { useQuery } from '@tanstack/react-query';
import { influencerService } from '@/services/influencer-service';
import { useInfluencerStore } from '@/store';

// Fallback mock data (used when backend is offline)
import { brandMatches }          from '@/data/brands';
import { ratefluencerScore }     from '@/data/score';
import { defaultCampaignMetrics, historicalCampaigns } from '@/data/campaigns';
import { authenticityData }      from '@/data/authenticity';
import { growthForecasts, growthTimelineData } from '@/data/growth';
import { mockInfluencer, mockInfluencerList }  from '@/data/influencer';

// ─── Influencer list ──────────────────────────────────────────────────────────

export function useInfluencerList() {
  return useQuery({
    queryKey: ['influencers'],
    queryFn: () => influencerService.list(),
    placeholderData: mockInfluencerList,
    retry: 1,
  });
}

// ─── Single influencer profile ────────────────────────────────────────────────

export function useInfluencer(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['influencer', targetId],
    queryFn: () => influencerService.getById(targetId),
    placeholderData: mockInfluencer,
    retry: 1,
  });
}

// ─── Authenticity ─────────────────────────────────────────────────────────────

export function useAuthenticity(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['authenticity', targetId],
    queryFn: () => influencerService.getAuthenticity(targetId),
    placeholderData: authenticityData,
    retry: 1,
  });
}

// ─── Growth ──────────────────────────────────────────────────────────────────

export function useGrowthForecasts(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['growth', 'forecasts', targetId],
    queryFn: () => influencerService.getGrowthForecasts(targetId),
    placeholderData: growthForecasts,
    retry: 1,
  });
}

export function useGrowthTimeline(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['growth', 'timeline', targetId],
    queryFn: () => influencerService.getGrowthTimeline(targetId),
    placeholderData: growthTimelineData,
    retry: 1,
  });
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

export function useCampaignMetrics(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['campaign', 'metrics', targetId],
    queryFn: () => influencerService.getCampaignMetrics(targetId),
    placeholderData: defaultCampaignMetrics,
    retry: 1,
  });
}

export function useHistoricalCampaigns(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['campaign', 'history', targetId],
    queryFn: () => influencerService.getHistoricalCampaigns(targetId),
    placeholderData: historicalCampaigns,
    retry: 1,
  });
}

// ─── Brand Matching ───────────────────────────────────────────────────────────

export function useBrands(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['brands', targetId],
    queryFn: () => influencerService.getBrandMatches(targetId),
    placeholderData: brandMatches,
    retry: 1,
  });
}

// ─── Ratefluencer Score ───────────────────────────────────────────────────────

export function useRatefluencerScore(id?: string) {
  const activeId = useInfluencerStore((state) => state.activeInfluencerId);
  const targetId = id ?? activeId;

  return useQuery({
    queryKey: ['score', targetId],
    queryFn: () => influencerService.getScore(targetId),
    placeholderData: ratefluencerScore,
    retry: 1,
  });
}

