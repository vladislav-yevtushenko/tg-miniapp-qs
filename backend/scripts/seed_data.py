"""Seed database with test data."""

import asyncio
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.models.base import Base
from app.models.listing import Listing
from app.models.listing_photo import ListingPhoto
from app.models.user import User


async def seed_database():
    """Seed database with test users and listings."""
    # Create async engine
    engine = create_async_engine(settings.database_url, echo=True)

    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

    # Create async session
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy.orm import sessionmaker

    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if users already exist
        result = await session.execute(select(User).limit(1))
        existing_users = result.scalars().all()

        if existing_users:
            print("Database already seeded. Skipping...")
            return

        print("Seeding database...")

        # Create test users
        users_data = [
            {
                "telegram_id": 123456789,
                "username": "john_doe",
                "first_name": "John",
                "last_name": "Doe",
                "language_code": "en",
                "is_premium": False,
                "role": "student",
            },
            {
                "telegram_id": 987654321,
                "username": "jane_smith",
                "first_name": "Jane",
                "last_name": "Smith",
                "language_code": "en",
                "is_premium": True,
                "role": "student",
            },
            {
                "telegram_id": 555555555,
                "username": "moderator",
                "first_name": "Admin",
                "last_name": "User",
                "language_code": "en",
                "is_premium": False,
                "role": "moderator",
            },
        ]

        users = []
        for user_data in users_data:
            user = User(**user_data)
            session.add(user)
            users.append(user)

        await session.flush()  # Get user IDs

        print(f"Created {len(users)} users")

        # Create test listings
        listings_data = [
            {
                "title": "MacBook Pro 16-inch (2023)",
                "description": "Excellent condition, barely used. Includes original charger and box. Perfect for students doing video editing or programming. M2 Pro chip, 16GB RAM, 512GB SSD.",
                "price_minor_units": 180000000,  # 1,800,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "electronics",
                "condition": "like_new",
                "seller_id": users[0].id,
            },
            {
                "title": "Calculus Textbook - 9th Edition",
                "description": "Used textbook in good condition. Some highlighting but all pages intact. Great for math students.",
                "price_minor_units": 500000,  # 5,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "textbooks",
                "condition": "good",
                "seller_id": users[1].id,
            },
            {
                "title": "Mountain Bike - Trek Marlin 7",
                "description": "Well-maintained mountain bike. Hydraulic disc brakes, 29-inch wheels. Perfect for trail riding. Includes bike lock.",
                "price_minor_units": 15000000,  # 150,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "sports",
                "condition": "good",
                "seller_id": users[0].id,
            },
            {
                "title": "Winter Jacket - North Face",
                "description": "Size M, barely worn. Very warm, perfect for harsh winters. Black color, down-filled.",
                "price_minor_units": 2500000,  # 25,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "clothing",
                "condition": "like_new",
                "seller_id": users[1].id,
            },
            {
                "title": "Study Desk with Chair",
                "description": "Solid wood desk with matching chair. Some minor scratches but very sturdy. Dimensions: 120x60cm.",
                "price_minor_units": 1500000,  # 15,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "furniture",
                "condition": "good",
                "seller_id": users[0].id,
            },
            {
                "title": "Python Programming Course Notes",
                "description": "Comprehensive notes from CS101. Includes examples, exercises, and cheat sheets. Digital PDF format.",
                "price_minor_units": 100000,  # 1,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "study_materials",
                "condition": "new",
                "seller_id": users[1].id,
            },
            {
                "title": "Guitar - Yamaha F310",
                "description": "Acoustic guitar in great condition. Includes soft case, tuner, and extra strings. Perfect for beginners.",
                "price_minor_units": 3000000,  # 30,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "musical_instruments",
                "condition": "good",
                "seller_id": users[0].id,
            },
            {
                "title": "Scientific Calculator - TI-84 Plus",
                "description": "Essential for engineering and science students. All functions work perfectly. Includes USB cable.",
                "price_minor_units": 1200000,  # 12,000 KZT
                "currency": "KZT",
                "status": "active",
                "category": "electronics",
                "condition": "good",
                "seller_id": users[1].id,
            },
        ]

        listings = []
        for listing_data in listings_data:
            listing = Listing(**listing_data)
            session.add(listing)
            listings.append(listing)

        await session.flush()  # Get listing IDs

        print(f"Created {len(listings)} listings")

        # Add some placeholder photos (using picsum.photos)
        for i, listing in enumerate(listings):
            # Add 1-3 photos per listing
            num_photos = (i % 3) + 1
            for j in range(num_photos):
                photo = ListingPhoto(
                    listing_id=listing.id,
                    photo_url=f"https://picsum.photos/seed/listing-{listing.id}-{j}/800/600",
                    display_order=j,
                )
                session.add(photo)

        await session.commit()
        print("✅ Database seeded successfully!")
        print(f"   - {len(users)} users")
        print(f"   - {len(listings)} listings")
        print("   - Multiple photos per listing")

    await engine.dispose()


if __name__ == "__main__":
    print("Starting database seed...")
    asyncio.run(seed_database())
