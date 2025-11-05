"""Photo schemas."""

from datetime import datetime

from pydantic import BaseModel


class PhotoResponse(BaseModel):
    """Response schema for listing photos."""

    id: int
    photo_url: str
    display_order: int
    thumbnail_data: str | None = None  # Base64-encoded thumbnail
    file_size_bytes: int | None = None
    original_filename: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
        # Allow missing fields (for backward compatibility before migration)
        populate_by_name = True


class PhotoUploadResponse(BaseModel):
    """Response schema for photo upload operations."""

    url: str
    thumbnail: str | None = None  # Base64-encoded thumbnail
