import os
import uuid
import asyncio
import requests
import ssl
import pandas as pd
import numpy as np
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATA_PATH = os.getenv("DATA_PATH", "/usr/local/airflow/include/data")

# String-to-number configuration dictionaries matching your ML models categorical footprints
NICHE_MAP = {"tech": 1, "beauty": 2, "fitness": 3, "fashion": 4, "education": 5}
COUNTRY_MAP = {"IN": 1, "US": 2, "GLOBAL": 3}
GENDER_MAP = {"all": 0, "female": 1, "male": 2}
TIER_MAP = {"nano": 1, "micro": 2, "macro": 3, "mega": 4}

# ========================================================================
# ── BATCH PIPELINE OPERATIONS (Scheduled Master Tracking Loops) ──
# ========================================================================

def extract_raw_data():
    """Reads the raw baseline dataset file to kick off core batch processing runs."""
    raw_path = f"{DATA_PATH}/raw/influencers.csv"
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Missing master data template file at {raw_path}.")
    df = pd.read_csv(raw_path)
    os.makedirs(f"{DATA_PATH}/staging", exist_ok=True)
    df.to_parquet(f"{DATA_PATH}/staging/raw_influencers.parquet", index=False)
    print(f"✅ [BATCH EXTRACT] Staged {len(df)} primary tracking records.")
    return len(df)

def validate_data():
    """Ensures input parameters hold valid mathematical bounds before structural processing."""
    df = pd.read_parquet(f"{DATA_PATH}/staging/raw_influencers.parquet")
    assert "followers" in df.columns, "Missing prerequisite 'followers' schema."
    assert df["followers"].min() >= 0, "Data Fault: Intercepted an invalid negative profile balance count."
    print("✅ [BATCH VALIDATE] Pipeline input patterns successfully confirmed.")

def engineer_features():
    """Derives core performance calculations from raw system numbers."""
    df = pd.read_parquet(f"{DATA_PATH}/staging/raw_influencers.parquet")
    df["engagement_rate"] = ((df["avg_likes"] + df["avg_comments"]) / df["followers"].clip(lower=1)) * 100
    df["share_rate"] = df["avg_shares"] / df["avg_views"].clip(lower=1)
    df["save_rate"] = df["avg_saves"] / df["avg_views"].clip(lower=1)
    df["view_rate"] = df["avg_views"] / df["followers"].clip(lower=1)
    df["follower_following_ratio"] = df["followers"] / df["following"].clip(lower=1)
    df.to_parquet(f"{DATA_PATH}/staging/engineered_features.parquet", index=False)
    print("✅ [BATCH TRANSFORM] Numerical ratio arrays completely compiled.")

def load_to_neondb():
    """Populates clean structured parameters into your NeonDB cluster using a secure bulk insert statement."""
    df = pd.read_parquet(f"{DATA_PATH}/staging/engineered_features.parquet")
    
    # ── THE DOCKER ASYNCPG INTERCEPT FIX ──
    database_url = os.getenv("NEON_DATABASE_URL", "")
    if "?" in database_url:
        database_url = database_url.split("?")[0]
        
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    pipeline_engine = create_async_engine(
        database_url,
        echo=False,
        connect_args={"ssl": ssl_context}
    )
    PipelineSession = sessionmaker(pipeline_engine, class_=AsyncSession, expire_on_commit=False)

    async def _async_load():
        async with PipelineSession() as session:
            # Format the entire parquet dataframe into a clean list of parameters for a bulk run
            bulk_params = [
                {
                    "influencer_id": str(row["influencer_id"]), 
                    "er": float(row["engagement_rate"]),
                    "sr": float(row["share_rate"]), 
                    "sv": float(row["save_rate"]),
                    "vr": float(row["view_rate"]), 
                    "ffr": float(row["follower_following_ratio"])
                }
                for _, row in df.iterrows()
            ]
            
            # Execute everything in one single network roundtrip transaction
            await session.execute(
                text("""
                    INSERT INTO engineered_features 
                    (influencer_id, engagement_rate, share_rate, save_rate, view_rate, follower_following_ratio)
                    VALUES (:influencer_id, :er, :sr, :sv, :vr, :ffr)
                    ON CONFLICT (influencer_id) DO UPDATE SET
                    engagement_rate = EXCLUDED.engagement_rate,
                    share_rate = EXCLUDED.share_rate,
                    save_rate = EXCLUDED.save_rate,
                    view_rate = EXCLUDED.view_rate,
                    follower_following_ratio = EXCLUDED.follower_following_ratio;
                """),
                bulk_params
            )
            await session.commit()
            
    try:
        asyncio.run(_async_load())
        print("✅ [BATCH LOAD] Relational configurations successfully bulk-synchronized to NeonDB.")
    finally:
        asyncio.run(pipeline_engine.dispose())

# ========================================================================
# ── REALTIME INFERENCE PROCESSING (Influencer Platform-Specific Mapping) ──
# ========================================================================

