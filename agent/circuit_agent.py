"""CircuitAgent — the wrapper around Claude that powers CircuitMind."""

from __future__ import annotations
import json
import os
import re
from anthropic import Anthropic
from .prompts import CIRCUIT_SYSTEM_PROMPT, DATASHEET_QA_SYSTEM_PROMPT

DESIGN_MODEL = "claude-haiku-4-5-20251001"
QA_MODEL = "claude-haiku-4-5-20251001"


class InvalidDesignJSON(Exception):
    def __init__(self, message: str, raw_text: str):
        super().__init__(message)
        self.raw_text = raw_text


class CircuitAgent:
    def __init__(self):
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key or api_key.strip() in ("", "your_key_here"):
            raise RuntimeError(
                "ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add "
                "your Anthropic API key."
            )
        self.client = Anthropic(api_key=api_key)

    def generate_design(self, project_description: str) -> dict:
        message = self.client.messages.create(
            model=DESIGN_MODEL,
            max_tokens=4096,
            system=CIRCUIT_SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": "Design this project and return ONLY the JSON object:\n\n"
                           f"{project_description.strip()}",
            }],
        )
        raw_text = "".join(
            block.text for block in message.content if getattr(block, "type", "") == "text"
        ).strip()
        parsed = self._extract_json(raw_text)
        if parsed is None:
            raise InvalidDesignJSON("The model did not return valid JSON.", raw_text=raw_text)
        parsed["_raw_json"] = raw_text
        return parsed

    @staticmethod
    def _extract_json(text: str):
        if not text:
            return None
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
        fenced = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
        if fenced:
            try:
                return json.loads(fenced.group(1))
            except json.JSONDecodeError:
                pass
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except json.JSONDecodeError:
                return None
        return None

    def answer_datasheet_question(self, question: str, context: str, chat_history: list) -> str:
        system_prompt = DATASHEET_QA_SYSTEM_PROMPT.replace(
            "{context}", context or "(no relevant sections were found)"
        )
        messages = []
        for turn in chat_history[-6:]:
            role = turn.get("role")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": question})

        response = self.client.messages.create(
            model=QA_MODEL, max_tokens=1024, system=system_prompt, messages=messages,
        )
        answer = "".join(
            block.text for block in response.content if getattr(block, "type", "") == "text"
        ).strip()
        return answer or "I couldn't generate an answer. Please try rephrasing."
