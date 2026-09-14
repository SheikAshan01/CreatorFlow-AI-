"""
Runner script for CreatorFlow AI Python Engine.
Starts the FastAPI server with hot-reload enabled.
"""

import sys
import os

# Ensure backend folder is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    import uvicorn
    print("=" * 60)
    print(">> Launching CreatorFlow AI Python Local Backend Server")
    print(">> Local URL: http://127.0.0.1:8000")
    print(">> API Documentation (Swagger): http://127.0.0.1:8000/docs")
    print(">> Zero External Cloud APIs Used - 100% Local Python Engine")
    print("=" * 60)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
