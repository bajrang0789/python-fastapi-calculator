from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

router = APIRouter()

class Operands(BaseModel):
    a: float
    b: float

    @field_validator("a", "b")
    def check_nan(cls, v):
        if v != v:  # NaN check
            raise ValueError("Operand must be a number")
        return v

class Result(BaseModel):
    a: float
    b: float
    result: float

@router.post("/add", response_model=Result)
async def add(payload: Operands):
    return Result(a=payload.a, b=payload.b, result=payload.a + payload.b)

@router.post("/subtract", response_model=Result)
async def subtract(payload: Operands):
    return Result(a=payload.a, b=payload.b, result=payload.a - payload.b)

@router.post("/multiply", response_model=Result)
async def multiply(payload: Operands):
    return Result(a=payload.a, b=payload.b, result=payload.a * payload.b)

@router.post("/divide", response_model=Result)
async def divide(payload: Operands):
    if payload.b == 0:
        raise HTTPException(status_code=400, detail="Division by zero is not allowed")
    return Result(a=payload.a, b=payload.b, result=payload.a / payload.b)
