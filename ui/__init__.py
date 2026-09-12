"""Interactive view renderers (schematic canvas, 3D board) for CircuitMind."""

import json

__all__ = ["js_json", "THEME_CSS"]


def js_json(value) -> str:
    """Serialise a value for embedding inside an inline <script> block.

    json.dumps escapes quotes and backslashes but NOT "</script>", so model
    output containing that string would close the tag early and the remainder
    would be parsed as HTML. Escaping the angle brackets as \\u-sequences keeps
    the value identical once JS parses it while the HTML parser never sees a tag.
    """
    return (
        json.dumps(value)
        .replace("<", "\\u003c")
        .replace(">", "\\u003e")
        .replace("&", "\\u0026")
    )


# Shared design tokens so the embedded iframes match the main app's styling.
THEME_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
:root{
  --bg:#080b12; --panel:#0e1420; --line:#ffffff1a;
  --ink:#e8eefb; --muted:#93a3bd; --dim:#6f7f99;
  --cyan:#22d3ee; --blue:#4b8bff; --pink:#ff4d97;
  --grad:linear-gradient(115deg,#22d3ee,#4b8bff 46%,#ff4d97);
  --head:'Chakra Petch',system-ui,sans-serif;
  --body:'Inter',system-ui,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;
}
*{box-sizing:border-box}
body{margin:0;background:transparent;color:var(--ink);font-family:var(--body);}
"""
