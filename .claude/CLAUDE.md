# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Telegram Mini App for a school marketplace that enables schoolmates to list and purchase items. The project consists of:

- **Backend**: FastAPI service with Telegram Bot API integration for authentication and payments
- **Frontend**: React-based mini app UI designed for Telegram's webview experience

## Development Commands

### Backend

```bash
cd backend
poetry install                                    # Install dependencies
poetry run uvicorn app.main:app --reload         # Run development server
poetry run pytest                                 # Run tests
poetry run ruff check app                        # Lint code
poetry run black app                             # Format code
poetry run mypy app                              # Type checking
```

### Frontend

```bash
cd frontend
npm install                                       # Install dependencies
npm run dev                                       # Run Vite dev server
npm run build                                     # Type-check and build for production
npm run lint                                      # Run ESLint
npm run preview                                   # Preview production build
```

### Development Workflow

Run both services in separate terminals to test the full integration:
1. Terminal 1: `cd backend && poetry run uvicorn app.main:app --reload`
2. Terminal 2: `cd frontend && npm run dev`

## Architecture

### Backend Architecture

**Entry Point & Configuration**
- `app/main.py`: ASGI application entry point, wires together FastAPI app with CORS middleware and API routes
- `app/core/config.py`: Centralized settings using Pydantic BaseSettings, loads from `.env` files
- `app/core/security.py`: Authentication and security utilities

**API Layer**
- `app/api/api_v1.py`: Main API router that aggregates all route modules
- `app/api/routes/`: Individual route modules for different endpoints (health, listings, telegram)
- Routes use FastAPI's dependency injection for auth (`get_current_user`)

**Data Layer**
- `app/models/`: SQLAlchemy ORM models (User, Listing) with Base class in `models/base.py`
- `app/schemas/`: Pydantic schemas for request/response DTOs (separate from ORM models)
- `app/db/session.py`: Async SQLAlchemy session management with `get_db()` dependency

**Business Logic**
- `app/services/telegram.py`: Telegram authentication verification using HMAC-SHA256
  - `verify_telegram_auth()`: Validates Telegram WebApp init data
  - `fake_verify_telegram_auth()`: Test helper for local development
- `app/dependencies/auth.py`: Authentication dependencies for route protection

**Database**
- Uses async PostgreSQL via asyncpg
- SQLAlchemy 2.0 with async sessions
- Alembic configured for migrations (currently not set up but dependencies installed)

### Frontend Architecture

**Entry Point & Providers**
- `src/main.tsx`: App bootstrap with provider hierarchy:
  - QueryClientProvider (React Query for data fetching)
  - TelegramProvider (Telegram WebApp SDK integration)
  - Provider (Chakra UI theme provider)

**Telegram Integration**
- `src/services/telegram.ts`: Wraps @twa-dev/sdk for Telegram WebApp API
- `src/providers/TelegramProvider.tsx`: React context provider that:
  - Initializes Telegram WebApp SDK on mount
  - Fetches and caches user profile via `/telegram/auth` endpoint
  - Provides authentication state and user info to child components
- `src/providers/telegramContext.ts`: Context definition and `useTelegramContext()` hook

**Data Management**
- `src/services/apiClient.ts`: Axios instance configured with base URL from environment
- `src/hooks/useListings.ts`: React Query hook for listings data with transformations
- API responses use snake_case (Python convention), transformed to camelCase for React

**UI Components**
- `src/components/ui/`: Chakra UI components (color-mode, provider, toaster, tooltip)
- `src/components/layout/AppLayout.tsx`: Main app layout wrapper
- `src/components/listings/`: Listing-specific components (ListingCard, ListingDetail, AddListingDrawer)
- `src/components/profile/ProfileDrawer.tsx`: User profile drawer
- `src/components/photos/PhotoPicker.tsx`: Photo upload component

**Feature Organization**
- `src/features/listings/ListingsView.tsx`: Main listings view feature
- Features compose multiple components and hooks into complete user flows

**Configuration**
- `src/config/env.ts`: Type-safe environment variable access with validation
- `vite.config.ts`: Vite configuration with proxy setup for API routes during development
  - Proxies `/health` and `/listings` to backend API
  - Allows custom hosts for Telegram's webhook domain

## Key Technical Details

### Telegram Authentication Flow

1. Frontend initializes Telegram WebApp SDK and retrieves `initData`
2. Frontend sends `initData` to backend `/telegram/auth` endpoint
3. Backend validates using HMAC-SHA256 with bot token as secret
4. Backend returns user profile if valid, throws 401 if invalid
5. Frontend caches user in React Query with 5-minute stale time

### Data Modeling

**Listings**
- Prices stored in minor units (cents/kopecks) as integers to avoid floating point issues
- Currency stored as 3-letter ISO code (e.g., "KZT")
- Placeholder implementation currently returns hardcoded data
- Foreign key relationship: `Listing.seller_id` → `User.id` with CASCADE delete

**Users**
- Telegram user IDs used as primary identifiers
- User model includes: id, first_name, last_name, username, language_code, is_premium, photo_url

### Environment Configuration

Both apps require `.env` files (copy from `.env.example`):

**Backend** (`backend/.env`):
- `DATABASE_URL`: PostgreSQL connection string (asyncpg format)
- `TELEGRAM_BOT_TOKEN`: Bot token from @BotFather
- `TELEGRAM_WEBHOOK_URL`: Optional webhook URL for production

**Frontend** (`frontend/.env`):
- `VITE_APP_NAME`: Application name
- `VITE_APP_API_URL`: Backend API base URL
- `VITE_APP_PORT`: Dev server port (default: 5173)

## Code Style

### Python (Backend)
- Black formatting (88 char lines, 4-space indent)
- Ruff for linting (FastAPI-specific rules enabled)
- Type hints required on all new code (mypy enforcement)
- Naming: `snake_case` for modules/functions, `PascalCase` for Pydantic models and classes
- Async by default: use `async def` for all route handlers and service methods

### TypeScript (Frontend)
- React components in `PascalCase`
- Custom hooks prefixed with `use`
- Utility functions in `camelCase`
- Prefer TypeScript strict mode
- Use `type` for object shapes, `interface` for extensible contracts

## Testing

### Backend
- Test files in `backend/tests/` following `test_*.py` pattern
- Use `pytest` with async fixtures
- Use FastAPI's `TestClient` for endpoint integration tests
- Example: `backend/tests/test_health.py`

### Frontend
- Testing infrastructure not yet implemented
- When adding: colocate tests near features, run in CI alongside ESLint

## Current State & Next Steps

**Implemented**:
- Basic FastAPI backend structure with health endpoint
- Telegram authentication verification
- SQLAlchemy models for User and Listing
- React frontend with Chakra UI
- Telegram WebApp SDK integration
- Listings view with placeholder data

**Not Yet Implemented** (from README):
- Database migrations (Alembic)
- Actual CRUD operations for listings (currently returning mock data)
- Payment flow integration
- Persistent user account creation
- Photo upload/storage for listings
