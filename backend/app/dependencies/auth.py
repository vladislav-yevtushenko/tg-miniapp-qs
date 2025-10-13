"""Authentication dependencies exposing the current user."""

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import User


async def get_current_user(_: AsyncSession = Depends(get_db)) -> User:
    """Placeholder current-user dependency until auth is implemented."""
    # raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Authentication not yet implemented")
    return User(
        id=1,
        telegram_id=123456789,
        username="testuser",
        first_name="Test",
    )
