from schemas.branding import ContextInput, NameRequest

class PromptBuilder:
    @staticmethod
    def _inject_context(base_prompt: str, context: ContextInput) -> str:
        ctx_str = (
            f"BRAND CONTEXT:\n"
            f"- Industry: {context.industry}\n"
            f"- Tone: {context.tone}\n"
            f"- Audience: {context.target_audience}\n"
            f"- Personality: {context.brand_personality}\n"
            f"- Keywords: {', '.join(context.keywords)}\n\n"
        )
        return ctx_str + base_prompt

    @classmethod
    def build_brand_name_prompt(cls, req: NameRequest, context: ContextInput) -> str:
        base = f"Generate 5 unique brand names. Focus on the {req.vibe or context.tone} vibe."
        return cls._inject_context(base, context)

    @classmethod
    def build_logo_prompt(cls, prompt: str, context: ContextInput) -> str:
        base = f"Create a professional logo: {prompt}. Style should be {context.brand_personality}."
        return cls._inject_context(base, context)

    @classmethod
    def build_content_prompt(cls, c_type: str, context: ContextInput) -> str:
        prompts = {
            "tagline": "Craft 3 punchy taglines.",
            "mission": "Write a 2-sentence mission statement.",
            "social": "Draft 2 engaging Instagram captions."
        }
        return cls._inject_context(prompts.get(c_type, ""), context)