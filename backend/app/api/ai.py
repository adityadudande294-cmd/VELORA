from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.database.connection import get_db
from app.services.ai_service import solve_story_question

router = APIRouter(prefix="/ai", tags=["AI Integration"])

class QARequest(BaseModel):
    storyId: str
    question: str
    lang: str = "en"

class ExplainRequest(BaseModel):
    storyId: str
    mode: str = "normal"
    lang: str = "en"

@router.post("/qa")
async def ask_story_question(req: QARequest, db=Depends(get_db)):
    story = await db["stories"].find_one({"id": req.storyId})
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with ID {req.storyId} was not found"
        )
        
    answer = solve_story_question(story, req.question, req.lang)
    return {"answer": answer}

@router.post("/explain")
async def get_explanation(req: ExplainRequest, db=Depends(get_db)):
    story = await db["stories"].find_one({"id": req.storyId})
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with ID {req.storyId} was not found"
        )
        
    # Retrieve specific cognitive explanation
    explanations = story.get("explanations", {})
    target_exp = explanations.get(req.mode, explanations.get("simple", {}))
    text = target_exp.get(req.lang, target_exp.get("en", "No explanation available in this language."))
    
    return {"text": text}
