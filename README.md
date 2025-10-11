# Telegram School Marketplace Mini App

This repository contains the initial scaffold for a Telegram Mini App that enables schoolmates to list and purchase items. It is composed of:

- **Backend** – FastAPI service that integrates with the Telegram Bot API for authentication and payments, and exposes marketplace endpoints.
- **Frontend** – React-based mini app UI tailored for the Telegram webview experience.

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env
poetry install
poetry run uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Next Steps

- Implement authentication flow connecting Telegram users to persisted accounts.
- Create CRUD operations for listings and link them with payment flows.
- Add database migrations (Alembic) and infrastructure automation.
