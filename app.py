"""
FastAPI Backend for AetherAI Travel Squad.
Provides a scalable streaming API for the frontend.
"""

import json
import logging
from typing import Generator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

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

logger.info("Booting agent hierarchy...")
editor_agent = build_editor_agent()
logger.info("All agents online.")


@app.post("/api/chat")
async def chat_endpoint(request: Request):
    """
    Main endpoint for agent interaction.
    Accepts a 'message' and streams thoughts + final markdown blog post via SSE.

    @param request: The incoming FastAPI HTTP request.
    @return: A StreamingResponse yielding server-sent events.
    """
    data = await request.json()
    message = data.get("message", "")
    if not message:
        return {"error": "Message is required"}

    def event_generator() -> Generator[str, None, None]:
        last_good_content = None
        try:
            # Native stream from smolagents without requiring Gradio module
            for event in editor_agent.run(message, stream=True):
                event_type = type(event).__name__
                content = None
                
                if hasattr(event, "content"):
                    content = event.content
                elif hasattr(event, "thought") and event.thought:
                    content = event.thought
                elif hasattr(event, "answer"):
                    content = event.answer
                elif hasattr(event, "text"):
                    content = event.text
                elif isinstance(event, dict):
                    content = event.get("content") or event.get("thought") or event.get("answer") or event.get("text")
                
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
    """
    Health check endpoint for monitoring purposes.
    
    @return: A dictionary indicating server status.
    """
    return {"status": "ok", "agents": "online"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
