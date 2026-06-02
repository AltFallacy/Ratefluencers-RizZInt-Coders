from fastapi import APIRouter, Request
from schemas.influencer import InfluencerInput
from modules.authenticity import predict_authenticity

router = APIRouter()


@router.post("/predict")
async def predict(inf: InfluencerInput, request: Request):
    """
    Run the Isolation Forest authenticity model.
    Returns an AuthenticityResponse-compatible payload.
    """
    result = predict_authenticity(inf, request.app.state.auth_model)
    return result
