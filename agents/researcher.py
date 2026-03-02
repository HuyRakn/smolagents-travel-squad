from smolagents import CodeAgent, InferenceClientModel
from tools.search_tool import TavilySearchTool
from config import HF_TOKEN, RESEARCHER_MODEL_ID, RESEARCHER_MAX_STEPS, HF_PROVIDER

_RESEARCHER_DESCRIPTION = """
You are **The Researcher**.
Task: Find facts about a topic in Vietnam.

**IRONCLAD RULES:**
1. **ONLY CALL** `tavily_search` (alias: `google_search`, `web_search`). 
2. **NEVER** use `requests`, `bs4`, or `BeautifulSoup`.
3. You must output a code block `<code>...</code>` to search.
4. **LAST STEP**: Call `final_answer` with a summary of the facts found.

**EXAMPLE:**
Thought: I need the address.
<code>
result = tavily_search(query="Ca Phe Muoi Da Nang address")
print(result)
</code>
"""


def build_researcher_agent() -> CodeAgent:
    """
    Constructs and returns the Researcher CodeAgent.
    """
    model = InferenceClientModel(
        model_id=RESEARCHER_MODEL_ID,
        token=HF_TOKEN,
        provider=HF_PROVIDER,
    )

    # Alias tools to handle LLM hallucinations
    tavily = TavilySearchTool()
    google = TavilySearchTool()
    google.name = "google_search"
    web = TavilySearchTool()
    web.name = "web_search"

    return CodeAgent(
        tools=[tavily, google, web],
        model=model,
        max_steps=RESEARCHER_MAX_STEPS,
        name="researcher_agent",
        description=_RESEARCHER_DESCRIPTION,
    )
