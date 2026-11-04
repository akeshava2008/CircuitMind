"""Public Chabi configuration, read at runtime from environment or host secrets."""
from dataclasses import dataclass
from typing import Mapping


@dataclass(frozen=True)
class Settings:
    chabi_client_id: str = ""
    chabi_redirect_uri: str = ""
    design_model: str = "claude-sonnet-5-5"
    qa_model: str = "claude-haiku-5-5"

    @classmethod
    def from_sources(cls, environ: Mapping, secrets: Mapping | None = None):
        secrets = secrets or {}
        def value(name, default=""):
            return str(environ.get(name, secrets.get(name, default))).strip()
        return cls(
            chabi_client_id=value("CHABI_CLIENT_ID"),
            chabi_redirect_uri=value("CHABI_REDIRECT_URI"),
            design_model=value("CIRCUITMIND_DESIGN_MODEL", cls.design_model),
            qa_model=value("CIRCUITMIND_QA_MODEL", cls.qa_model),
        )
