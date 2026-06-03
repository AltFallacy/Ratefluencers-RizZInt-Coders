from fastapi import APIRouter, Request, HTTPException
from schemas.influencer import InfluencerInput
from modules.authenticity import predict_authenticity

router = APIRouter()


@router.post("/predict")
async def predict(inf: InfluencerInput, request: Request):
    """
    Run the Isolation Forest authenticity model.
    Returns an AuthenticityResponse-compatible payload.
    """
    model = request.app.state.auth_model
    if model is None:
        raise HTTPException(status_code=503, detail="Authenticity model not loaded — check server logs.")
    result = predict_authenticity(inf, model)
    return result
