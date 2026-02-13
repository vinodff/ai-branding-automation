
import google.generativeai as genai
from core.config import settings
from services.providers.base import AIProvider
from tenacity import retry, stop_after_attempt, wait_exponential
import asyncio
import logging

logger = logging.getLogger("brandcraft.gemini")

class GeminiProvider(AIProvider):
    def __init__(self, model_name: str = 'gemini-3-flash-preview'):
        genai.configure(api_key=settings.API_KEY)
        self.model_name = model_name

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    async def generate_text(self, prompt: str, **kwargs) -> dict:
        try:
            loop = asyncio.get_event_loop()
            model = genai.GenerativeModel(self.model_name)
            
            # Use synchronous call in executor as SDK is primarily blocking
            response = await loop.run_in_executor(
                None, 
                lambda: model.generate_content(prompt)
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini")
            
            # Approximate token counting if not provided by SDK
            # Gemini usually provides usage metadata
            usage = getattr(response, 'usage_metadata', None)
            
            return {
                "text": response.text,
                "provider": "google",
                "model": self.model_name,
                "usage": {
                    "prompt_tokens": getattr(usage, 'prompt_token_count', 0),
                    "completion_tokens": getattr(usage, 'candidates_token_count', 0),
                    "total_tokens": getattr(usage, 'total_token_count', 0)
                }
            }
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise e
