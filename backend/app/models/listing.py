"""Listing model."""

from sqlalchemy import Column, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import mapped_column, relationship

from app.models.base import Base


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    price_minor_units = Column(Integer, nullable=False)
    currency = Column(String(3), nullable=False)

    seller = relationship("User", back_populates="listings")
