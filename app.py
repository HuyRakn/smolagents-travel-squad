"""
FastAPI Backend for AetherAI Travel Squad.
Replaces legacy Gradio app.py with a scalable streaming API for Next.js.
"""

import json
import logging
import uuid
from pathlib import Path
from typing import Generator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
from smolagents import stream_to_gradio

from agents.editor import build_editor_agent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AetherAI Travel Squad Backend")

# Enable CORS for Next.js development (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Persistent storage for generated images
IMAGE_DIR = Path("static/images")
IMAGE_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

print("Booting agent hierarchy...")
editor_agent = build_editor_agent()
print("All agents online.")


def _persist_image(img: Image.Image) -> str:
    """Saves PIL Image to static/images and returns the public URL path."""
    filename = f"{uuid.uuid4()}.png"
    filepath = IMAGE_DIR / filename
    img.save(filepath)
    return f"/static/images/{filename}"


@app.post("/api/chat")
async def chat_endpoint(request: Request):
    """
    Main endpoint for agent interaction.
    Accepts a 'message' and streams thoughts + final blog post via SSE.
    """
    data = await request.json()
    message = data.get("message", "")
    if not message:
        return {"error": "Message is required"}

    def event_generator() -> Generator[str, None, None]:
        last_good_content = None
        try:
            # stream_to_gradio yields AgentEvent objects
            for event in stream_to_gradio(editor_agent, task=message, reset_agent_memory=False):
                event_type = type(event).__name__
                content = None
                
                # Robust extraction across different event objects
                if hasattr(event, "content"):
                    content = event.content
                elif hasattr(event, "answer"):
                    content = event.answer
                elif hasattr(event, "text"):
                    content = event.text
                elif isinstance(event, dict):
                    content = event.get("content") or event.get("answer") or event.get("text")
                
                if isinstance(content, Image.Image):
                    image_url = _persist_image(content)
                    yield f"data: {json.dumps({'type': 'image', 'url': image_url})}\n\n"
                    continue

                if content is None:
                    continue

                content_str = str(content).strip()
                if not content_str:
                    continue

                # Buffer long outputs as a safety net
                if len(content_str) > 500:
                    last_good_content = content_str

                # HEURISTIC: smolagents uses FinalAnswerAction or similar for the end
                is_final_event = ("Final" in event_type) or (getattr(event, "tool_name", "") == "final_answer")
                
                # Check if it's a long markdown (the final blog)
                is_long_markdown = content_str.startswith("# ") and len(content_str) > 400
                
                msg_type = "final" if (is_final_event or is_long_markdown) else "thought"
                
                # Log for debugging
                logger.info(f"Stream Event: {event_type} | Type: {msg_type} | Length: {len(content_str)}")
                
                yield f"data: {json.dumps({'type': msg_type, 'content': content_str})}\n\n"
                
                if is_final_event:
                    # Clear buffer once finalized
                    last_good_content = None
                    break
                    
            # FAIL-SAFE: If the stream ends but we have a large buffer, send it as final
            if last_good_content:
                logger.info("Stream ended without final event, but buffer found. Sending buffer as final.")
                yield f"data: {json.dumps({'type': 'final', 'content': last_good_content})}\n\n"

        except StopIteration:
            logger.info("Agent stream finished (StopIteration)")
            if last_good_content:
                yield f"data: {json.dumps({'type': 'final', 'content': last_good_content})}\n\n"
        except Exception as e:
            logger.error(f"Error in agent stream: {e}", exc_info=True)
            yield f"data: {json.dumps({'type': 'error', 'content': f'Backend Error: {str(e)}'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/health")
def health_check():
    return {"status": "ok", "agents": "online"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
