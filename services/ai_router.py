
from typing import Any, Dict
import logging
from services.providers.gemini_provider import GeminiProvider
from services.providers.huggingface_provider import HuggingFaceProvider
from services.providers.stable_diffusion_provider import StableDiffusionProvider
from services.providers.ibm_provider import IBMProvider

logger = logging.getLogger("brandcraft.router")

class AIRouter:
    # Simple in-memory cache
    _cache: Dict[str, Any] = {}
    
    # Initialize providers
    gemini = GeminiProvider()
    hf = HuggingFaceProvider()
    sd = StableDiffusionProvider()
    ibm = IBMProvider()

    @classmethod
    async def route_request(cls, task: str, payload: str) -> Any:
        # Cache Key Generation
        cache_key = f"{task}:{hash(payload)}"
        if cache_key in cls._cache:
            logger.info(f"Cache Hit for {task}")
            return cls._cache[cache_key]

        logger.info(f"Routing task: {task}")
        try:
            result = None
            if task in ["content", "name", "branding_names"]:
                res_text = await cls.gemini.generate_text(payload)
                result = {"provider": "gemini", "response": res_text}
                
            elif task == "sentiment":
                analysis = await cls.hf.analyze_sentiment(payload)
                result = {**analysis, "provider": "huggingface"}
                
            elif task == "logo":
                img_path = await cls.sd.generate_logo(payload)
                result = {"image_url": img_path, "provider": "stability_ai"}
                
            elif task == "assistant":
                res_text = await cls.ibm.branding_advisor(payload)
                result = {"provider": "ibm_watsonx", "response": res_text}
                
            else:
                res_text = await cls.gemini.generate_text(payload)
                result = {"provider": "gemini_fallback", "response": res_text}

            # Update Cache (Skip for logos to avoid stale paths)
            if task != "logo":
                cls._cache[cache_key] = result
                
            return result

        except Exception as e:
            logger.error(f"Routing Error for {task}: {str(e)}")
            # Fallback or Graceful failure
            return {
                "error": True, 
                "message": f"Service temporarily unavailable: {task}", 
                "details": str(e)
            }
