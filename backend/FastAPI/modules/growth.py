"""
Growth module — XGBoost Regressor (growth_prediction_model.pkl).

The model uses feature_names_in_ and expects a pandas DataFrame with 24 named columns.
No scaler needed for this model (from predictors/models/).
"""
from __future__ import annotations
import pandas as pd
import numpy as np
from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from schemas.influencer import InfluencerInput


def _build_dataframe(inf: "InfluencerInput") -> pd.DataFrame:
    """Build the 24-feature DataFrame expected by the growth model."""
    followers = max(inf.followers, 1)
    following = max(inf.following, 1)
    views     = max(inf.avg_views, 1)

    engagement_rate      = ((inf.avg_likes + inf.avg_comments) / followers) * 100
    share_rate           = inf.avg_shares / views
    save_rate            = inf.avg_saves  / views
    view_rate            = inf.avg_views  / followers
    follower_following_r = followers / following

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
    }])


def predict_growth(inf: "InfluencerInput", growth_model, growth_scaler=None) -> dict:
    """Run the XGBoost growth model and return a GrowthResponse-shaped dict."""
    df = _build_dataframe(inf)

    if hasattr(growth_model, "feature_names_in_"):
        X = df[list(growth_model.feature_names_in_)]
    else:
        X = df

    raw_growth_pct = float(growth_model.predict(X)[0])
    raw_growth_pct = max(0.0, raw_growth_pct)

    followers  = inf.followers
    growth_30d = round(followers * (raw_growth_pct / 100) * 1.0)
    growth_60d = round(followers * (raw_growth_pct / 100) * 2.1)
    growth_90d = round(followers * (raw_growth_pct / 100) * 3.3)

    conf_30 = round(min(97.0, 70 + raw_growth_pct * 1.2), 1)
    conf_60 = round(min(92.0, conf_30 - 7.0), 1)
    conf_90 = round(min(86.0, conf_60 - 9.0), 1)

    growth_score = round(min(100.0, raw_growth_pct * 5.0), 1)

    # Timeline: 6 months historical + 3 months projected
    now      = datetime.utcnow()
    timeline = []

    for i in range(5, -1, -1):
        dt    = now - relativedelta(months=i)
        label = dt.strftime("%b %Y")
        approx = round(followers - growth_30d * i)
        timeline.append({"date": label, "actual": max(0, approx)})

    for i in range(1, 4):
        dt         = now + relativedelta(months=i)
        label      = dt.strftime("%b %Y")
        projected  = round(followers + growth_30d * i)
        conf_band  = round(growth_30d * i * 0.12)
        timeline.append({
            "date":           label,
            "predicted":      projected,
            "confidenceLow":  projected - conf_band,
            "confidenceHigh": projected + conf_band,
            "isProjected":    True,
        })

    return {
        "forecasts": [
            {"period": "30d", "label": "30 Days", "predicted_growth": growth_30d, "confidence": conf_30},
            {"period": "60d", "label": "60 Days", "predicted_growth": growth_60d, "confidence": conf_60},
            {"period": "90d", "label": "90 Days", "predicted_growth": growth_90d, "confidence": conf_90},
        ],
        "growth_score": growth_score,
        "growth_30d":   float(growth_30d),
        "growth_60d":   float(growth_60d),
        "growth_90d":   float(growth_90d),
        "timeline":     timeline,
    }
