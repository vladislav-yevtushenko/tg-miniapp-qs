"""Endpoints for marketplace listings."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import get_current_user
from app.schemas.listing import Listing, ListingCreate
from app.schemas.user import User

router = APIRouter()


@router.get("/", response_model=List[Listing], summary="List available products")
async def list_listings(_: User = Depends(get_current_user)) -> list[Listing]:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Listings retrieval not yet implemented")


@router.post("/", response_model=Listing, status_code=status.HTTP_201_CREATED, summary="Create a new listing")
async def create_listing(_: ListingCreate, __: User = Depends(get_current_user)) -> Listing:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Listing creation not yet implemented")
