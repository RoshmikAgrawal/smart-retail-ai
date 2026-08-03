# Multi-stage containerization Dockerfile for Smart Retail & Customer Intelligence Platform
FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies required for OpenCV, glib, and build utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy dependency specifications first to leverage Docker layer caching
COPY requirements.txt /app/requirements.txt

# Install Python packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Download mandatory NLTK corpora data at image build time
RUN python -c "import nltk; nltk.download('wordnet', quiet=True); nltk.download('punkt', quiet=True)"

# Copy application source code and serialized model artifacts
COPY . /app/

# Expose FastAPI application port
EXPOSE 8000

# Health check instructions for cloud monitoring (Cloud Run, Docker Compose)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Launch production Uvicorn server serving FastAPI gateway
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
