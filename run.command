#!/bin/bash
# Double-click this file to launch CircuitMind.
cd "$(dirname "$0")"
if [ ! -f .env ]; then
  cp .env.example .env
  echo ">>> Created .env — open it and set your Chabi client ID and redirect URI, then run again."
  open -e .env
  exit 0
fi
echo ">>> Installing dependencies (first run only)…"
python3 -m pip install -r requirements.txt --quiet
echo ">>> Launching CircuitMind…"
python3 -m streamlit run app.py
