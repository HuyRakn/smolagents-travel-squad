"""
Tavily Search Tool for smolagents.

Wraps the Tavily REST API to provide clean, agent-optimised web search results
suitable for RAG-style consumption without hallucination.
"""

from smolagents import Tool
from tavily import TavilyClient
from config import TAVILY_API_KEY, TAVILY_MAX_RESULTS, TAVILY_SEARCH_DEPTH


class TavilySearchTool(Tool):
    """
    A smolagents Tool that performs real-time web search via the Tavily API.

    @input  query: Natural-language search query string.
    @output Formatted string of top results (title, URL, snippet), one per line.
    """

    name = "tavily_search"
    description = (
        "Performs a real-time web search using Tavily and returns the most relevant "
        "results as structured text. Use this to look up current information, reviews, "
        "addresses, opening hours, or news about a specific place or topic."
    )
    inputs = {
        "query": {
            "type": "string",
            "description": "The search query to look up on the web.",
        }
    }
    output_type = "string"

    def __init__(self):
        super().__init__()
        self._client = TavilyClient(api_key=TAVILY_API_KEY)

    def forward(self, query: str) -> str:
        """
        @param  query: The search query string.
        @return Formatted multi-line string of search results.
        """
        response = self._client.search(
            query=query,
            search_depth=TAVILY_SEARCH_DEPTH,
            max_results=TAVILY_MAX_RESULTS,
            include_answer=True,
        )

        lines = []

        # Include the synthesised answer when available
        if response.get("answer"):
            lines.append(f"**Summary:** {response['answer']}\n")

        lines.append("**Top Search Results:**")
        for i, result in enumerate(response.get("results", []), start=1):
            lines.append(
                f"\n{i}. [{result['title']}]({result['url']})\n"
                f"   {result.get('content', '').strip()[:400]}"
            )

        return "\n".join(lines)
