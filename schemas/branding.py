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
    aspect_ratio: str = "1:1"

class SentimentRequest(BaseModel):
    text: str

class AssistantRequest(BaseModel):
    message: str
    history: List[dict] = []