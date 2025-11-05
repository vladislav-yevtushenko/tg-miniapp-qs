"""Storage service factory and exports."""

from typing import Union

from app.core.config import settings
from app.services.storage.base import StorageBackend
from app.services.storage.s3_backend import S3StorageService
from app.services.storage.supabase_backend import SupabaseStorageService


# Singleton instance
_storage_service: Union[S3StorageService, SupabaseStorageService, None] = None


def get_storage_service() -> StorageBackend:
    """Get or create storage service instance based on configuration.

    Returns:
        StorageBackend implementation (S3 or Supabase)

    Raises:
        ValueError: If storage backend is not configured or invalid
    """
    global _storage_service

    if _storage_service is None:
        backend = settings.storage_backend.lower()

        if backend == "supabase":
            _storage_service = SupabaseStorageService()
        elif backend in ("s3", "minio"):
            _storage_service = S3StorageService()
        else:
            raise ValueError(
                f"Invalid storage backend: {backend}. "
                "Supported backends: 'supabase', 's3', 'minio'"
            )

    return _storage_service


__all__ = ["get_storage_service", "StorageBackend"]
