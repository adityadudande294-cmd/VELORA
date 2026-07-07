from fastapi import APIRouter, Depends, HTTPException, status
from app.database.connection import get_db
from app.schemas.user import UserBookmarksSchema
from app.utils.helpers import get_current_user_id

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])

@router.get("", response_model=UserBookmarksSchema)
async def get_bookmarks(user_id: str = Depends(get_current_user_id), db=Depends(get_db)):
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user.get("bookmarks", {"bookmarkedIds": [], "highlights": {}, "notes": {}})

@router.post("", response_model=UserBookmarksSchema)
async def update_bookmarks(
    bookmarks: UserBookmarksSchema,
    user_id: str = Depends(get_current_user_id),
    db=Depends(get_db)
):
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    await db["users"].update_one(
        {"id": user_id},
        {"$set": {"bookmarks": bookmarks.dict()}}
    )
    return bookmarks
