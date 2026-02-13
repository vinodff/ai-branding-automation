
from sqlalchemy.orm import Session
from . import models
from modules.auth import service as auth_service
import uuid

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, email: str, password: str, full_name: str):
    db_user = models.User(
        id=str(uuid.uuid4()),
        email=email,
        hashed_password=auth_service.get_password_hash(password),
        full_name=full_name,
        credits=10, # Initial free credits
        tier=models.UserTier.FREE
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_credits(db: Session, user_id: str, amount: int):
    user = get_user(db, user_id)
    if user:
        user.credits += amount
        db.commit()
        db.refresh(user)
    return user

def create_usage_log(
    db: Session, 
    user_id: str, 
    endpoint: str, 
    method: str, 
    status: int, 
    duration: float, 
    credits: int, 
    ip: str,
    ai_metadata: dict = None
):
    ai_metadata = ai_metadata or {}
    usage = ai_metadata.get("usage", {})
    
    log = models.UsageLog(
        user_id=user_id,
        endpoint=endpoint,
        method=method,
        status_code=status,
        duration=duration,
        credits_consumed=credits,
        ip_address=ip,
        
        # Expanded analytics
        provider=ai_metadata.get("provider"),
        model_name=ai_metadata.get("model"),
        prompt_tokens=usage.get("prompt_tokens", 0),
        completion_tokens=usage.get("completion_tokens", 0),
        total_tokens=usage.get("total_tokens", 0),
        cost_estimate=ai_metadata.get("cost_estimate", 0.0)
    )
    db.add(log)
    db.commit()
    return log
