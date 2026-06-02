/** Matches InfluencerInput Pydantic schema on the FastAPI backend. */
export interface InfluencerInput {
  influencer_id?:        string;
  username?:             string;
  niche?:                string;
  platform?:             string;
  country?:              string;
  tier?:                 string;
  is_verified?:          boolean;
  followers?:            number;
  following?:            number;
  total_posts?:          number;
  account_age_days?:     number;
  avg_likes?:            number;
  avg_comments?:         number;
  avg_shares?:           number;
  avg_saves?:            number;
  avg_views?:            number;
  avg_reel_plays?:       number;
  post_frequency?:       number;
  story_frequency?:      number;
  peak_posting_hour?:    number;
  comment_quality_ratio?: number;
  posting_consistency?:  number;
  like_spike_variance?:  number;
  growth_velocity?:      number;
  audience_quality_score?: number;
  avg_likes_7d?:         number;
  avg_comments_7d?:      number;
  engagement_rate_7d?:   number;
  posts_this_week?:      number;
}
