# 🔌 CircuitMind

**An AI copilot that turns a plain-English electronics idea into a first-pass hardware design.**

Describe a project — *"a battery-powered BLE temperature sensor that runs 6 months on a CR2032"* — and CircuitMind returns a grounded, structured design: real manufacturer part numbers, a bill of materials with live-search links, a schematic, a power/battery-life budget, and specific engineering warnings. It also lets you upload a component datasheet and ask questions about it, answered only from the retrieved text (no invented specs).

Built to close the gap between "I have an idea" and "I can order the parts" — most AI tools either hallucinate part numbers or require learning a full EDA suite before you can explore anything.

## What it does

- **Component recommendation** — real, in-production manufacturer part numbers (not vague placeholders), each with a datasheet search link and typical cost.
- **Bill of Materials** — quantities, unit price, extended cost, and a live Digikey search link per line item.
- **Interactive schematic** — the design's blocks laid out by role and wired from the structured nets. Click any block to inspect its designator, value and every net it touches; a static `schemdraw` rendering is available alongside it.
- **3D board view** — the proposed parts placed on a PCB outline at their real footprints and heights, rotatable in the browser (three.js). A placement sketch for sanity-checking size and arrangement, not a routed board.
- **Power budget** — sleep/active current per component, duty-cycle weighting, and an estimated battery life for battery-powered designs.
- **Phased build plan** — the build broken into independently testable phases, each with steps, the parts it consumes, a time estimate, and a concrete checkpoint to verify before moving on.
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
app.py                    Streamlit UI — tabs for BOM, schematic, 3D view,
                           build plan, power budget, warnings, datasheet Q&A
agent/
  circuit_agent.py         Wraps the Claude API call; enforces + repairs JSON output
  prompts.py                System prompts (design generation, datasheet Q&A)
  bom.py                    BOM formatting + Digikey link generation
  schematic.py              Static schematic rendering via schemdraw
ui/
  schematic_view.py         Interactive schematic canvas — column layout, net
                             routing, click-to-inspect
  three_view.py             3D board view — placements as meshes on a PCB outline
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

Early, single-user MVP. Two honest limitations worth stating up front: BOM pricing is the model's own estimate rather than a real-time parts-API lookup (Nexar/Octopart), and the 3D view is a placement sketch rather than a routed PCB — there is no copper, no vias and no DRC.

## Roadmap

- Wire the BOM to a live parts API (Nexar/Octopart) for verified real-time pricing/stock
- Persistent projects saved across sessions
- Real PCB layout: copper, routing and design-rule checks on top of the placement sketch
- A "build journal" — versioned design history with a decision log

## Author

Armaan Keshava — EE @ Purdue
