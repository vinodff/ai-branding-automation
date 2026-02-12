
from fastapi import APIRouter, Body
from schemas.branding import NameRequest, ContentRequest, LogoRequest, SentimentRequest, AssistantRequest
from services.context_manager import ContextManager
from services.prompt_builder import PromptBuilder
from services.ai_router import AIRouter
from core.exceptions import BrandCraftException

router = APIRouter()

async def get_active_context(ctx_id: str = None):
    if not ctx_id:
        return ContextManager.get_context("default")
    return ContextManager.get_context(ctx_id)

@router.post("/generate-name")
async def generate_name(req: NameRequest):
    context = await get_active_context(req.context_id)
    if not context:
        # Create a mock context if none exists for demo stability
        from schemas.branding import ContextInput
        context = ContextInput(industry="Tech", target_audience="Everyone")
    
    prompt = PromptBuilder.build_brand_name_prompt(req, context)
    result = await AIRouter.route_request("branding_names", prompt)
    return result

@router.post("/generate-logo")
async def generate_logo(req: LogoRequest):
    context = await get_active_context(None) # Context can be used for style injection
    prompt = req.prompt
    if context:
        prompt = PromptBuilder.build_logo_prompt(req.prompt, context)
    
    result = await AIRouter.route_request("logo", prompt)
    return result

@router.post("/generate-content")
async def generate_content(req: ContentRequest):
    context = await get_active_context(req.context_id)
    if not context:
        raise BrandCraftException("Active Brand Context Required for content generation", 400)
    
    prompt = PromptBuilder.build_content_prompt(req.type, context)
    result = await AIRouter.route_request("content", prompt)
    return result

@router.post("/sentiment")
async def analyze_sentiment(req: SentimentRequest):
    return await AIRouter.route_request("sentiment", req.text)

@router.post("/assistant")
async def assistant_chat(req: AssistantRequest):
    # Context-aware chat logic
    context = await get_active_context(None)
    system_ctx = f"User Industry: {context.industry}. " if context else ""
    full_prompt = f"{system_ctx}User says: {req.message}"
    
    return await AIRouter.route_request("assistant", full_prompt)
