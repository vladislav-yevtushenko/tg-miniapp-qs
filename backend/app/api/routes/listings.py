"""Endpoints for marketplace listings."""

from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.listing import Listing as ListingModel
from app.models.listing_photo import ListingPhoto
from app.schemas.listing import Listing, ListingCreate, ListingWithSeller
from app.schemas.user import User
from app.services.storage import get_storage_service

router = APIRouter()


@router.get("/", response_model=List[ListingWithSeller], summary="List available products")
async def list_listings(
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ListingWithSeller]:
    """Get all active listings with seller information and photos."""
    try:
        # Query active listings with eager loading of seller and photos
        stmt = (
            select(ListingModel)
            .where(ListingModel.status == "active")
            .options(
                selectinload(ListingModel.seller),
                selectinload(ListingModel.photos),
            )
            .order_by(ListingModel.created_at.desc())
        )

        result = await db.execute(stmt)
        listings = result.scalars().all()

        # Transform to response schema with photos array
        response_listings = []
        for listing in listings:
            listing_dict = {
                "id": listing.id,
                "title": listing.title,
                "description": listing.description,
                "price_minor_units": listing.price_minor_units,
                "currency": listing.currency,
                "seller_id": listing.seller_id,
                "created_at": listing.created_at,
                "updated_at": listing.updated_at,
                "photos": [photo.photo_url for photo in listing.photos],
                "seller": listing.seller,
            }
            response_listings.append(ListingWithSeller(**listing_dict))

        return response_listings

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve listings: {str(e)}",
        )


@router.post(
    "/",
    response_model=Listing,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new listing",
)
async def create_listing(
    listing_data: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Listing:
    """Create a new listing.

    Listings are created with status='pending' and require moderator approval.
    """
    try:
        # Create new listing
        new_listing = ListingModel(
            title=listing_data.title,
            description=listing_data.description,
            price_minor_units=listing_data.price_minor_units,
            currency=listing_data.currency,
            category=listing_data.category,
            condition=listing_data.condition,
            seller_id=current_user.id,
            status="pending",  # Requires approval
        )

        db.add(new_listing)
        await db.commit()
        await db.refresh(new_listing)

        return Listing(
            id=new_listing.id,
            title=new_listing.title,
            description=new_listing.description,
            price_minor_units=new_listing.price_minor_units,
            currency=new_listing.currency,
            seller_id=new_listing.seller_id,
            created_at=new_listing.created_at,
            updated_at=new_listing.updated_at,
            photos=[],
        )

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create listing: {str(e)}",
        )


@router.post(
    "/{listing_id}/photos",
    response_model=List[str],
    summary="Upload photos for a listing",
)
async def upload_listing_photos(
    listing_id: int,
    photos: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[str]:
    """Upload one or more photos for a listing.

    Only the listing owner can upload photos.
    Maximum 5 photos per listing.
    """
    # Check if listing exists and belongs to current user
    stmt = select(ListingModel).where(ListingModel.id == listing_id)
    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if listing.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only upload photos to your own listings",
        )

    # Check existing photo count
    stmt = select(ListingPhoto).where(ListingPhoto.listing_id == listing_id)
    result = await db.execute(stmt)
    existing_photos = result.scalars().all()

    if len(existing_photos) + len(photos) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum 5 photos per listing. Currently {len(existing_photos)} photos exist.",
        )

    try:
        storage_service = get_storage_service()
        uploaded_urls = []

        for idx, photo in enumerate(photos):
            # Upload to S3
            photo_url = await storage_service.upload_file(photo, folder="listings")

            # Create database record
            display_order = len(existing_photos) + idx
            photo_record = ListingPhoto(
                listing_id=listing_id,
                photo_url=photo_url,
                display_order=display_order,
            )
            db.add(photo_record)
            uploaded_urls.append(photo_url)

        await db.commit()
        return uploaded_urls

    except ValueError as e:
        # Validation error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        # Clean up uploaded files
        storage_service = get_storage_service()
        for url in uploaded_urls:
            storage_service.delete_file(url)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload photos: {str(e)}",
        )
