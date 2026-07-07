from datetime import timedelta
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from app.database.connection import get_db
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.utils.helpers import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(req: UserRegisterRequest, db=Depends(get_db)):
    # Check if user already exists
    existing = await db["users"].find_one({"email": req.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
        
    hashed = hash_password(req.password)
    user_id = str(uuid.uuid4())
    
    user_doc = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "password": hashed,
        "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={req.name}",
        "settings": {
            "lang": "en",
            "speed": 1.0,
            "theme": "dark",
            "history": []
        },
        "bookmarks": {
            "bookmarkedIds": [],
            "highlights": {},
            "notes": {}
        },
        "streak": 1,
        "achievements": ["First Journey Started"]
    }
    
    await db["users"].insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user_id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_doc
    }

@router.post("/login", response_model=TokenResponse)
async def login(req: UserLoginRequest, db=Depends(get_db)):
    user = await db["users"].find_one({"email": req.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password combination"
        )
        
    if not verify_password(req.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password combination"
        )
        
    access_token = create_access_token(data={"sub": user["id"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/google", response_model=TokenResponse)
async def google_auth(req: UserLoginRequest, db=Depends(get_db)):
    # Simple Google login mock: checks if email exists; if not, registers them dynamically.
    user = await db["users"].find_one({"email": req.email})
    if not user:
        user_id = str(uuid.uuid4())
        name = req.email.split("@")[0].capitalize()
        user_doc = {
            "id": user_id,
            "name": name,
            "email": req.email,
            "password": hash_password(str(uuid.uuid4())), # random secure pass
            "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={name}",
            "settings": {
                "lang": "en",
                "speed": 1.0,
                "theme": "dark",
                "history": []
            },
            "bookmarks": {
                "bookmarkedIds": [],
                "highlights": {},
                "notes": {}
            },
            "streak": 1,
            "achievements": ["Google Pioneer"]
        }
        await db["users"].insert_one(user_doc)
        user = user_doc
        
    access_token = create_access_token(data={"sub": user["id"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
