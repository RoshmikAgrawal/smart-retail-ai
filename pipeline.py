"""
Module C1: Unified ML Pipeline Wrapper
Provides a single pipeline.py entrypoint that loads all models at startup.
"""
from app.core.pipeline import MLPipeline, ml_pipeline

__all__ = ["MLPipeline", "ml_pipeline"]

if __name__ == "__main__":
    print("[Pipeline CLI Test] Testing unified model loader...")
    ml_pipeline.load_models()
    print(f"Pipeline loaded state: {ml_pipeline.is_loaded}")
