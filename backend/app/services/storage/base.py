"""Base storage backend protocol."""

from typing import Protocol

from fastapi import UploadFile


class StorageBackend(Protocol):
    """Protocol for storage backends."""

    ALLOWED_IMAGE_EXTENSIONS: set[str]
    MAX_FILE_SIZE: int

    def validate_file(self, file: UploadFile) -> None:
        """Validate file type and size.

        Args:
            file: The uploaded file

        Raises:
            ValueError: If file validation fails
        """
        ...

    async def upload_file(self, file: UploadFile, folder: str = "listings") -> str:
        """Upload file to storage and return public URL.

        Args:
            file: The file to upload
            folder: Folder path in storage

        Returns:
            Public URL of the uploaded file

        Raises:
            ValueError: If file validation fails
            Exception: If upload fails
        """
        ...

    def delete_file(self, url: str) -> bool:
        """Delete file from storage.

        Args:
            url: Public URL of the file to delete

        Returns:
            True if deletion was successful, False otherwise
        """
        ...
