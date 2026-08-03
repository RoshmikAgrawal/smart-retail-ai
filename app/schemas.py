from pydantic import BaseModel, Field
from typing import List, Optional, Generic, TypeVar, Any

# Declare a Type Variable for the Generic Response Wrapper
DataT = TypeVar('DataT')

# ==========================================
# 1. Computer Vision Schemas (Module A)
# ==========================================

class FaceRecognitionRequest(BaseModel):
    customerNameHint: Optional[str] = None
    imageBase64: Optional[str] = None

class FaceRecognitionResponseData(BaseModel):
    id: str
    customerId: str
    customerName: str
    status: str
    loyaltyTier: Optional[str] = "Gold"
    loyaltyPoints: int
    visitCount: int
    confidence: float
    timestamp: str
    note: Optional[str] = None
    avatar: Optional[str] = None

class ProductClassificationRequest(BaseModel):
    imageBase64: Optional[str] = None
    sampleCategory: Optional[str] = None

class ProductClassificationResponseData(BaseModel):
    category: str
    confidence: float
    subCategory: str
    estimatedPriceRange: str
    engineSource: str

# ==========================================
# 2. NLP Sentiment Schemas (Module B)
# ==========================================

class SentimentRequest(BaseModel):
    text: str

class AspectRating(BaseModel):
    aspect: str
    sentiment: str
    score: float

class SentimentResponseData(BaseModel):
    originalText: str
    cleanedText: str
    tokens: List[str]
    stopwordsRemoved: List[str]
    sentiment: str
    confidence: float
    polarityScore: float
    aspects: List[AspectRating]
    summary: str
    timestamp: str

# ==========================================
# 3. AI Chatbot Schemas (Module B3)
# ==========================================

class ChatMessageRequest(BaseModel):
    message: str

class ChatMessageResponseData(BaseModel):
    id: str
    sender: str
    text: str
    timestamp: str
    intentTag: Optional[str] = None
    confidence: Optional[float] = None
    source: Optional[str] = None
    category: Optional[str] = None

# ==========================================
# 4. Dashboard Analytics Schemas
# ==========================================

class CategoryDistributionItem(BaseModel):
    category: str
    count: int
    percentage: float

class SentimentBreakdown(BaseModel):
    positive: int
    neutral: int
    negative: int

class VisitTrendItem(BaseModel):
    time: str
    visits: int
    vips: int

class SystemStatus(BaseModel):
    cvModule: str
    nlpModule: str
    chatbotModule: str
    pipelineStatus: str

class DashboardStatsData(BaseModel):
    totalVisitsToday: int
    uniqueCustomersToday: int
    returningCustomerRate: int
    averageSentimentScore: int
    sentimentBreakdown: Optional[SentimentBreakdown] = None
    categoryDistribution: Optional[List[CategoryDistributionItem]] = None
    visitTrend: Optional[List[VisitTrendItem]] = None
    recentVisits: List[FaceRecognitionResponseData]
    systemStatus: Optional[SystemStatus] = None

# ==========================================
# 5. Reusable Generic Wrapper Framework
# ==========================================

class ApiResponse(BaseModel, Generic[DataT]):
    """
    Fulfills production API guidelines by maintaining full type validation
    and explicit sub-model nesting structures inside auto-generated documentation.
    """
    success: bool
    data: Optional[DataT] = None
    error: Optional[str] = None