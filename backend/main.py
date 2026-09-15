"""
CreatorFlow AI - Dedicated Python NLP & AI Backend Server
Built with FastAPI. Runs locally without external paid/cloud AI models.
"""

import sys
import os

# Ensure local backend modules can be imported regardless of execution directory
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

from nlp_engine import generate_python_blog, generate_python_social
from seo_engine import analyze_python_seo
from keywords_engine import generate_python_keywords


app = FastAPI(
    title="CreatorFlow AI Python Engine",
    description="Native Python NLP & Content Generation API (Self-hosted, Zero External APIs)",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request Models
class BlogRequest(BaseModel):
    topic: str = Field(..., description="Main topic or title")
    keywords: Optional[str] = Field("", description="Comma-separated target keywords")
    tone: Optional[str] = Field("Informative", description="Tone of voice")
    length: Optional[str] = Field("medium", description="Length: short, medium, long")
    audience: Optional[str] = Field("Business Owners & Creators", description="Target audience")
    api_key: Optional[str] = Field("", description="Optional API key for Gemini/Groq/OpenAI")
    provider: Optional[str] = Field("local", description="AI Provider (gemini, groq, openai, local)")
    model: Optional[str] = Field("", description="Model name")


class SocialRequest(BaseModel):
    topic: str = Field(..., description="Post topic or subject")
    platforms: Optional[List[str]] = Field(default=["linkedin", "twitter"], description="Target platforms")
    tone: Optional[str] = Field("Professional", description="Tone of voice")
    count: Optional[int] = Field(3, description="Number of variations per platform")
    api_key: Optional[str] = Field("", description="Optional API key for Gemini/Groq/OpenAI")
    provider: Optional[str] = Field("local", description="AI Provider (gemini, groq, openai, local)")
    model: Optional[str] = Field("", description="Model name")


class SeoRequest(BaseModel):
    content: str = Field(..., description="Article or copy content to analyze")
    target_keyword: Optional[str] = Field("", description="Target search keyword")
    meta_description: Optional[str] = Field("", description="Meta description text")


class KeywordsRequest(BaseModel):
    topic: str = Field(..., description="Seed topic or niche")
    intent: Optional[str] = Field("informational", description="informational or transactional")


@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    """Returns backend status and loaded AI engine information."""
    return {
        "status": "online",
        "message": "CreatorFlow AI Backend is running successfully",
        "engine": "CreatorFlow Hybrid AI & NLP Engine",
        "version": "1.1.0",
        "real_ai_supported": True,
        "providers": ["gemini", "groq", "openai", "local"]
    }



@app.post("/api/blog")
def generate_blog_endpoint(req: BlogRequest):
    """Generates an SEO-optimized blog post with metadata."""
    try:
        result = generate_python_blog(
            topic=req.topic,
            keywords_str=req.keywords or "",
            tone=req.tone or "Informative",
            length=req.length or "medium",
            audience=req.audience or "Business Owners & Creators",
            api_key=req.api_key or "",
            provider=req.provider or "local",
            model=req.model or ""
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/social")
def generate_social_endpoint(req: SocialRequest):
    """Generates platform-compliant social captions."""
    try:
        result = generate_python_social(
            topic=req.topic,
            platforms=req.platforms or ["linkedin", "twitter"],
            tone=req.tone or "Professional",
            count=req.count or 3,
            api_key=req.api_key or "",
            provider=req.provider or "local",
            model=req.model or ""
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/seo")
def analyze_seo_endpoint(req: SeoRequest):
    """Audits content for SEO readability, keyword density, and structural signals."""
    try:
        result = analyze_python_seo(
            content=req.content,
            target_keyword=req.target_keyword or "",
            meta_description=req.meta_description or ""
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/keywords")
def generate_keywords_endpoint(req: KeywordsRequest):
    """Extracts keywords, metrics, and tiered hashtag buckets."""
    try:
        result = generate_python_keywords(
            topic=req.topic,
            intent=req.intent or "informational"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
