
import google.generativeai as genai
from core.config import settings
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import asyncio
import logging

logger = logging.getLogger("brandcraft.gemini")

class GeminiProvider:
    def __init__(self):
        genai.configure(api_key=settings.API_KEY)
        self.model_name = 'gemini-3-flash-preview'

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(Exception)
    )
    async def generate_text(self, prompt: str) -> str:
        try:
            # Use run_in_executor since standard SDK calls are blocking
            loop = asyncio.get_event_loop()
            model = genai.GenerativeModel(self.model_name)
            
            response = await loop.run_in_executor(
                None, 
                lambda: model.generate_content(prompt)
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini")
            
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise
