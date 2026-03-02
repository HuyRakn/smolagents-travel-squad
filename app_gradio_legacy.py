"""
FantastiCity AI Travel Blog — Gradio Application.
Single-surface dark UI. stream_to_gradio for live agent thought streaming.
"""

import tempfile
from pathlib import Path

import gradio as gr
from PIL import Image
from smolagents import stream_to_gradio

from agents.editor import build_editor_agent
from config import GRADIO_SERVER_PORT, GRADIO_SHARE

_CSS = (Path(__file__).parent / "assets" / "style.css").read_text(encoding="utf-8")

print("Booting agent hierarchy...")
editor_agent = build_editor_agent()
print("All agents online.")


# ── Helpers ──────────────────────────────────────────────────────────────────

def _persist_image(img: Image.Image) -> str:
    """
    @function   _persist_image
    @param      img   PIL Image from the Art Director agent.
    @return     Markdown image embed pointing to saved temp file.
    """
    f = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    img.save(f.name)
    return f"![Travel photo]({f.name})"


def _to_markdown(raw) -> str:
    """
    @function   _to_markdown
    @param      raw   str, PIL.Image, or any agent output type.
    @return     Clean Markdown string ready for Gradio rendering.
    """
    if isinstance(raw, Image.Image):
        return _persist_image(raw)
    return raw.strip() if isinstance(raw, str) else str(raw)


def msg(role: str, content: str) -> dict:
    """@return Gradio 6.x message dict."""
    return {"role": role, "content": content}


_WELCOME = msg(
    "assistant",
    "Welcome. Enter the name of a destination, dish, or local experience "
    "in Da Nang & Vietnam — the squad will research, illustrate, and write "
    "a complete travel blog post for you."
)


# ── Chat handler ──────────────────────────────────────────────────────────────

def generate_blog(message: str, history: list[dict]):
    """
    @function   generate_blog
    @param      message   User travel topic.
    @param      history   Gradio 6.x message history.
    @yield      Progressive history list via stream_to_gradio.
    """
    if not message.strip():
        yield history
        return

    history = list(history) + [
        msg("user", message),
        msg("assistant", "Gathering information... please wait a moment."),
    ]
    yield history

    thought_lines: list[str] = []
    final_post: str | None = None

    try:
        for event in stream_to_gradio(editor_agent, task=message, reset_agent_memory=False):
            content = getattr(event, "content", None) or (
                event.get("content", "") if isinstance(event, dict) else str(event)
            )
            role = getattr(event, "role", "assistant")

            if role == "assistant" and content:
                is_final = len(content) > 200
                if is_final:
                    final_post = content
                else:
                    thought_lines.append(content)
                    history[-1] = msg("assistant", content.strip()[:300])
                    yield history

    except Exception as exc:  # noqa: BLE001
        final_post = f"An error occurred:\n\n```\n{exc}\n```\n\nCheck `.env` API keys and retry."

    result = _to_markdown(
        final_post
        or ("\n\n".join(thought_lines) if thought_lines else "No output returned. Please retry.")
    )
    history[-1] = msg("assistant", result)
    yield history


# ── Static HTML ───────────────────────────────────────────────────────────────

_WELCOME_HTML = """
<div id="welcome-block">
  <div id="app-logo">FC</div>
  <p id="welcome-greeting">Good to See You.</p>
  <h1 id="welcome-title">How Can I Write<br>Your Travel Story?</h1>
  <p id="welcome-sub">Describe a destination, dish, or experience in Da Nang &amp; Vietnam — the AI squad will research, illustrate, and publish.</p>
</div>
"""

_PROMO_HTML = """
<div id="promo-bar">
  <span>Powered by smolagents &times; Hugging Face Inference</span>
  <span id="active-status">
    <span class="dot-green"></span>Agents active
  </span>
</div>
"""

_INPBAR_HTML = '<div id="inp-plus">+</div><div id="inp-pipe"></div>'

_FOOTER_HTML = """
<div id="app-footer">
  FantastiCity AI Travel Blog &mdash; Da Nang, Vietnam &nbsp;&middot;&nbsp;
  Built with <a href="https://huggingface.co/docs/smolagents" target="_blank">smolagents</a>
</div>
"""

_EXAMPLES = [
    'Write a blog post about "Ca Phe Muoi" in Da Nang',
    'Explore Ba Na Hills and the Golden Bridge, Da Nang',
    '"Mi Quang" — the soul of Central Vietnamese cuisine',
    'Han Market at night — a Da Nang seafood guide',
    'Hoi An Ancient Town lantern festival experience',
]

# Minimal neutral theme — all visual styling handled by custom CSS
_THEME = gr.themes.Soft(
    primary_hue="neutral",
    secondary_hue="neutral",
    neutral_hue="neutral",
    font=[gr.themes.GoogleFont("Inter"), "ui-sans-serif", "system-ui"],
)

# ── Layout ────────────────────────────────────────────────────────────────────
with gr.Blocks(title="FantastiCity AI Travel Blog", elem_id="app-shell") as demo:

    gr.HTML(_WELCOME_HTML)

    chatbot = gr.Chatbot(
        value=[_WELCOME],
        label="",
        show_label=False,
        elem_id="blog-chat",
        height=460,
        render_markdown=True,
        avatar_images=(None, None),
    )

    with gr.Column(elem_id="input-section"):

        gr.HTML(_PROMO_HTML)

        with gr.Row(elem_id="input-bar"):
            gr.HTML(_INPBAR_HTML)
            user_input = gr.Textbox(
                placeholder="Ask anything...",
                lines=1,
                show_label=False,
                elem_id="chat-input",
                autofocus=True,
                scale=10,
            )
            btn_gen = gr.Button("↑", elem_id="btn-generate", scale=0, min_width=34)
            btn_clr = gr.Button("×", elem_id="btn-clear", scale=0, min_width=34)

        with gr.Row(elem_classes=["chips-row"]):
            gr.Examples(
                examples=[[e] for e in _EXAMPLES],
                inputs=[user_input],
                label=None,
                examples_per_page=5,
            )

    gr.HTML(_FOOTER_HTML)

    # ── Events ─────────────────────────────────────────────────────────────────
    def _submit(msg_text, hist):
        yield from generate_blog(msg_text, hist)

    btn_gen.click(_submit, [user_input, chatbot], chatbot).then(lambda: "", outputs=user_input)
    user_input.submit(_submit, [user_input, chatbot], chatbot).then(lambda: "", outputs=user_input)
    btn_clr.click(lambda: ([_WELCOME], ""), outputs=[chatbot, user_input])


# ── Launch ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=GRADIO_SERVER_PORT,
        share=GRADIO_SHARE,
        show_error=True,
        ssr_mode=False,
        theme=_THEME,
        css=_CSS,
        app_kwargs={"timeout_keep_alive": 600},
    )
