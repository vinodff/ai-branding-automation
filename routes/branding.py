
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from database import connection, models, crud
from modules.auth.service import get_current_user
from modules.credits.service import CreditManager
from schemas.branding import (
    NameRequest, ContentRequest, LogoRequest, AssistantRequest, 
    SentimentRequest, VideoRequest, VoiceRequest, ResearchRequest, RoadmapRequest
)
from services.ai_router import AIRouter
from services.context_manager import ContextManager
from services.prompt_builder import PromptBuilder
from core.security import SecurityEngine
import time

router = APIRouter()

async def get_valid_context(ctx_id: Optional[str]):
    if not ctx_id: return None
    ctx = ContextManager.get_context(ctx_id)
    if not ctx: raise HTTPException(status_code=404, detail="Context not found")
    return ctx

@router.post("/generate-name")
async def generate_name(req: NameRequest, request: Request, user: models.User = Depends(get_current_user), db: Session = Depends(connection.get_db)):
    start = time.time()
    endpoint = "/branding/generate-name"
    cost = CreditManager.check_and_deduct(db, user, endpoint)
    
    ctx = await get_valid_context(req.context_id)
    prompt = PromptBuilder.build_brand_name_prompt(req, ctx) if ctx else req.vibe or "Professional"
    
    result = await AIRouter.route_text("branding_names", prompt)
    if "error" in result:
        user.credits += cost
        db.commit()
        raise HTTPException(status_code=503, detail=result["message"])
    
    crud.create_usage_log(db, user.id, endpoint, "POST", 200, time.time()-start, cost, request.client.host, ai_metadata=result)
    return result

@router.post("/generate-logo")
async def generate_logo(req: LogoRequest, request: Request, user: models.User = Depends(get_current_user), db: Session = Depends(connection.get_db)):
    start = time.time()
    endpoint = "/branding/generate-logo"
    cost = CreditManager.check_and_deduct(db, user, endpoint)
    
    ctx = await get_valid_context(req.context_id)
    prompt = PromptBuilder.build_logo_prompt(req.prompt, ctx) if ctx else req.prompt
    
    result = await AIRouter.route_image(prompt)
    crud.create_usage_log(db, user.id, endpoint, "POST", 200, time.time()-start, cost, request.client.host, ai_metadata=result)
    return result

@router.post("/sentiment")
async def analyze_sentiment(req: SentimentRequest, request: Request, user: models.User = Depends(get_current_user), db: Session = Depends(connection.get_db)):
    start = time.time()
    endpoint = "/branding/sentiment"
    cost = CreditManager.check_and_deduct(db, user, endpoint)
    
    result = await AIRouter.route_sentiment(req.text)
    crud.create_usage_log(db, user.id, endpoint, "POST", 200, time.time()-start, cost, request.client.host, ai_metadata=result)
    return result

@router.post("/generate-content")
async def generate_content(req: ContentRequest, request: Request, user: models.User = Depends(get_current_user), db: Session = Depends(connection.get_db)):
    start = time.time()
    endpoint = "/branding/generate-content"
    cost = CreditManager.check_and_deduct(db, user, endpoint)
    
    ctx = await get_valid_context(req.context_id)
    prompt = PromptBuilder.build_content_prompt(req.type, ctx) if ctx else f"Create {req.type} content."
    
    result = await AIRouter.route_text("content", prompt)
    crud.create_usage_log(db, user.id, endpoint, "POST", 200, time.time()-start, cost, request.client.host, ai_metadata=result)
    return result

@router.post("/roadmap")
async def generate_roadmap(req: RoadmapRequest, request: Request, user: models.User = Depends(get_current_user), db: Session = Depends(connection.get_db)):
    start = time.time()
    endpoint = "/branding/roadmap"
    cost = CreditManager.check_and_deduct(db, user, endpoint)
    
    ctx = await get_valid_context(req.context_id)
    prompt = f"Create a 7-day marketing roadmap for {ctx.industry if ctx else 'a new brand'} in JSON format."
    
    result = await AIRouter.route_text("roadmap", prompt)
    crud.create_usage_log(db, user.id, endpoint, "POST", 200, time.time()-start, cost, request.client.host, ai_metadata=result)
    return result

@router.post("/research")
async def research_industry(req: ResearchRequest, request: Request, user: models.User = Depends(get_current_user), db: Session = Depends(connection.get_db)):
    start = time.time()
    endpoint = "/branding/research"
    cost = CreditManager.check_and_deduct(db, user, endpoint)
    
    ctx = await get_valid_context(req.context_id)
    prompt = f"Research market trends for {ctx.industry if ctx else 'emerging markets'}."
    
    # Force Gemini for search grounding
    provider = GeminiProvider(model_name='gemini-3-flash-preview')
    result = await provider.generate_text(prompt) # In real implementation, pass tools here
    
    crud.create_usage_log(db, user.id, endpoint, "POST", 200, time.time()-start, cost, request.client.host, ai_metadata=result)
    return result