def call_influencer_data_provider_api(username: str) -> dict:
    """Pulls down live platform analytics for a specific creator handle."""
    api_key = os.getenv("RAPIDAPI_KEY")
    api_host = os.getenv("RAPIDAPI_HOST")
    
    if api_key and "your_" not in api_key:
        url = f"https://{api_host}/v2/influencer/profile"
        headers = {"X-RapidAPI-Key": api_key, "X-RapidAPI-Host": api_host}
        try:
            response = requests.get(url, headers=headers, params={"username": username}, timeout=10)
            if response.status_code == 200:
                payload = response.json()
                profile = payload.get("collector", {})
                audience = payload.get("audience_demographics", {})
                
                return {
                    "followers_count": int(profile.get("follower_count", 68000)),
                    "following_count": int(profile.get("following_count", 450)),
                    "avg_likes_per_post": float(profile.get("stats", {}).get("avg_likes", 2400)),
                    "avg_comments_per_post": float(profile.get("stats", {}).get("avg_comments", 110)),
                    "avg_shares_per_post": float(profile.get("stats", {}).get("avg_shares", 45)),
                    "avg_saves_per_post": float(profile.get("stats", {}).get("avg_saves", 80)),
                    "avg_video_views": float(profile.get("stats", {}).get("avg_views", 32000)),
                    "comment_quality_index": float(audience.get("quality_signals", {}).get("authentic_comment_ratio", 0.85)),
                    "posting_regularity_deviation": float(profile.get("fingerprint", {}).get("intervals_std_dev", 0.14)),
                    "like_variance_index": float(profile.get("fingerprint", {}).get("like_distribution_skew", 0.28)),
                    "growth_velocity_30d": float(profile.get("trends", {}).get("follower_velocity_percentage", 3.8))
                }
        except Exception as api_err:
            print(f"⚠️ Live creator pipeline api request interrupted: {api_err}. Running mock baseline fallback loops.")

    return {
        "followers_count": 84000, "following_count": 520, "avg_likes_per_post": 3100, "avg_comments_per_post": 140,
        "avg_shares_per_post": 65, "avg_saves_per_post": 105, "avg_video_views": 41000, "comment_quality_index": 0.79,
        "posting_regularity_deviation": 0.11, "like_variance_index": 0.21, "growth_velocity_30d": 5.2
    }

def process_realtime_influencer_features():
    """Transforms raw incoming handles into clean arrays AND updates NeonDB with a dynamic unique ID."""
    raw_path = f"{DATA_PATH}/staging/realtime_raw_input.parquet"
    
    try:
        if os.path.exists(raw_path):
            df_raw = pd.read_parquet(raw_path)
        else:
            raise FileNotFoundError()
    except Exception:
        print("⚠️ Realtime influencer parquet missing or corrupted. Overwriting clean binary structure...")
        os.makedirs(f"{DATA_PATH}/staging", exist_ok=True)
        unique_id = f"inf_realtime_{uuid.uuid4().hex[:6]}"
        df_raw = pd.DataFrame([{
            "influencer_id": unique_id, "username": "artem_lipko", "niche": "tech",
            "followers": 500000, "country": "US", "tier": "macro", "post_frequency": 4
        }])
        df_raw.to_parquet(raw_path, index=False)
        
    processed_records = []
    
    # Setup our sanitized connection driver mapping on-the-fly
    database_url = os.getenv("NEON_DATABASE_URL", "")
    if "?" in database_url:
        database_url = database_url.split("?")[0]
        
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    pipeline_engine = create_async_engine(database_url, echo=False, connect_args={"ssl": ssl_context})
    PipelineSession = sessionmaker(pipeline_engine, class_=AsyncSession, expire_on_commit=False)

    async def _async_load_realtime():
        async with PipelineSession() as session:
            for _, row in df_raw.iterrows():
                live_data = call_influencer_data_provider_api(row["username"])
                
                followers = max(live_data["followers_count"], 1)
                views = max(live_data["avg_video_views"], 1)
                following = max(live_data["following_count"], 1)
                
                engagement_rate = ((live_data["avg_likes_per_post"] + live_data["avg_comments_per_post"]) / followers) * 100
                share_rate = live_data["avg_shares_per_post"] / views
                save_rate = live_data["avg_saves_per_post"] / views
                view_rate = live_data["avg_video_views"] / followers
                follower_following_ratio = followers / following
                
                feature_vector = [
                    float(engagement_rate), float(live_data["comment_quality_index"]), float(share_rate),
                    float(save_rate), float(view_rate), float(follower_following_ratio),
                    float(live_data["posting_regularity_deviation"]), float(live_data["like_variance_index"]),
                    float(live_data["growth_velocity_30d"]), int(followers), float(live_data["avg_likes_per_post"]),
                    float(live_data["avg_comments_per_post"]), float(engagement_rate), int(row.get("post_frequency", 3)),
                    float(live_data["avg_likes_per_post"]), float(live_data["avg_comments_per_post"]),
                    float(live_data["avg_shares_per_post"]), float(live_data["avg_saves_per_post"]),
                    float(live_data["avg_video_views"]), float(live_data["avg_video_views"] * 0.75),
                    float(row.get("post_frequency", 3)), float(row.get("post_frequency", 3) * 2), 19
                ]
                
                processed_records.append({
                    "influencer_id": str(row["influencer_id"]),
                    "username": row["username"],
                    "clean_features_array": feature_vector
                })

                # Stream the newly derived real-time metrics straight into NeonDB!
                await session.execute(
                    text("""
                        INSERT INTO engineered_features 
                        (influencer_id, engagement_rate, share_rate, save_rate, view_rate, follower_following_ratio)
                        VALUES (:influencer_id, :er, :sr, :sv, :vr, :ffr)
                        ON CONFLICT (influencer_id) DO UPDATE SET
                        engagement_rate = EXCLUDED.engagement_rate,
                        share_rate = EXCLUDED.share_rate,
                        save_rate = EXCLUDED.save_rate,
                        view_rate = EXCLUDED.view_rate,
                        follower_following_ratio = EXCLUDED.follower_following_ratio;
                    """),
                    {
                        "influencer_id": str(row["influencer_id"]),
                        "er": float(engagement_rate),
                        "sr": float(share_rate),
                        "sv": float(save_rate),
                        "vr": float(view_rate),
                        "ffr": float(follower_following_ratio)
                    }
                )
            await session.commit()

    try:
        asyncio.run(_async_load_realtime())
        print("✅ [REALTIME LOAD] Live statistics successfully inserted/updated in NeonDB cluster.")
    finally:
        asyncio.run(pipeline_engine.dispose())
        
    df_clean = pd.DataFrame(processed_records)
    df_clean.to_parquet(f"{DATA_PATH}/staging/ml_ready_influencer_prediction.parquet", index=False)
    print("✅ [REALTIME] Platform-specific creator data arrays successfully mapped for Model 1 & 2.")

