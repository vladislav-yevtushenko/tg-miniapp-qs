"""Listing schemas."""

from datetime import datetime

from pydantic import BaseModel, Field, PositiveInt


class ListingBase(BaseModel):
    title: str = Field(..., max_length=120)
    description: str = Field(..., max_length=2048)
    price_minor_units: PositiveInt
    currency: str = Field(..., min_length=3, max_length=3)


class ListingCreate(ListingBase):
    pass


class Listing(ListingBase):
    id: int
    seller_id: int
    created_at: datetime

    class Config:
        from_attributes = True
