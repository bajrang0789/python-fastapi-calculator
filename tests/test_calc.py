import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/health")
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_add():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/calc/add", json={"a": 2, "b": 3})
        assert r.status_code == 200
        assert r.json()["result"] == 5

@pytest.mark.asyncio
async def test_divide_by_zero():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/calc/divide", json={"a": 1, "b": 0})
        assert r.status_code == 400
        assert r.json()["detail"] == "Division by zero is not allowed"