def process_realtime_brand_match_features():
    """Binds text parameter attributes together into numerical configurations for Model 3."""
    inf_path = f"{DATA_PATH}/staging/realtime_raw_input.parquet"
    brand_path = f"{DATA_PATH}/staging/realtime_brand_input.parquet"
    
    try:
        if os.path.exists(inf_path) and os.path.exists(brand_path):
            df_inf = pd.read_parquet(inf_path)
            df_brand = pd.read_parquet(brand_path)
        else:
            raise FileNotFoundError()
    except Exception:
        print("⚠️ Realtime inputs missing or corrupted. Resetting clean fallback layout files...")
        os.makedirs(f"{DATA_PATH}/staging", exist_ok=True)
        unique_id = f"inf_realtime_{uuid.uuid4().hex[:6]}"
        df_inf = pd.DataFrame([{
            "influencer_id": unique_id, "username": "artem_lipko", "niche": "tech",
            "followers": 500000, "country": "US", "tier": "macro", "is_verified": True
        }])
        df_inf.to_parquet(inf_path, index=False)
        
        df_brand = pd.DataFrame([{
            "brand_name": "TechCorp Global", "category": "tech", "country_focus": "US",
            "target_gender": "all", "target_age_min": 18, "target_age_max": 35,
            "min_followers": 100000, "max_followers": 1000000
        }])
        df_brand.to_parquet(brand_path, index=False)
        
    pair_records = []
    
    for i in range(min(len(df_inf), len(df_brand))):
        inf_row = df_inf.iloc[i]
        brand_row = df_brand.iloc[i]
        
        niche_enc = NICHE_MAP.get(str(inf_row["niche"]).lower(), 1)
        country_enc = COUNTRY_MAP.get(str(inf_row["country"]).upper(), 3)
        brand_cat_enc = NICHE_MAP.get(str(brand_row["category"]).lower(), 1)
        brand_country_enc = COUNTRY_MAP.get(str(brand_row["country_focus"]).upper(), 3)
        gender_enc = GENDER_MAP.get(str(brand_row["target_gender"]).lower(), 0)
        tier_enc = TIER_MAP.get(str(inf_row["tier"]).lower(), 2)
        
        match_vector = [
            int(inf_row["followers"]), int(niche_enc), int(country_enc),
            1 if bool(inf_row.get("is_verified", False)) else 0,
            int(tier_enc), int(brand_cat_enc),
            int(brand_row["target_age_min"]), int(brand_row["target_age_max"]),
            int(gender_enc), int(brand_country_enc)
        ]
        
        pair_records.append({
            "influencer_id": str(inf_row["influencer_id"]),
            "brand_name": brand_row["brand_name"],
            "clean_pair_array": match_vector
        })
        
    df_pairs = pd.DataFrame(pair_records)
    df_pairs.to_parquet(f"{DATA_PATH}/staging/ml_ready_brand_match_prediction.parquet", index=False)
    print("✅ [REALTIME] Categorical influencer pairing profiles mapped into arrays for Model 3.")