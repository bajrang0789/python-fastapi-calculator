# Python FastAPI Calculator

Small calculator app with a FastAPI backend and a Vite + React frontend.

## Architecture

```mermaid
flowchart LR
  U[User] --> F[React UI on Vite]
  F -->|HTTP JSON| A[FastAPI backend]
  A --> R[Calc router]
  R --> O[Arithmetic response]
```

## Features

- FastAPI arithmetic endpoints
- React calculator UI
- Dockerized backend runtime
- Pytest coverage for the API
- Dependabot, CI, and code scanning workflows

## API

### Health

```http
GET /health
```

Response:

```json
{ "status": "healthy" }
```

### Arithmetic

```http
POST /api/v1/calc/add
POST /api/v1/calc/subtract
POST /api/v1/calc/multiply
POST /api/v1/calc/divide
```

Request body:

```json
{ "a": 2, "b": 3 }
```

Example response:

```json
{ "a": 2, "b": 3, "result": 5 }
```

## Local Development

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Tests and Quality

```bash
pytest -q
black --check app tests
ruff check app tests
mypy app
```

## Docker

```bash
docker build -t fastapi-calculator .
docker run -p 8000:8000 fastapi-calculator
```

## Docker Compose

```bash
docker compose up -d --build
```

## Screenshots

Add UI screenshots here once the frontend design is finalized. The current frontend is a lightweight calculator form, so screenshots will be most useful after the next visual pass.

## Contributing

1. Open an issue for a bug or feature.
2. Create a branch from `main`.
3. Keep changes focused and covered by tests when possible.
4. Run the backend quality checks and the frontend build before opening a PR.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor workflow.

## Roadmap

- Add more calculator operations and input validation
- Add persistent UI state and better error handling
- Add release tagging and changelog entries
- Add screenshots and a short product walkthrough
- Expand API and frontend automated tests
