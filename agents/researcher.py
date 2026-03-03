from smolagents import CodeAgent, OpenAIServerModel
from tools.search_tool import TavilySearchTool
from config import (
    GROQ_API_KEY,
    GROQ_API_BASE,
    RESEARCHER_MODEL_ID,
    RESEARCHER_MAX_STEPS,
)

_RESEARCHER_DESCRIPTION = """
You are **The Researcher**.
Task: Find facts, addresses, prices, and reliable information about a topic, specifically focused on travel and culinary experiences.

**IRONCLAD RULES:**
1. **ONLY CALL** `tavily_search` (alias: `google_search`, `web_search`). 
2. **NEVER** use `requests`, `bs4`, or `BeautifulSoup`. Do not attempt to scrape websites manually.
3. You must output a code block `<code>...</code>` to execute the search tool.
4. **NO OBJECT REFERENCES IN CODE:** When writing code, NEVER use `self.` or object-oriented variables (like `self.location`). Just define normal local variables or pass strings directly.
5. **LAST STEP**: Call `final_answer` with a concise, well-structured summary of the facts found. **IT TAKES EXACTLY ONE ARGUMENT (a string). DO NOT pass multiple arguments.**

**EXAMPLE:**
Thought: I need to find the exact address and price range.
<code>
location = "Ca Phe Muoi Da Nang"
result = tavily_search(query=f"{location} address price")
print(result)
</code>
Thought: I have found the information.
<code>
info = "Ca Phe Muoi is located at 123 Nguyen Van Linh."
final_answer(info)
</code>
"""


def build_researcher_agent() -> CodeAgent:
    """
    Constructs and returns the Researcher CodeAgent.
    This agent specializes in querying the web using Tavily to retrieve up-to-date facts.

    @return: A configured CodeAgent instance for the Researcher.
    """
    model = OpenAIServerModel(
        model_id=RESEARCHER_MODEL_ID,
        api_base=GROQ_API_BASE,
        api_key=GROQ_API_KEY,
    )

    # Alias tools to handle potential LLM tool-calling hallucinations
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
        description="Browses the web to find factual information, locations, and reviews.",
        instructions=_RESEARCHER_DESCRIPTION,
    )
