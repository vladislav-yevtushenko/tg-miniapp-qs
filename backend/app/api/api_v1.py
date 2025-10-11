"""API v1 router aggregation."""

from fastapi import APIRouter

from app.api.routes import health, listings, telegram

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(telegram.router, prefix="/telegram", tags=["telegram"])
api_router.include_router(listings.router, prefix="/listings", tags=["listings"])
