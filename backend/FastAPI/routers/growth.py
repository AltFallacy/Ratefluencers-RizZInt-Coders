from fastapi import APIRouter, Request, HTTPException
from schemas.influencer import InfluencerInput
from modules.growth import predict_growth

router = APIRouter()


@router.post("/predict")
async def predict(inf: InfluencerInput, request: Request):
    """
    Run the XGBoost growth model.
    Returns a GrowthResponse-compatible payload with forecasts and timeline.
    """
    model = request.app.state.growth_model
    if model is None:
        raise HTTPException(status_code=503, detail="Growth model not loaded — check server logs.")
    result = predict_growth(inf, model, request.app.state.growth_scaler)
    return result
