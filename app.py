"""
CircuitMind — Streamlit front-end.  Run with:  streamlit run app.py
"""

from __future__ import annotations
import html
import json
import os

import streamlit as st
import streamlit.components.v1 as components
from dotenv import load_dotenv

from agent.circuit_agent import CircuitAgent, InvalidDesignJSON
from agent.bom import format_bom_table, calculate_bom_total
from agent.schematic import generate_schematic
from utils.rag import load_pdf_and_chunk, get_relevant_chunks

load_dotenv()

# Locally the key comes from .env; on Streamlit Community Cloud it arrives in
# st.secrets instead, which does not reliably reach os.environ. Bridge the two
# here so CircuitAgent can stay Streamlit-agnostic and read the environment.
if not os.environ.get("ANTHROPIC_API_KEY"):
    try:
        _secret_key = st.secrets["ANTHROPIC_API_KEY"]
    except Exception:
        _secret_key = None
    if _secret_key:
        os.environ["ANTHROPIC_API_KEY"] = str(_secret_key)

st.set_page_config(
    page_title="CircuitMind",
    page_icon="🔌",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --------------------------------------------------------------------------
# Design system
# --------------------------------------------------------------------------
TRACE_SVG = (
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' "
    "viewBox='0 0 140 140'%3E%3Cg fill='none' stroke='%234b8bff' stroke-width='1' opacity='0.13'%3E"
    "%3Cpath d='M14 0 V46 H58 V92 H104 V140'/%3E%3Cpath d='M0 116 H34 V70 H80 V24 H140'/%3E"
    "%3Cpath d='M126 46 V80 H92'/%3E%3Cpath d='M0 14 H24'/%3E%3C/g%3E"
    "%3Cg fill='%2322d3ee' opacity='0.15'%3E%3Ccircle cx='14' cy='46' r='2.3'/%3E"
    "%3Ccircle cx='58' cy='92' r='2.3'/%3E%3Ccircle cx='34' cy='70' r='2.3'/%3E"
    "%3Ccircle cx='80' cy='24' r='2.3'/%3E%3Ccircle cx='92' cy='80' r='2.3'/%3E%3C/g%3E%3C/svg%3E\")"
)

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    :root{
      --bg:#080b12; --panel:#0e1420; --line:#ffffff1a;
      --ink:#e8eefb; --muted:#93a3bd; --dim:#6f7f99;
      --cyan:#22d3ee; --blue:#4b8bff; --pink:#ff4d97;
      --green:#22c55e; --amber:#f59e0b; --red:#ef4444;
      --grad:linear-gradient(115deg,#22d3ee,#4b8bff 46%,#ff4d97);
      --head:'Chakra Petch',system-ui,sans-serif;
      --body:'Inter',system-ui,sans-serif;
      --mono:'JetBrains Mono',ui-monospace,monospace;
    }

    /* ---------- app shell ---------- */
    .stApp{
      background:
        radial-gradient(1100px 620px at 12% -8%, #12325a4d, transparent 60%),
        radial-gradient(900px 560px at 92% 2%, #ff4d971c, transparent 58%),
        radial-gradient(820px 700px at 50% 108%, #22d3ee12, transparent 60%),
        var(--bg);
    }
    .stApp::before{
      content:""; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.55;
      background-image:PATTERN_URL;
    }
    [data-testid="stHeader"]{background:transparent;}
    .main .block-container{padding-top:2.1rem; padding-bottom:4rem; max-width:1300px;}
    h1,h2,h3,h4,h5{font-family:var(--head) !important; color:var(--ink) !important; letter-spacing:.01em;}
    p,li,label{font-family:var(--body);}
    a{color:#9fdcff;}
    hr{border-color:var(--line) !important;}

    /* ---------- buttons ---------- */
    .stButton > button{
      font-family:var(--head); font-weight:600; font-size:15px; letter-spacing:.01em;
      border-radius:12px; border:1px solid var(--line); background:#ffffff0d; color:var(--ink);
      padding:11px 22px; transition:.2s; backdrop-filter:blur(8px);
    }
    .stButton > button:hover{border-color:var(--cyan); background:#ffffff16; color:var(--ink); transform:translateY(-1px);}
    .stButton > button[kind="primary"], .stButton > button[data-testid="baseButton-primary"]{
      background:var(--grad); color:#04121f; border:none;
      box-shadow:0 10px 34px #22d3ee3d, 0 4px 20px #ff4d9726;
    }
    .stButton > button[kind="primary"]:hover, .stButton > button[data-testid="baseButton-primary"]:hover{
      transform:translateY(-2px); color:#04121f;
      box-shadow:0 16px 48px #22d3ee5c, 0 6px 26px #ff4d9740;
    }
    .stDownloadButton > button{
      font-family:var(--head); font-weight:600; border-radius:11px;
      border:1px solid var(--line); background:#ffffff0d; color:var(--ink);
    }
    .stDownloadButton > button:hover{border-color:var(--cyan); color:var(--ink);}

    /* ---------- inputs ---------- */
    .stTextArea textarea{
      background:#0a101c !important; color:var(--ink) !important;
      border:1px solid var(--line) !important; border-radius:14px !important;
      font-family:var(--body) !important; font-size:15px !important; padding:14px !important; line-height:1.6 !important;
    }
    .stTextArea textarea:focus{border-color:var(--cyan) !important; box-shadow:0 0 0 3px #22d3ee1f !important;}
    .stTextArea textarea::placeholder{color:var(--dim) !important;}
    [data-testid="stChatInput"] textarea{font-family:var(--body) !important;}

    /* ---------- tabs ---------- */
    .stTabs [data-baseweb="tab-list"]{
      gap:5px; background:#0b111ca6; border:1px solid var(--line);
      border-radius:14px; padding:6px; backdrop-filter:blur(10px);
    }
    .stTabs [data-baseweb="tab"]{
      font-family:var(--head); font-weight:600; font-size:13.5px;
      color:var(--muted); border-radius:10px; padding:9px 16px; background:transparent;
    }
    .stTabs [data-baseweb="tab"]:hover{color:var(--ink); background:#ffffff0a;}
    .stTabs [aria-selected="true"]{color:#04121f !important; background:var(--grad);}
    .stTabs [data-baseweb="tab-highlight"], .stTabs [data-baseweb="tab-border"]{display:none;}

    /* ---------- sidebar ---------- */
    [data-testid="stSidebar"]{background:#070b12e8; border-right:1px solid var(--line); backdrop-filter:blur(14px);}
    [data-testid="stSidebar"] .block-container{padding-top:1.7rem;}
    [data-testid="stFileUploader"] section{
      background:#0a101ca8; border:1px dashed #ffffff26; border-radius:14px;
    }
    [data-testid="stFileUploader"] section:hover{border-color:var(--cyan);}
    [data-testid="stFileUploader"] small{color:var(--dim);}

    /* ---------- containers ---------- */
    [data-testid="stExpander"]{
      border:1px solid var(--line) !important; border-radius:14px !important;
      background:#0b111ca1 !important; overflow:hidden;
    }
    [data-testid="stExpander"] summary{font-family:var(--head) !important; font-weight:600; color:var(--ink);}
    [data-testid="stAlert"]{border-radius:12px; border:1px solid var(--line); background:#0d1523d9;}
    [data-testid="stChatMessage"]{background:#0b111ca8; border:1px solid var(--line); border-radius:14px;}
    .stCodeBlock, pre{border-radius:12px !important; border:1px solid var(--line) !important;}
    code, .stCodeBlock code{font-family:var(--mono) !important; font-size:12.5px !important;}

    /* ---------- brand ---------- */
    .cm-brand{display:flex; align-items:center; gap:11px;}
    .cm-spark{width:13px; height:13px; border-radius:3px; background:var(--grad);
      transform:rotate(45deg); box-shadow:0 0 14px #22d3eeaa;}
    .cm-word{font-family:var(--head); font-weight:700; font-size:25px; letter-spacing:.02em; color:var(--ink);}
    .cm-word b{background:var(--grad); -webkit-background-clip:text; background-clip:text;
      color:transparent; font-weight:700;}
    .cm-eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.24em; text-transform:uppercase;
      color:var(--cyan); text-shadow:0 0 18px #22d3ee55;}
    .cm-tagline{color:var(--muted); font-size:13.5px; line-height:1.6; margin-top:7px;}
    .cm-h1{font-family:var(--head); font-size:31px; font-weight:700; color:var(--ink); margin:22px 0 4px;}
    .cm-sub{color:var(--muted); font-size:14.5px; margin-bottom:14px;}

    /* ---------- stat tiles ---------- */
    .cm-stats{display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; margin:4px 0 6px;}
    .cm-stat{position:relative; overflow:hidden; background:#0e1420a8; border:1px solid var(--line);
      border-radius:15px; padding:16px 17px; backdrop-filter:blur(12px); transition:.22s;}
    .cm-stat::after{content:""; position:absolute; inset:0 0 auto 0; height:2px; background:var(--grad); opacity:.85;}
    .cm-stat:hover{transform:translateY(-3px); border-color:#ffffff2e; box-shadow:0 18px 44px #0007;}
    .cm-stat-k{font-family:var(--mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted);}
    .cm-stat-v{font-family:var(--head); font-size:27px; font-weight:700; color:var(--ink); margin-top:7px; line-height:1;}
    .cm-stat-s{font-family:var(--mono); font-size:11px; color:var(--dim); margin-top:7px;}

    /* ---------- component cards ---------- */
    .cm-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(335px,1fr)); gap:13px;}
    .cm-card{background:#0e1420a3; border:1px solid var(--line); border-radius:15px;
      padding:17px 18px; backdrop-filter:blur(12px); transition:.22s;}
    .cm-card:hover{transform:translateY(-3px); border-color:#ffffff2b; box-shadow:0 18px 44px #0006;}
    .cm-card-top{display:flex; align-items:flex-start; justify-content:space-between; gap:10px;}
    .cm-card-name{font-family:var(--head); font-size:16px; font-weight:600; color:var(--ink); line-height:1.3;}
    .cm-chip{font-family:var(--mono); font-size:11px; color:#7fe9d0; background:#0c241f;
      border:1px solid #1f6f5a; border-radius:999px; padding:3px 10px; white-space:nowrap;}
    .cm-mpn{font-family:var(--mono); font-size:11.5px; color:var(--cyan); margin-top:6px;}
    .cm-desc{font-size:13px; line-height:1.62; color:var(--muted); margin:10px 0 12px;}
    .cm-link{font-family:var(--mono); font-size:11.5px; color:#9fdcff; text-decoration:none;
      border-bottom:1px solid #9fdcff33; padding-bottom:1px;}
    .cm-link:hover{color:var(--cyan); border-color:var(--cyan);}

    /* ---------- tables ---------- */
    .cm-tablewrap{background:#0b111ca8; border:1px solid var(--line); border-radius:15px;
      overflow:auto; backdrop-filter:blur(12px);}
    .cm-table{width:100%; border-collapse:collapse; font-size:13px;}
    .cm-table th{font-family:var(--mono); font-size:10px; letter-spacing:.08em; text-transform:uppercase;
      color:var(--muted); text-align:left; padding:12px 14px; border-bottom:1px solid var(--line);
      background:#0d1422; white-space:nowrap;}
    .cm-table td{padding:11px 14px; border-bottom:1px solid #ffffff0f; color:var(--ink); vertical-align:top;}
    .cm-table tbody tr:last-child td{border-bottom:none;}
    .cm-table tbody tr:hover td{background:#ffffff07;}
    .cm-table td.r, .cm-table th.r{text-align:right; white-space:nowrap;}
    .cm-table .mono{font-family:var(--mono); font-size:12px; color:var(--muted);}
    .cm-table tfoot td{padding:13px 14px; font-family:var(--head); font-weight:700; color:var(--ink);
      border-top:1px solid var(--line); background:#0d1422;}

    /* ---------- warnings ---------- */
    .cm-warn{display:flex; gap:12px; align-items:flex-start; background:#0e1420a3;
      border:1px solid var(--line); border-left:3px solid var(--amber);
      border-radius:12px; padding:13px 15px; margin-bottom:9px;}
    .cm-warn.crit{border-left-color:var(--red); background:#190f16a8;}
    .cm-warn-ic{font-size:15px; line-height:1.5;}
    .cm-warn-t{font-size:13.5px; line-height:1.62; color:#d8e3f5;}

    /* ---------- panels / empty states ---------- */
    .cm-panel{background:#0b111ca8; border:1px solid var(--line); border-radius:16px;
      padding:18px; backdrop-filter:blur(12px);}
    .cm-empty{text-align:center; padding:54px 24px; background:#0b111c8f;
      border:1px dashed #ffffff1f; border-radius:16px;}
    .cm-empty-ic{font-size:30px; margin-bottom:10px; opacity:.75;}
    .cm-empty-t{font-family:var(--head); font-size:17px; font-weight:600; color:var(--ink);}
    .cm-empty-s{font-size:13.5px; color:var(--muted); margin-top:8px; line-height:1.6;}
    .cm-sec{font-family:var(--head); font-size:15px; font-weight:700; color:var(--ink);
      margin:24px 0 12px; display:flex; align-items:center; gap:10px;}
    .cm-sec::after{content:""; flex:1; height:1px; background:linear-gradient(90deg,#ffffff1f,transparent);}
    .cm-note{font-family:var(--mono); font-size:11px; color:var(--dim); margin-top:10px; line-height:1.6;}
    .cm-divider{height:1px; background:linear-gradient(90deg,transparent,#ffffff1f,transparent); margin:22px 0;}
    .cm-sidelabel{font-family:var(--mono); font-size:10px; letter-spacing:.16em; text-transform:uppercase;
      color:var(--muted); margin:4px 0 8px;}
    .cm-pill{display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:11px;
      color:#7fe9d0; background:#0c241f; border:1px solid #1f6f5a; border-radius:999px; padding:5px 11px;}
    .cm-pill.off{color:var(--dim); background:#11161f; border-color:#ffffff1a;}
    </style>
    """.replace("PATTERN_URL", TRACE_SVG),
    unsafe_allow_html=True,
)


# --------------------------------------------------------------------------
# Small render helpers
# --------------------------------------------------------------------------
def _esc(value) -> str:
    """HTML-escape any model-supplied value before it goes into markup."""
    return html.escape(str(value if value is not None else ""))


def _num(value):
    """Best-effort float; returns None when the model sent something unusable."""
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(str(value).replace("$", "").replace(",", "").strip())
    except (TypeError, ValueError):
        return None


def stat_tiles(tiles: list) -> str:
    """tiles: list of (label, value, sublabel)."""
    cells = "".join(
        f'<div class="cm-stat"><div class="cm-stat-k">{_esc(k)}</div>'
        f'<div class="cm-stat-v">{_esc(v)}</div>'
        f'<div class="cm-stat-s">{_esc(s)}</div></div>'
        for k, v, s in tiles
    )
    return f'<div class="cm-stats">{cells}</div>'


def empty_state(icon: str, title: str, sub: str) -> str:
    return (
        f'<div class="cm-empty"><div class="cm-empty-ic">{icon}</div>'
        f'<div class="cm-empty-t">{_esc(title)}</div>'
        f'<div class="cm-empty-s">{_esc(sub)}</div></div>'
    )


def section(title: str) -> str:
    return f'<div class="cm-sec">{_esc(title)}</div>'


def component_cards(components: list) -> str:
    cards = []
    for comp in components:
        if not isinstance(comp, dict):
            continue
        name = _esc(comp.get("name") or "Component")
        part = _esc(comp.get("part_number") or "")
        mfr = _esc(comp.get("manufacturer") or "")
        desc = _esc(comp.get("description") or "")
        url = comp.get("datasheet_search_url") or ""
        cost = _num(comp.get("typical_cost_usd"))

        chip = f'<div class="cm-chip">${cost:,.2f}</div>' if cost is not None else ""
        meta = " · ".join(x for x in [part, mfr] if x)
        link = (
            f'<a class="cm-link" href="{_esc(url)}" target="_blank" rel="noopener">Datasheet ↗</a>'
            if url else ""
        )
        cards.append(
            f'<div class="cm-card"><div class="cm-card-top">'
            f'<div class="cm-card-name">{name}</div>{chip}</div>'
            f'<div class="cm-mpn">{meta}</div>'
            f'<p class="cm-desc">{desc}</p>{link}</div>'
        )
    return f'<div class="cm-grid">{"".join(cards)}</div>' if cards else ""


def bom_table(bom_df, grand_total: float) -> str:
    rows = []
    for _, row in bom_df.iterrows():
        link = str(row.get("Digikey Link") or "")
        search = (
            f'<a class="cm-link" href="{_esc(link)}" target="_blank" rel="noopener">Search ↗</a>'
            if link else ""
        )
        rows.append(
            f"<tr><td>{_esc(row.get('Item'))}</td>"
            f"<td class='mono'>{_esc(row.get('Part Number'))}</td>"
            f"<td class='r mono'>{_esc(row.get('Qty'))}</td>"
            f"<td class='r mono'>${_num(row.get('Unit Price ($)')) or 0:,.2f}</td>"
            f"<td class='r mono'>${_num(row.get('Total ($)')) or 0:,.2f}</td>"
            f"<td class='r'>{search}</td></tr>"
        )
    return (
        '<div class="cm-tablewrap"><table class="cm-table"><thead><tr>'
        "<th>Item</th><th>Part number</th><th class='r'>Qty</th>"
        "<th class='r'>Unit</th><th class='r'>Total</th><th class='r'>Source</th>"
        f'</tr></thead><tbody>{"".join(rows)}</tbody>'
        f'<tfoot><tr><td colspan="4">Total</td>'
        f'<td class="r">${grand_total:,.2f}</td><td></td></tr></tfoot>'
        "</table></div>"
    )


def power_table(cells: list) -> str:
    rows = []
    for cell in cells:
        if not isinstance(cell, dict):
            continue
        sleep = _num(cell.get("sleep_current_ua"))
        active = _num(cell.get("active_current_ma"))
        duty = _num(cell.get("duty_cycle_pct"))
        rows.append(
            f"<tr><td>{_esc(cell.get('component'))}</td>"
            f"<td class='r mono'>{f'{sleep:,.1f}' if sleep is not None else '—'}</td>"
            f"<td class='r mono'>{f'{active:,.2f}' if active is not None else '—'}</td>"
            f"<td class='r mono'>{f'{duty:,.2f}' if duty is not None else '—'}</td>"
            f"<td class='mono'>{_esc(cell.get('notes'))}</td></tr>"
        )
    if not rows:
        return ""
    return (
        '<div class="cm-tablewrap"><table class="cm-table"><thead><tr>'
        "<th>Component</th><th class='r'>Sleep (µA)</th><th class='r'>Active (mA)</th>"
        "<th class='r'>Duty (%)</th><th>Notes</th>"
        f'</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
    )


HARD_WORDS = (
    "damage", "brownout", "brown-out", "exceed", "overvoltage", "over-voltage",
    "destroy", "short", "fire", "latch-up", "reverse", "burn",
)


def warning_rows(warnings: list) -> str:
    rows = []
    for warning in warnings:
        text = str(warning)
        critical = any(word in text.lower() for word in HARD_WORDS)
        cls = "cm-warn crit" if critical else "cm-warn"
        icon = "🛑" if critical else "⚠️"
        rows.append(
            f'<div class="{cls}"><div class="cm-warn-ic">{icon}</div>'
            f'<div class="cm-warn-t">{_esc(text)}</div></div>'
        )
    return "".join(rows)


def _copy_button(text: str):
    """Tiny HTML/JS clipboard button (Streamlit has no native clipboard API)."""
    # json.dumps() escapes quotes and backslashes but NOT "</script>", so model
    # output containing that string would close the tag early and the remainder
    # would be parsed as HTML. Escaping the angle brackets as \u-sequences keeps
    # the value identical once JS parses it, while the HTML parser never sees a tag.
    payload = (
        json.dumps(text)
        .replace("<", "\\u003c")
        .replace(">", "\\u003e")
        .replace("&", "\\u0026")
    )
    components.html(
        f"""
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&display=swap');
          #cm-copy{{font-family:'Chakra Petch',sans-serif;padding:7px 14px;border-radius:10px;
            border:none;background:linear-gradient(115deg,#22d3ee,#4b8bff 46%,#ff4d97);
            color:#04121f;cursor:pointer;font-size:13px;font-weight:600;}}
          #cm-copy:hover{{opacity:.9}}
          #cm-copied{{margin-left:9px;color:#22d3ee;font-size:12px;font-family:monospace}}
        </style>
        <button id="cm-copy">Copy JSON</button><span id="cm-copied"></span>
        <script>
            const btn = document.getElementById("cm-copy");
            btn.addEventListener("click", async () => {{
                try {{
                    await navigator.clipboard.writeText({payload});
                    document.getElementById("cm-copied").innerText = "Copied";
                }} catch (e) {{
                    document.getElementById("cm-copied").innerText = "Copy failed";
                }}
            }});
        </script>
        """,
        height=42,
    )


# --------------------------------------------------------------------------
# Agent + session state
# --------------------------------------------------------------------------
@st.cache_resource(show_spinner=False)
def get_agent():
    try:
        return CircuitAgent(), None
    except Exception as exc:
        return None, str(exc)


agent, agent_error = get_agent()

for key, default in (
    ("design", None), ("qa_history", []), ("pdf_chunks", []), ("pdf_name", None),
):
    if key not in st.session_state:
        st.session_state[key] = default


# --------------------------------------------------------------------------
# Sidebar
# --------------------------------------------------------------------------
with st.sidebar:
    st.markdown(
        '<div class="cm-brand"><div class="cm-spark"></div>'
        '<div class="cm-word">Circuit<b>Mind</b></div></div>'
        '<div class="cm-tagline">Your AI electrical engineer — from a plain-English '
        "idea to a BOM, schematic, and power budget.</div>",
        unsafe_allow_html=True,
    )
    st.markdown('<div class="cm-divider"></div>', unsafe_allow_html=True)

    st.markdown('<div class="cm-sidelabel">Datasheet</div>', unsafe_allow_html=True)
    uploaded_pdf = st.file_uploader(
        "Upload a component datasheet (optional)", type=["pdf"],
        label_visibility="collapsed",
        help="Upload a datasheet, then ask questions about it in the Datasheet Q&A tab.",
    )
    if uploaded_pdf is not None and uploaded_pdf.name != st.session_state.pdf_name:
        with st.spinner("Reading datasheet…"):
            try:
                chunks = load_pdf_and_chunk(uploaded_pdf)
            except Exception as exc:
                chunks = []
                st.error(f"Could not read that PDF: {exc}")
        st.session_state.pdf_chunks = chunks
        st.session_state.pdf_name = uploaded_pdf.name
        st.session_state.qa_history = []
        if chunks:
            st.success(f"Loaded {uploaded_pdf.name} ({len(chunks)} chunks).")
        else:
            st.warning("No selectable text found — this may be a scanned/image PDF.")

    if st.session_state.pdf_name:
        st.markdown(
            f'<div class="cm-pill">📄 {_esc(st.session_state.pdf_name)}</div>',
            unsafe_allow_html=True,
        )
    else:
        st.markdown(
            '<div class="cm-pill off">No datasheet loaded</div>', unsafe_allow_html=True
        )

    st.markdown('<div class="cm-divider"></div>', unsafe_allow_html=True)
    st.markdown('<div class="cm-sidelabel">Status</div>', unsafe_allow_html=True)
    if agent_error:
        st.error(agent_error)
    else:
        st.markdown('<div class="cm-pill">◆ Agent ready</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="cm-note">Designs are AI-generated first passes. '
        "Verify every part against its datasheet before building.</div>",
        unsafe_allow_html=True,
    )


# --------------------------------------------------------------------------
# Header + prompt
# --------------------------------------------------------------------------
st.markdown(
    '<div class="cm-eyebrow">Idea → buildable circuit</div>'
    '<div class="cm-h1">Describe your electronics project</div>'
    '<div class="cm-sub">Plain English in. Real part numbers, a costed BOM, a schematic, '
    "and a power budget out.</div>",
    unsafe_allow_html=True,
)

project_description = st.text_area(
    label="Project description", label_visibility="collapsed", height=140,
    placeholder=(
        "I want to build a battery-powered BLE temperature sensor that runs for "
        "6 months on a CR2032 coin cell."
    ),
)
generate_clicked = st.button("⚡  Generate Design", type="primary")

if generate_clicked:
    if agent is None:
        st.error("The agent isn't configured. Add your ANTHROPIC_API_KEY to a .env file and restart.")
    elif not project_description.strip():
        st.warning("Please describe your project first.")
    else:
        with st.spinner("Designing your circuit — selecting parts, sizing power, drawing the schematic…"):
            try:
                st.session_state.design = agent.generate_design(project_description)
            except InvalidDesignJSON as exc:
                st.session_state.design = None
                if getattr(exc, "truncated", False):
                    st.error(
                        "This design got too large for the model to finish in one response, so the "
                        "output was cut off. Try narrowing the scope — describe one subsystem at a "
                        "time (for example the power stage, then the sensor front-end)."
                    )
                else:
                    st.error("The model didn't return valid JSON. Here's the raw output:")
                    st.code(exc.raw_text or "(empty response)", language="text")
            except Exception as exc:
                st.session_state.design = None
                st.error(f"Something went wrong while generating the design: {exc}")

design = st.session_state.design

st.markdown('<div class="cm-divider"></div>', unsafe_allow_html=True)

tab_bom, tab_schem, tab_power, tab_warn, tab_qa = st.tabs(
    ["Components & BOM", "Schematic", "Power Budget", "Design Warnings", "Datasheet Q&A"]
)

# --------------------------------------------------------------------------
# Tab — components & BOM
# --------------------------------------------------------------------------
with tab_bom:
    if not design:
        st.markdown(
            empty_state(
                "🧩", "No design yet",
                "Describe a project above and hit Generate Design to get a costed parts list.",
            ),
            unsafe_allow_html=True,
        )
    else:
        components_list = design.get("components", []) or []
        bom_list = design.get("bom", []) or []
        bom_df = format_bom_table(bom_list)
        grand_total = calculate_bom_total(bom_list)
        line_items = int(bom_df["Qty"].sum()) if not bom_df.empty else 0

        power = design.get("power_budget", {}) or {}
        life = _num(power.get("estimated_battery_life_months")) if power.get("applicable") else None

        st.markdown(
            stat_tiles([
                ("Total BOM", f"${grand_total:,.2f}", f"{len(bom_df)} line items"),
                ("Distinct parts", f"{len(components_list)}", f"{line_items} units total"),
                ("Battery life", f"{life:,.1f} mo" if life is not None else "—",
                 "estimated" if life is not None else "not battery-powered"),
                ("Warnings", f"{len(design.get('design_warnings', []) or [])}",
                 "review before building"),
            ]),
            unsafe_allow_html=True,
        )

        if components_list:
            st.markdown(section("Recommended components"), unsafe_allow_html=True)
            st.markdown(component_cards(components_list), unsafe_allow_html=True)

        if not bom_df.empty:
            st.markdown(section("Bill of materials"), unsafe_allow_html=True)
            st.markdown(bom_table(bom_df, grand_total), unsafe_allow_html=True)
            st.markdown(
                '<div class="cm-note">Prices are the model\'s estimates, not live distributor '
                "quotes — follow the search links to confirm current pricing and stock.</div>",
                unsafe_allow_html=True,
            )

        raw_json = design.get("_raw_json") or json.dumps(
            {k: v for k, v in design.items() if k != "_raw_json"}, indent=2
        )
        with st.expander("View raw agent JSON"):
            _copy_button(raw_json)
            st.code(raw_json, language="json")
            st.download_button(
                "Download JSON", data=raw_json,
                file_name="circuitmind_design.json", mime="application/json",
            )

# --------------------------------------------------------------------------
# Tab — schematic
# --------------------------------------------------------------------------
with tab_schem:
    if not design:
        st.markdown(
            empty_state("📐", "No schematic yet",
                        "Generate a design and the circuit topology gets drawn here."),
            unsafe_allow_html=True,
        )
    else:
        schem_desc = design.get("schematic_description", {}) or {}
        st.markdown(section(schem_desc.get("title") or "Circuit"), unsafe_allow_html=True)
        image = generate_schematic(schem_desc)
        if image is not None:
            st.image(image, use_container_width=True)
            st.markdown(
                '<div class="cm-note">Best-effort topology drawn from the model\'s structured '
                "description. AI-generated — verify against each datasheet before building.</div>",
                unsafe_allow_html=True,
            )
        else:
            st.warning(
                "Couldn't render a schematic from the model's description. The structured "
                "description is shown below instead."
            )

        connections = schem_desc.get("connections") or []
        if connections:
            st.markdown(section("Nets"), unsafe_allow_html=True)
            rows = "".join(
                f'<tr><td class="mono">{_esc(net)}</td></tr>' for net in connections
            )
            st.markdown(
                '<div class="cm-tablewrap"><table class="cm-table">'
                f"<thead><tr><th>Connection</th></tr></thead><tbody>{rows}</tbody></table></div>",
                unsafe_allow_html=True,
            )

        with st.expander("Schematic description (raw)"):
            st.json(schem_desc)

# --------------------------------------------------------------------------
# Tab — power budget
# --------------------------------------------------------------------------
with tab_power:
    if not design:
        st.markdown(
            empty_state("🔋", "No power budget yet",
                        "Generate a battery-powered design to see current draw and runtime."),
            unsafe_allow_html=True,
        )
    else:
        power = design.get("power_budget", {}) or {}
        if not power.get("applicable", False):
            st.markdown(
                empty_state(
                    "🔌", "Not battery-powered",
                    "This design runs from a fixed supply, so there's no runtime budget to show.",
                ),
                unsafe_allow_html=True,
            )
        else:
            life = _num(power.get("estimated_battery_life_months"))
            cells = power.get("cells", []) or []
            st.markdown(
                stat_tiles([
                    ("Battery", power.get("battery") or "—", "source"),
                    ("Estimated life", f"{life:,.1f} mo" if life is not None else "—",
                     "average-current model"),
                    ("Rails budgeted", f"{len(cells)}", "components measured"),
                ]),
                unsafe_allow_html=True,
            )
            table = power_table(cells)
            if table:
                st.markdown(section("Per-component current budget"), unsafe_allow_html=True)
                st.markdown(table, unsafe_allow_html=True)
            st.markdown(
                '<div class="cm-note">First-order estimate (average current vs. capacity). Real '
                "life depends on temperature, self-discharge, and peak-current voltage sag.</div>",
                unsafe_allow_html=True,
            )

# --------------------------------------------------------------------------
# Tab — design warnings
# --------------------------------------------------------------------------
with tab_warn:
    if not design:
        st.markdown(
            empty_state("⚠️", "No warnings yet",
                        "Generate a design to see the engineering review."),
            unsafe_allow_html=True,
        )
    else:
        warnings = design.get("design_warnings", []) or []
        if not warnings:
            st.markdown(
                empty_state(
                    "✅", "Nothing flagged",
                    "No specific warnings came back. Still verify the design against each "
                    "datasheet before building.",
                ),
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                section(f"{len(warnings)} design consideration(s) flagged"),
                unsafe_allow_html=True,
            )
            st.markdown(warning_rows(warnings), unsafe_allow_html=True)

# --------------------------------------------------------------------------
# Tab — datasheet Q&A
# --------------------------------------------------------------------------
with tab_qa:
    if not st.session_state.pdf_chunks:
        st.markdown(
            empty_state(
                "💬", "No datasheet loaded",
                "Upload a datasheet PDF from the sidebar, then ask things like "
                "“What is the maximum supply voltage?”",
            ),
            unsafe_allow_html=True,
        )
    elif agent is None:
        st.error("The agent isn't configured (missing API key), so Q&A is off.")
    else:
        st.markdown(
            section(f"Ask about {st.session_state.pdf_name}"), unsafe_allow_html=True
        )
        for turn in st.session_state.qa_history:
            with st.chat_message(turn["role"]):
                st.markdown(turn["content"])

        user_q = st.chat_input("Ask about the datasheet…")
        if user_q:
            st.session_state.qa_history.append({"role": "user", "content": user_q})
            with st.chat_message("user"):
                st.markdown(user_q)
            with st.chat_message("assistant"):
                with st.spinner("Searching the datasheet…"):
                    context = get_relevant_chunks(user_q, st.session_state.pdf_chunks, top_k=3)
                    try:
                        answer = agent.answer_datasheet_question(
                            user_q, context, st.session_state.qa_history
                        )
                    except Exception as exc:
                        answer = f"Sorry, I hit an error: {exc}"
                st.markdown(answer)
            st.session_state.qa_history.append({"role": "assistant", "content": answer})
