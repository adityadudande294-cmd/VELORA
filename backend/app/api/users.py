from fastapi import APIRouter, Depends, HTTPException, status
from app.database.connection import get_db
from app.schemas.user import UserResponse, ProfileUpdateRequest
from app.utils.helpers import get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(user_id: str = Depends(get_current_user_id), db=Depends(get_db)):
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    return user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    req: ProfileUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db=Depends(get_db)
):
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
        
    update_data = {}
    if req.name is not None:
        update_data["name"] = req.name
    if req.avatar is not None:
        update_data["avatar"] = req.avatar
    if req.streak is not None:
        update_data["streak"] = req.streak
    if req.achievements is not None:
        update_data["achievements"] = req.achievements
        
    if req.settings is not None:
        # Merge settings dict
        current_settings = user.get("settings", {})
        current_settings.update(req.settings.dict(exclude_unset=True))
        update_data["settings"] = current_settings
        
    if req.bookmarks is not None:
        # Merge bookmarks dict
        current_bookmarks = user.get("bookmarks", {})
        current_bookmarks.update(req.bookmarks.dict(exclude_unset=True))
        update_data["bookmarks"] = current_bookmarks

    if update_data:
        await db["users"].update_one({"id": user_id}, {"$set": update_data})
        # Fetch updated user
        user = await db["users"].find_one({"id": user_id})
        
    return user
