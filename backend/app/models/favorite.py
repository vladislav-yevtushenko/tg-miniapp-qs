"""Favorite model."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint("user_id", "listing_id", name="uq_user_listing"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    listing_id = mapped_column(ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    user = relationship("User", back_populates="favorites")
    listing = relationship("Listing", back_populates="favorites")
