# 🔌 CircuitMind

**An AI copilot that turns a plain-English electronics idea into a first-pass hardware design.**

Describe a project — *"a battery-powered BLE temperature sensor that runs 6 months on a CR2032"* — and CircuitMind returns a grounded, structured design: real manufacturer part numbers, a bill of materials with live-search links, a schematic, a power/battery-life budget, and specific engineering warnings. It also lets you upload a component datasheet and ask questions about it, answered only from the retrieved text (no invented specs).

Built to close the gap between "I have an idea" and "I can order the parts" — most AI tools either hallucinate part numbers or require learning a full EDA suite before you can explore anything.

## What it does

- **Component recommendation** — real, in-production manufacturer part numbers (not vague placeholders), each with a datasheet search link and typical cost.
- **Bill of Materials** — quantities, unit price, extended cost, and a live Digikey search link per line item.
- **Schematic rendering** — a best-effort two-rail schematic drawn from the model's structured circuit description (via `schemdraw`).
- **Power budget** — sleep/active current per component, duty-cycle weighting, and an estimated battery life for battery-powered designs.
- **Design warnings** — engineering review comments specific to the chosen parts (voltage mismatches, missing decoupling, GPIO current limits, coin-cell brownout risk, etc.).
- **Datasheet Q&A** — upload a PDF datasheet; a lightweight TF-IDF retrieval step grounds the model's answers strictly in the retrieved excerpts.

All AI-generated output is explicitly flagged for human verification before building — this is a first-pass design assistant, not a substitute for engineering review.

## Tech stack

- **Frontend:** [Streamlit](https://streamlit.io/)
- **AI:** [Claude](https://www.anthropic.com/claude) (Anthropic API) via the `anthropic` Python SDK, with a strict JSON output contract
- **Schematic rendering:** `schemdraw` + `matplotlib`
- **Datasheet retrieval:** `pypdf` for extraction, hand-rolled TF-IDF cosine similarity for chunk ranking (no vector DB)
- **Data/display:** `pandas`, `Pillow`

## Architecture

```
app.py                    Streamlit UI — tabs for BOM, schematic, power budget,
                           warnings, and datasheet Q&A
agent/
  circuit_agent.py         Wraps the Claude API call; enforces + repairs JSON output
  prompts.py                System prompts (design generation, datasheet Q&A)
  bom.py                    BOM formatting + Digikey link generation
  schematic.py              Renders the model's schematic description with schemdraw
utils/
  rag.py                    PDF chunking + TF-IDF retrieval for datasheet Q&A
```

The design-generation prompt requires the model to return **only** a JSON object against a fixed schema (components, BOM, schematic description, power budget, warnings) — real part numbers required, no vague placeholders, with explicit engineering-review rules (decoupling caps, GPIO limits, coin-cell brownout, etc.) baked into the system prompt.

## Running it locally

1. Clone the repo and `cd circuitmind`
2. Copy `.env.example` to `.env` and add your own [Anthropic API key](https://console.anthropic.com/)
3. `pip install -r requirements.txt`
4. `streamlit run app.py`

(Or just double-click `run.command`, which does all of the above.)

## Status

Early, single-user MVP. Live BOM pricing is currently the model's own estimate rather than a real-time parts-API lookup (Nexar/Octopart) — see the roadmap below for what's next.

## Roadmap

- Wire the BOM to a live parts API (Nexar/Octopart) for verified real-time pricing/stock
- Persistent projects + a build-phase timeline (sketches, instructions, change log)
- Interactive schematic canvas + a rotatable 3D board/product model
- A "build journal" — versioned design history with a decision log

## Author

Armaan Keshava — EE @ Purdue
