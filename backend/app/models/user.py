"""User model."""

from datetime import datetime

from sqlalchemy import BigInteger, Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False, index=True)
    username = Column(String(64), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True)
    language_code = Column(String(10), nullable=True)
    is_premium = Column(Boolean, default=False, nullable=False)
    photo_url = Column(Text, nullable=True)
    role = Column(String(20), nullable=False, server_default="student")  # student, moderator, admin
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at = Column(
        "updated_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    listings = relationship("Listing", foreign_keys="Listing.seller_id", back_populates="seller", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
