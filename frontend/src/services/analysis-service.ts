import { apiClient } from './api';
import type { InfluencerInput } from '@/types/api';

/**
 * Runs the full analysis pipeline against a given influencer input.
 * This is the single "mega" endpoint used for one-shot full profile loads.
 */
export const analysisService = {
  analyze: async (influencer: InfluencerInput) => {
    const { data } = await apiClient.post('/analyze/', { influencer });
    return data;
  },
};
