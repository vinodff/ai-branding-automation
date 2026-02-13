
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import connection, models
from modules.auth.service import get_current_user
from sqlalchemy import func
import datetime

router = APIRouter()

@router.get("/me")
async def get_my_analytics(current_user: models.User = Depends(get_current_user), db: Session = Depends(connection.get_db)):
    # Summary stats
    logs = db.query(models.UsageLog).filter(models.UsageLog.user_id == current_user.id).all()
    
    total_spent_credits = sum(log.credits_consumed for log in logs if log.credits_consumed)
    total_tokens = sum(log.total_tokens for log in logs if log.total_tokens)
    
    # 7-day usage trend
    seven_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    trend = db.query(
        func.date(models.UsageLog.timestamp).label('date'),
        func.count(models.UsageLog.id).label('count')
    ).filter(
        models.UsageLog.user_id == current_user.id,
        models.UsageLog.timestamp >= seven_days_ago
    ).group_by(func.date(models.UsageLog.timestamp)).all()

    # Tool breakdown
    tools = db.query(
        models.UsageLog.endpoint, 
        func.count(models.UsageLog.id)
    ).filter(models.UsageLog.user_id == current_user.id).group_by(models.UsageLog.endpoint).all()

    return {
        "credits": {
            "remaining": current_user.credits,
            "total_spent": total_spent_credits
        },
        "usage": {
            "total_requests": len(logs),
            "total_tokens": total_tokens,
            "7_day_trend": {str(t.date): t.count for t in trend}
        },
        "tools_breakdown": {endpoint: count for endpoint, count in tools},
        "tier": current_user.tier
    }
