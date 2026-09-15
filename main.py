"""
CreatorFlow AI - Root Entry Point for Cloud Deployment (Render / Railway)
Exposes the FastAPI application as both `app` and runs uvicorn when executed directly.
"""

import os
import sys

# Add both root and backend directory to sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")

for p in [root_dir, backend_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Import the FastAPI app from backend.main
from backend.main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
