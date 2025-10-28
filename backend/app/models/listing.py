"""Listing model."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    price_minor_units = Column(Integer, nullable=False)
    currency = Column(String(3), nullable=False, server_default="KZT")
    status = Column(String(20), nullable=False, server_default="pending", index=True)  # pending, active, rejected, sold, inactive
    category = Column(String(50), nullable=True)
    condition = Column(String(20), nullable=True)
    view_count = Column(Integer, nullable=False, server_default="0")
    moderated_by_id = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    moderated_at = Column("moderated_at", DateTime(timezone=True), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )
    updated_at = Column(
        "updated_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    seller = relationship("User", foreign_keys=[seller_id], back_populates="listings")
    photos = relationship("ListingPhoto", back_populates="listing", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="listing", cascade="all, delete-orphan")
