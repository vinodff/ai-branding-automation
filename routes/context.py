from fastapi import APIRouter, HTTPException
from schemas.branding import ContextInput
from services.context_manager import ContextManager

router = APIRouter()

@router.post("/create")
async def create_context(data: ContextInput):
    ctx_id = ContextManager.create_context(data)
    return {"context_id": ctx_id, "message": "Context synchronized"}

@router.get("/{ctx_id}")
async def get_context(ctx_id: str):
    ctx = ContextManager.get_context(ctx_id)
    if not ctx:
        raise HTTPException(status_code=404, detail="Context ID expired or invalid")
    return ctx

@router.put("/{ctx_id}")
async def update_context(ctx_id: str, data: ContextInput):
    success = ContextManager.update_context(ctx_id, data)
    if not success:
        raise HTTPException(status_code=404, detail="Update failed")
    return {"status": "updated"}