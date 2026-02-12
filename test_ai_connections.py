
import asyncio
import logging
from services.ai_router import AIRouter
from core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_connections")

async def test_all():
    logger.info("Starting AI Provider Connectivity Tests...")
    
    # Test Gemini
    logger.info("Testing Gemini...")
    res_names = await AIRouter.route_request("name", "Generate a brand name for a space travel agency.")
    logger.info(f"Gemini Response: {res_names.get('response', 'ERROR')[:50]}...")

    # Test HF
    logger.info("Testing HuggingFace...")
    res_sent = await AIRouter.route_request("sentiment", "I absolutely love this product, it works perfectly!")
    logger.info(f"HF Response: {res_sent}")

    # Test IBM
    logger.info("Testing IBM Watsonx...")
    res_assistant = await AIRouter.route_request("assistant", "How should I position a luxury watch brand?")
    logger.info(f"IBM Response: {res_assistant.get('response', 'ERROR')[:50]}...")

    # Test SD (Note: Costs credits)
    logger.info("Testing Stable Diffusion...")
    try:
        res_logo = await AIRouter.route_request("logo", "A minimalist futuristic logo for a space agency, blue and silver.")
        logger.info(f"SD Response: {res_logo}")
    except Exception as e:
        logger.warning(f"SD Test skipped or failed: {e}")

    logger.info("Tests Completed.")

if __name__ == "__main__":
    asyncio.run(test_all())
