"""Small, credential-free contract shared by current and future providers."""

from dataclasses import dataclass
from typing import Literal, Protocol, TypedDict


class Message(TypedDict):
    role: Literal["user", "assistant"]
    content: str


@dataclass(frozen=True)
class Completion:
    text: str
    truncated: bool = False


class TextProvider(Protocol):
    def complete(self, *, model: str, max_tokens: int, system: str,
                 messages: list[Message], response_schema: dict | None = None) -> Completion: ...
