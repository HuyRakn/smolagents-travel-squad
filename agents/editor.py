from smolagents import CodeAgent, InferenceClientModel
from agents.researcher import build_researcher_agent
from agents.art_director import build_art_director_agent
from config import HF_TOKEN, LLM_MODEL_ID, EDITOR_MAX_STEPS, EDITOR_PLANNING_INTERVAL, HF_PROVIDER

_EDITOR_SYSTEM_PROMPT = """
You are **The Editor-in-Chief**. 
Task: Produce a professional travel blog post in English.

**IRONCLAD RULES:**
1. **WORKFLOW**: 
   Step 1: Call `researcher_agent` for all facts.
   Step 2: Call `art_director_agent` for a hero image URL.
   Step 3: Call `final_answer` with the FULL Markdown post.
2. **Vietnamese names**: Use quotes and diacritics: "Cà Phê Muối".
3. **Markdown ONLY**: No talk, only markdown in `final_answer`.

**EXAMPLE:**
Thought: I'll start by getting facts.
<code>
info = researcher_agent(task="Facts about Ca Phe Muoi in Da Nang")
img = art_director_agent(task="Cinematic photo of a Vietnamese cafe")
final_answer(f"# Unique Coffee in Da Nang\\n![Hero]({img})\\n{info}")
</code>

**Markdown Structure:**
# [Title]
*[Location] | [Best time to visit] | [Price range]*
![Hero image]([URL])
## Introduction
## Highlights
## The Experience
## Essential Information
## Sources
"""


def build_editor_agent() -> CodeAgent:
    """
    Constructs and returns the Editor CodeAgent.
    """
    researcher = build_researcher_agent()
    art_director = build_art_director_agent()

    model = InferenceClientModel(
        model_id=LLM_MODEL_ID,
        token=HF_TOKEN,
        provider=HF_PROVIDER,
    )

    return CodeAgent(
        tools=[],
        model=model,
        managed_agents=[researcher, art_director],
        max_steps=EDITOR_MAX_STEPS,
        planning_interval=EDITOR_PLANNING_INTERVAL,
        name="editor_agent",
        description="Produces travel blog posts in English.",
        instructions=_EDITOR_SYSTEM_PROMPT,
    )
