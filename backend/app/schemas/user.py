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

    class Config:
        from_attributes = True
