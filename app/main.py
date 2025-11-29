from fastapi import FastAPI
from fastapi.responses import JSONResponse
from .routers.calc import router as calc_router

app = FastAPI(title="FastAPI Calculator")

@app.get("/health")
def health():
    return JSONResponse({"status": "healthy"})

@app.get("/health/live")
def live():
    return JSONResponse({"status": "alive"})

app.include_router(calc_router, prefix="/api/v1/calc", tags=["calc"])
