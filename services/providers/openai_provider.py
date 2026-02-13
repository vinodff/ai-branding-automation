
import aiohttp
import logging
from core.config import settings
from services.providers.base import AIProvider
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger("brandcraft.openai")

class OpenAIProvider(AIProvider):
    def __init__(self, model_name: str = 'gpt-4o'):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.model_name = model_name
        self.url = "https://api.openai.com/v1/chat/completions"

    @retry(
        stop=stop_after_attempt(2),
        wait=wait_exponential(multiplier=1, min=2, max=6)
    )
    async def generate_text(self, prompt: str, **kwargs) -> dict:
        if not self.api_key:
            raise ValueError("OpenAI API Key missing")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(self.url, headers=headers, json=payload, timeout=30) as response:
                if response.status != 200:
                    err = await response.text()
                    logger.error(f"OpenAI Error: {err}")
                    raise Exception(f"OpenAI API Error: {response.status}")
                
                data = await response.json()
                usage = data.get("usage", {})
                
                return {
                    "text": data["choices"][0]["message"]["content"],
                    "provider": "openai",
                    "model": self.model_name,
                    "usage": {
                        "prompt_tokens": usage.get("prompt_tokens", 0),
                        "completion_tokens": usage.get("completion_tokens", 0),
                        "total_tokens": usage.get("total_tokens", 0)
                    }
                }
