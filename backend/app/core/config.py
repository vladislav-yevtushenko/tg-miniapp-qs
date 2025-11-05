"""Application configuration."""

from typing import List

from pydantic import Field, AnyHttpUrl, BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


class _CorsSettings(BaseModel):
    # allow_origins: List[AnyHttpUrl] | List[str] = ["http://localhost:5173"]
    allow_origins: List[AnyHttpUrl] | List[str] = ["*"]
    allow_credentials: bool = True
    allow_methods: List[str] = ["*"]
    allow_headers: List[str] = ["*"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    project_name: str = "School Marketplace"
    api_v1_prefix: str = "/api/v1"
    cors: _CorsSettings = _CorsSettings()

    database_url: str = Field(default="", validation_alias="DATABASE_URL")

    telegram_bot_token: str = Field(default="", validation_alias="TELEGRAM_BOT_TOKEN")
    telegram_webhook_url: AnyHttpUrl | None = None

    # Storage backend configuration
    storage_backend: str = Field(default="s3", validation_alias="STORAGE_BACKEND")  # "s3", "minio", or "supabase"

    # S3-compatible storage settings
    s3_endpoint_url: str | None = Field(default=None, validation_alias="S3_ENDPOINT_URL")
    s3_access_key_id: str = Field(default="", validation_alias="S3_ACCESS_KEY_ID")
    s3_secret_access_key: str = Field(default="", validation_alias="S3_SECRET_ACCESS_KEY")
    s3_bucket_name: str = Field(default="marketplace-photos", validation_alias="S3_BUCKET_NAME")
    s3_region: str = Field(default="us-east-1", validation_alias="S3_REGION")
    s3_public_url_base: str | None = Field(default=None, validation_alias="S3_PUBLIC_URL_BASE")

    # Supabase storage settings
    supabase_url: str | None = Field(default=None, validation_alias="SUPABASE_URL")
    supabase_key: str | None = Field(default=None, validation_alias="SUPABASE_KEY")
    supabase_bucket: str | None = Field(default="listing-photos", validation_alias="SUPABASE_BUCKET")


settings = Settings()
