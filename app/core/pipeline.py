import os
import pickle
import joblib
import tensorflow as tf
from pathlib import Path
from typing import Dict, Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent

class MLPipeline:
    """
    Module C1 & C2: Unified ML Pipeline loading and serving all Computer Vision,
    NLP Sentiment, and Chatbot models at application startup.
    """
    def __init__(self):
        self.face_db: Optional[Dict[str, Any]] = None
        self.product_classifier: Optional[tf.keras.Model] = None
        self.sentiment_analyzer: Optional[Dict[str, Any]] = None
        self.chatbot_model: Optional[Dict[str, Any]] = None
        self.is_loaded: bool = False

    def load_models(self):
        print("====== Initializing Unified ML Pipeline Start ======")
        
        # C2: Serialization - Load facial embeddings (Pickle)
        face_db_path = BASE_DIR / "models" / "face_db.pkl"
        if face_db_path.exists():
            try:
                with open(face_db_path, "rb") as f:
                    self.face_db = pickle.load(f)
                print(f"[MLPipeline] Successfully unpickled face embedding database ({len(self.face_db)} customers).")
            except Exception as e:
                print(f"[MLPipeline] Error loading face database: {e}")

        # C2: Serialization - Load Deep Learning Product Graph (.h5 native)
        model_path = BASE_DIR / "models" / "product_classifier.h5"
        if model_path.exists():
            try:
                self.product_classifier = tf.keras.models.load_model(model_path)
                print("[MLPipeline] Successfully loaded Keras MobileNetV2 deep learning model (.h5).")
            except Exception as e:
                print(f"[MLPipeline] Error loading product classifier model: {e}")
            
        # C2: Serialization - Load Sklearn/NLP Sentiment Pipeline (Joblib)
        nlp_path = BASE_DIR / "models" / "sentiment_model.pkl"
        if nlp_path.exists():
            try:
                self.sentiment_analyzer = joblib.load(nlp_path)
                print("[MLPipeline] Successfully loaded TF-IDF Sentiment Sklearn pipeline (.pkl).")
            except Exception as e:
                print(f"[MLPipeline] Error loading sentiment model: {e}")

        # C2: Serialization - Load Chatbot Intent Classifier (Joblib)
        chatbot_path = BASE_DIR / "models" / "chatbot_model.pkl"
        if chatbot_path.exists():
            try:
                self.chatbot_model = joblib.load(chatbot_path)
                print("[MLPipeline] Successfully loaded Chatbot intent classifier (.pkl).")
            except Exception as e:
                print(f"[MLPipeline] Error loading chatbot model: {e}")

        self.is_loaded = True
        print("====== Unified ML Pipeline Loaded Successfully ======")

# Singleton Instance
ml_pipeline = MLPipeline()