import os
import pickle
import joblib
import tensorflow as tf
from pathlib import Path
from typing import Dict, Any, Optional

# Defensive path mapping: dynamically resolves the models directory location
CURRENT_DIR = Path(__file__).resolve().parent
if (CURRENT_DIR / "models").exists():
    MODELS_DIR = CURRENT_DIR / "models"
else:
    MODELS_DIR = CURRENT_DIR.parent / "models"

class MLPipeline:
    """
    Module C1 & C2: Unified ML Pipeline loading and serving all Computer Vision,
    NLP Sentiment, and Chatbot models at application startup[cite: 1].
    """
    def __init__(self):
        self.face_db: Optional[Dict[str, Any]] = None
        self.product_classifier: Optional[tf.keras.Model] = None
        self.sentiment_analyzer: Optional[Any] = None
        self.chatbot_model: Optional[Any] = None
        self.is_loaded: bool = False

    def load_models(self):
        print("====== Initializing Unified ML Pipeline Start ======")
        engines_loaded = 0
        
        # C2: Serialization - Load facial embeddings (Pickle)[cite: 1]
        face_db_path = MODELS_DIR / "face_db.pkl"
        if face_db_path.exists():
            try:
                try:
                    import joblib
                    self.face_db = joblib.load(str(face_db_path))
                except Exception:
                    with open(face_db_path, "rb") as f:
                        self.face_db = pickle.load(f)
                num_entries = len(self.face_db.get("face_db", self.face_db)) if isinstance(self.face_db, dict) else len(self.face_db)
                print(f"[MLPipeline] Successfully loaded face database ({num_entries} gallery identities)[cite: 1].")
                engines_loaded += 1
            except Exception as e:
                print(f"[MLPipeline] Error loading face database: {e}")
        else:
            print(f"[MLPipeline] Warning: Missing face_db.pkl at {face_db_path}. Bootstrapping empty fallback container[cite: 1].")
            self.face_db = {}

        # C2: Serialization - Load Deep Learning Product Graph (.h5 native)[cite: 1]
        model_path = MODELS_DIR / "product_classifier.h5"
        if model_path.exists():
            try:
                # Compile=False cuts model loading times significantly during quick boot presentations
                self.product_classifier = tf.keras.models.load_model(str(model_path), compile=False)
                print("[MLPipeline] Successfully loaded Keras MobileNetV2 deep learning graph (.h5)[cite: 1].")
                engines_loaded += 1
            except Exception as e:
                print(f"[MLPipeline] Error loading product classifier: {e}")
        else:
            print(f"[MLPipeline] Warning: Missing product_classifier.h5 at {model_path}[cite: 1].")

        # C2: Serialization - Load Sklearn/NLP Sentiment Pipeline (Joblib/Pickle)[cite: 1]
        nlp_path = MODELS_DIR / "sentiment_model.pkl"
        if not nlp_path.exists():
            nlp_path = MODELS_DIR / "sentiment_model.joblib"
        if nlp_path.exists():
            try:
                self.sentiment_analyzer = joblib.load(nlp_path)
                print(f"[MLPipeline] Successfully loaded TF-IDF Sentiment Sklearn pipeline ({nlp_path.name})[cite: 1].")
                engines_loaded += 1
            except Exception as e:
                print(f"[MLPipeline] Error loading sentiment pipeline structure: {e}")
        else:
            print(f"[MLPipeline] Warning: Missing sentiment model at {nlp_path}[cite: 1].")

        # C2: Serialization - Load Chatbot Intent Classifier (Joblib)[cite: 1]
        chatbot_path = MODELS_DIR / "chatbot_model.pkl"
        if chatbot_path.exists():
            try:
                self.chatbot_model = joblib.load(chatbot_path)
                print("[MLPipeline] Successfully loaded Chatbot intent classifier (.pkl)[cite: 1].")
                engines_loaded += 1
            except Exception as e:
                print(f"[MLPipeline] Error loading chatbot model matrix: {e}")
        else:
            print(f"[MLPipeline] Warning: Missing chatbot_model.pkl at {chatbot_path}[cite: 1].")

        # Confirm loading health metrics state flags accurately
        self.is_loaded = engines_loaded > 0
        print(f"====== Unified ML Pipeline Settled ({engines_loaded}/4 Subsystems Active) ======")

# Unified Global Singleton Instance
ml_pipeline = MLPipeline()