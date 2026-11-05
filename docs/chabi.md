# Sign in with Chabi

This integration starts from CircuitMind main (`a6ccba0`) and retains its screens.
The sidebar adds Chabi sign-in/sign-out, account name and remaining credits.
The design navigation now uses rounded tabs with a subtle cyan selected state,
keyboard focus styling and automatic wrapping when space is limited.

## Configure and deploy

1. In <https://chabi.dev/developers/portal>, create/select this app and copy its
   public client ID. No client secret or owner Anthropic API key is needed.
2. Register the exact app root URL as a redirect, including trailing slash:
   `http://localhost:8501/` locally and your HTTPS app URL in production, for
   example `https://your-app.streamlit.app/`. Start sign-in on the same origin.
3. Copy `.env.example` to `.env` locally or use host environment variables /
   Streamlit Secrets (see `.streamlit/secrets.toml.example`):

   ```toml
   CHABI_CLIENT_ID = "circuitmind-7955b6"
   CHABI_REDIRECT_URI = "https://circuitmind-kdsdjugs3sroapx4akfy8b.streamlit.app/"
   CIRCUITMIND_DESIGN_MODEL = "claude-sonnet-5-5"
   CIRCUITMIND_QA_MODEL = "claude-haiku-5-5"
   ```

4. Deploy this branch with `app.py` as the entry point, Python 3.12 and
   `requirements.txt`. Include `frontend/dist/chabi.js` in the deployment.
   The host needs no Node build. Remove obsolete `ANTHROPIC_API_KEY` settings.
5. Restart the app after changing environment/Secrets. Public OAuth config is
   passed to the browser at runtime, so these changes need no frontend rebuild.
6. Test with **the app's own Sign in with Chabi button**. The portal's try-sign-in
   button only previews consent and cannot complete this app's flow.

The production registration is `circuitmind-7955b6`, with the exact redirect
`https://circuitmind-kdsdjugs3sroapx4akfy8b.streamlit.app/`. Copy the production
settings above into the live host's Secrets; the example file is not loaded
automatically. The current local `.env` uses a separate registration,
`circuit-mind-22312e`, returning to `http://127.0.0.1:8503/`.

Production OAuth must be verified after the updated source and Secrets are deployed.
Verify acceptance/decline, a callback opened in another tab, sign-out across
open tabs, generation, Q&A, and credit/revocation errors on the final host.
Use HTTPS in production and a browser supporting Web Locks. For a different
local port, update both the portal registration and `CHABI_REDIRECT_URI`.

## Implementation

`frontend/src/auth.js` implements authorization code + PKCE without a secret.
On a sign-in click, the browser opens a top-level tab before asynchronous PKCE
work. This avoids loading Chabi inside Community Cloud's sandboxed app frame,
where Chabi's framing policy blocks the consent page. The new tab has no opener.
If popups are blocked, the app asks the user to allow the sign-in tab and retry.
The callback updates the original app tab through the existing storage event.

Random state and verifier persist in localStorage keyed by state, with a
15-minute lifetime and the redirect URI. Callbacks validate and consume them
once and remove OAuth parameters before exchanging the code. Missing or expired
state is never trusted. Declined consent displays a friendly message.

Tokens and expiry stay in browser localStorage, scoped to the Chabi client ID.
Refresh is proactive and runs once on `401 invalid_token`. Every refresh holds
the origin-wide `chabi-refresh` Web Lock, rereads stored tokens, and saves the
rotated pair before releasing the lock. Late failures from an old access token
use the newer saved token. An ambiguous/failed refresh signs out rather than
risking reuse of a consumed token. Sign-out and callback exchange share this
lock; storage events synchronize other tabs. No unsafe lock fallback exists.

`frontend/src/component.js` runs the official Anthropic SDK in the browser,
using `baseURL: https://chabi.dev`, `dangerouslyAllowBrowser: true`, and the
visitor's current access token. Tokens and verifiers never enter Python.
`providers/chabi.py` bridges session-local request IDs and responses through
`ui/chabi.py`; in-flight browser promises prevent duplicate calls on rerenders.
The globally cached owner-funded agent was replaced with session-local jobs.
No server routes existed solely to hide an API key, and none were deleted.

Design requests use `output_config.format` with the small `agent/schema.py`
envelope (`design_json`), medium effort and a 16,000-token output cap. The complete
design format stays in the engineering prompt. Python unwraps the JSON string,
parses the inner design and validates its container types before display. The
transport grammar deliberately avoids the large nested schema that exceeded the
provider's compilation budget; inner field correctness still depends on the
prompt and local validation, rather than provider grammar enforcement. Q&A uses low effort with 4,096 tokens, allowing room for reasoning.
The defaults are Sonnet for design and Haiku for focused datasheet retrieval.
Unsupported configured models disable AI instead of silently changing models.

Insufficient credits errors explain the maximum-cost hold and link to Chabi's
HTTPS `upgrade_url`. Revocation signs out; rate limits wait `Retry-After` and
retry a bounded number of times. SDK retries are disabled to centralize this
logic. `/v1/me` and `/v1/credits` supply optional account/balance information.
No fixed cost per request is promised.

## Development checks

```sh
python -m unittest discover -s tests -v
cd frontend
npm ci
npm test
npm run build
```

Commit the regenerated `frontend/dist/chabi.js` after changing browser source.
Python hosts load that self-contained bundle. The SDK license is included in
`frontend/THIRD_PARTY_LICENSES.txt`. Tests use fake OAuth/AI responses, including
cross-tab refresh, malformed state, revocation, credit errors, rate limits and
asynchronous Streamlit design/Q&A resumption. No paid inference is used.
