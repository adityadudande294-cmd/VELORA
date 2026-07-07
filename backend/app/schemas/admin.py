from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class RoleUpdateRequest(BaseModel):
    role: str

class UserAdminResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: str
    role: str = "Viewer"
    suspended: bool = False
    streak: int = 1
    achievements: List[str] = []

class CategoryCreateRequest(BaseModel):
    name: str
    banner: str = ""
    hidden: bool = False
    order: int = 0

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    banner: str = ""
    hidden: bool = False
    order: int = 0

class MediaResponse(BaseModel):
    id: str
    filename: str
    url: str
    type: str
    size: int
    uploaded_at: str

class ChartDataPoint(BaseModel):
    name: str
    value: int

class DashboardStatsResponse(BaseModel):
    totalStories: int
    publishedStories: int
    draftStories: int
    totalCategories: int
    totalAuthors: int
    totalReaders: int
    totalBookmarks: int
    dailyActiveUsers: int
    avgReadingTimeMins: float
    topStories: List[Dict[str, Any]]
    trendingCategories: List[ChartDataPoint]
    recentActivity: List[Dict[str, Any]]
    readershipTrend: List[ChartDataPoint]
    bookmarksTrend: List[ChartDataPoint]
