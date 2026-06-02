from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib, os
from dotenv import load_dotenv

load_dotenv()

from routers import analyze, authenticity, growth, brands, score

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load all ML models ONCE at startup
    app.state.auth_model     = joblib.load("models/authenticity.pkl")
    app.state.growth_model   = joblib.load("models/growth.pkl")
    app.state.campaign_model = joblib.load("models/campaign.pkl")
    print("✅ ML models loaded")
    yield

app = FastAPI(
    title="Ratefluencer AI",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(analyze.router,      prefix="/analyze",      tags=["Analyze"])
app.include_router(authenticity.router, prefix="/authenticity", tags=["Authenticity"])
app.include_router(growth.router,       prefix="/growth",       tags=["Growth"])
app.include_router(brands.router,       prefix="/brands",       tags=["Brands"])
app.include_router(score.router,        prefix="/score",        tags=["Score"])

@app.get("/health")
def health():
    return {"status": "ok", "project": "Ratefluencer AI"}