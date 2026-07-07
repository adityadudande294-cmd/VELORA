import os
import re
import uuid
import shutil
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header, UploadFile, File
from pydantic import BaseModel
from app.database.connection import get_db
from app.schemas.admin import (
    AdminLoginRequest,
    RoleUpdateRequest,
    UserAdminResponse,
    CategoryCreateRequest,
    CategoryResponse,
    MediaResponse,
    DashboardStatsResponse,
    ChartDataPoint
)
from app.utils.helpers import get_current_user_id

router = APIRouter(prefix="/admin", tags=["Admin CMS & Management"])

# Setup public uploads local folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
UPLOAD_DIR = os.path.join(BASE_DIR, "public", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Admin RBAC Dependency
async def get_admin_user(user_id: str = Depends(get_current_user_id), db = Depends(get_db)):
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User session not found"
        )
    role = user.get("role", "Viewer")
    if role not in ["Admin", "Editor", "Author"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin, Editor, or Author permission required"
        )
    if user.get("suspended", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Account suspended"
        )
    return user

# --- AUTHENTICATION ---

@router.post("/login")
async def admin_login(req: AdminLoginRequest, db=Depends(get_db)):
    user = await db["users"].find_one({"email": req.email})
    
    # Auto-seed default administrator credentials if none exist
    if not user and req.email == "admin@velora.com" and req.password == "admin123":
        from app.utils.helpers import hash_password
        user = {
            "id": "admin-seeded-uuid",
            "name": "Super Admin",
            "email": "admin@velora.com",
            "password": hash_password("admin123"),
            "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Admin",
            "role": "Admin",
            "suspended": False,
            "settings": {"lang": "en", "speed": 1.0, "theme": "dark", "history": []},
            "bookmarks": {"bookmarkedIds": [], "highlights": {}, "notes": {}},
            "streak": 1,
            "achievements": ["CMS System Initialized"]
        }
        await db["users"].insert_one(user)
    elif not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password combination"
        )
        
    from app.utils.helpers import verify_password, create_access_token
    if not verify_password(req.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password combination"
        )
        
    if user.get("suspended", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Account suspended"
        )
        
    role = user.get("role", "Viewer")
    if role not in ["Admin", "Editor", "Author"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin role authorization required"
        )
        
    token = create_access_token(data={"sub": user["id"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "avatar": user["avatar"],
            "role": role,
            "suspended": user.get("suspended", False)
        }
    }


# --- DASHBOARD & ANALYTICS ---

@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(db=Depends(get_db), current_user=Depends(get_admin_user)):
    stories = await db["stories"].find()
    users = await db["users"].find()
    categories = await db["categories"].find()
    media = await db["media"].find()
    
    total_stories = len(stories)
    published = sum(1 for s in stories if s.get("factStatus", "") != "Draft" and s.get("status", "published") != "draft")
    drafts = total_stories - published
    
    # Calculate unique authors
    authors = set(s.get("author", "Velora Team") for s in stories)
    total_authors = len(authors) if authors else 1
    
    # Mocking analytics data sets securely
    top_stories = []
    for s in stories[:4]:
        top_stories.append({
            "id": s["id"],
            "title": s["title"]["en"],
            "reads": len(s.get("references", [])) * 42 + 15,
            "bookmarks": len(s.get("relatedTopics", [])) * 12 + 4
        })
        
    trending_cats = [
        ChartDataPoint(name="Space & Science", value=1420),
        ChartDataPoint(name="Indian Mysteries", value=950),
        ChartDataPoint(name="Temple Architecture", value=760),
        ChartDataPoint(name="Legends & Folklore", value=540)
    ]
    
    recent_act = [
        {"id": "1", "user": "Aditya", "action": "Read 'The Mystery of Roopkund'", "time": "5 mins ago"},
        {"id": "2", "user": "Admin", "action": "Published story 'Antikythera Mechanism'", "time": "20 mins ago"},
        {"id": "3", "user": "Neha", "action": "Bookmarked 'Dwarka Temple'", "time": "1 hour ago"},
        {"id": "4", "user": "Editor", "action": "Uploaded cover 'konark.jpg'", "time": "2 hours ago"}
    ]
    
    readership_trend = [
        ChartDataPoint(name="Mon", value=120),
        ChartDataPoint(name="Tue", value=150),
        ChartDataPoint(name="Wed", value=180),
        ChartDataPoint(name="Thu", value=220),
        ChartDataPoint(name="Fri", value=310),
        ChartDataPoint(name="Sat", value=450),
        ChartDataPoint(name="Sun", value=390)
    ]
    
    bookmarks_trend = [
        ChartDataPoint(name="Mon", value=15),
        ChartDataPoint(name="Tue", value=18),
        ChartDataPoint(name="Wed", value=24),
        ChartDataPoint(name="Thu", value=30),
        ChartDataPoint(name="Fri", value=42),
        ChartDataPoint(name="Sat", value=55),
        ChartDataPoint(name="Sun", value=48)
    ]
    
    return DashboardStatsResponse(
        totalStories=total_stories,
        publishedStories=published,
        draftStories=drafts,
        totalCategories=max(len(categories), 4),
        totalAuthors=total_authors,
        totalReaders=len(users),
        totalBookmarks=sum(len(u.get("bookmarks", {}).get("bookmarkedIds", [])) for u in users) + 12,
        dailyActiveUsers=min(len(users) * 3 // 4 + 5, 24),
        avgReadingTimeMins=8.5,
        topStories=top_stories,
        trendingCategories=trending_cats,
        recentActivity=recent_act,
        readershipTrend=readership_trend,
        bookmarksTrend=bookmarks_trend
    )


# --- STORY CRUD ---

@router.get("/stories")
async def list_admin_stories(db=Depends(get_db), current_user=Depends(get_admin_user)):
    stories = await db["stories"].find()
    return stories

@router.post("/stories")
async def create_story(story_data: Dict[str, Any], db=Depends(get_db), current_user=Depends(get_admin_user)):
    slug = story_data.get("id")
    if not slug:
        slug = re.sub(r'[^a-z0-9]+', '-', story_data["title"]["en"].lower()).strip("-")
        story_data["id"] = slug
        
    existing = await db["stories"].find_one({"id": slug})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Story with this title/slug ID already exists"
        )
        
    # Append defaults if empty
    story_data.setdefault("image", "/images/bhangarh.png")
    story_data.setdefault("duration", "8 mins")
    story_data.setdefault("difficulty", "Medium")
    story_data.setdefault("era", "Ancient Era")
    story_data.setdefault("factStatus", "Draft")
    story_data.setdefault("factLabel", "Draft Mode")
    story_data.setdefault("learningObjectives", [])
    story_data.setdefault("knowledgeLevel", "Intermediate")
    story_data.setdefault("relatedTopics", [])
    story_data.setdefault("timeline", [])
    story_data.setdefault("narrative", {"en": {"intro": []}})
    story_data.setdefault("explanations", {})
    story_data.setdefault("qa", [])
    story_data.setdefault("references", [])
    story_data.setdefault("author", current_user.get("name", "Administrator"))
    story_data.setdefault("status", "draft")
    
    await db["stories"].insert_one(story_data)
    return story_data

@router.put("/stories/{story_id}")
async def update_story(story_id: str, story_data: Dict[str, Any], db=Depends(get_db), current_user=Depends(get_admin_user)):
    existing = await db["stories"].find_one({"id": story_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
        
    # Remove MongoDB _id if present in body
    story_data.pop("_id", None)
    await db["stories"].update_one({"id": story_id}, {"$set": story_data})
    return story_data

@router.delete("/stories/{story_id}")
async def delete_story(story_id: str, db=Depends(get_db), current_user=Depends(get_admin_user)):
    existing = await db["stories"].find_one({"id": story_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
        
    await db["stories"].delete_one({"id": story_id})
    return {"message": f"Story {story_id} deleted successfully"}

@router.post("/stories/{story_id}/duplicate")
async def duplicate_story(story_id: str, db=Depends(get_db), current_user=Depends(get_admin_user)):
    existing = await db["stories"].find_one({"id": story_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
        
    new_doc = existing.copy()
    new_doc.pop("_id", None)
    new_doc["id"] = f"{existing['id']}-copy-{str(uuid.uuid4())[:4]}"
    new_doc["title"]["en"] = f"{existing['title']['en']} (Copy)"
    new_doc["factStatus"] = "Draft"
    new_doc["status"] = "draft"
    
    await db["stories"].insert_one(new_doc)
    return new_doc


# --- CATEGORY CRUD ---

@router.get("/categories")
async def list_categories(db=Depends(get_db)):
    categories = await db["categories"].find()
    if not categories:
        # Seeding defaults
        default_cats = [
            {"id": "1", "name": "Indian Mysteries", "slug": "indian-mysteries", "banner": "/images/roopkund.png", "hidden": False, "order": 1},
            {"id": "2", "name": "Space & Science", "slug": "space-science", "banner": "/images/blackhole.png", "hidden": False, "order": 2},
            {"id": "3", "name": "Temple Architecture", "slug": "temple-architecture", "banner": "/images/konark.png", "hidden": False, "order": 3},
            {"id": "4", "name": "Legends & Folklore", "slug": "legends-folklore", "banner": "/images/bhangarh.png", "hidden": False, "order": 4}
        ]
        for c in default_cats:
            await db["categories"].insert_one(c)
        categories = default_cats
    return categories

@router.post("/categories", response_model=CategoryResponse)
async def create_category(req: CategoryCreateRequest, db=Depends(get_db), current_user=Depends(get_admin_user)):
    slug = req.name.lower().replace(" ", "-").replace("&", "and")
    cat_id = str(uuid.uuid4())[:8]
    cat_doc = {
        "id": cat_id,
        "name": req.name,
        "slug": slug,
        "banner": req.banner or "/images/bhangarh.png",
        "hidden": req.hidden,
        "order": req.order
    }
    await db["categories"].insert_one(cat_doc)
    return cat_doc

@router.put("/categories/{category_id}")
async def update_category(category_id: str, req: CategoryCreateRequest, db=Depends(get_db), current_user=Depends(get_admin_user)):
    existing = await db["categories"].find_one({"id": category_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Category not found")
        
    slug = req.name.lower().replace(" ", "-").replace("&", "and")
    update_doc = {
        "name": req.name,
        "slug": slug,
        "banner": req.banner,
        "hidden": req.hidden,
        "order": req.order
    }
    await db["categories"].update_one({"id": category_id}, {"$set": update_doc})
    return {"id": category_id, **update_doc}

@router.delete("/categories/{category_id}")
async def delete_category(category_id: str, db=Depends(get_db), current_user=Depends(get_admin_user)):
    await db["categories"].delete_one({"id": category_id})
    return {"message": "Category deleted successfully"}


# --- MEDIA MANAGER ---

@router.get("/media", response_model=List[MediaResponse])
async def list_media(db=Depends(get_db), current_user=Depends(get_admin_user)):
    media_list = await db["media"].find()
    return media_list

@router.post("/media/upload", response_model=MediaResponse)
async def upload_media_file(file: UploadFile = File(...), db=Depends(get_db), current_user=Depends(get_admin_user)):
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    # Save the file to public uploads folder
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_size = os.path.getsize(filepath)
    file_type = file.content_type or "image/png"
    
    # Return file URL relative to client site
    file_url = f"/uploads/{filename}"
    media_id = str(uuid.uuid4())[:8]
    
    media_doc = {
        "id": media_id,
        "filename": file.filename,
        "url": file_url,
        "type": file_type,
        "size": file_size,
        "uploaded_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    await db["media"].insert_one(media_doc)
    return media_doc

@router.delete("/media/{media_id}")
async def delete_media(media_id: str, db=Depends(get_db), current_user=Depends(get_admin_user)):
    media_doc = await db["media"].find_one({"id": media_id})
    if not media_doc:
        raise HTTPException(status_code=404, detail="Media reference not found")
        
    # Remove local file
    filename = media_doc["url"].replace("/uploads/", "")
    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
        except Exception:
            pass
            
    await db["media"].delete_one({"id": media_id})
    return {"message": "Media deleted successfully"}


# --- USER MANAGEMENT ---

@router.get("/users", response_model=List[UserAdminResponse])
async def list_users(db=Depends(get_db), current_user=Depends(get_admin_user)):
    users = await db["users"].find()
    response = []
    for u in users:
        response.append(UserAdminResponse(
            id=u["id"],
            name=u["name"],
            email=u["email"],
            avatar=u["avatar"],
            role=u.get("role", "Viewer"),
            suspended=u.get("suspended", False),
            streak=u.get("streak", 1),
            achievements=u.get("achievements", [])
        ))
    return response

@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, req: RoleUpdateRequest, db=Depends(get_db), current_user=Depends(get_admin_user)):
    if current_user.get("role") != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Administrator accounts can update user roles"
        )
        
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db["users"].update_one({"id": user_id}, {"$set": {"role": req.role}})
    return {"message": "User role updated successfully"}

@router.put("/users/{user_id}/suspend")
async def toggle_user_suspend(user_id: str, db=Depends(get_db), current_user=Depends(get_admin_user)):
    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_state = not user.get("suspended", False)
    await db["users"].update_one({"id": user_id}, {"$set": {"suspended": new_state}})
    return {"suspended": new_state, "message": "User suspension state updated"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, db=Depends(get_db), current_user=Depends(get_admin_user)):
    if current_user.get("role") != "Admin":
        raise HTTPException(status_code=403, detail="Only Admins can delete users")
    await db["users"].delete_one({"id": user_id})
    return {"message": "User deleted successfully"}
