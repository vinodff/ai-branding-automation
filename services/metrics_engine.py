
from sqlalchemy.orm import Session
from database import models
from sqlalchemy import func
import datetime

class MetricsEngine:
    @staticmethod
    def get_global_metrics(db: Session):
        total_users = db.query(models.User).count()
        active_24h = db.query(models.UsageLog.user_id).filter(
            models.UsageLog.timestamp >= datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ).distinct().count()
        
        total_requests = db.query(models.UsageLog).count()
        avg_latency = db.query(func.avg(models.UsageLog.duration)).scalar() or 0
        
        # Revenue estimate based on credits (hypothetical $0.10 per credit)
        total_credits_consumed = db.query(func.sum(models.UsageLog.credits_consumed)).scalar() or 0
        revenue_est = total_credits_consumed * 0.10
        
        error_count = db.query(models.UsageLog).filter(models.UsageLog.status_code >= 400).count()
        error_percentage = (error_count / total_requests * 100) if total_requests > 0 else 0

        return {
            "total_users": total_users,
            "active_users_24h": active_24h,
            "total_requests": total_requests,
            "avg_latency_ms": round(avg_latency * 1000, 2),
            "revenue_estimate_usd": round(revenue_est, 2),
            "error_percentage": round(error_percentage, 2)
        }
