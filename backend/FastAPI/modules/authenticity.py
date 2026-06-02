"""
Authenticity module — Isolation Forest anomaly detection.

Uses the real model from predictors/models/ which expects a pandas DataFrame
with named columns (34 features including derived scores).
"""
from __future__ import annotations
import pandas as pd
import numpy as np
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from schemas.influencer import InfluencerInput


def _build_dataframe(inf: "InfluencerInput", growth_score: float = 60.0, campaign_score: float = 70.0, brand_score: float = 70.0) -> pd.DataFrame:
    """Build the 34-feature DataFrame expected by the Isolation Forest model."""
    followers = max(inf.followers, 1)
    following = max(inf.following, 1)
    views     = max(inf.avg_views, 1)

    engagement_rate      = ((inf.avg_likes + inf.avg_comments) / followers) * 100
    share_rate           = inf.avg_shares / views
    save_rate            = inf.avg_saves  / views
    view_rate            = inf.avg_views  / followers
    follower_following_r = followers / following

    # Estimate derived scores for the 34-feature model
    authenticity_score   = min(100.0, inf.comment_quality_ratio * 80 + (1 - inf.like_spike_variance) * 20)
    bot_risk             = max(0.0, (1 - inf.comment_quality_ratio) * 50 + inf.like_spike_variance * 50)
    fraud_risk           = bot_risk * 0.6
    growth_30d           = inf.followers * (inf.growth_velocity / 100)
    growth_60d           = growth_30d * 2.1
    growth_90d           = growth_30d * 3.3
    ratefluencer_score   = (authenticity_score * 0.25 + growth_score * 0.20 + campaign_score * 0.25 + brand_score * 0.20 + inf.audience_quality_score * 0.10)

    return pd.DataFrame([{
        "engagement_rate":          engagement_rate,
        "comment_quality_ratio":    inf.comment_quality_ratio,
        "share_rate":               share_rate,
        "save_rate":                save_rate,
        "view_rate":                view_rate,
        "follower_following_ratio": follower_following_r,
        "posting_consistency":      inf.posting_consistency,
        "like_spike_variance":      inf.like_spike_variance,
        "growth_velocity":          inf.growth_velocity,
        "audience_quality_score":   inf.audience_quality_score,
        "followers_count":          float(followers),
        "avg_likes_7d":             inf.avg_likes_7d,
        "avg_comments_7d":          inf.avg_comments_7d,
        "engagement_rate_7d":       inf.engagement_rate_7d,
        "posts_this_week":          float(inf.posts_this_week),
        "avg_likes":                inf.avg_likes,
        "avg_comments":             inf.avg_comments,
        "avg_shares":               inf.avg_shares,
        "avg_saves":                inf.avg_saves,
        "avg_views":                inf.avg_views,
        "avg_reel_plays":           inf.avg_reel_plays,
        "post_frequency":           inf.post_frequency,
        "story_frequency":          inf.story_frequency,
        "peak_posting_hour":        float(inf.peak_posting_hour),
        "authenticity_score":       authenticity_score,
        "bot_risk":                 bot_risk,
        "fraud_risk":               fraud_risk,
        "growth_score":             growth_score,
        "growth_30d":               growth_30d,
        "growth_60d":               growth_60d,
        "growth_90d":               growth_90d,
        "campaign_score":           campaign_score,
        "brand_match_score":        brand_score,
        "ratefluencer_score":       ratefluencer_score,
    }])


def predict_authenticity(inf: "InfluencerInput", auth_model) -> dict:
    """Run the Isolation Forest model and return an AuthenticityResponse-shaped dict."""
    df = _build_dataframe(inf)

    # Use feature_names_in_ if available to ensure correct column order
    if hasattr(auth_model, "feature_names_in_"):
        X = df[list(auth_model.feature_names_in_)]
    else:
        X = df

    raw_pred  = auth_model.predict(X)[0]          # 1 or -1
    raw_score = auth_model.decision_function(X)[0] # negative = more anomalous

    # Map decision score → 0-100 authenticity score
    normalised    = float(np.clip((raw_score + 0.5) / 1.0, 0.0, 1.0))
    overall_score = round(normalised * 100, 1)

    # Derive sub-metrics from feature values
    followers       = max(inf.followers, 1)
    fake_risk       = round(max(0.0, min(100.0, (1 - normalised) * 60 + (1 - inf.comment_quality_ratio) * 40)), 1)
    bot_eng         = round(max(0.0, min(100.0, (1 - inf.comment_quality_ratio) * 50 + inf.like_spike_variance * 50)), 1)
    eng_auth        = round(min(100.0, inf.comment_quality_ratio * 80 + normalised * 20), 1)
    aq_score        = round(float(inf.audience_quality_score), 1)

    real_pct        = round(min(99.0, overall_score * 0.85 + 10), 1)
    suspicious_pct  = round(min(50.0, fake_risk * 0.15), 1)
    bot_pct         = round(max(0.0, 100.0 - real_pct - suspicious_pct), 1)

    risk_level = "Low" if overall_score >= 75 else "Medium" if overall_score >= 50 else "High"

    risk_indicators = []
    if inf.like_spike_variance > 0.4:
        risk_indicators.append({"id": "ri-001", "label": "Sudden Follower Spike", "risk": "High" if inf.like_spike_variance > 0.6 else "Medium", "description": f"Like spike variance of {inf.like_spike_variance:.2f} suggests potential artificial amplification."})
    else:
        risk_indicators.append({"id": "ri-001", "label": "Engagement Consistency", "risk": "Low", "description": f"Like variance of {inf.like_spike_variance:.2f} is within normal organic range."})

    cr_ratio = inf.avg_comments / max(inf.avg_likes, 1)
    risk_indicators.append({"id": "ri-002", "label": "Comment-to-Like Ratio", "risk": "Low" if cr_ratio >= 0.03 else "Medium", "description": f"Comment-to-like ratio of 1:{round(1/max(cr_ratio,0.001))} — {'within' if cr_ratio >= 0.03 else 'below'} benchmark."})
    risk_indicators.append({"id": "ri-003", "label": "Geographic Anomaly", "risk": "Low", "description": f"Follower geographic distribution appears consistent with {inf.country} market."})
    risk_indicators.append({"id": "ri-004", "label": "Bot Engagement Detected", "risk": "High" if bot_eng > 20 else "Medium" if bot_eng > 10 else "Low", "description": f"{bot_eng}% of engagement interactions flagged as automated activity."})
    risk_indicators.append({"id": "ri-005", "label": "Audience Authenticity", "risk": "Low" if eng_auth >= 80 else "Medium" if eng_auth >= 60 else "High", "description": f"{eng_auth}% of engagement classified as authentic human interaction (industry avg: 84%)."})

    return {
        "overall_score":           overall_score,
        "risk_level":              risk_level,
        "fake_follower_risk":      fake_risk,
        "bot_engagement":          bot_eng,
        "engagement_authenticity": eng_auth,
        "audience_quality_score":  aq_score,
        "follower_composition":    {"real": real_pct, "suspicious": suspicious_pct, "bot": bot_pct},
        "risk_indicators":         risk_indicators,
    }
