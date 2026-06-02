from __future__ import annotations
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


# ── Request Schemas ──────────────────────────────────────────────────────────

class InfluencerInput(BaseModel):
    """Core metrics that every ML model consumes."""
    # Identity
    influencer_id:       str   = Field(default="inf-001",    description="Internal ID")
    username:            str   = Field(default="ariawestfield")
    niche:               str   = Field(default="lifestyle",   description="Primary niche (tech/beauty/fitness/fashion/education)")
    platform:            str   = Field(default="Instagram")
    country:             str   = Field(default="US")
    tier:                str   = Field(default="macro",       description="nano/micro/macro/mega")
    is_verified:         bool  = Field(default=True)

    # Follower stats
    followers:           int   = Field(default=1_480_000)
    following:           int   = Field(default=842)
    total_posts:         int   = Field(default=1200)
    account_age_days:    int   = Field(default=2600)

    # Engagement metrics
    avg_likes:           float = Field(default=3_100.0)
    avg_comments:        float = Field(default=140.0)
    avg_shares:          float = Field(default=65.0)
    avg_saves:           float = Field(default=105.0)
    avg_views:           float = Field(default=41_000.0)
    avg_reel_plays:      float = Field(default=30_750.0)

    # Posting behaviour
    post_frequency:      float = Field(default=4.0,  description="Posts per week")
    story_frequency:     float = Field(default=8.0,  description="Stories per week")
    peak_posting_hour:   int   = Field(default=19)

    # Quality signals
    comment_quality_ratio:     float = Field(default=0.79)
    posting_consistency:       float = Field(default=0.85)
    like_spike_variance:       float = Field(default=0.21)
    growth_velocity:           float = Field(default=5.2)
    audience_quality_score:    float = Field(default=83.0)

    # Weekly rolling stats
    avg_likes_7d:         float = Field(default=3_100.0)
    avg_comments_7d:      float = Field(default=140.0)
    engagement_rate_7d:   float = Field(default=4.7)
    posts_this_week:      int   = Field(default=4)


class BrandInput(BaseModel):
    """Brand criteria used for the compatibility matcher."""
    brand_name:      str = Field(default="Nike")
    category:        str = Field(default="fitness",  description="Must match a niche key")
    target_age_min:  int = Field(default=18)
    target_age_max:  int = Field(default=35)
    target_gender:   str = Field(default="all",      description="all/female/male")
    min_followers:   int = Field(default=100_000)
    max_followers:   int = Field(default=5_000_000)
    budget_tier:     str = Field(default="mid",      description="micro/mid/premium")
    country_focus:   str = Field(default="US")


class AnalyzeRequest(BaseModel):
    influencer: InfluencerInput
    brands:     List[BrandInput] = Field(default_factory=list)


class CampaignSimulatorRequest(BaseModel):
    influencer:    InfluencerInput
    budget:        float = Field(default=10_000.0)
    duration_days: int   = Field(default=30)
    campaign_type: Literal["Awareness", "Conversion", "Product Launch"] = "Awareness"


# ── Response Schemas ──────────────────────────────────────────────────────────

class AuthenticityResponse(BaseModel):
    overall_score:             float
    risk_level:                Literal["Low", "Medium", "High"]
    fake_follower_risk:        float
    bot_engagement:            float
    engagement_authenticity:   float
    audience_quality_score:    float
    follower_composition:      dict   # {real, suspicious, bot}
    risk_indicators:           List[dict]


class GrowthForecast(BaseModel):
    period:           Literal["30d", "60d", "90d"]
    label:            str
    predicted_growth: float
    confidence:       float


class GrowthResponse(BaseModel):
    forecasts:          List[GrowthForecast]
    growth_score:       float
    growth_30d:         float
    growth_60d:         float
    growth_90d:         float
    timeline:           List[dict]  # {date, actual?, predicted?, confidenceLow?, confidenceHigh?}


class ScoreResponse(BaseModel):
    composite:            float
    tier:                 Literal["Elite", "Premium", "Standard", "Rising"]
    tier_label:           str
    percentile:           float
    authenticity_score:   float
    growth_score:         float
    campaign_score:       float
    brand_score:          float
    audience_score:       float
    categories:           List[dict]
    strengths:            List[str]
    improvement_areas:    List[str]
    comparable_influencers: List[dict]


class BrandMatchResult(BaseModel):
    brand_name:    str
    match_score:   float
    compatibility: dict
    explanation:   Optional[str] = None


class CampaignResponse(BaseModel):
    success_probability:      float
    estimated_reach:          int
    estimated_engagement:     int
    predicted_roi:            float
    avg_cost_per_engagement:  float


class FullAnalysisResponse(BaseModel):
    influencer_id:  str
    username:       str
    platform:       str
    authenticity:   AuthenticityResponse
    growth:         GrowthResponse
    score:          ScoreResponse
    campaign:       CampaignResponse
    brand_matches:  List[BrandMatchResult]
