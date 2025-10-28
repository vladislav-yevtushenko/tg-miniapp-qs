"""Listing photo model."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.sql import func

from app.models.base import Base


class ListingPhoto(Base):
    __tablename__ = "listing_photos"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = mapped_column(ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True)
    photo_url = Column(Text, nullable=False)
    display_order = Column(Integer, nullable=False, server_default="0")
    created_at = Column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    listing = relationship("Listing", back_populates="photos")
