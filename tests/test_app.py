import os
import json
import unittest
from unittest.mock import patch
from streamlit.testing.v1 import AppTest
from pathlib import Path
from providers.base import Completion


class FakeProvider:
    def complete(self, **kwargs):
        return Completion(json.dumps({
            "components": [{"name": "Resistor", "part_number": "RC0603FR-071KL",
                            "manufacturer": "Yageo", "description": "1 kOhm", "typical_cost_usd": 0.1}],
            "bom": [{"item": "Resistor", "part_number": "RC0603FR-071KL", "qty": 1, "unit_price_usd": 0.1}],
            "schematic_description": {"title": "Test", "elements": [
                {"ref": "BT1", "name": "Battery", "type": "power_source"},
                {"ref": "R1", "name": "Resistor", "type": "resistor", "value": "1 kOhm"}],
                "nets": [{"name": "VDD", "from": "BT1", "to": "R1"}], "connections": ["BT1 -> R1"]},
            "board": {"width_mm": 20, "height_mm": 20, "placements": [
                {"ref": "R1", "kind": "passive", "x_mm": 2, "y_mm": 2, "w_mm": 1.6, "h_mm": 0.8, "z_mm": 0.5}]},
            "power_budget": {"applicable": True, "battery": "Test battery", "cells": [
                {"component": "R1", "sleep_current_ua": 0, "active_current_ma": 3, "duty_cycle_pct": 100}],
                "estimated_battery_life_months": 0.1},
            "build_plan": [{"phase": "Assemble", "steps": ["Fit resistor"], "parts": ["RC0603FR-071KL"],
                            "checkpoint": "Measure resistance before power"}],
            "design_warnings": ["Verify before building."],
        }))


class AppTests(unittest.TestCase):
    def test_starts_without_credentials_and_disables_ai(self):
        with patch.dict(os.environ, {"CHABI_CLIENT_ID":"", "CHABI_REDIRECT_URI":""}):
            app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertTrue(app.button[0].disabled)
            self.assertEqual(len(app.tabs), 7)
            self.assertIn("Sign in with Chabi", app.sidebar.info[0].value)
            self.assertNotIn("Saved design", str(app))
            app.run(timeout=30)
            self.assertEqual(len(app.exception), 0)

    def test_generated_design_renders_and_survives_rerun(self):
        with patch("ui.chabi.mount", return_value=True), patch("providers.chabi.ChabiProvider", return_value=FakeProvider()):
            app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            app.text_area[0].set_value("A temperature sensor")
            app.button[0].click().run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertEqual(app.session_state.design["bom"][0]["qty"], 1)
            app.run(timeout=30)
            self.assertEqual(len(app.exception), 0)
            self.assertEqual(app.session_state.design["design_warnings"], ["Verify before building."])

    def test_sessions_do_not_share_designs(self):
        with patch.dict(os.environ, {"CHABI_CLIENT_ID":"", "CHABI_REDIRECT_URI":""}):
            first = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            first.session_state.design = {"bom": [], "components": []}
            first.run(timeout=30)
            second = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run(timeout=30)
            self.assertIsNone(second.session_state.design)
            self.assertEqual(len(first.exception), 0)
            self.assertEqual(len(second.exception), 0)


if __name__ == "__main__":
    unittest.main()
