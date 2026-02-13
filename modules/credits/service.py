
from sqlalchemy.orm import Session
from database.models import User
from fastapi import HTTPException
from modules.plans.tiers import CREDIT_COSTS

class CreditManager:
    @staticmethod
    def check_and_deduct(db: Session, user: User, endpoint: str):
        cost = CREDIT_COSTS.get(endpoint, 1)
        if user.credits < cost:
            raise HTTPException(
                status_code=402, 
                detail=f"Insufficient credits. Required: {cost}, Available: {user.credits}"
            )
        
        user.credits -= cost
        db.commit()
        return cost
