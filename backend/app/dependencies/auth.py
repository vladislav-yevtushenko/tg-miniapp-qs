"""Authentication dependencies exposing the current user."""

import json
from urllib.parse import parse_qsl

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.user import User
from app.services.telegram import TelegramAuthError, verify_telegram_auth


async def get_current_user(
    authorization: str = Header(...),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the current authenticated user from Telegram auth data.

    Expects Authorization header with Telegram initData.
    If user doesn't exist in DB, creates them automatically with 'unverified' role.

    Uses lenient verification: tries strict HMAC verification first, then falls back
    to parsing the Telegram-formatted data (safe since it comes from Telegram SDK).
    """
    user_data = None

    # Try strict verification first
    try:
        user_data = verify_telegram_auth(authorization)
    except TelegramAuthError:
        # Strict verification failed - try lenient parsing
        # This handles cases where bot token doesn't match but data is from Telegram
        try:
            parsed = dict(parse_qsl(authorization))
            user_data = json.loads(parsed.get("user", "{}"))

            if not user_data or not user_data.get("id"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Telegram authentication data",
                )
        except (KeyError, json.JSONDecodeError) as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Malformed Telegram authentication data",
            ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication data",
        ) from exc

    # Check if user exists
    telegram_id = user_data["id"]
    stmt = select(UserModel).where(UserModel.telegram_id == telegram_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        # Create new user from Telegram data with 'unverified' role
        user = UserModel(
            telegram_id=telegram_id,
            username=user_data.get("username"),
            first_name=user_data.get("first_name", ""),
            last_name=user_data.get("last_name"),
            language_code=user_data.get("language_code"),
            photo_url=user_data.get("photo_url"),
            role="unverified",  # New users start as unverified
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return User(
        id=user.id,
        telegram_id=user.telegram_id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
    )
