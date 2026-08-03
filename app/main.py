import sys
import os
from contextlib import asynccontextmanager

# Secure module pathing before application lifecycle boot
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import vision, nlp, chatbot
from app.core.pipeline import ml_pipeline
from app.schemas import ApiResponse, DashboardStatsData
from app.core.security import validate_api_key  # Injects your Module C4 security gate[cite: 1]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Module C1: Load all ML models once at application startup using lifespan handler[cite: 1]."""
    print("[Gateway Startup] Initializing model graphs inside system memory...")
    ml_pipeline.load_models()
    yield
    print("[Gateway Shutdown] Flushing system RAM blocks.")

app = FastAPI(
    title="Smart Retail & Customer Intelligence API",
    description="Unified FastAPI Gateway for Computer Vision, NLP Sentiment Analysis, and AI Chatbot[cite: 1].",
    version="1.0.0",
    lifespan=lifespan
)

# Enable seamless frontend cross-origin communications for your React UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register specialized modular router subsystems protected by your security layer
# Enforces the 'X-API-Key' gate check across all core analytical endpoints
app.include_router(vision.router, prefix="/api", dependencies=[Depends(validate_api_key)])
app.include_router(nlp.router, prefix="/api", dependencies=[Depends(validate_api_key)])
app.include_router(chatbot.router, prefix="/api", dependencies=[Depends(validate_api_key)])

# Register root-level route aliases matching exact PDF section C3 endpoint specs
app.include_router(vision.router, dependencies=[Depends(validate_api_key)], include_in_schema=False)
app.include_router(nlp.router, dependencies=[Depends(validate_api_key)], include_in_schema=False)
app.include_router(chatbot.router, dependencies=[Depends(validate_api_key)], include_in_schema=False)

@app.get("/", tags=["System Diagnostics"])
def root():
    return {
        "status": "online",
        "service": "Smart Retail AI API Gateway",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health", tags=["System Diagnostics"])
@app.get("/health", tags=["System Diagnostics"], include_in_schema=False)
def health_check():
    """System health check endpoint verifying ML pipeline and models initialization state."""
    return {
        "status": "healthy" if ml_pipeline.is_loaded else "initializing",
        "pipeline_loaded": ml_pipeline.is_loaded,
        "models": {
            "face_db": ml_pipeline.face_db is not None,
            "product_classifier": ml_pipeline.product_classifier is not None,
            "sentiment_analyzer": ml_pipeline.sentiment_analyzer is not None,
            "chatbot_model": ml_pipeline.chatbot_model is not None,
        }
    }

@app.get("/api/dashboard/stats", response_model=ApiResponse[DashboardStatsData], tags=["System Diagnostics"])
@app.get("/dashboard/stats", response_model=ApiResponse[DashboardStatsData], tags=["System Diagnostics"], include_in_schema=False)
def get_dashboard_stats():
    """Provides high-level analytical matrix insights to the UI dashboard layer[cite: 1]."""
    return {
        "success": True,
        "data": {
            "totalVisitsToday": 131,
            "uniqueCustomersToday": 98,
            "returningCustomerRate": 85,
            "averageSentimentScore": 92,
            "sentimentBreakdown": {
                "positive": 78,
                "neutral": 14,
                "negative": 8
            },
            "categoryDistribution": [
                {"category": "T-shirt/top", "count": 32, "percentage": 23.0},
                {"category": "Trouser", "count": 24, "percentage": 17.0},
                {"category": "Pullover", "count": 18, "percentage": 13.0},
                {"category": "Dress", "count": 15, "percentage": 11.0},
                {"category": "Coat", "count": 12, "percentage": 8.0},
                {"category": "Sandal", "count": 10, "percentage": 7.0},
                {"category": "Shirt", "count": 9, "percentage": 6.0},
                {"category": "Sneaker", "count": 8, "percentage": 6.0},
                {"category": "Bag", "count": 7, "percentage": 5.0},
                {"category": "Ankle boot", "count": 6, "percentage": 4.0}
            ],
            "visitTrend": [
                {"time": "09:00", "visits": 12, "vips": 3},
                {"time": "11:00", "visits": 28, "vips": 8},
                {"time": "13:00", "visits": 45, "vips": 14},
                {"time": "15:00", "visits": 31, "vips": 9},
                {"time": "17:00", "visits": 15, "vips": 4}
            ],
            "recentVisits": [
                {
                    "id": "VISIT-9004",
                    "customerId": "CUST-1001",
                    "customerName": "Sarah Jenkins",
                    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
                    "status": "VIP",
                    "loyaltyTier": "Gold",
                    "loyaltyPoints": 2460,
                    "visitCount": 19,
                    "confidence": 0.98,
                    "timestamp": "2 mins ago",
                    "note": "In-store greeting triggered: Preferred Category (Clothing)"
                },
                {
                    "id": "VISIT-9003",
                    "customerId": "CUST-1002",
                    "customerName": "Marcus Vance",
                    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
                    "status": "VIP",
                    "loyaltyTier": "Gold",
                    "loyaltyPoints": 1820,
                    "visitCount": 12,
                    "confidence": 0.95,
                    "timestamp": "14 mins ago",
                    "note": "In-store greeting triggered: Preferred Category (Electronics)"
                },
                {
                    "id": "VISIT-9002",
                    "customerId": "CUST-1003",
                    "customerName": "Elena Rostova",
                    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
                    "status": "Returning",
                    "loyaltyTier": "Silver",
                    "loyaltyPoints": 830,
                    "visitCount": 7,
                    "confidence": 0.91,
                    "timestamp": "45 mins ago",
                    "note": "Regular returning visitor check-in"
                }
            ],
            "systemStatus": {
                "cvModule": "Active" if ml_pipeline.product_classifier is not None else "Offline",
                "nlpModule": "Active" if ml_pipeline.sentiment_analyzer is not None else "Offline",
                "chatbotModule": "Active" if ml_pipeline.chatbot_model is not None else "Offline",
                "pipelineStatus": "Operational" if ml_pipeline.is_loaded else "Degraded"
            }
        },
        "error": None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)