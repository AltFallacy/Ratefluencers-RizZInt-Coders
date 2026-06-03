"""
Brand match module — uses brand_match_model.pkl from predictors/models/.
Also provides AI-powered explanations via OpenRouter.
"""
from __future__ import annotations
import pandas as pd
import numpy as np
from typing import TYPE_CHECKING

from ai_client import chat_with_system

if TYPE_CHECKING:
    from schemas.influencer import InfluencerInput, BrandInput

_COLORS   = ["#f97316", "#3b82f6", "#6b7280", "#10b981", "#1d4ed8", "#22c55e"]
NICHE_MAP    = {"tech": 1, "beauty": 2, "fitness": 3, "fashion": 4, "education": 5, "lifestyle": 3, "sportswear": 3, "food": 3, "travel": 2, "wellness": 5, "gaming": 1, "finance": 5}
PLATFORM_MAP = {"Instagram": 1, "YouTube": 2, "TikTok": 3, "Twitter": 4}
TIER_MAP     = {"nano": 1, "micro": 2, "macro": 3, "mega": 4}
GENDER_MAP   = {"all": 0, "female": 1, "male": 2}
COUNTRY_MAP  = {"IN": 1, "US": 2, "GLOBAL": 3, "UK": 2, "AU": 2}
BUDGET_MAP   = {"micro": 1, "mid": 2, "premium": 3}


def _get_initials(name: str) -> str:
    words = name.split()
    return (words[0][0] + (words[1][0] if len(words) > 1 else words[0][1])).upper()


def _build_match_dataframe(inf: "InfluencerInput", brand: "BrandInput") -> pd.DataFrame:
    return pd.DataFrame([{
        "category":       brand.category,
        "target_age_min": brand.target_age_min,
        "target_age_max": brand.target_age_max,
        "target_gender":  brand.target_gender,
        "min_followers":  brand.min_followers,
        "max_followers":  brand.max_followers,
        "budget_tier":    brand.budget_tier,
        "country_focus":  brand.country_focus,
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


def _encode_df(df: pd.DataFrame, model, encoders=None) -> pd.DataFrame:
    enc = df.copy()
    if encoders and isinstance(encoders, dict):
        for col, le in encoders.items():
            if col in enc.columns:
                class_to_val = dict(zip(le.classes_, le.transform(le.classes_)))
                # Map case-insensitively or with fallback to -1
                enc[col] = enc[col].astype(str).map(
                    lambda val: class_to_val.get(val, class_to_val.get(val.capitalize(), class_to_val.get(val.lower(), -1)))
                ).fillna(-1)
    else:
        for col, mapping in [
            ("category",      NICHE_MAP),
            ("target_gender", GENDER_MAP),
            ("country_focus", COUNTRY_MAP),
            ("platform",      PLATFORM_MAP),
            ("niche",         NICHE_MAP),
            ("country",       COUNTRY_MAP),
            ("tier",          TIER_MAP),
            ("budget_tier",   BUDGET_MAP),
        ]:
            if col in enc.columns:
                enc[col] = enc[col].map(lambda v: mapping.get(str(v).lower(), 0))

        for col in ["is_verified", "is_bot"]:
            if col in enc.columns:
                enc[col] = enc[col].map(lambda v: 1 if v else 0)

    feat_cols = list(model.feature_names_in_) if hasattr(model, "feature_names_in_") else enc.columns
    return enc[feat_cols]


def predict_brand_match(
    inf: "InfluencerInput",
    brand: "BrandInput",
    campaign_model,
    campaign_scaler=None,
) -> float:
    """Returns a 0-100 brand compatibility score."""
    df  = _build_match_dataframe(inf, brand)
    encoders = campaign_scaler if isinstance(campaign_scaler, dict) else None
    X   = _encode_df(df, campaign_model, encoders)
    raw = float(campaign_model.predict(X)[0])   # 0-10 raw score
    return round(max(0.0, min(100.0, raw * 10.0)), 1)


def build_brand_match_result(
    inf: "InfluencerInput",
    brand: "BrandInput",
    campaign_model,
    campaign_scaler=None,
    index: int = 0,
    include_explanation: bool = False,
    api_key: str = None,
) -> dict:
    match_score = predict_brand_match(inf, brand, campaign_model, campaign_scaler)

    audience_overlap   = round(min(99.0, match_score * 1.02 + 1.0), 1)
    content_style      = round(min(99.0, match_score * 0.97 + 2.0), 1)
    engagement_quality = round(min(99.0, match_score * 1.01 + 0.5), 1)
    brand_safety       = round(min(99.0, match_score * 0.99 + 3.0), 1)

    explanation = get_brand_explanation(inf, brand, api_key) if include_explanation else None

    return {
        "brand_name":  brand.brand_name,
        "name":        brand.brand_name,
        "match_score": match_score,
        "compatibility": {
            "audienceOverlap":   audience_overlap,
            "contentStyle":      content_style,
            "engagementQuality": engagement_quality,
            "brandSafety":       brand_safety,
        },
        "color":       _COLORS[index % len(_COLORS)],
        "initials":    _get_initials(brand.brand_name),
        "explanation": explanation,
        "industry":    [brand.category.capitalize()],
        "id":          f"brand-{index + 1:03d}",
    }


def get_brand_explanation(inf: "InfluencerInput", brand: "BrandInput", api_key: str = None) -> str:
    system = (
        "You are a concise influencer marketing analyst. "
        "Given an influencer's profile and a brand's targeting criteria, "
        "explain in exactly 2 short sentences why this is (or isn't) a strong match. "
        "Be specific and data-driven."
    )
    user = (
        f"Influencer: @{inf.username}, {inf.niche} niche, {inf.followers:,} followers, "
        f"{inf.engagement_rate_7d:.1f}% engagement, verified={inf.is_verified}, country={inf.country}.\n"
        f"Brand: {brand.brand_name}, category={brand.category}, targets {brand.target_gender} "
        f"aged {brand.target_age_min}-{brand.target_age_max}, budget_tier={brand.budget_tier}."
    )
    return chat_with_system(system, user, api_key=api_key)


def get_campaign_recommendation(inf: "InfluencerInput", score: dict, api_key: str = None) -> dict:
    system = (
        "You are a senior influencer marketing strategist. "
        "Given an influencer's Ratefluencer score breakdown, recommend exactly 3 specific "
        "campaign strategies. Return valid JSON only with keys: "
        "strategies (array of {title, description, campaign_type})."
    )
    user = (
        f"Influencer: @{inf.username}, composite score {score.get('composite', 80)}/100, "
        f"tier {score.get('tier', 'Premium')}. "
        f"Strengths: {score.get('strengths', [])}. "
        f"Improvement areas: {score.get('improvement_areas', [])}. "
        f"Platform: {inf.platform}."
    )
    raw = chat_with_system(system, user, api_key=api_key)
    try:
        import json, re
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return {"strategies": [{"title": "Content Partnership", "description": raw[:200], "campaign_type": "Awareness"}]}
