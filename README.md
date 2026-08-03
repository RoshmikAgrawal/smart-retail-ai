# Smart Retail & Customer Intelligence Platform

An end-to-end Computer Vision and Natural Language Processing solution for smart retail environments, combining facial recognition loyalty tracking, MobileNetV2 product classification, TF-IDF sentiment analysis, and hybrid support chatbots into a unified API and interactive dashboard.

## File & Repository Structure

```
smart-retail-ai/
├── app/
│   ├── main.py                    # FastAPI entrypoint
│   ├── routers/
│   │   ├── vision.py              # Vision endpoints (/recognize-face, /classify-product)
│   │   ├── nlp.py                 # Sentiment & NLP preprocessing endpoints
│   │   └── chatbot.py             # Chatbot FAQ intent endpoints
│   ├── models/                    # Serialized model artifacts (.h5, .pkl)
│   │   ├── product_classifier.h5
│   │   ├── face_db.pkl
│   │   ├── sentiment_model.pkl
│   │   └── chatbot_model.pkl
│   ├── services/                  # Business logic & ML inference pipelines
│   │   ├── cv_service.py
│   │   ├── nlp_service.py
│   │   └── chatbot_service.py
│   └── schemas.py                 # Pydantic request/response data validation schemas
├── notebooks/                     # Training & experiment Jupyter notebooks
│   ├── 01_image_classifier_training.ipynb
│   ├── 02_face_recognition_setup.ipynb
│   └── 03_sentiment_model_training.ipynb
├── data/                          # Dataset stores
│   ├── reviews.csv                # Women's E-Commerce Clothing Reviews dataset (fetched via kagglehub)
│   └── intents.json               # Chatbot training patterns & responses
├── tests/
│   └── test_endpoints.py          # Pytest suite for API verification
├── requirements.txt
├── README.md
└── .github/workflows/deploy.yml   # CI/CD deployment pipeline
```

## Quick Start (Python FastAPI Backend)

```bash
# Install dependencies
pip install -r requirements.txt

# Run FastAPI server with auto-reload
uvicorn app.main:app --reload --port 8000
```

Access Swagger UI API Docs at `http://localhost:8000/docs`.

## Quick Start (Full-Stack Web App)

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to interact with the full Smart Retail Capstone Dashboard.
