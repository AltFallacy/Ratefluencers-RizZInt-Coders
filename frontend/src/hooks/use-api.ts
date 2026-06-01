import { useQuery } from '@tanstack/react-query';
import { brandMatches } from '@/data/brands';
import { ratefluencerScore } from '@/data/score';
import { defaultCampaignMetrics } from '@/data/campaigns';

// Simulated API delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Phase 10: Backend Integration Prep
// These hooks simulate fetching from an API, ready to be swapped with real Axios calls.

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      await delay(600);
      return brandMatches;
    },
  });
}

export function useRatefluencerScore() {
  return useQuery({
    queryKey: ['score'],
    queryFn: async () => {
      await delay(800);
      return ratefluencerScore;
    },
  });
}

export function useCampaignMetrics() {
  return useQuery({
    queryKey: ['campaignMetrics'],
    queryFn: async () => {
      await delay(400);
      return defaultCampaignMetrics;
    },
  });
}
