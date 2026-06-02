from fastapi import APIRouter, Request
from schemas.influencer import CampaignSimulatorRequest, InfluencerInput
from modules.score import compute_ratefluencer_score
from modules.authenticity import predict_authenticity
from modules.growth import predict_growth
from modules.campaign import predict_campaign

router = APIRouter()


@router.post("/compute")
async def compute_score(req: CampaignSimulatorRequest, request: Request):
    """
    Compute the full Ratefluencer composite score from all sub-model scores.
    Also runs the campaign simulator with the provided budget/duration/type.
    """
    inf   = req.influencer
    state = request.app.state

    auth_result     = predict_authenticity(inf, state.auth_model)
    growth_result   = predict_growth(inf, state.growth_model, state.growth_scaler)
    campaign_result = predict_campaign(
        inf,
        state.campaign_model,
        state.campaign_scaler,
        budget        = req.budget,
        duration_days = req.duration_days,
        campaign_type = req.campaign_type,
    )

    score_result = compute_ratefluencer_score(
        auth_score     = auth_result["overall_score"],
        growth_score   = growth_result["growth_score"],
        campaign_score = campaign_result["success_probability"],
        brand_score    = 75.0,   # default when no brand specified
        audience_score = auth_result["audience_quality_score"],
    )

    return {
        **score_result,
        "campaign_simulation": campaign_result,
    }
