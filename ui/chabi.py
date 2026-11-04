"""Mount the bundled browser-only OAuth/AI component in the sidebar."""
from pathlib import Path
import streamlit as st
import streamlit.components.v2 as components

_component = components.component(
    "chabi_account",
    js=(Path(__file__).resolve().parents[1] / "frontend/dist/chabi.js").read_text(),
    css="button {padding:.6rem 1rem; border:1px solid #22d3ee; border-radius:8px; cursor:pointer; background:#0e1420; color:#e8eefb} p {font:14px system-ui} a {color:#22d3ee}",
)


def mount(settings):
    with st.sidebar:
        result = _component(key="chabi_account", data={
            "client_id": settings.chabi_client_id,
            "redirect_uri": settings.chabi_redirect_uri,
            "request": st.session_state.get("chabi_request"),
            "signed_in": st.session_state.get("chabi_signed_in", False),
        }, default={"signed_in": False},
            on_signed_in_change=lambda: None, on_response_change=lambda: None)
    if result.response and result.response.get("id") == st.session_state.get("chabi_request", {}).get("id"):
        st.session_state.chabi_response = result.response
    signed_in = bool(result.signed_in)
    if st.session_state.get("chabi_signed_in") and not signed_in:
        for key in ("pending_design", "pending_qa", "chabi_request", "chabi_response"):
            st.session_state.pop(key, None)
    st.session_state.chabi_signed_in = signed_in
    return signed_in
