
import aiohttp
from core.config import settings
import logging

logger = logging.getLogger("brandcraft.huggingface")

class HuggingFaceProvider:
    def __init__(self):
        self.api_url = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"
        self.headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}

    async def analyze_sentiment(self, text: str) -> dict:
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(self.api_url, headers=self.headers, json={"inputs": text}, timeout=10) as response:
                    if response.status != 200:
                        error_data = await response.text()
                        logger.error(f"HF Error: {error_data}")
                        return {"label": "neutral", "confidence": 0.0, "error": True}
                    
                    result = await response.json()
                    # Typically returns [[{'label': 'POSITIVE', 'score': 0.99}, ...]]
                    if isinstance(result, list) and len(result) > 0:
                        top_sentiment = result[0][0]
                        return {
                            "label": top_sentiment["label"].lower(),
                            "confidence": top_sentiment["score"]
                        }
                    return {"label": "neutral", "confidence": 0.0}
            except Exception as e:
                logger.error(f"HF Provider Exception: {str(e)}")
                return {"label": "neutral", "confidence": 0.0, "error": str(e)}
