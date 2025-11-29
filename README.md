# Python FastAPI Calculator

Simple calculator web app with FastAPI backend and arithmetic APIs.

## Endpoints
- `GET /health` → `{ "status": "healthy" }`
- `GET /health/live` → `{ "status": "alive" }`
- `POST /api/v1/calc/add` → `{ a, b, result }`
- `POST /api/v1/calc/subtract` → `{ a, b, result }`
- `POST /api/v1/calc/multiply` → `{ a, b, result }`
- `POST /api/v1/calc/divide` → `{ a, b, result }` (returns error on division by zero)

## Quick start
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Docker
```bash
docker build -t fastapi-calculator .
docker run -p 8000:8000 fastapi-calculator
```

## Compose
```bash
docker compose up -d --build
```

## Tests
```bash
pytest -q
```
