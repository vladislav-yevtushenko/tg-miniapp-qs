"""User schemas."""

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    telegram_id: int
    username: str | None = None
    first_name: str
    last_name: str | None = None
    email: EmailStr | None = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    role: str  # unverified, verified, moderator, admin

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    """Public user information for displaying in listings."""

    id: int
    telegram_id: int
    username: str | None = None
    first_name: str
    last_name: str | None = None
    photo_url: str | None = None

    class Config:
        from_attributes = True
