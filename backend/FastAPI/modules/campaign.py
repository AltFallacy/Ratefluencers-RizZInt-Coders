"""
Campaign module — XGBoost Regressor (brand_match_model.pkl).

The model expects an 18-feature pandas DataFrame with named columns
for brand + influencer attributes. It returns a 0-10 compatibility score.
"""
from __future__ import annotations
import math
import pandas as pd
import numpy as np
from typing import Literal, TYPE_CHECKING

if TYPE_CHECKING:
    from schemas.influencer import InfluencerInput

_CAMPAIGN_TYPE_MULT = {"Awareness": 1.0, "Conversion": 0.85, "Product Launch": 1.15}


def _build_match_dataframe(inf: "InfluencerInput", brand_category: str = "lifestyle", brand_name: str = "brand") -> pd.DataFrame:
    """Build the 18-feature DataFrame for the brand_match_model."""
    from schemas.influencer import BrandInput
    # Default brand params for campaign scoring
    return pd.DataFrame([{
        "category":       brand_category,
        "target_age_min": 18,
        "target_age_max": 35,
        "target_gender":  "all",
        "min_followers":  100_000,
        "max_followers":  5_000_000,
        "budget_tier":    "mid",
        "country_focus":  inf.country,
        "platform":       inf.platform,
        "niche":          inf.niche,
        "followers":      inf.followers,
        "following":      inf.following,
        "total_posts":    inf.total_posts,
        "account_age_days": inf.account_age_days,
        "is_verified":    inf.is_verified,
        "country":        inf.country,
        "tier":           inf.tier,
        "is_bot":         False,
    }])


def predict_campaign(
    inf: "InfluencerInput",
    campaign_model,
    campaign_scaler=None,
    budget: float = 10_000.0,
    duration_days: int = 30,
    campaign_type: str = "Awareness",
) -> dict:
    """Run the brand_match_model for campaign scoring and return CampaignResponse-shaped dict."""
    df = _build_match_dataframe(inf)

    # Apply encoders if model has them (loaded separately)
    if hasattr(campaign_model, "feature_names_in_"):
        # Encode string columns numerically for the model
        X = _encode_df(df, campaign_model)
    else:
        X = df

    raw_score = float(campaign_model.predict(X)[0])   # 0-10
    raw_score = max(0.0, min(10.0, raw_score))

    mult        = _CAMPAIGN_TYPE_MULT.get(campaign_type, 1.0)
    followers   = inf.followers
    dur_factor  = min(duration_days / 30, 2.5)
    budget_fact = math.log10(budget + 1) / math.log10(50_001)

    success_prob = min(97.0, raw_score * 10.0 * mult * (0.5 + budget_fact * 0.5))
    reach        = round(followers * mult * dur_factor * budget_fact * 1.4)
    engagement   = round(reach * (inf.engagement_rate_7d / 100) * 0.9)
    roi          = round(2.0 + mult * budget_fact * 4.0, 1)
    cpe          = round(budget / max(engagement, 1), 2)

    return {
        "success_probability":     round(success_prob, 1),
        "estimated_reach":         max(reach, 0),
        "estimated_engagement":    max(engagement, 0),
        "predicted_roi":           roi,
        "avg_cost_per_engagement": cpe,
    }


def _encode_df(df: pd.DataFrame, model) -> pd.DataFrame:
    """Encode string columns to their expected numeric equivalents."""
    NICHE_MAP    = {"tech": 1, "beauty": 2, "fitness": 3, "fashion": 4, "education": 5, "lifestyle": 3, "sportswear": 3, "food": 3, "travel": 2, "wellness": 5, "gaming": 1, "finance": 5}
    PLATFORM_MAP = {"Instagram": 1, "YouTube": 2, "TikTok": 3, "Twitter": 4}
    TIER_MAP     = {"nano": 1, "micro": 2, "macro": 3, "mega": 4}
    GENDER_MAP   = {"all": 0, "female": 1, "male": 2}
    COUNTRY_MAP  = {"IN": 1, "US": 2, "GLOBAL": 3, "UK": 2, "AU": 2}
    BUDGET_MAP   = {"micro": 1, "mid": 2, "premium": 3}
    BOOL_MAP     = {True: 1, False: 0}

    enc = df.copy()
    for col, mapping in [
        ("category",     NICHE_MAP),
        ("target_gender",GENDER_MAP),
        ("country_focus",COUNTRY_MAP),
        ("platform",     PLATFORM_MAP),
        ("niche",        NICHE_MAP),
        ("country",      COUNTRY_MAP),
        ("tier",         TIER_MAP),
        ("budget_tier",  BUDGET_MAP),
    ]:
        if col in enc.columns:
            enc[col] = enc[col].map(lambda v: mapping.get(str(v).lower(), 0))

    for col in ["is_verified", "is_bot"]:
        if col in enc.columns:
            enc[col] = enc[col].map(lambda v: BOOL_MAP.get(v, 0))

    # Ensure exact column order
    feat_cols = list(model.feature_names_in_)
    return enc[feat_cols]
