
import aiohttp
import os
import uuid
from core.config import settings
import logging

logger = logging.getLogger("brandcraft.sd")

class StableDiffusionProvider:
    def __init__(self):
        # Using Stability AI SDK compatible Inference API URL
        self.api_url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {settings.SD_API_KEY}"
        }

    async def generate_logo(self, prompt: str) -> str:
        payload = {
            "text_prompts": [{"text": prompt}],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
        }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(self.api_url, headers=self.headers, json=payload, timeout=60) as response:
                    if response.status != 200:
                        error_data = await response.text()
                        logger.error(f"SD API Error: {error_data}")
                        raise Exception(f"SD API Error: {response.status}")
                    
                    data = await response.json()
                    image_base64 = data["artifacts"][0]["base64"]
                    
                    # Save locally
                    filename = f"logo_{uuid.uuid4().hex}.png"
                    filepath = os.path.join(settings.STATIC_DIR, filename)
                    
                    import base64
                    with open(filepath, "wb") as f:
                        f.write(base64.b64decode(image_base64))
                    
                    return f"/static/{filename}"
            except Exception as e:
                logger.error(f"SD Provider Exception: {str(e)}")
                raise
