"""
CircuitMind — Streamlit front-end.  Run with:  streamlit run app.py
"""

from __future__ import annotations
import html
import json

import streamlit as st
import streamlit.components.v1 as components
from dotenv import load_dotenv

from agent.circuit_agent import CircuitAgent, InvalidDesignJSON
from agent.bom import format_bom_table, calculate_bom_total
from agent.schematic import generate_schematic
from utils.rag import load_pdf_and_chunk, get_relevant_chunks

load_dotenv()

st.set_page_config(page_title="CircuitMind", page_icon="🔌", layout="wide")
st.markdown(
    """
    <style>
      .block-container { padding-top: 2rem; }
      div[data-testid="stMetric"] {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 12px 16px;
      }
      .cm-tagline { color: #9aa0a6; font-size: 0.9rem; margin-top: -8px; }
    </style>
    """,
    unsafe_allow_html=True,
)


def _copy_button(text: str):
    """Tiny HTML/JS clipboard button (Streamlit has no native clipboard API)."""
    payload = json.dumps(text)
    components.html(
        f"""
        <button id="cm-copy"
            style="padding:6px 12px;border-radius:8px;border:1px solid #444;
                   background:#1f6feb;color:white;cursor:pointer;font-size:13px;">
            📋 Copy JSON
        </button>
        <span id="cm-copied" style="margin-left:8px;color:#3fb950;font-size:13px;"></span>
        <script>
            const btn = document.getElementById("cm-copy");
            btn.addEventListener("click", async () => {{
                try {{
                    await navigator.clipboard.writeText({payload});
                    document.getElementById("cm-copied").innerText = "Copied!";
                }} catch (e) {{
                    document.getElementById("cm-copied").innerText = "Copy failed";
                }}
            }});
        </script>
        """,
        height=44,
    )


@st.cache_resource(show_spinner=False)
def get_agent():
    try:
        return CircuitAgent(), None
    except Exception as exc:
        return None, str(exc)


agent, agent_error = get_agent()

if "design" not in st.session_state:
    st.session_state.design = None
if "qa_history" not in st.session_state:
    st.session_state.qa_history = []
if "pdf_chunks" not in st.session_state:
    st.session_state.pdf_chunks = []
if "pdf_name" not in st.session_state:
    st.session_state.pdf_name = None

