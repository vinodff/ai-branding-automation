
# BrandCraft SaaS - System Design

## 1. Overview
BrandCraft is a multi-tenant AI Branding automation platform. The architecture follows a modular service-oriented approach designed for high availability and vertical scaling.

## 2. Architecture Layers
- **Gateway**: Nginx load balancer handling SSL, Compression, and Static serving.
- **Application**: FastAPI backend managing the SaaS lifecycle (Auth, Credits, Logic).
- **Core Intelligence**: AI Router abstracting multiple providers (Gemini, stability, HF, WatsonX).
- **Data Persistence**: SQL-based storage for Users, Logs, and Contexts.

## 3. Request Lifecycle
1. User authenticates via JWT.
2. `RateLimitGuard` checks plan-based quotas.
3. `CreditManager` verifies balance for the specific tool.
4. `AIRouter` executes the neural synthesis.
5. `UsageLog` records the transaction for analytics.
6. Credits are deducted atomically.

## 4. Scaling Strategy
- **Horizontal**: Backend is stateless. Deploy multiple Docker containers behind Nginx.
- **Task Queue**: Move image and video generation to Celery/Redis workers to avoid blocking the main thread.
- **Caching**: Implement Redis for user session and frequent prompt results.
