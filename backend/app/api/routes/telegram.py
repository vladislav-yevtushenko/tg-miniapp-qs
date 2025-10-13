"""Telegram related endpoints."""

from fastapi import APIRouter, HTTPException, status

from app.schemas.telegram import TelegramAuthRequest, TelegramAuthResponse, TelegramUser
from app.services.telegram import (
    TelegramAuthError,
    verify_telegram_auth,
    fake_verify_telegram_auth,
)

router = APIRouter()


@router.post(
    "/auth",
    response_model=TelegramAuthResponse,
    summary="Verify Telegram Mini App auth data",
)
async def authenticate(payload: TelegramAuthRequest) -> TelegramAuthResponse:
    """Validate Telegram init data and return the parsed user payload."""
    try:
        # user_payload = verify_telegram_auth(payload.init_data)
        user_payload = fake_verify_telegram_auth(payload.init_data)
    except TelegramAuthError as exc:
        raise exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Malformed init data"
        ) from exc

    return TelegramAuthResponse(user=TelegramUser(**user_payload))
