from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class TranslationSchema(BaseModel):
    en: str
    hi: str
    mr: str

class TimelineEventSchema(BaseModel):
    year: str
    title: TranslationSchema
    details: TranslationSchema

class QAPairSchema(BaseModel):
    q: List[str]
    a: TranslationSchema

class NarrativeLanguageSchema(BaseModel):
    intro: List[str]
    background: Optional[List[str]] = None
    main: Optional[List[str]] = None
    evidence: Optional[List[str]] = None
    scientific: Optional[List[str]] = None
    historical: Optional[List[str]] = None
    legends: Optional[List[str]] = None
    facts: Optional[List[str]] = None
    takeaways: Optional[List[str]] = None
    conclusion: Optional[List[str]] = None

class NarrativeSchema(BaseModel):
    en: NarrativeLanguageSchema
    hi: Optional[NarrativeLanguageSchema] = None
    mr: Optional[NarrativeLanguageSchema] = None

class ExplanationsSchema(BaseModel):
    eli10: TranslationSchema
    simple: TranslationSchema
    detailed: TranslationSchema
    academic: TranslationSchema
    revision: TranslationSchema

class StoryResponse(BaseModel):
    id: str
    image: str
    title: TranslationSchema
    subtitle: TranslationSchema
    category: str
    duration: str
    difficulty: str
    era: str
    factStatus: str
    factLabel: str
    learningObjectives: List[TranslationSchema]
    knowledgeLevel: str
    relatedTopics: List[str]
    synopsis: TranslationSchema
    timeline: List[TimelineEventSchema]
    narrative: NarrativeSchema
    explanations: ExplanationsSchema
    qa: List[QAPairSchema]
    references: List[str]

class StoryCreateRequest(BaseModel):
    topic: str
