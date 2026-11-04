"""Session-local request bridge. Credentials and SDK calls stay in the browser."""
import uuid
from .base import Completion


class BrowserRequestPending(Exception):
    """The UI must yield to the browser, then resume the same operation."""

    def __init__(self, newly_queued=False):
        self.newly_queued = newly_queued


class ChabiRequestError(Exception):
    pass


class ChabiProvider:
    def __init__(self, state):
        self.state = state

    def complete(self, **request):
        response = self.state.pop("chabi_response", None)
        pending = self.state.get("chabi_request")
        if response and pending and response.get("id") == pending["id"]:
            self.state.pop("chabi_request", None)
            if response.get("error"):
                raise ChabiRequestError(response["error"])
            return Completion(response.get("text", ""), bool(response.get("truncated")))
        if not pending:
            self.state["chabi_request"] = {"id": str(uuid.uuid4()), **request}
        raise BrowserRequestPending(newly_queued=not pending)
