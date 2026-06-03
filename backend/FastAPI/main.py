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


def _load_model(path: str, label: str):
    """Load a joblib model file, returning None with a warning on failure."""
    try:
        m = joblib.load(path)
        print(f"[OK] Loaded {label}")
        return m
    except FileNotFoundError:
        print(f"[WARN] Model not found: {path} — {label} will be unavailable")
        return None
    except Exception as exc:
        print(f"[WARN] Failed to load {label}: {exc}")
        return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Load all ML models ONCE at startup ────────────────────────────────────
    app.state.auth_model     = _load_model(os.path.join(_MODEL_DIR, "anomaly_detection_model.pkl"), "Anomaly Detection")
    app.state.growth_model   = _load_model(os.path.join(_MODEL_DIR, "growth_prediction_model.pkl"), "Growth Prediction")
    app.state.campaign_model = _load_model(os.path.join(_MODEL_DIR, "brand_match_model.pkl"),       "Brand Match")
    app.state.brand_match_encoders = _load_model(os.path.join(_MODEL_DIR, "brand_match_encoders.pkl"), "Brand Match Encoders")

    # Scalers (not used by the real models but kept for API compatibility)
    app.state.growth_scaler   = None
    app.state.campaign_scaler = app.state.brand_match_encoders

    loaded = sum(1 for m in [
        app.state.auth_model, app.state.growth_model,
        app.state.campaign_model, app.state.brand_match_encoders,
    ] if m is not None)
    print(f"[OK] {loaded}/4 ML models loaded from: {_MODEL_DIR}")
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