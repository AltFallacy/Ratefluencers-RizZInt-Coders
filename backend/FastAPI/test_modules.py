import sys, os
sys.path.insert(0, '.')

# Point to real models
MODEL_DIR = os.path.normpath(os.path.join('..', '..', 'predictors', 'models'))

from schemas.influencer import InfluencerInput, BrandInput
inf = InfluencerInput()
print("SCHEMAS OK")

import joblib
auth_model   = joblib.load(os.path.join(MODEL_DIR, 'anomaly_detection_model.pkl'))
growth_model = joblib.load(os.path.join(MODEL_DIR, 'growth_prediction_model.pkl'))
brand_model  = joblib.load(os.path.join(MODEL_DIR, 'brand_match_model.pkl'))
print("MODELS LOADED from", MODEL_DIR)

from modules.authenticity import predict_authenticity
auth_r = predict_authenticity(inf, auth_model)
print("AUTH SCORE:", auth_r["overall_score"])
print("RISK:", auth_r["risk_level"])

from modules.growth import predict_growth
growth_r = predict_growth(inf, growth_model)
print("GROWTH 30d:", growth_r["growth_30d"])
print("GROWTH SCORE:", growth_r["growth_score"])

from modules.campaign import predict_campaign
camp_r = predict_campaign(inf, brand_model)
print("CAMPAIGN PROB:", camp_r["success_probability"])

from modules.score import compute_ratefluencer_score
score_r = compute_ratefluencer_score(
    auth_r["overall_score"], growth_r["growth_score"],
    camp_r["success_probability"], 75.0, auth_r["audience_quality_score"]
)
print("COMPOSITE:", score_r["composite"], "TIER:", score_r["tier"])

from modules.brand_match import build_brand_match_result
brand = BrandInput()
brand_r = build_brand_match_result(inf, brand, brand_model)
print("BRAND MATCH:", brand_r["match_score"])

print()
print("=== ALL TESTS PASSED ===")
