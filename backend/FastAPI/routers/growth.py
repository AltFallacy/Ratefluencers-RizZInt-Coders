from fastapi import APIRouter, Request
from schemas.influencer import InfluencerInput
from modules.growth import predict_growth

router = APIRouter()


@router.post("/predict")
async def predict(inf: InfluencerInput, request: Request):
    """
    Run the XGBoost growth model.
    Returns a GrowthResponse-compatible payload with forecasts and timeline.
    """
    result = predict_growth(inf, request.app.state.growth_model, request.app.state.growth_scaler)
    return result
