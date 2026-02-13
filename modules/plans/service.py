
from database.models import User, UserTier
from .tiers import PLAN_LIMITS

class PlanService:
    @staticmethod
    def get_user_limits(user: User):
        tier = user.tier or UserTier.FREE
        return PLAN_LIMITS.get(tier, PLAN_LIMITS[UserTier.FREE])

    @staticmethod
    def can_access_priority_speed(user: User) -> bool:
        limits = PlanService.get_user_limits(user)
        return limits.get("priority", False)
