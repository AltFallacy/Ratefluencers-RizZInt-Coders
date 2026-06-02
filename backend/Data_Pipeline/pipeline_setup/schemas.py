from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
from database import Base

class EngineeredFeaturesSchema(Base):
    __tablename__ = "engineered_features"

    influencer_id = Column(String(255), primary_key=True, index=True)
    engagement_rate = Column(Float, nullable=True)
    share_rate = Column(Float, nullable=True)
    save_rate = Column(Float, nullable=True)
    view_rate = Column(Float, nullable=True)
    follower_following_ratio = Column(Float, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)