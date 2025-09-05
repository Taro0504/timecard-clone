import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_auth0_me_requires_auth():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/auth/me/auth0")
        assert resp.status_code == 401



