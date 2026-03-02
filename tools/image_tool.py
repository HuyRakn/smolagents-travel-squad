"""
Image generation tool loader for smolagents.

Loads the Hugging Face Hub text-to-image tool and re-exports it so consumers
do not need to handle trust_remote_code themselves.
"""

from smolagents import load_tool


def load_image_tool():
    """
    Loads and returns the HF Hub text-to-image tool.

    @return A smolagents Tool instance backed by a Stable Diffusion model.
    """
    return load_tool("m-ric/text-to-image", trust_remote_code=True)
