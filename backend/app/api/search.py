from fastapi import APIRouter, Depends
from typing import List
from app.database.connection import get_db
from app.schemas.story import StoryResponse
from app.database.seed import SEED_STORIES

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=List[StoryResponse])
async def search_stories(q: str = "", db=Depends(get_db)):
    stories = await db["stories"].find()
    if not stories:
        stories = SEED_STORIES
        
    if not q:
        return stories
        
    query_terms = q.lower().split(" ")
    results = []
    
    for story in stories:
        score = 0
        title_en = story["title"]["en"].lower()
        subtitle_en = story["subtitle"]["en"].lower()
        category = story["category"].lower()
        tags = [t.lower() for t in story.get("relatedTopics", [])]
        
        for term in query_terms:
            if term in title_en:
                score += 5
            if term in category:
                score += 3
            if term in subtitle_en:
                score += 2
            if any(term in tag for tag in tags):
                score += 2
                
        if score > 0:
            story["search_score"] = score  # local assign
            results.append(story)
            
    # Sort by score descending
    results.sort(key=lambda x: x.get("search_score", 0), reverse=True)
    return results
