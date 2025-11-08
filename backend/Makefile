.PHONY: help install dev run test check format lint clean migrate migrate-create db-upgrade db-downgrade db-reset

# Default target
help:
	@echo "Available targets:"
	@echo "  install        - Install production dependencies"
	@echo "  dev            - Install all dependencies including dev"
	@echo "  run            - Run the development server"
	@echo "  test           - Run pytest tests"
	@echo "  check          - Run all checks (lint + type check)"
	@echo "  format         - Format code with black and ruff"
	@echo "  lint           - Run ruff linter"
	@echo "  lint-fix       - Run ruff linter with auto-fix"
	@echo "  type-check     - Run mypy type checking"
	@echo "  clean          - Remove cache files and build artifacts"
	@echo "  migrate        - Create a new migration"
	@echo "  db-upgrade     - Apply all pending migrations"
	@echo "  db-downgrade   - Rollback the last migration"
	@echo "  db-reset       - Reset database to initial state"
	@echo "  db-current     - Show current migration version"

# Installation
install:
	poetry install --no-dev

dev:
	poetry install

# Running the application
run:
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Testing
test:
	poetry run pytest -v

test-cov:
	poetry run pytest --cov=app --cov-report=html --cov-report=term

# Code quality
check: lint type-check
	@echo "✓ All checks passed!"

format:
	@echo "Formatting with black..."
	poetry run black app tests
	@echo "Sorting imports with ruff..."
	poetry run ruff check --select I --fix app tests
	@echo "✓ Code formatted!"

lint:
	@echo "Running ruff linter..."
	poetry run ruff check app tests

lint-fix:
	@echo "Running ruff linter with auto-fix..."
	poetry run ruff check --fix app tests

type-check:
	@echo "Running mypy type checker..."
	poetry run mypy app

# Database migrations
migrate:
	@read -p "Enter migration message: " msg; \
	poetry run alembic revision --autogenerate -m "$$msg"

db-upgrade:
	poetry run alembic upgrade head

db-downgrade:
	poetry run alembic downgrade -1

db-reset:
	poetry run alembic downgrade base
	poetry run alembic upgrade head

db-current:
	poetry run alembic current

# Cleanup
clean:
	@echo "Cleaning up cache files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pyright*" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	find . -type f -name ".coverage" -delete 2>/dev/null || true
	rm -rf htmlcov/ 2>/dev/null || true
	rm -rf dist/ 2>/dev/null || true
	rm -rf build/ 2>/dev/null || true
	@echo "✓ Cleanup complete!"

# Development helpers
.PHONY: shell
shell:
	poetry run python

.PHONY: deps-update
deps-update:
	poetry update

.PHONY: deps-show
deps-show:
	poetry show --tree

.PHONY: all
all: clean format check test
	@echo "✓ All tasks completed successfully!"
