from fastapi import APIRouter, HTTPException
from app.services.nlp_service import nlp_service
from app.schemas import ApiResponse, SentimentRequest, SentimentResponseData

#router = APIRouter(prefix="/api/nlp", tags=["Natural Language Processing"])
router = APIRouter(tags=["Natural Language Processing"])

@router.post("/analyze-sentiment", response_model=ApiResponse[SentimentResponseData])
@router.post("/nlp/analyze", response_model=ApiResponse[SentimentResponseData], include_in_schema=False)
async def analyze_text_sentiment(payload: SentimentRequest):
    """
    Fulfills Module B1 and B2 pipeline requirements by processing raw text reviews
    and extracting granular sentiment vectors along with aspect scores.
    """
    try:
        # Route request payload text string directly to the NLP service pipeline
        sentiment_result = nlp_service.analyze_sentiment(payload.text)
        return {"success": True, "data": sentiment_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))