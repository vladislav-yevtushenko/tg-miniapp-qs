"""Supabase Storage backend implementation."""

import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings


class SupabaseStorageService:
    """Service for uploading files to Supabase Storage."""

    # Allowed file extensions
    ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

    # Max file size: 10MB
    MAX_FILE_SIZE = 10 * 1024 * 1024

    def __init__(self):
        """Initialize Supabase Storage client."""
        # Import here to avoid requiring supabase-py if not using this backend
        try:
            from supabase import create_client, Client
        except ImportError:
            raise ImportError(
                "supabase-py is required for SupabaseStorageService. "
                "Install it with: poetry add supabase"
            )

        if not settings.supabase_url or not settings.supabase_key:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_KEY must be set to use Supabase storage backend"
            )

        self.client: Client = create_client(settings.supabase_url, settings.supabase_key)
        self.bucket_name = settings.supabase_bucket or "listing-photos"

        # Ensure bucket exists
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        """Create bucket if it doesn't exist."""
        try:
            # List buckets to check if our bucket exists
            buckets = self.client.storage.list_buckets()
            bucket_names = [b.name for b in buckets]

            if self.bucket_name not in bucket_names:
                # Create bucket with public access
                self.client.storage.create_bucket(
                    self.bucket_name,
                    options={"public": True}
                )
        except Exception as e:
            # If bucket check fails, log but continue
            # (bucket might be created manually)
            print(f"Warning: Could not verify/create bucket: {e}")

    def validate_file(self, file: UploadFile) -> None:
        """Validate file type and size.

        Args:
            file: The uploaded file

        Raises:
            ValueError: If file validation fails
        """
        # Check file extension
        if file.filename:
            ext = Path(file.filename).suffix.lower()
            if ext not in self.ALLOWED_IMAGE_EXTENSIONS:
                raise ValueError(
                    f"Invalid file type. Allowed types: {', '.join(self.ALLOWED_IMAGE_EXTENSIONS)}"
                )

        # Check file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning

        if file_size > self.MAX_FILE_SIZE:
            raise ValueError(f"File too large. Maximum size: {self.MAX_FILE_SIZE / 1024 / 1024}MB")

    async def upload_file(self, file: UploadFile, folder: str = "listings") -> str:
        """Upload file to Supabase Storage and return public URL.

        Args:
            file: The file to upload
            folder: Folder path in storage bucket

        Returns:
            Public URL of the uploaded file

        Raises:
            ValueError: If file validation fails
            Exception: If upload fails
        """
        # Validate file
        self.validate_file(file)

        # Generate unique filename
        ext = Path(file.filename or "image.jpg").suffix.lower()
        unique_filename = f"{uuid.uuid4()}{ext}"
        storage_path = f"{folder}/{unique_filename}"

        try:
            # Upload file
            contents = await file.read()

            result = self.client.storage.from_(self.bucket_name).upload(
                path=storage_path,
                file=contents,
                file_options={
                    "content-type": file.content_type or "image/jpeg",
                }
            )

            # Get public URL
            public_url_data = self.client.storage.from_(self.bucket_name).get_public_url(storage_path)

            return public_url_data

        except Exception as e:
            raise Exception(f"Failed to upload file to Supabase: {str(e)}")

    def delete_file(self, url: str) -> bool:
        """Delete file from Supabase Storage.

        Args:
            url: Public URL of the file to delete

        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            # Extract storage path from URL
            # Supabase URLs typically look like:
            # https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
            if f"/storage/v1/object/public/{self.bucket_name}/" in url:
                storage_path = url.split(f"/storage/v1/object/public/{self.bucket_name}/")[-1]
            else:
                return False

            # Delete object
            self.client.storage.from_(self.bucket_name).remove([storage_path])
            return True

        except Exception as e:
            print(f"Failed to delete file from Supabase: {str(e)}")
            return False
