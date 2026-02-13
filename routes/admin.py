
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import connection, models
from modules.auth.service import get_admin_user
from services.metrics_engine import MetricsEngine
import datetime

router = APIRouter()

@router.get("/users")
async def list_users(admin: models.User = Depends(get_admin_user), db: Session = Depends(connection.get_db)):
    users = db.query(models.User).all()
    return [{
        "id": u.id, 
        "email": u.email, 
        "full_name": u.full_name,
        "tier": u.tier, 
        "credits": u.credits,
        "is_active": u.is_active,
        "is_admin": u.is_admin,
        "created_at": u.created_at
    } for u in users]

@router.get("/usage")
async def system_usage(admin: models.User = Depends(get_admin_user), db: Session = Depends(connection.get_db)):
    """Comprehensive system-wide usage statistics."""
    # Last 30 days daily requests
    thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
    
    daily_stats = db.query(
        func.date(models.UsageLog.timestamp).label('date'),
        func.count(models.UsageLog.id).label('requests'),
        func.sum(models.UsageLog.total_tokens).label('tokens'),
        func.avg(models.UsageLog.duration).label('latency')
    ).filter(models.UsageLog.timestamp >= thirty_days_ago)\
     .group_by(func.date(models.UsageLog.timestamp))\
     .order_by('date').all()

    return {
        "daily_stats": [dict(row._asdict()) for row in daily_stats],
        "total_requests": db.query(models.UsageLog).count(),
        "total_tokens_all_time": db.query(func.sum(models.UsageLog.total_tokens)).scalar() or 0
    }

@router.get("/costs")
async def audit_costs(admin: models.User = Depends(get_admin_user), db: Session = Depends(connection.get_db)):
    """AI Provider cost auditing."""
    provider_stats = db.query(
        models.UsageLog.provider,
        models.UsageLog.model_name,
        func.count(models.UsageLog.id).label('call_count'),
        func.sum(models.UsageLog.cost_estimate).label('total_cost_usd')
    ).group_by(models.UsageLog.provider, models.UsageLog.model_name).all()

    return {
        "provider_breakdown": [dict(row._asdict()) for row in provider_stats],
        "estimated_total_burn_usd": db.query(func.sum(models.UsageLog.cost_estimate)).scalar() or 0.0
    }

@router.post("/users/{user_id}/credits")
async def adjust_user_credits(user_id: str, amount: int, admin: models.User = Depends(get_admin_user), db: Session = Depends(connection.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.credits += amount
    db.commit()
    return {"id": user.id, "new_balance": user.credits}
