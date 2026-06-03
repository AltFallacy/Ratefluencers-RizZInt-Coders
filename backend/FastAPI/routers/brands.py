from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from schemas.influencer import InfluencerInput, BrandInput
from modules.brand_match import (
    build_brand_match_result,
    get_brand_explanation,
    get_campaign_recommendation,
)
from modules.score import compute_ratefluencer_score

router = APIRouter()


class BrandMatchRequest(BaseModel):
    influencer: InfluencerInput
    brands:     List[BrandInput]


class ExplainRequest(BaseModel):
    influencer: InfluencerInput
    brand_name: str
    category:   str = "lifestyle"


class CampaignRecRequest(BaseModel):
    influencer: InfluencerInput
    score:      dict


@router.post("/match")
async def match_brands(req: BrandMatchRequest, request: Request):
    """
    Compute brand compatibility scores for a list of brands against an influencer.
    """
    state = request.app.state
    if state.campaign_model is None:
        raise HTTPException(status_code=503, detail="Brand match model not loaded — check server logs.")

    api_key = request.headers.get("x-openrouter-key")

    results = [
        build_brand_match_result(
            req.influencer, brand,
            state.campaign_model, state.campaign_scaler,
            index=i,
            api_key=api_key,
        )
        for i, brand in enumerate(req.brands)
    ]
    return {"brands": results}


@router.post("/explain")
async def explain_match(req: ExplainRequest, request: Request):
    """
    AI-generated 2-sentence explanation of a brand-influencer match.
    """
    brand = BrandInput(
        brand_name  = req.brand_name,
        category    = req.category,
    )
    api_key = request.headers.get("x-openrouter-key")
    explanation = get_brand_explanation(req.influencer, brand, api_key=api_key)
    return {"brand": req.brand_name, "explanation": explanation}


@router.post("/campaign-recommendation")
async def campaign_rec(req: CampaignRecRequest, request: Request):
    """
    AI-powered campaign strategy recommendations based on score breakdown.
    """
    api_key = request.headers.get("x-openrouter-key")
    rec = get_campaign_recommendation(req.influencer, req.score, api_key=api_key)
    return rec