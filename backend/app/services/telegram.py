"""Telegram integration helpers."""

from hashlib import sha256
import hmac
import json
from typing import Any
from urllib.parse import parse_qsl

from fastapi import HTTPException, status

from app.core.config import settings


class TelegramAuthError(HTTPException):
    """Raised when Telegram authentication data is invalid."""

    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Telegram auth data")


def _compute_hash(data_check_string: str) -> str:
    secret_key = sha256(settings.telegram_bot_token.encode()).digest()
    return hmac.new(secret_key, data_check_string.encode(), sha256).hexdigest()


def verify_telegram_auth(init_data: str) -> dict[str, Any]:
    """Verify Telegram init data and return the parsed payload."""
    parsed = dict(parse_qsl(init_data, keep_blank_values=True))
    hash_value = parsed.pop("hash", None)
    if not hash_value:
        raise TelegramAuthError()

    data_check_string = "\n".join(f"{k}={parsed[k]}" for k in sorted(parsed))
    if _compute_hash(data_check_string) != hash_value:
        raise TelegramAuthError()

    try:
        return json.loads(parsed["user"])
    except (KeyError, json.JSONDecodeError) as exc:
        raise TelegramAuthError() from exc
