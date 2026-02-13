
from pydantic import BaseModel, Field
from typing import List, Optional

class ContextInput(BaseModel):
    industry: str = Field(..., example="Fintech")
    tone: str = Field(default="professional", example="disruptive")
    keywords: List[str] = Field(default_factory=list)
    target_audience: str = Field(..., example="Gen Z Investors")
    brand_personality: str = Field(default="innovative")

class NameRequest(BaseModel):
    context_id: Optional[str] = None
    industry_override: Optional[str] = None
    vibe: Optional[str] = None

class ContentRequest(BaseModel):
    type: str = Field(..., pattern="^(tagline|mission|social)$")
    context_id: Optional[str] = None

class LogoRequest(BaseModel):
    prompt: str
    style: Optional[str] = "minimalist"
    context_id: Optional[str] = None

class SentimentRequest(BaseModel):
    text: str

class AssistantRequest(BaseModel):
    message: str
    history: List[dict] = []
    context_id: Optional[str] = None

class VideoRequest(BaseModel):
    prompt: str
    context_id: Optional[str] = None

class VoiceRequest(BaseModel):
    text: str
    voice: Optional[str] = "Kore"
    context_id: Optional[str] = None

class ResearchRequest(BaseModel):
    context_id: Optional[str] = None

class RoadmapRequest(BaseModel):
    context_id: Optional[str] = None
