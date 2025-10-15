# Repository Guidelines

## Project Structure & Module Organization
- `backend/app/api`, `app/services`, and `app/schemas` hold FastAPI routers, domain logic, and shared DTOs; `app/main.py` wires the ASGI app.
- `backend/app/core` centralizes settings, auth, and utilities; `backend/tests/test_health.py` shows the `pytest` layout for new suites.
- `frontend/src` groups UI by responsibility (`components`, `features`, `hooks`, `services`, `utils`), with `main.tsx` bootstrapping the React mini app.
- Static assets live in `frontend/public`, and both apps rely on `.env` files copied from their respective `.env.example`.

## Build, Test, and Development Commands
- Backend install & dev server: `cd backend && poetry install && poetry run uvicorn app.main:app --reload`.
- Backend quality gates: `poetry run pytest`, `poetry run ruff check app`, and `poetry run black app`.
- Frontend workflow: `cd frontend && npm install`, `npm run dev` for Vite, `npm run build` for a type-checked production bundle, `npm run lint` for ESLint.
- Spin up both services together by running each dev server in separate terminals to mirror Telegram webview + API interactions.

## Coding Style & Naming Conventions
- Python code follows Black defaults (4-space indent, 88-character lines) and Ruff’s FastAPI rules; keep modules and packages in `snake_case`, Pydantic models in `PascalCase`.
- Type-hint all new backend code and resolve `mypy` feedback before opening a PR.
- Frontend sticks to TypeScript modules (`.ts`/`.tsx`), React components in `PascalCase`, hooks as `useX`, and shared utilities in `camelCase`.
- Keep environment-specific values behind configuration objects (`app/core/config.py`, `frontend/src/config/*`) to simplify Telegram deployment.

## Testing Guidelines
- Write backend tests with `pytest`, mirroring the `test_*.py` pattern; prefer async fixtures and FastAPI’s `TestClient` for endpoint coverage.
- Aim to cover new endpoints and services with unit tests plus at least one integration path per feature flag.
- Frontend tests are pending; when adding them, colocate specs near the feature directory and run them in CI alongside ESLint.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`) as seen in `git log`; keep subject lines under 72 characters.
- Each PR should explain the Telegram scenario solved, list backend/frontend touchpoints, link related issues, and attach screenshots or screencasts for UI work.
- Confirm all linting, tests, and local dev servers pass before requesting review; note any skipped checks in the PR description.
