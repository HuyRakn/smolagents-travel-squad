# FantastiCity AI Travel Blog ✈️

> **"AI Travel Blogger Squad"** — A multi-agent system that generates full Vietnamese travel blog posts (research + hero image) from a single prompt, powered by `smolagents` and Gradio.

---

## Architecture

```
User Prompt
    │
    ▼
┌─────────────────────────────────────────────────┐
│  Editor-in-Chief (Orchestrator — CodeAgent)      │
│  • planning_interval=3  • managed_agents=[...]   │
└──────────────┬──────────────────────┬────────────┘
               │                      │
               ▼                      ▼
  ┌────────────────────┐   ┌──────────────────────┐
  │  The Researcher    │   │  The Art Director     │
  │  (CodeAgent)       │   │  (CodeAgent)          │
  │  Tool: Tavily API  │   │  Tool: HF text-to-    │
  │  Real-time search  │   │  image (Stable Diff.) │
  └────────────────────┘   └──────────────────────┘
               │                      │
          Text summary          PIL Image object
               └──────────┬───────────┘
                           ▼
                  Markdown Blog Post
                  (rendered in Gradio)
```

## Project Structure

```
smolagents-travel-squad/
├── agents/
│   ├── researcher.py       # Researcher sub-agent (Tavily search)
│   ├── art_director.py     # Art Director sub-agent (HF text-to-image)
│   └── editor.py           # Editor-in-Chief orchestrator
├── tools/
│   ├── search_tool.py      # TavilySearchTool (smolagents.Tool subclass)
│   └── image_tool.py       # HF Hub image tool loader
├── assets/
│   └── style.css           # Custom Da Nang dark-mode Gradio CSS
├── frontend/               # [NEW] Next.js AetherAI Frontend
├── app.py                  # [NEW] FastAPI backend entry point
├── app_gradio_legacy.py    # [OLD] Legacy Gradio app entry point
├── config.py               # Centralised config & env loading
├── requirements.txt
└── .env.example
```

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API keys

```bash
cp .env.example .env
# Edit .env and fill in your real keys:
#   HF_TOKEN     — https://huggingface.co/settings/tokens
#   TAVILY_API_KEY — https://app.tavily.com
```

### 3. Launch the app

```bash
python app.py
```

Open [http://localhost:7860](http://localhost:7860) in your browser.

---

## Models Used

| Role | Model |
|------|-------|
| Editor-in-Chief (Orchestrator) | `Qwen/Qwen2.5-72B-Instruct` |
| The Researcher | `Qwen/Qwen2.5-Coder-32B-Instruct` |
| Art Director | `Qwen/Qwen2.5-72B-Instruct` |
| Image Generation | `m-ric/text-to-image` (HF Hub tool) |

All models run remotely via **Hugging Face Inference API** — no local GPU required.

---

## Example Prompts

- `"Viết bài blog về Cà Phê Muối đặc sản Đà Nẵng"`
- `"Khám phá Bà Nà Hills và cầu Vàng Đà Nẵng"`
- `"Mì Quảng Đà Nẵng — linh hồn ẩm thực miền Trung"`

---

## Key Concepts Demonstrated

- **`CodeAgent`** — agents that reason by writing and executing Python code
- **`managed_agents`** — hierarchical multi-agent communication pattern
- **`planning_interval`** — periodic self-reflection for the orchestrator
- **`smolagents.Tool`** — custom tool subclassing (Tavily search)
- **`load_tool`** — loading community tools from HF Hub
- **`InferenceClientModel`** — serverless LLM calls via HF Inference API
- **Gradio** dark-mode themed UI with streaming chat