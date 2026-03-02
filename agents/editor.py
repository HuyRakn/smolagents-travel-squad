import logging
from smolagents import CodeAgent, OpenAIServerModel
from agents.researcher import build_researcher_agent
from config import (
    GROQ_API_KEY,
    GROQ_API_BASE,
    LLM_MODEL_ID,
    EDITOR_MAX_STEPS,
    EDITOR_PLANNING_INTERVAL,
)

logger = logging.getLogger(__name__)

_EDITOR_SYSTEM_PROMPT = """
You are **The Editor-in-Chief**.
Task: Produce a professional travel blog post in English based on the user's request.

**IRONCLAD RULES:**
1. **WORKFLOW**:
   - Step 1: Call `researcher_agent` to gather facts, addresses, and details about the requested location or topic.
   - Step 2: Call `final_answer` with the FULL Markdown blog post once you have enough information.
2. **Vietnamese names**: Use quotes and retain Vietnamese diacritics (e.g., "Cà Phê Muối").
3. **Markdown ONLY**: Your final output must strictly be formatted in Markdown. Do not include introductory chatter in the `final_answer`.
4. **NO IMAGES**: Do not attempt to add or generate images. Focus entirely on text content.

**EXAMPLE:**
Thought: I need facts about the destination first.
<code>
info = researcher_agent(task="Find facts, addresses, and price range for Ca Phe Muoi in Da Nang")
</code>
Thought: I have the information, now I will write the blog post.
<code>
final_answer(f"# Unique Coffee in Da Nang\\n\\n*Da Nang | Morning | Budget friendly*\\n\\n## Introduction\\n...")
</code>

**Required Markdown Structure for the Blog:**
# [Engaging Title]
*[Location] | [Best time to visit] | [Price range]*

## Introduction
[Brief hook and introduction]

## Highlights
[Key attractions or features]

## The Experience
[Detailed description of what to expect]

## Essential Information
[Addresses, costs, or practical tips]
"""


def build_editor_agent() -> CodeAgent:
    """
    Constructs and returns the Editor CodeAgent.
    This agent orchestrates the blog creation process by utilizing the researcher agent.

    @return: A configured CodeAgent instance for the Editor.
    """
    logger.info("Building Researcher Managed Agent...")
    researcher = build_researcher_agent()

    logger.info("Initializing Editor LLM Model with Groq...")
    model = OpenAIServerModel(
        model_id=LLM_MODEL_ID,
        api_base=GROQ_API_BASE,
        api_key=GROQ_API_KEY,
    )

    logger.info("Creating Editor CodeAgent...")
    return CodeAgent(
        tools=[],
        model=model,
        managed_agents=[researcher],
        max_steps=EDITOR_MAX_STEPS,
        planning_interval=EDITOR_PLANNING_INTERVAL,
        name="editor_agent",
        description="Produces travel blog posts in English using researched facts.",
        instructions=_EDITOR_SYSTEM_PROMPT,
    )
