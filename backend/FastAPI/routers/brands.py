# routers/brands.py
from ai_client import chat_with_system, GEMINI_FLASH_FREE
from brand_match import get_brand_explanation, get_campaign_recommendation

@router.post("/explain")
async def explain_match(data: InfluencerInput, brand_name: str):
    explanation = get_brand_explanation(
        influencer=data.dict(),
        brand={"brand_name": brand_name}
    )
    return {"brand": brand_name, "explanation": explanation}


@router.post("/campaign-recommendation")
async def campaign_rec(data: InfluencerInput, score: ScoreResponse):
    rec = get_campaign_recommendation(
        influencer=data.dict(),
        score=score.dict()
    )
    return rec   # already a clean JSON dict