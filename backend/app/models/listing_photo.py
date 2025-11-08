"""Listing photo model."""

from typing import Any

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.sql import func

from app.models.base import Base


class ListingPhoto(Base):
    __tablename__ = "listing_photos"

    # Explicitly declare we don't want updated_at from Base
    __mapper_args__: dict[str, Any] = {"exclude_properties": ["updated_at"]}

    id = Column(Integer, primary_key=True, index=True)
    listing_id = mapped_column(
        ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    photo_url = Column(Text, nullable=False)
    display_order = Column(Integer, nullable=False, server_default="0")
    thumbnail_data = Column(Text, nullable=True)  # Base64-encoded thumbnail
    file_size_bytes = Column(Integer, nullable=True)
    original_filename = Column(String(255), nullable=True)
    created_at = Column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    listing = relationship("Listing", back_populates="photos")
