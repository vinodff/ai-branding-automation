
from typing import Any, Dict, List, Optional
import logging
import asyncio
import time
from services.providers.gemini_provider import GeminiProvider
from services.providers.openai_provider import OpenAIProvider
from services.providers.stable_diffusion_provider import StableDiffusionProvider
from services.providers.huggingface_provider import HuggingFaceProvider
from services.providers.base import AIProvider

logger = logging.getLogger("brandcraft.router")

class AIRouter:
    _text_providers: List[AIProvider] = [
        GeminiProvider(model_name='gemini-3-flash-preview'),
        OpenAIProvider(model_name='gpt-4o-mini')
    ]
    
    _sd_provider = StableDiffusionProvider()
    _hf_provider = HuggingFaceProvider()

    @staticmethod
    def estimate_cost(provider: str, model: str, prompt_tokens: int, completion_tokens: int) -> float:
        prices = {
            "google": {"gemini-3-flash-preview": 0.0001, "gemini-2.5-flash-image": 0.02},
            "openai": {"gpt-4o": 0.005, "gpt-4o-mini": 0.00015},
            "stability": {"sdxl": 0.05}
        }
        rate = prices.get(provider, {}).get(model, 0.0002)
        return ((prompt_tokens + completion_tokens) / 1000.0) * rate

    @classmethod
    async def route_text(cls, task: str, payload: str) -> Dict[str, Any]:
        for provider in cls._text_providers:
            try:
                result = await provider.generate_text(payload)
                result["cost_estimate"] = cls.estimate_cost(
                    result["provider"], result["model"],
                    result["usage"]["prompt_tokens"], result["usage"]["completion_tokens"]
                )
                return result
            except Exception as e:
                logger.warning(f"Text Provider failed: {str(e)}")
                continue
        return {"error": True, "message": "No text providers available."}

    @classmethod
    async def route_image(cls, prompt: str) -> Dict[str, Any]:
        try:
            # Prefer SD for high-end logos
            url = await cls._sd_provider.generate_logo(prompt)
            return {
                "url": url,
                "provider": "stability",
                "model": "sdxl",
                "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
                "cost_estimate": 0.05
            }
        except Exception:
            # Fallback to Gemini Image
            provider = GeminiProvider(model_name='gemini-2.5-flash-image')
            res = await provider.generate_text(f"Generate logo: {prompt}")
            return res

    @classmethod
    async def route_sentiment(cls, text: str) -> Dict[str, Any]:
        return await cls._hf_provider.analyze_sentiment(text)
