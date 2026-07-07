from pydantic import BaseModel
from typing import Optional
from app.schemas.user import UserResponse

class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
