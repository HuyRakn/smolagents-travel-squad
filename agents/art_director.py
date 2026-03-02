"""
The Art Director Agent.

A CodeAgent specialised in visual storytelling. It takes a text summary,
crafts a vivid English image prompt, and returns a PIL Image object
representing the hero image for the blog post.
"""

from smolagents import CodeAgent, InferenceClientModel
from tools.image_tool import load_image_tool
from tools.persist_tool import load_persist_tool
from config import HF_TOKEN, LLM_MODEL_ID, ART_DIRECTOR_MAX_STEPS, HF_PROVIDER

_ART_DIRECTOR_DESCRIPTION = """
You are **The Art Director** — a visual expert.
Your task: Create a cinematic hero image for a travel blog and return its URL.

**Workflow:**
1. Craft a 60-100 word English prompt describing a beautiful, photorealistic scene. Include lighting (golden hour), mood, and Vietnamese aesthetic.
2. Call `text_to_image` tool with your prompt to get a PIL Image.
3. Call `save_and_get_image_url` with that PIL Image to get a URL string.
4. Use `final_answer` to return the URL string. 

**STRICT RULES:**
- RETURN ONLY THE URL STRING (e.g., "/static/images/...") IN `final_answer`. 
- DO NOT use the "Task outcome" template. Just return the URL.
"""


def build_art_director_agent() -> CodeAgent:
    """
    Constructs and returns the Art Director CodeAgent.

    @return A configured CodeAgent instance with text-to-image capability.
    """
    model = InferenceClientModel(
        model_id=LLM_MODEL_ID,
        token=HF_TOKEN,
        provider=HF_PROVIDER,
    )

    return CodeAgent(
        tools=[load_image_tool(), load_persist_tool()],
        model=model,
        max_steps=ART_DIRECTOR_MAX_STEPS,
        name="art_director_agent",
        description=_ART_DIRECTOR_DESCRIPTION,
    )
