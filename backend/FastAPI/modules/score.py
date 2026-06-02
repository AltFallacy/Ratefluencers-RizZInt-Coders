"""
Score module — weighted composite Ratefluencer Score.

Weights (must sum to 100):
  Authenticity    25%
  Growth          20%
  Campaign        25%
  Brand Match     20%
  Audience Quality 10%
"""
from __future__ import annotations

WEIGHTS = {
    "authenticity":  0.25,
    "growth":        0.20,
    "campaign":      0.25,
    "brand":         0.20,
    "audience":      0.10,
}

TIER_THRESHOLDS = [
    (90, "Elite",    "Elite Influencer"),
    (75, "Premium",  "Premium Influencer"),
    (60, "Standard", "Standard Influencer"),
    (0,  "Rising",   "Rising Star"),
]

INDUSTRY_AVG = {
    "Authenticity":      72.0,
    "Growth Trajectory": 63.0,
    "Campaign Success":  69.0,
    "Brand Compatibility": 71.0,
    "Audience Quality":  74.0,
}

# Comparable influencers pool (static for now)
_COMPARABLES = [
    {"id": "comp-001", "name": "Lena Voss",     "username": "@lenavoss",    "platform": "Instagram"},
    {"id": "comp-002", "name": "Derek Tran",    "username": "@derektran",   "platform": "YouTube"},
    {"id": "comp-003", "name": "Mia Fontaine",  "username": "@miafontaine", "platform": "Instagram"},
]


def compute_ratefluencer_score(
    auth_score:     float,   # 0-100
    growth_score:   float,   # 0-100
    campaign_score: float,   # 0-100  (success_probability)
    brand_score:    float,   # 0-100  (avg brand match score)
    audience_score: float,   # 0-100
) -> dict:
    """
    Compute the weighted composite Ratefluencer score and return
    a ScoreResponse-shaped dict.
    """
    composite = round(
        auth_score     * WEIGHTS["authenticity"] +
        growth_score   * WEIGHTS["growth"]       +
        campaign_score * WEIGHTS["campaign"]     +
        brand_score    * WEIGHTS["brand"]        +
        audience_score * WEIGHTS["audience"],
        1,
    )

    # Tier
    tier, tier_label = "Rising", "Rising Star"
    for threshold, t, tl in TIER_THRESHOLDS:
        if composite >= threshold:
            tier, tier_label = t, tl
            break

    # Approximate percentile (linear mapping 0→0%, 100→100%)
    percentile = round(min(99.0, composite * 0.98 + 2.0), 1)

    # Category breakdown
    categories = [
        {"name": "Authenticity",       "score": round(auth_score, 1),     "weight": 25, "industryAvg": INDUSTRY_AVG["Authenticity"]},
        {"name": "Growth Trajectory",  "score": round(growth_score, 1),   "weight": 20, "industryAvg": INDUSTRY_AVG["Growth Trajectory"]},
        {"name": "Campaign Success",   "score": round(campaign_score, 1), "weight": 25, "industryAvg": INDUSTRY_AVG["Campaign Success"]},
        {"name": "Brand Compatibility","score": round(brand_score, 1),    "weight": 20, "industryAvg": INDUSTRY_AVG["Brand Compatibility"]},
        {"name": "Audience Quality",   "score": round(audience_score, 1), "weight": 10, "industryAvg": INDUSTRY_AVG["Audience Quality"]},
    ]

    # Strengths = categories above industry avg by >10 pts
    strengths         = [c["name"] for c in categories if c["score"] - c["industryAvg"] > 10]
    improvement_areas = [c["name"] for c in categories if c["score"] < c["industryAvg"]]

    # Comparable influencers: assign slightly varied scores around composite
    comparables = [
        {**c, "score": max(0, min(100, round(composite + delta)))}
        for c, delta in zip(_COMPARABLES, [-2, +2, -3])
    ]

    return {
        "composite":              composite,
        "tier":                   tier,
        "tier_label":             tier_label,
        "percentile":             percentile,
        "authenticity_score":     round(auth_score, 1),
        "growth_score":           round(growth_score, 1),
        "campaign_score":         round(campaign_score, 1),
        "brand_score":            round(brand_score, 1),
        "audience_score":         round(audience_score, 1),
        "categories":             categories,
        "strengths":              strengths if strengths else ["Campaign Success"],
        "improvement_areas":      improvement_areas if improvement_areas else ["Growth Trajectory"],
        "comparable_influencers": comparables,
    }
