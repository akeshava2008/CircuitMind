import json
import unittest
from config import Settings
from providers.base import Completion
from agent.circuit_agent import CircuitAgent, InvalidDesignJSON
from agent.design import validate_design


class FakeProvider:
    def __init__(self, text, truncated=False):
        self.result = Completion(text, truncated)
        self.calls = []

    def complete(self, **kwargs):
        self.calls.append(kwargs)
        return self.result


class AgentTests(unittest.TestCase):
    def test_design_uses_injected_transport_and_model(self):
        provider = FakeProvider('```json\n{"components": [], "bom": []}\n```')
        agent = CircuitAgent(provider, Settings(design_model="chosen-model"))
        self.assertEqual(agent.generate_design(" a sensor ")["bom"], [])
        call = provider.calls[0]
        self.assertEqual(call["model"], "chosen-model")
        self.assertTrue(call["messages"][0]["content"].endswith("a sensor"))
        self.assertEqual(call["max_tokens"], 16000)

    def test_compact_structured_envelope_is_unwrapped_and_validated(self):
        design = {"components": [], "bom": [], "board": {"placements": []}}
        provider = FakeProvider(json.dumps({"design_json": json.dumps(design)}))
        result = CircuitAgent(provider).generate_design("sensor")
        self.assertEqual(json.loads(result["_raw_json"]), design)
        self.assertEqual(result["board"], design["board"])
        schema = provider.calls[0]["response_schema"]
        self.assertEqual(schema["required"], ["design_json"])
        self.assertEqual(schema["properties"]["design_json"]["type"], "string")
        self.assertIn("COMPLETE", provider.calls[0]["system"])
        for invalid in (123, "not JSON", json.dumps({"bom": "wrong"}), "[]"):
            with self.subTest(invalid=invalid), self.assertRaises(InvalidDesignJSON):
                CircuitAgent(FakeProvider(json.dumps({"design_json": invalid}))).generate_design("sensor")

    def test_truncation_is_distinguished_from_invalid_json(self):
        with self.assertRaises(InvalidDesignJSON) as caught:
            CircuitAgent(FakeProvider('{"bom":', truncated=True)).generate_design("sensor")
        self.assertTrue(caught.exception.truncated)

    def test_non_design_json_is_rejected(self):
        for value in ([], 123, "hello", {"components": "wrong"}, {"bom": [], "board": []}):
            with self.subTest(value=value), self.assertRaises(InvalidDesignJSON):
                CircuitAgent(FakeProvider(json.dumps(value))).generate_design("sensor")

    def test_qa_preserves_history_and_grounds_context(self):
        provider = FakeProvider("3.3 V")
        agent = CircuitAgent(provider)
        answer = agent.answer_datasheet_question(
            "Supply?", "VDD: 3.3 V", [{"role": "user", "content": "Hi"},
                                      {"role": "assistant", "content": "Hello"}],
        )
        self.assertEqual(answer, "3.3 V")
        call = provider.calls[0]
        self.assertIn("VDD: 3.3 V", call["system"])
        self.assertEqual([m["content"] for m in call["messages"]], ["Hi", "Hello", "Supply?"])

    def test_design_rejects_invalid_nested_containers(self):
        for extra in ({"build_plan": [{"steps": "wrong"}]},
                      {"schematic_description": {"elements": ["bad"]}},
                      {"design_warnings": {}}):
            with self.subTest(extra=extra), self.assertRaises(ValueError):
                validate_design({"bom": [], **extra})


class ConfigTests(unittest.TestCase):
    def test_public_configuration_uses_environment_over_host_secrets(self):
        settings = Settings.from_sources({"CHABI_CLIENT_ID":"env-client"},
            {"CHABI_CLIENT_ID":"host-client", "CHABI_REDIRECT_URI":"https://app.example/"})
        self.assertEqual(settings.chabi_client_id,"env-client")
        self.assertEqual(settings.chabi_redirect_uri,"https://app.example/")
        self.assertEqual(settings.design_model,"claude-sonnet-5-5")
        self.assertEqual(settings.qa_model,"claude-haiku-5-5")
