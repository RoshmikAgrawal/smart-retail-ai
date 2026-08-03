import sys
import os
from contextlib import asynccontextmanager

# Secure module pathing before application lifecycle boot
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import vision, nlp, chatbot
from app.core.pipeline import ml_pipeline
from app.schemas import ApiResponse, DashboardStatsData

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Module C1: Load all ML models once at application startup using lifespan handler."""
    ml_pipeline.load_models()
    yield

app = FastAPI(
    title="Smart Retail & Customer Intelligence API",
    description="Unified FastAPI Gateway for Computer Vision, NLP Sentiment Analysis, and AI Chatbot.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable seamless frontend cross-origin communications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register specialized modular router subsystems
app.include_router(vision.router)
app.include_router(nlp.router)
app.include_router(chatbot.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Smart Retail AI API Gateway",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
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

@app.get("/api/dashboard/stats", response_model=ApiResponse[DashboardStatsData])
def get_dashboard_stats():
    """Provides high-level analytical matrix insights to the UI dashboard layer."""
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
                {"category": "Clothing", "count": 52, "percentage": 37.0},
                {"category": "Shoes", "count": 35, "percentage": 25.0},
                {"category": "Bags & Luggage", "count": 24, "percentage": 17.0},
                {"category": "Electronics", "count": 18, "percentage": 13.0},
                {"category": "Groceries & Food", "count": 12, "percentage": 8.0}
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
                "cvModule": "Active",
                "nlpModule": "Active",
                "chatbotModule": "Active",
                "pipelineStatus": "Operational"
            }
        },
        "error": None
    }

if __name__ == "__main__":
    import uvicorn
    # Boot network listener framework with hot-reload enabled for rapid testing
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)