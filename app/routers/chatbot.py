from fastapi import APIRouter, HTTPException
from app.services.chatbot_service import chatbot_service
from app.schemas import ApiResponse, ChatMessageRequest, ChatMessageResponseData

# router = APIRouter(prefix="/api/chatbot", tags=["Chatbot Module"])
router = APIRouter(tags=["Chatbot Module"])

# @router.post("/chatbot", response_model=ApiResponse[ChatMessageResponseData])
@router.post("/chatbot", response_model=ApiResponse[ChatMessageResponseData])
def handle_chat(req: ChatMessageRequest):
    """
    Fulfills Module B3 pipeline requirements by routing incoming consumer dialogue
    through the hybrid intent classification and Naive Bayes fallback framework.
    """
    try:
        result = chatbot_service.respond(req.message)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot Engine Fault: {str(e)}")

@router.get("/intents")
def get_intents():
    """Returns the FAQ intents training dataset for UI exploration."""
    try:
        return {"success": True, "data": chatbot_service.intents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch intents: {str(e)}")