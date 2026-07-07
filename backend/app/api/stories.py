from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.database.connection import get_db
from app.schemas.story import StoryResponse, StoryCreateRequest
from app.database.seed import SEED_STORIES
from app.services.ai_service import generate_custom_story

router = APIRouter(prefix="/stories", tags=["Stories"])

@router.get("", response_model=List[StoryResponse])
async def get_stories(db=Depends(get_db)):
    stories = await db["stories"].find()
    if not stories:
        print("Stories database collection is empty. Seeding primary stories...")
        for story in SEED_STORIES:
            await db["stories"].insert_one(story)
        stories = await db["stories"].find()
    return stories

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story_detail(story_id: str, db=Depends(get_db)):
    story = await db["stories"].find_one({"id": story_id})
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with ID {story_id} was not found in archives"
        )
    return story

@router.post("/generate", response_model=StoryResponse)
async def generate_story(req: StoryCreateRequest, db=Depends(get_db)):
    # Generate custom story dictionary
    story_data = generate_custom_story(req.topic)
    
    # Check if slug ID already exists, if so return existing
    existing = await db["stories"].find_one({"id": story_data["id"]})
    if existing:
        return existing
        
    # Otherwise insert into database to persist it
    await db["stories"].insert_one(story_data)
    return story_data
