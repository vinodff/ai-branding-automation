
from ibm_watsonx_ai.foundation_models import Model
from core.config import settings
import asyncio
import logging

logger = logging.getLogger("brandcraft.ibm")

class IBMProvider:
    def __init__(self):
        self.credentials = {
            "url": settings.IBM_URL,
            "apikey": settings.IBM_API_KEY
        }
        self.project_id = settings.IBM_PROJECT_ID
        self.model_id = "google/flan-ul2" # Representative performant model

    async def branding_advisor(self, prompt: str) -> str:
        try:
            loop = asyncio.get_event_loop()
            
            def call_watsonx():
                model = Model(
                    model_id=self.model_id,
                    params={
                        "decoding_method": "sample",
                        "max_new_tokens": 512,
                        "temperature": 0.7
                    },
                    credentials=self.credentials,
                    project_id=self.project_id
                )
                return model.generate_text(prompt)

            response = await loop.run_in_executor(None, call_watsonx)
            return response
        except Exception as e:
            logger.error(f"IBM Watsonx AI Error: {str(e)}")
            return "Strategy Assistant encountered an error. Please try again."
