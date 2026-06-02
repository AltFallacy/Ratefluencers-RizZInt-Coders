from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib, os
from dotenv import load_dotenv

load_dotenv()

from routers import analyze, authenticity, growth, brands, score

# The real trained models live in predictors/models/
# (the models/ folder in FastAPI has smaller prototype models)
_BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
_MODEL_DIR  = os.path.join(_BASE_DIR, "..", "..", "predictors", "models")
_MODEL_DIR  = os.path.normpath(_MODEL_DIR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Load all ML models ONCE at startup ────────────────────────────────────
    app.state.auth_model     = joblib.load(os.path.join(_MODEL_DIR, "anomaly_detection_model.pkl"))
    app.state.growth_model   = joblib.load(os.path.join(_MODEL_DIR, "growth_prediction_model.pkl"))
    app.state.campaign_model = joblib.load(os.path.join(_MODEL_DIR, "brand_match_model.pkl"))
    app.state.brand_match_encoders = joblib.load(os.path.join(_MODEL_DIR, "brand_match_encoders.pkl"))

    # Scalers (not used by the real models but kept for API compatibility)
    app.state.growth_scaler   = None
    app.state.campaign_scaler = app.state.brand_match_encoders

    print(f"[OK] ML models and encoders loaded from: {_MODEL_DIR}")
    yield
    print("[STOP] FastAPI shutting down")


app = FastAPI(
    title="Ratefluencer AI",
    description="AI-powered influencer intelligence engine",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── All routers under /api/v1 (matches frontend api.ts baseURL) ───────────────
app.include_router(analyze.router,      prefix="/api/v1/analyze",      tags=["Analyze"])
app.include_router(authenticity.router, prefix="/api/v1/authenticity",  tags=["Authenticity"])
app.include_router(growth.router,       prefix="/api/v1/growth",        tags=["Growth"])
app.include_router(brands.router,       prefix="/api/v1/brands",        tags=["Brands"])
app.include_router(score.router,        prefix="/api/v1/score",         tags=["Score"])


@app.get("/health")
def health():
    return {"status": "ok", "project": "Ratefluencer AI", "version": "1.0.0"}


@app.get("/api/v1/health")
def health_v1():
    return {"status": "ok", "version": "1.0.0"}