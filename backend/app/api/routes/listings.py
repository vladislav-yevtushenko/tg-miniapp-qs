"""Endpoints for marketplace listings."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import get_current_user
from app.schemas.listing import Listing, ListingCreate
from app.schemas.user import User

router = APIRouter()


@router.get("/", response_model=List[Listing], summary="List available products")
async def list_listings(_: User = Depends(get_current_user)) -> list[Listing]:
    from datetime import datetime

    return [
        Listing(
            id=1,
            seller_id=1,
            title="Отдам котенка в хорошие руки",
            description="Очень ласковый и игривый котенок, ищет дом.",
            price_minor_units=1000,
            currency="KZT",
            created_at=datetime(2023, 1, 1, 12, 0, 0),
        ),
        Listing(
            id=2,
            seller_id=2,
            title="Продам велосипед",
            description="Горный велосипед в отличном состоянии, почти новый.",
            price_minor_units=1500000,
            currency="KZT",
            created_at=datetime(2023, 2, 1, 15, 30, 0),
        ),
        Listing(
            id=3,
            seller_id=3,
            title="Ищу напарника для совместных тренировок",
            description="Хочу найти человека, с которым можно будет вместе заниматься спортом.",
            price_minor_units=1,
            currency="KZT",
            created_at=datetime(2023, 2, 1, 15, 30, 0),
        ),
    ]


@router.post(
    "/",
    response_model=Listing,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new listing",
)
async def create_listing(
    _: ListingCreate, __: User = Depends(get_current_user)
) -> Listing:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Listings retrieval not yet implemented",
    )
