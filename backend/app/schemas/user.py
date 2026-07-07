from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class UserSettingsSchema(BaseModel):
    lang: str = "en"
    speed: float = 1.0
    theme: str = "dark"
    history: List[str] = []

class UserBookmarksSchema(BaseModel):
    bookmarkedIds: List[str] = []
    # maps storyId -> list of highlighted sentence indexes
    highlights: Dict[str, List[int]] = {}
    # maps storyId -> dict of { sentenceIndex -> noteText }
    notes: Dict[str, Dict[str, str]] = {}

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: str
    settings: UserSettingsSchema
    bookmarks: UserBookmarksSchema
    streak: int = 1
    achievements: List[str] = []

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    settings: Optional[UserSettingsSchema] = None
    bookmarks: Optional[UserBookmarksSchema] = None
    streak: Optional[int] = None
    achievements: Optional[List[str]] = None
