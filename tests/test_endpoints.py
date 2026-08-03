from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

VALID_PRODUCT_CATEGORIES = [
    "T-shirt/top", "Trouser", "Pullover", "Dress", "Coat", 
    "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot", "Clothing"
]

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] in ["healthy", "initializing"]

def test_face_recognition_endpoint():
    response = client.post("/api/vision/recognize-face?hint=Sarah%20Jenkins")
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["data"]["customerName"] == "Sarah Jenkins"

def test_classify_product_endpoint():
    response = client.post("/api/vision/classify-product?category_hint=Clothing")
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["data"]["category"] in VALID_PRODUCT_CATEGORIES

def test_classify_product_with_file_endpoint():
    files = {"file": ("test.jpg", b"fake_image_bytes", "image/jpeg")}
    response = client.post("/api/vision/classify-product?category_hint=Clothing", files=files)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["data"]["category"] in VALID_PRODUCT_CATEGORIES

def test_sentiment_analysis_endpoint():
    response = client.post("/api/analyze-sentiment", json={"text": "Great store experience and polite staff!"})
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["data"]["sentiment"] in ["Positive", "Negative", "Neutral"]

def test_chatbot_endpoint():
    response = client.post("/api/chatbot", json={"message": "What are your store hours?"})
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["data"]["intentTag"] == "store_hours"
