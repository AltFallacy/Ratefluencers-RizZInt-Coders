from fastapi import APIRouter, Request
from schemas.influencer import (
    InfluencerInput, AnalyzeRequest, FullAnalysisResponse,
    BrandInput,
)
from modules.authenticity import predict_authenticity
from modules.growth import predict_growth
from modules.campaign import predict_campaign
from modules.score import compute_ratefluencer_score
from modules.brand_match import build_brand_match_result

router = APIRouter()

# ── Static influencer store (used as the "database" before NeonDB is seeded) ─
from data.influencer_store import INFLUENCER_STORE

@router.get("/influencers")
def list_influencers():
    """Return all known influencers (profile cards)."""
    return list(INFLUENCER_STORE.values())


@router.get("/influencers/{influencer_id}")
def get_influencer(influencer_id: str):
    """Return a single influencer profile."""
    inf = INFLUENCER_STORE.get(influencer_id)
    if not inf:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Influencer not found")
    return inf


@router.post("/")
async def analyze_influencer(req: AnalyzeRequest, request: Request):
    """
    Full analysis endpoint — runs all ML models and returns a complete
    FullAnalysisResponse. Accepts an InfluencerInput + optional list of BrandInputs.
    """
    inf   = req.influencer
    state = request.app.state

    # ── ML model inference ──────────────────────────────────────────────────
    auth_result     = predict_authenticity(inf, state.auth_model)
    growth_result   = predict_growth(inf, state.growth_model, state.growth_scaler)
    campaign_result = predict_campaign(
        inf, state.campaign_model, state.campaign_scaler,
        budget=10_000, duration_days=30, campaign_type="Awareness"
    )

    # ── Brand matches ────────────────────────────────────────────────────────
    brand_inputs = req.brands or _default_brands()
    brand_results = [
        build_brand_match_result(inf, b, state.campaign_model, state.campaign_scaler, i)
        for i, b in enumerate(brand_inputs)
    ]
    avg_brand_score = (
        sum(b["match_score"] for b in brand_results) / len(brand_results)
        if brand_results else 70.0
    )

    # ── Composite score ──────────────────────────────────────────────────────
    score_result = compute_ratefluencer_score(
        auth_score     = auth_result["overall_score"],
        growth_score   = growth_result["growth_score"],
        campaign_score = campaign_result["success_probability"],
        brand_score    = avg_brand_score,
        audience_score = auth_result["audience_quality_score"],
    )

    return {
        "influencer_id": inf.influencer_id,
        "username":      inf.username,
        "platform":      inf.platform,
        "authenticity":  auth_result,
        "growth":        growth_result,
        "score":         score_result,
        "campaign":      campaign_result,
        "brand_matches": brand_results,
    }


def _default_brands() -> list[BrandInput]:
    """Default brand list used when the caller doesn't specify brands."""
    return [
        BrandInput(brand_name="Nike",     category="fitness",  country_focus="US"),
        BrandInput(brand_name="Adidas",   category="fitness",  country_focus="US"),
        BrandInput(brand_name="Apple",    category="tech",     country_focus="GLOBAL"),
        BrandInput(brand_name="GoPro",    category="lifestyle",country_focus="US"),
        BrandInput(brand_name="Samsung",  category="tech",     country_focus="GLOBAL"),
        BrandInput(brand_name="Spotify",  category="lifestyle",country_focus="GLOBAL"),
    ]
