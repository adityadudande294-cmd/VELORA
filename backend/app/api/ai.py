from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.database.connection import get_db
from app.services.ai_service import (
    solve_story_question,
    summarize_story,
    explain_passage,
    translate_passage,
    recommend_next_stories,
    generate_quiz
)

router = APIRouter(prefix="/ai", tags=["AI Integration"])

# --- REQUEST SCHEMAS ---
class QARequest(BaseModel):
    storyId: str
    question: str
    lang: str = "en"

class ChatRequest(BaseModel):
    storyId: str
    message: str
    history: Optional[List[Dict[str, str]]] = None
    lang: str = "en"

class SummaryRequest(BaseModel):
    storyId: str
    lang: str = "en"

class ExplainRequest(BaseModel):
    storyId: Optional[str] = None
    text: Optional[str] = None
    mode: str = "simple"
    lang: str = "en"

class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"

class RecommendRequest(BaseModel):
    storyId: str
    category: str
    history: List[str]
    bookmarks: Dict[str, Any]
    interests: List[str]

class QuestionsRequest(BaseModel):
    storyId: str
    lang: str = "en"


# --- ROUTE ENDPOINTS ---

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


@router.post("/chat")
async def ask_ai_chat(req: ChatRequest, db=Depends(get_db)):
    story = await db["stories"].find_one({"id": req.storyId})
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with ID {req.storyId} was not found"
        )
    # The message corresponds to the latest user query in the chat thread
    answer = solve_story_question(story, req.message, req.lang)
    return {"answer": answer}


@router.post("/summary")
async def get_story_summary(req: SummaryRequest, db=Depends(get_db)):
    story = await db["stories"].find_one({"id": req.storyId})
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with ID {req.storyId} was not found"
        )
    summary = summarize_story(story, req.lang)
    return summary


@router.post("/explain")
async def get_explanation(req: ExplainRequest, db=Depends(get_db)):
    text_to_explain = req.text
    
    if req.storyId:
        story = await db["stories"].find_one({"id": req.storyId})
        if not story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Story with ID {req.storyId} was not found"
            )
        # Default fallback to existing explanations blocks if offline
        if not text_to_explain:
            exps = story.get("explanations", {})
            target_exp = exps.get(req.mode, exps.get("simple", {}))
            text_to_explain = target_exp.get(req.lang, target_exp.get("en", ""))
            
            # If still empty, construct text description from synopsis
            if not text_to_explain:
                text_to_explain = story.get("synopsis", {}).get("en", "")

    if not text_to_explain:
        return {"text": "No text provided to explain."}

    explanation = explain_passage(text_to_explain, req.mode, req.lang)
    return {"text": explanation}


@router.post("/translate")
async def get_translation(req: TranslateRequest):
    translation = translate_passage(req.text, req.target_lang)
    return {"translated_text": translation}


@router.post("/recommend")
async def get_recommendations(req: RecommendRequest, db=Depends(get_db)):
    current_story = await db["stories"].find_one({"id": req.storyId})
    if not current_story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with ID {req.storyId} was not found"
        )
    
    # Retrieve all stories from the database to suggest recommendations
    all_db_stories = await db["stories"].find()
    recommendations = recommend_next_stories(
        current_story,
        req.category,
        req.history,
        req.bookmarks,
        req.interests,
        all_db_stories
    )
    return recommendations


@router.post("/questions")
async def get_quiz_questions(req: QuestionsRequest, db=Depends(get_db)):
    story = await db["stories"].find_one({"id": req.storyId})
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with ID {req.storyId} was not found"
        )
    quiz = generate_quiz(story, req.lang)
    return {"questions": quiz}
