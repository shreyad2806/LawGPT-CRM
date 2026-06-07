from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import dashboard, content, leads, followups, analytics
from routers import trends
from routers import infographic
from routers import engagement_logs
from routers import notifications

app = FastAPI(
    title="LawGPT CRM API",
    description="API for LawGPT CRM - AI-powered legal CRM system",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Register routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(followups.router, prefix="/api/followups", tags=["followups"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(trends.router, prefix="/api/trends", tags=["trends"])
app.include_router(infographic.router, prefix="/api/infographic", tags=["infographic"])
app.include_router(engagement_logs.router, prefix="/api/engagement-logs", tags=["engagement-logs"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
