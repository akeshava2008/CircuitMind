import json
import os
from pathlib import Path
import unittest
from unittest.mock import patch
from streamlit.testing.v1 import AppTest
from config import Settings
from providers.chabi import ChabiProvider
from providers.chabi import BrowserRequestPending, ChabiRequestError
from test_app import FakeProvider


class BridgeTests(unittest.TestCase):
    def test_request_roundtrip_and_error_are_consumed_once(self):
        state = {}
        provider = ChabiProvider(state)
        with self.assertRaises(BrowserRequestPending) as first:
            provider.complete(model="claude-sonnet-5-5", messages=[])
        self.assertTrue(first.exception.newly_queued)
        request = state["chabi_request"]
        with self.assertRaises(BrowserRequestPending) as waiting:
            provider.complete(model="claude-sonnet-5-5", messages=[])
        self.assertFalse(waiting.exception.newly_queued)
        self.assertEqual(request, state["chabi_request"])
        state["chabi_response"] = {"id":request["id"], "text":"response", "truncated":True}
        result = provider.complete(model="claude-sonnet-5-5", messages=[])
        self.assertEqual(result.text, "response")
        self.assertTrue(result.truncated)
        self.assertEqual(state, {})
        state.update(chabi_request=request, chabi_response={"id":request["id"], "error":"Add credits"})
        with self.assertRaisesRegex(ChabiRequestError, "Add credits"):
            provider.complete(model="claude-sonnet-5-5", messages=[])
        self.assertEqual(state, {})

    def test_browser_request_resumes_design_and_qa_without_repeating_submission(self):
        import streamlit as st
        # AppTest cannot execute browser JS. Simulate only the component response;
        # keep the real provider bridge, agent, UI and Streamlit rerun behavior.
        def mount(_settings):
            request = st.session_state.get("chabi_request")
            if request:
                text = FakeProvider().complete().text if "response_schema" in request else "Grounded datasheet answer."
                st.session_state.chabi_response = {"id": request["id"], "text": text}
            return True

        with patch("ui.chabi.mount", side_effect=mount):
            app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            app.text_area[0].set_value("A temperature sensor")
            app.button[0].click().run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertEqual(app.session_state.design["bom"][0]["qty"], 1)
            self.assertNotIn("chabi_request", app.session_state)
            app.run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            app.session_state.pdf_chunks = ["Supply voltage 3.3 V"]
            app.session_state.pdf_name = "test.pdf"
            app.run(timeout=30)
            app.chat_input[0].set_value("What is the supply voltage?").run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            history = app.session_state.qa_history
            self.assertEqual([row["role"] for row in history], ["user", "assistant"])
            self.assertEqual(history[-1]["content"], "Grounded datasheet answer.")
            self.assertNotIn("chabi_request", app.session_state)

    def test_waiting_for_browser_keeps_one_request_and_resumes(self):
        with patch("ui.chabi.mount", return_value=True):
            app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            app.text_area[0].set_value("A temperature sensor")
            app.button[0].click().run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            request = app.session_state.chabi_request
            app.run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertEqual(app.session_state.chabi_request["id"], request["id"])
            app.session_state.chabi_response = {"id": request["id"], "text": FakeProvider().complete().text}
            app.run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertEqual(app.session_state.design["bom"][0]["qty"], 1)
            self.assertNotIn("chabi_request", app.session_state)

    def test_sidebar_status_tracks_sign_out_and_sign_in(self):
        from types import SimpleNamespace
        current = {"signed_in": True}
        def component(**_kwargs):
            return SimpleNamespace(signed_in=current["signed_in"], response=None)

        with patch("ui.chabi._component", side_effect=component), patch("ui.chabi.st.rerun") as rerun:
            app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertTrue(any("Agent ready" in item.value for item in app.sidebar.markdown))
            self.assertFalse(app.button[0].disabled)
            app.session_state.chabi_request = {"id": "cancel-on-signout"}
            app.session_state.pending_qa = "A pending question"
            current["signed_in"] = False
            app.run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertFalse(any("Agent ready" in item.value for item in app.sidebar.markdown))
            self.assertEqual(app.sidebar.info[0].value, "Sign in with Chabi to use AI features.")
            self.assertTrue(app.button[0].disabled)
            self.assertNotIn("chabi_request", app.session_state)
            self.assertNotIn("pending_qa", app.session_state)
            rerun.assert_not_called()  # Preserve the component event; no second server rerun.
            current["signed_in"] = True
            app.run(timeout=30)
            self.assertTrue(any("Agent ready" in item.value for item in app.sidebar.markdown))
            self.assertFalse(app.button[0].disabled)

    def test_unconfigured_chabi_starts_signed_out(self):
        with patch.dict(os.environ, {"CHABI_CLIENT_ID":"", "CHABI_REDIRECT_URI":""}):
            app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertTrue(app.button[0].disabled)
            self.assertIn("Sign in with Chabi", app.sidebar.info[0].value)
