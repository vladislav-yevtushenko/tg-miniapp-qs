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


settings = Settings()
