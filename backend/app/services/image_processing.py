"""Image processing service for thumbnails and optimization."""

import base64
import io
from typing import BinaryIO

from PIL import Image


class ImageProcessingService:
    """Service for image processing operations."""

    # Thumbnail dimensions
    THUMBNAIL_SIZE = (300, 300)
    THUMBNAIL_QUALITY = 80  # JPEG quality for thumbnails
    THUMBNAIL_FORMAT = "JPEG"

    @staticmethod
    def generate_thumbnail(image_data: bytes, max_size: tuple[int, int] = THUMBNAIL_SIZE) -> str:
        """Generate a thumbnail from image data and return as base64.

        Args:
            image_data: Raw image bytes
            max_size: Maximum thumbnail dimensions (width, height)

        Returns:
            Base64-encoded thumbnail string (without data URI prefix)

        Raises:
            ValueError: If image processing fails
        """
        try:
            # Open image from bytes
            image = Image.open(io.BytesIO(image_data))

            # Convert RGBA to RGB if necessary (for JPEG compatibility)
            if image.mode in ("RGBA", "LA", "P"):
                # Create white background
                background = Image.new("RGB", image.size, (255, 255, 255))
                if image.mode == "P":
                    image = image.convert("RGBA")
                background.paste(image, mask=image.split()[-1] if image.mode in ("RGBA", "LA") else None)
                image = background

            # Create thumbnail (maintains aspect ratio)
            image.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Save to bytes buffer as JPEG
            buffer = io.BytesIO()
            image.save(
                buffer,
                format=ImageProcessingService.THUMBNAIL_FORMAT,
                quality=ImageProcessingService.THUMBNAIL_QUALITY,
                optimize=True,
            )
            buffer.seek(0)

            # Encode to base64
            thumbnail_base64 = base64.b64encode(buffer.read()).decode("utf-8")

            return thumbnail_base64

        except Exception as e:
            raise ValueError(f"Failed to generate thumbnail: {str(e)}")

    @staticmethod
    def get_image_dimensions(image_data: bytes) -> tuple[int, int]:
        """Get image dimensions.

        Args:
            image_data: Raw image bytes

        Returns:
            Tuple of (width, height)

        Raises:
            ValueError: If image cannot be processed
        """
        try:
            image = Image.open(io.BytesIO(image_data))
            return image.size
        except Exception as e:
            raise ValueError(f"Failed to get image dimensions: {str(e)}")


# Service instance
image_service = ImageProcessingService()
