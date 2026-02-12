from typing import Dict, Optional
from schemas.branding import ContextInput
import uuid

class ContextManager:
    # Simulated in-memory database
    _store: Dict[str, ContextInput] = {}

    @classmethod
    def create_context(cls, data: ContextInput) -> str:
        ctx_id = str(uuid.uuid4())
        cls._store[ctx_id] = data
        return ctx_id

    @classmethod
    def get_context(cls, ctx_id: str) -> Optional[ContextInput]:
        return cls._store.get(ctx_id)

    @classmethod
    def update_context(cls, ctx_id: str, data: ContextInput) -> bool:
        if ctx_id in cls._store:
            cls._store[ctx_id] = data
            return True
        return False

    @classmethod
    def delete_context(cls, ctx_id: str) -> bool:
        if ctx_id in cls._store:
            del cls._store[ctx_id]
            return True
        return False