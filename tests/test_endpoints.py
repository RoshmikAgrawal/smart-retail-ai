from fastapi.testclient import TestClient
from app.main import app

# Incorporates both MobileNetV2 retail classes and Fashion-MNIST standard variants
VALID_PRODUCT_CATEGORIES = [
    "T-shirt/top", "Trouser", "Pullover", "Dress", "Coat", 
    "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot", 
    "Clothing", "Shoes", "Bags & Luggage", "Electronics", "Groceries & Food"
]

# C4: Production Security Token Verification Headers
HEADERS = {"X-API-Key": "retail_ai_secret_handshake_2026"}
INVALID_HEADERS = {"X-API-Key": "invalid_secret_key"}

def test_root_endpoint():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "online"

def test_health_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
        assert response.json()["pipeline_loaded"] is True
        assert response.json()["models"]["face_db"] is True
        assert response.json()["models"]["product_classifier"] is True
        assert response.json()["models"]["sentiment_analyzer"] is True
        assert response.json()["models"]["chatbot_model"] is True

def test_dashboard_stats_endpoints():
    with TestClient(app) as client:
        for path in ["/dashboard/stats", "/api/dashboard/stats"]:
            response = client.get(path)
            assert response.status_code == 200
            res_data = response.json()
            assert res_data["success"] is True
            assert "totalVisitsToday" in res_data["data"]

def test_face_recognition_endpoints():
    with TestClient(app) as client:
        for path in ["/recognize-face?hint=Sarah%20Jenkins", "/api/recognize-face?hint=Sarah%20Jenkins"]:
            response = client.post(path, headers=HEADERS)
            assert response.status_code == 200
            res_data = response.json()
            assert res_data["success"] is True
            assert res_data["data"]["customerName"] == "Sarah Jenkins"

def test_classify_product_endpoints():
    with TestClient(app) as client:
        for path in ["/classify-product?category_hint=Clothing", "/api/classify-product?category_hint=Clothing"]:
            response = client.post(path, headers=HEADERS)
            assert response.status_code == 200
            res_data = response.json()
            assert res_data["success"] is True
            assert res_data["data"]["category"] in VALID_PRODUCT_CATEGORIES

def test_classify_product_with_file_endpoint():
    with TestClient(app) as client:
        files = {"file": ("test.jpg", b"fake_image_bytes", "image/jpeg")}
        response = client.post("/api/classify-product?category_hint=Clothing", files=files, headers=HEADERS)
        assert response.status_code == 200
        res_data = response.json()
        assert res_data["success"] is True
        assert res_data["data"]["category"] in VALID_PRODUCT_CATEGORIES

def test_sentiment_analysis_endpoints():
    with TestClient(app) as client:
        for path in ["/analyze-sentiment", "/api/analyze-sentiment", "/api/nlp/analyze"]:
            response = client.post(path, json={"text": "Great store experience and polite staff!"}, headers=HEADERS)
            assert response.status_code == 200
            res_data = response.json()
            assert res_data["success"] is True
            assert res_data["data"]["sentiment"] in ["Positive", "Negative", "Neutral"]

def test_chatbot_endpoints():
    with TestClient(app) as client:
        for path in ["/chatbot", "/api/chatbot"]:
            response = client.post(path, json={"message": "What are your store hours?"}, headers=HEADERS)
            assert response.status_code == 200
            res_data = response.json()
            assert res_data["success"] is True
            assert "intentTag" in res_data["data"]
            assert res_data["data"]["intentTag"] is not None

def test_security_access_denied():
    with TestClient(app) as client:
        response = client.post("/api/chatbot", json={"message": "Hello"}, headers=INVALID_HEADERS)
        assert response.status_code == 403
