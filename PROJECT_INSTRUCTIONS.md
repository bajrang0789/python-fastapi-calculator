# Project Instructions

## Purpose
This repository is the source of truth for the Python FastAPI calculator and its React frontend.

## Repository Layout
- `app/` contains the FastAPI backend.
- `frontend/src/` contains the React calculator UI.
- `frontend/.env` controls the frontend API base URL.

## Edit Scope
- Backend API changes should stay in `app/`.
- Frontend UI and interaction changes should stay in `frontend/src/`.
- Documentation updates should stay in the repo root unless they are frontend-specific.

## Local Development
- Backend: `uvicorn app.main:app --reload`
- Frontend: `cd frontend && npm run dev`

## Environment
- Use `frontend/.env` for `VITE_API_BASE_URL`.
- Do not hardcode backend origins in the frontend.

## Validation
- Run backend tests and quality checks before merging backend work.
- Run `npm run build` inside `frontend/` before merging frontend work.

## Change Policy
- Keep UI and API behavior aligned.
- Update `README.md` when setup, endpoints, or environment variables change.
- Prefer small, focused edits over broad restructuring.
