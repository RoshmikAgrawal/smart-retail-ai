from ast import pattern
import os
import json
import random
import joblib
import datetime
from typing import Dict, Any
from app.services.nlp_service import nlp_service

class ChatbotService:
    def __init__(self):
        # Module B3: Hybrid Rule-based + ML Intent Classification
        self.intents = []
        self.intent_map = {}
        self.model_data = None
        
        # Absolute structural path configuration matching your workspace layout
        self.intents_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "intents.json")
        self.model_path = os.path.join(os.path.dirname(__file__), "..", "models", "chatbot_model.pkl")
        
        self._load_intents_and_model()

    def _load_intents_and_model(self):
        try:
            if os.path.exists(self.intents_path):
                with open(self.intents_path, 'r', encoding='utf-8') as f:
                    raw_data = json.load(f)
                    # Correctly assigned directly as a list to match your top-level JSON array layout
                    if isinstance(raw_data, list):
                        self.intents = raw_data
                    elif isinstance(raw_data, dict) and "intents" in raw_data:
                        self.intents = raw_data["intents"]
                    
                    for intent in self.intents:
                        if isinstance(intent, dict) and "tag" in intent:
                            self.intent_map[intent["tag"]] = intent
                print(f"[ChatbotService] Loaded {len(self.intents)} intents from data/intents.json")
        except Exception as e:
            print(f"[ChatbotService] Error loading intents.json: {e}")

        try:
            if os.path.exists(self.model_path):
                self.model_data = joblib.load(self.model_path)
                print(f"[ChatbotService] Loaded trained ML intent classifier from {self.model_path}")
        except Exception as e:
            print(f"[ChatbotService] Warning: Could not load chatbot_model.pkl ({e})")

    def respond(self, message: str) -> Dict[str, Any]:
        # Extract fully lemmatized text array from Module B1 core text cleaner
        nlp_analysis = nlp_service.analyze_sentiment(message)
        msg_cleaned = nlp_analysis.get("cleanedText", message.lower().strip())
        
        matched_tag = None
        response_text = None
        category = "General Inquiry"
        confidence = 0.85
        source = "rule_based_faq"

        # 1. Hybrid Approach - Step 1: Direct Pattern Word Matcher
        best_match_score = 0.0
        best_intent = None
        msg_words = set(msg_cleaned.split())

        for intent in self.intents:
            for pattern in intent.get("patterns", []):
                # Clean template tokens using matching text preprocessing loops
                pattern_analysis = nlp_service.analyze_sentiment(pattern)

                # Force a strict string fallback so Pyrefly knows it can safely execute .split()
                raw_fallback = pattern.lower() if pattern else ""
                pattern_cleaned = str(pattern_analysis.get("cleanedText") or raw_fallback)

                words = set(pattern_cleaned.split())
                overlap = len(words.intersection(msg_words))
                score = overlap / float(max(len(words), 1))

                if score > best_match_score:
                    best_match_score = score
                    best_intent = intent

        # If rule-based matrix satisfies criteria, capture the response details
        if best_intent and best_match_score >= 0.35:
            matched_tag = best_intent["tag"]
            response_text = random.choice(best_intent["responses"])
            category = best_intent.get("category", "General Inquiry")
            confidence = min(0.98, round(0.70 + best_match_score * 0.3, 2))
            source = "rule_based_faq"

        # 2. Hybrid Approach - Step 2: ML TF-IDF Classifier Fallback
        if not response_text and self.model_data and 'vectorizer' in self.model_data and 'model' in self.model_data:
            try:
                vectorizer = self.model_data['vectorizer']
                model = self.model_data['model']

                # Clean text feature extraction via custom vector space bounds
                X_in = vectorizer.transform([msg_cleaned])
                pred_tag = model.predict(X_in)[0]
                proba = model.predict_proba(X_in)[0]
                max_prob = float(max(proba))

                if pred_tag in self.intent_map and max_prob >= 0.15:
                    intent_obj = self.intent_map[pred_tag]
                    matched_tag = pred_tag
                    response_text = random.choice(intent_obj["responses"])
                    category = intent_obj.get("category", "ML Assistant")
                    confidence = round(max_prob, 2)
                    source = "ml_intent_classifier"
            except Exception as err:
                print(f"[ChatbotService] ML fallback error: {err}")

        # 3. Default Fallback Policy Block
        if not response_text:
            matched_tag = "general_fallback"
            response_text = "Thank you for reaching out to Smart Retail Customer Support. I have logged your request and our live support representative will assist you shortly."
            category = "Customer Care"
            confidence = 0.75
            source = "ml_fallback_model"

        return {
            "id": f"MSG-{Date_now_ts()}",
            "sender": "bot",
            "text": response_text,
            "timestamp": datetime.datetime.now().strftime("%H:%M"),
            "intentTag": matched_tag,
            "confidence": confidence,
            "source": source,
            "category": category
        }

def Date_now_ts():
    return int(datetime.datetime.now().timestamp() * 1000)

chatbot_service = ChatbotService()