"""S3-compatible storage service for file uploads."""

import uuid
from pathlib import Path

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from fastapi import UploadFile

from app.core.config import settings


class S3StorageService:
    """Service for uploading files to S3-compatible storage (MinIO, AWS S3, etc)."""

    # Allowed file extensions
    ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

    # Max file size: 10MB
    MAX_FILE_SIZE = 10 * 1024 * 1024

    def __init__(self):
        """Initialize S3 client."""
        s3_config = {}

        if settings.s3_endpoint_url:
            s3_config["endpoint_url"] = settings.s3_endpoint_url

        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region,
            config=Config(signature_version="s3v4"),
            **s3_config,
        )

        self.bucket_name = settings.s3_bucket_name
        self.public_url_base = settings.s3_public_url_base

        # Ensure bucket exists
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        """Create bucket if it doesn't exist."""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "404":
                # Bucket doesn't exist, create it
                try:
                    if settings.s3_region == "us-east-1":
                        self.s3_client.create_bucket(Bucket=self.bucket_name)
                    else:
                        self.s3_client.create_bucket(
                            Bucket=self.bucket_name,
                            CreateBucketConfiguration={
                                "LocationConstraint": settings.s3_region
                            },
                        )

                    # Set bucket policy to make objects publicly readable
                    policy = {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Sid": "PublicReadGetObject",
                                "Effect": "Allow",
                                "Principal": "*",
                                "Action": "s3:GetObject",
                                "Resource": f"arn:aws:s3:::{self.bucket_name}/*",
                            }
                        ],
                    }
                    import json

                    self.s3_client.put_bucket_policy(
                        Bucket=self.bucket_name, Policy=json.dumps(policy)
                    )
                except ClientError as create_error:
                    # If bucket creation fails, log but continue
                    # (bucket might be created manually)
                    print(f"Warning: Could not create bucket: {create_error}")

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
            raise ValueError(
                f"File too large. Maximum size: {self.MAX_FILE_SIZE / 1024 / 1024}MB"
            )

    async def upload_file(self, file: UploadFile, folder: str = "listings") -> str:
        """Upload file to S3 and return public URL.

        Args:
            file: The file to upload
            folder: Folder path in S3 bucket

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
        s3_key = f"{folder}/{unique_filename}"

        try:
            # Upload file
            contents = await file.read()
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=contents,
                ContentType=file.content_type or "image/jpeg",
            )

            # Generate public URL
            if self.public_url_base:
                public_url = f"{self.public_url_base}/{s3_key}"
            elif settings.s3_endpoint_url:
                public_url = f"{settings.s3_endpoint_url}/{self.bucket_name}/{s3_key}"
            else:
                # AWS S3 standard URL format
                if settings.s3_region == "us-east-1":
                    public_url = f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
                else:
                    public_url = f"https://{self.bucket_name}.s3.{settings.s3_region}.amazonaws.com/{s3_key}"

            return public_url

        except Exception as e:
            raise Exception(f"Failed to upload file: {str(e)}")

    def delete_file(self, url: str) -> bool:
        """Delete file from S3.

        Args:
            url: Public URL of the file to delete

        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            # Extract S3 key from URL
            # Handle different URL formats
            if self.bucket_name in url:
                parts = url.split(f"{self.bucket_name}/")
                if len(parts) > 1:
                    s3_key = parts[-1]
                else:
                    return False
            else:
                return False

            # Delete object
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=s3_key)
            return True

        except Exception as e:
            print(f"Failed to delete file: {str(e)}")
            return False


# Singleton instance
_storage_service: S3StorageService | None = None


def get_storage_service() -> S3StorageService:
    """Get or create storage service instance."""
    global _storage_service
    if _storage_service is None:
        _storage_service = S3StorageService()
    return _storage_service