with st.sidebar:
    st.title("🔌 CircuitMind")
    st.markdown(
        '<div class="cm-tagline">Your AI electrical engineer — from idea to BOM, '
        "schematic, and power budget.</div>",
        unsafe_allow_html=True,
    )
    st.divider()
    uploaded_pdf = st.file_uploader(
        "Upload a component datasheet (optional)", type=["pdf"],
        help="Upload a datasheet, then ask questions about it in the 'Datasheet Q&A' tab.",
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
            st.success(f"Loaded '{uploaded_pdf.name}' ({len(chunks)} chunks).")
        else:
            st.warning("No selectable text found — this may be a scanned/image PDF.")
    if st.session_state.pdf_name:
        st.caption(f"📄 Active datasheet: **{st.session_state.pdf_name}**")
    st.divider()
    if agent_error:
        st.error(agent_error)

st.header("Describe your electronics project")
project_description = st.text_area(
    label="Project description", label_visibility="collapsed", height=140,
    placeholder=("I want to build a battery-powered BLE temperature sensor that runs for "
                 "6 months on a CR2032 coin cell."),
)
generate_clicked = st.button("⚡ Generate Design", type="primary")

if generate_clicked:
    if agent is None:
        st.error("The agent isn't configured. Add your ANTHROPIC_API_KEY to a .env file and restart.")
    elif not project_description.strip():
        st.warning("Please describe your project first.")
    else:
        with st.spinner("Designing your circuit… (recommending parts, sizing power, drawing schematic)"):
            try:
                st.session_state.design = agent.generate_design(project_description)
            except InvalidDesignJSON as exc:
                st.session_state.design = None
                st.error("The model didn't return valid JSON. Here's the raw output:")
                st.code(exc.raw_text or "(empty response)", language="text")
            except Exception as exc:
                st.session_state.design = None
                st.error(f"Something went wrong while generating the design: {exc}")

design = st.session_state.design
tab_bom, tab_schem, tab_power, tab_warn, tab_qa = st.tabs(
    ["🧩 Components & BOM", "📐 Schematic", "🔋 Power Budget", "⚠️ Design Warnings", "💬 Datasheet Q&A"]
)

with tab_bom:
    if not design:
        st.info("Describe a project above and click **Generate Design** to begin.")
    else:
        components_list = design.get("components", []) or []
        bom_list = design.get("bom", []) or []
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Total BOM cost", f"${calculate_bom_total(bom_list):,.2f}")
        with col2:
            st.metric("Distinct components", f"{len(components_list)}")

        st.subheader("Recommended components")
        if components_list:
            for comp in components_list:
                if not isinstance(comp, dict):
                    continue
                name = comp.get("name", "Component")
                part = comp.get("part_number", "")
                mfr = comp.get("manufacturer", "")
                desc = comp.get("description", "")
                cost = comp.get("typical_cost_usd", None)
                url = comp.get("datasheet_search_url", "")
                cost_str = f" · ~${float(cost):.2f}" if isinstance(cost, (int, float)) else ""
                st.markdown(f"**{name} — {part}**" if part else f"**{name}**")
                meta = " · ".join(x for x in [mfr, desc] if x)
                st.markdown(
                    f"<span style='color:#9aa0a6'>{html.escape(meta)}{cost_str}</span>",
                    unsafe_allow_html=True,
                )
                if url:
                    st.markdown(f"[🔎 Datasheet]({url})")
                st.markdown("")
        else:
            st.write("No components returned.")

        st.subheader("Bill of Materials")
        bom_df = format_bom_table(bom_list)
        if not bom_df.empty:
            st.dataframe(
                bom_df, use_container_width=True, hide_index=True,
                column_config={
                    "Digikey Link": st.column_config.LinkColumn("Digikey", display_text="Search ↗"),
                    "Unit Price ($)": st.column_config.NumberColumn(format="$%.2f"),
                    "Total ($)": st.column_config.NumberColumn(format="$%.2f"),
                },
            )
        else:
            st.write("No BOM returned.")

        raw_json = design.get("_raw_json") or json.dumps(
            {k: v for k, v in design.items() if k != "_raw_json"}, indent=2
        )
        with st.expander("View raw agent JSON"):
            _copy_button(raw_json)
            st.code(raw_json, language="json")
            st.download_button("⬇️ Download JSON", data=raw_json,
                               file_name="circuitmind_design.json", mime="application/json")

with tab_schem:
    if not design:
        st.info("Generate a design to see its schematic.")
    else:
        st.warning("Schematic is AI-generated — verify before building.")
        schem_desc = design.get("schematic_description", {})
        image = generate_schematic(schem_desc)
        if image is not None:
            st.image(image, caption=schem_desc.get("title", "Circuit"))
        else:
            st.error("Couldn't render a schematic from the model's description. The structured "
                     "description is shown below instead.")
            st.json(schem_desc)
        with st.expander("Schematic description (text)"):
            st.json(schem_desc)

with tab_power:
    if not design:
        st.info("Generate a design to see its power budget.")
    else:
        power = design.get("power_budget", {}) or {}
        if not power.get("applicable", False):
            st.info("This design isn't battery-powered (or the model didn't estimate a power "
                    "budget), so there's nothing to show here.")
        else:
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Battery", power.get("battery") or "—")
            with col2:
                life = power.get("estimated_battery_life_months", None)
                st.metric("Estimated life", f"{life:.1f} months" if isinstance(life, (int, float)) else "—")

            st.subheader("Per-component current budget")
            cells = power.get("cells", []) or []
            if cells:
                import pandas as pd
                rows = []
                for c in cells:
                    if not isinstance(c, dict):
                        continue
                    rows.append({
                        "Component": c.get("component", ""),
                        "Sleep (µA)": c.get("sleep_current_ua", None),
                        "Active (mA)": c.get("active_current_ma", None),
                        "Duty cycle (%)": c.get("duty_cycle_pct", None),
                        "Notes": c.get("notes", ""),
                    })
                st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)
            else:
                st.write("No per-component breakdown was provided.")
            st.caption("Battery-life estimates are first-order (average current vs. capacity). Real "
                       "life depends on temperature, self-discharge, and peak-current voltage sag.")

with tab_warn:
    if not design:
        st.info("Generate a design to see its warnings.")
    else:
        warnings = design.get("design_warnings", []) or []
        if not warnings:
            st.success("No specific warnings were flagged. Still, verify the design against each "
                       "datasheet before building.")
        else:
            st.write(f"**{len(warnings)} design consideration(s) flagged:**")
            HARD_WORDS = ("damage", "brownout", "brown-out", "exceed", "overvoltage", "over-voltage",
                          "destroy", "short", "fire", "latch-up", "reverse", "burn")
            for w in warnings:
                text = str(w)
                if any(word in text.lower() for word in HARD_WORDS):
                    st.error(f"🛑 {text}")
                else:
                    st.warning(f"⚠️ {text}")

with tab_qa:
    st.subheader("Ask questions about your uploaded datasheet")
    if not st.session_state.pdf_chunks:
        st.info("Upload a datasheet PDF from the sidebar to enable Q&A. Then ask things like "
                "*'What is the maximum supply voltage?'*")
    elif agent is None:
        st.error("The agent isn't configured (missing API key), so Q&A is off.")
    else:
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
                        answer = agent.answer_datasheet_question(user_q, context, st.session_state.qa_history)
                    except Exception as exc:
                        answer = f"Sorry, I hit an error: {exc}"
                st.markdown(answer)
            st.session_state.qa_history.append({"role": "assistant", "content": answer})
