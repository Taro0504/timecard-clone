# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by `pnpm` + Turbo.
- `frontend/` (Next.js, TypeScript, Tailwind) – app code in `src/`.
- `backend/` (FastAPI, SQLAlchemy) – API in `app/`, tests in `tests/`.
- `docker/` and `docker-compose.yml` for local containers.
- Root configs: `turbo.json`, `.prettierrc`, `pnpm-workspace.yaml`.

## Build, Test, and Development Commands
- Root (runs via Turbo):
  - `pnpm dev` – start all apps (hot reload).
  - `pnpm build` – build all packages.
  - `pnpm test` – run backend tests.
  - `pnpm lint` / `pnpm format` – lint/format repo.
- Frontend:
  - `cd frontend && pnpm dev|build|start|lint|type-check`.
- Backend:
  - `cd backend && pnpm dev` (uvicorn reload), `pnpm test` (pytest), `pnpm lint` (ruff+mypy), `pnpm format` (black+ruff fix).
- Docker: `docker-compose up -d` (db, backend, frontend).

## Coding Style & Naming Conventions
- JavaScript/TypeScript: Prettier enforced (2 spaces, single quotes, width 80). ESLint (Next config) for linting. Components `PascalCase.tsx`; utilities `camelCase.ts`.
- Python: `black` (line length 88), `ruff`, `mypy --strict`. Modules `snake_case.py`; classes `PascalCase`; functions/vars `snake_case`.
- Keep functions small; prefer typed interfaces/schemas (Zod/Pydantic) at boundaries.

## Testing Guidelines
- Backend: `pytest` (+`pytest-asyncio`, `pytest-cov`). Place tests under `backend/tests/` using `test_*.py`. Aim to cover routers, services, and auth flows.
- Frontend: no runner configured; prefer adding integration coverage later (Vitest/Playwright). For now, validate critical flows manually and include repro steps in PRs.

## Commit & Pull Request Guidelines
- Follow Conventional Commits where possible: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Example: `feat(auth): add refresh token revocation`.
- Commits: concise, imperative, scoped; group related changes only.
- PRs: clear description, linked issues, screenshots for UI changes, test plan (commands, expected results), and notes on breaking changes or migrations.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` (root/package-level) for `DATABASE_URL`, `SECRET_KEY`, `NEXT_PUBLIC_API_URL`.
- Default DB is Postgres via Docker; local SQLite files in `backend/` are for quick dev only.
- Keep API URLs in env vars; never hardcode.

## Agent-Specific Instructions
- Use `pnpm` (not npm/yarn) and respect existing configs. Keep diffs minimal and aligned with folder boundaries. When adding tests or scripts, mirror existing patterns.

