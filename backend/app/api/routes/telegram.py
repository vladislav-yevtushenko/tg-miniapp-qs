"""Telegram related endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.telegram import TelegramAuthRequest, TelegramAuthResponse, TelegramUser
from app.services.telegram import (
    TelegramAuthError,
    verify_telegram_auth,
)

router = APIRouter()

log = logging.getLogger(__name__)


# NOTE: This endpoint is no longer needed - users are auto-created on first authenticated request
# via get_current_user() dependency. Keeping this commented for reference.
#
# @router.post(
#     "/auth",
#     response_model=TelegramAuthResponse,
#     summary="Verify Telegram Mini App auth data",
# )
# async def authenticate(
#     payload: TelegramAuthRequest, db: AsyncSession = Depends(get_db)
# ) -> TelegramAuthResponse:
#     """Validate Telegram init data, create/update user, and return the user info."""
#     print(f"Payload: {payload}")
#     try:
#         user_payload = verify_telegram_auth(payload.init_data)
#     except TelegramAuthError as exc:
#         raise exc
#     except Exception as exc:  # pragma: no cover
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST, detail="Malformed init data"
#         ) from exc
#
#     # Create or update user in database
#     telegram_id = user_payload["id"]
#     stmt = select(UserModel).where(UserModel.telegram_id == telegram_id)
#     result = await db.execute(stmt)
#     user = result.scalar_one_or_none()
#
#     if not user:
#         # Create new user with unverified role
#         user = UserModel(
#             telegram_id=telegram_id,
#             username=user_payload.get("username"),
#             first_name=user_payload.get("first_name", ""),
#             last_name=user_payload.get("last_name"),
#             language_code=user_payload.get("language_code"),
#             photo_url=user_payload.get("photo_url"),
#             role="unverified",  # New users start as unverified
#         )
#         db.add(user)
#         await db.commit()
#         await db.refresh(user)
#     else:
#         # Update existing user info (keep their current role)
#         user.username = user_payload.get("username") or user.username
#         user.first_name = user_payload.get("first_name", "") or user.first_name
#         user.last_name = user_payload.get("last_name") or user.last_name
#         user.photo_url = user_payload.get("photo_url") or user.photo_url
#         await db.commit()
#
#     return TelegramAuthResponse(user=TelegramUser(**user_payload))
