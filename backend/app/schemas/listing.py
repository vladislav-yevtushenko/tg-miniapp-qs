from datetime import datetime

from pydantic import BaseModel, Field, PositiveInt

from app.schemas.photo import PhotoResponse
from app.schemas.user import UserPublic


class ListingBase(BaseModel):
    title: str = Field(..., max_length=120)
    description: str = Field(..., max_length=2048)
    price_minor_units: PositiveInt
    currency: str = Field(..., min_length=3, max_length=3)


class ListingCreate(ListingBase):
    category: str | None = Field(None, max_length=50)
    condition: str | None = Field(None, max_length=20)


class Listing(ListingBase):
    id: int
    seller_id: int
    created_at: datetime
    updated_at: datetime
    photos: list[PhotoResponse] = []

    class Config:
        from_attributes = True


class ListingWithSeller(Listing):

    seller: UserPublic

    class Config:
        from_attributes = True
