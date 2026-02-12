from fastapi import APIRouter, Body
from schemas.branding import NameRequest, ContentRequest, LogoRequest, SentimentRequest
from services.context_manager import ContextManager
from services.prompt_builder import PromptBuilder
from services.ai_router import AIRouter
from core.exceptions import BrandCraftException

router = APIRouter()

async def get_active_context(ctx_id: str = None):
    # Fallback to a default context if none provided
    if not ctx_id:
        return ContextManager.get_context("default") or None
    return ContextManager.get_context(ctx_id)

@router.post("/generate-name")
async def generate_name(req: NameRequest):
    context = await get_active_context(req.context_id)
    if not context:
        raise BrandCraftException("Active Brand Context Required", 400)
    
    prompt = PromptBuilder.build_brand_name_prompt(req, context)
    result = await AIRouter.route_request("branding_names", prompt)
    return result

@router.post("/generate-logo")
async def generate_logo(req: LogoRequest):
    # Cross-module logic: Prompt Builder + AI Router
    result = await AIRouter.route_request("logo", req.prompt)
    return result

@router.post("/sentiment")
async def analyze_sentiment(req: SentimentRequest):
    return await AIRouter.route_request("sentiment", req.text)