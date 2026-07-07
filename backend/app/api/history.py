from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from app.database.connection import get_db
from app.schemas.user import UserResponse
from app.utils.helpers import get_current_user_id

router = APIRouter(prefix="/history", tags=["History"])

class ProgressRequest(BaseModel):
    storyId: str
    isCompleted: bool = False

@router.post("/progress", response_model=UserResponse)
async def record_progress(
    req: ProgressRequest,
    user_id: str = Depends(get_current_user_id),
    db=Depends(get_db)
):
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    settings = user.get("settings", {})
    history = settings.get("history", [])
    
    # Add to history if not exists
    if req.storyId not in history:
        history.append(req.storyId)
        settings["history"] = history
        
    update_fields = {"settings": settings}
    
    # If completed, check streak increments and trigger achievements
    achievements = user.get("achievements", [])
    streak = user.get("streak", 1)
    
    if req.isCompleted:
        # Increase streak by 1 if not read today (simulated simple update)
        if len(history) % 2 == 0:
            streak += 1
            update_fields["streak"] = streak
            
        # Unlock achievement milestone
        if len(history) >= 3 and "Triple Threat Reader" not in achievements:
            achievements.append("Triple Threat Reader")
            update_fields["achievements"] = achievements
        elif len(history) >= 5 and "Historian Laureate" not in achievements:
            achievements.append("Historian Laureate")
            update_fields["achievements"] = achievements

    await db["users"].update_one({"id": user_id}, {"$set": update_fields})
    
    # Retrieve updated user
    updated_user = await db["users"].find_one({"id": user_id})
    return updated_user
