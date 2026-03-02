"""
Central configuration for the AI Travel Blogger Squad.
Stores API keys, model identifiers, and agent parameters.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Keys
# API Keys
HF_TOKEN: str = os.environ.get("HF_TOKEN", "")
GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "")
TAVILY_API_KEY: str = os.environ["TAVILY_API_KEY"]

# Model Configuration
# Using Groq API with LPU for high-speed robust performance
LLM_MODEL_ID: str = "llama-3.3-70b-versatile"
RESEARCHER_MODEL_ID: str = "llama-3.3-70b-versatile"
GROQ_API_BASE: str = "https://api.groq.com/openai/v1"

# Agent Execution Limits
# Optimized steps for speed and tokenizer efficiency to avoid looping and wasted tokens.
RESEARCHER_MAX_STEPS: int = 4
EDITOR_MAX_STEPS: int = 5
EDITOR_PLANNING_INTERVAL: Optional[int] = None

# Search Tool Configuration
TAVILY_MAX_RESULTS: int = 5
TAVILY_SEARCH_DEPTH: str = "advanced"

# Web Application Settings
GRADIO_SERVER_PORT: int = 7860
GRADIO_SHARE: bool = False
