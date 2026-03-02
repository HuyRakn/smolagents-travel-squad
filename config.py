"""
Central configuration for AI Travel Blogger Squad.
"""

import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN: str = os.environ["HF_TOKEN"]
TAVILY_API_KEY: str = os.environ["TAVILY_API_KEY"]

# google/gemma-2-2b-it is extremely stable on the free serverless tier.
LLM_MODEL_ID: str        = "google/gemma-2-2b-it" 
RESEARCHER_MODEL_ID: str = "google/gemma-2-2b-it"
HF_PROVIDER: str         = None 
ART_DIRECTOR_MODEL_ID: str = "black-forest-labs/FLUX.1-schnell" 

# Optimized steps for speed and token savings.
RESEARCHER_MAX_STEPS: int     = 6
ART_DIRECTOR_MAX_STEPS: int   = 2
EDITOR_MAX_STEPS: int         = 15
EDITOR_PLANNING_INTERVAL: int = None

TAVILY_MAX_RESULTS: int  = 5
TAVILY_SEARCH_DEPTH: str = "advanced"

GRADIO_SERVER_PORT: int = 7860
GRADIO_SHARE: bool      = False
