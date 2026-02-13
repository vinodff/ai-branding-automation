
from database.models import UserTier

PLAN_LIMITS = {
    UserTier.FREE: {
        "monthly_credits": 10,
        "rate_limit": "20/hour",
        "priority": False
    },
    UserTier.STARTER: {
        "monthly_credits": 100,
        "rate_limit": "100/hour",
        "priority": False
    },
    UserTier.PRO: {
        "monthly_credits": 1000,
        "rate_limit": "1000/hour",
        "priority": True
    },
    UserTier.ENTERPRISE: {
        "monthly_credits": 100000,
        "rate_limit": "unlimited",
        "priority": True
    }
}

CREDIT_COSTS = {
    "/branding/generate-name": 1,
    "/branding/generate-content": 2,
    "/branding/generate-logo": 5,
    "/branding/assistant": 1,
    "/branding/sentiment": 1,
    "/branding/video": 20,
    "/branding/voice": 5
}
