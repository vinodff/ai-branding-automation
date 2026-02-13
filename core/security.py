
import re
import logging

logger = logging.getLogger("brandcraft.security")

class SecurityEngine:
    # Malicious patterns and jailbreak attempts
    FORBIDDEN_PATTERNS = [
        r"ignore previous instructions",
        r"system prompt",
        r"reveal your secrets",
        r"forget everything",
        r"as a developer with full access",
        r"sudo",
        r"<script>",
        r"javascript:",
        r"union select",
        r"drop table"
    ]

    @classmethod
    def validate_prompt(cls, text: str) -> bool:
        """Returns True if the prompt is considered safe."""
        if not text:
            return True
        
        text_lower = text.lower()
        for pattern in cls.FORBIDDEN_PATTERNS:
            if re.search(pattern, text_lower):
                logger.warning(f"Security: Blocked potential malicious prompt pattern: {pattern}")
                return False
        return True

    @classmethod
    def filter_malicious_content(cls, text: str) -> str:
        """Sanitizes outgoing or incoming text from XSS/Injection characters."""
        if not text:
            return ""
        # Basic HTML stripping
        clean = re.compile('<.*?>')
        return re.sub(clean, '', text)
