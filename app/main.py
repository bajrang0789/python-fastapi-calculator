from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .routers.calc import router as calc_router

app = FastAPI(title="FastAPI Calculator")

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return JSONResponse({"status": "healthy"})

@app.get("/health/live")
def live():
    return JSONResponse({"status": "alive"})

app.include_router(calc_router, prefix="/api/v1/calc", tags=["calc"])
