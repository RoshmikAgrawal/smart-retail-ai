from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from typing import Optional

API_KEY = "retail_ai_secret_handshake_2026"
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def validate_api_key(header_key: Optional[str] = Security(api_key_header)) -> Optional[str]:
    """
    Module C4: Security layer validating production API Key headers for protected endpoints.
    """
    if header_key is not None and header_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or Missing Secret Production System API Key"
        )
    return header_key