"""Schematic rendering. Takes the agent's schematic_description dict and draws a
best-effort two-rail circuit diagram with schemdraw, returning a PIL.Image (or
None on any failure)."""

from __future__ import annotations
import io
import matplotlib
matplotlib.use("Agg")  # headless backend BEFORE schemdraw imports pyplot

import schemdraw
import schemdraw.elements as elm
from PIL import Image

_PASSIVE_MAP = {
    "resistor": elm.Resistor,
    "capacitor": elm.Capacitor,
    "cap": elm.Capacitor,
    "inductor": elm.Inductor,
    "diode": elm.Diode,
    "led": elm.LED,
}
_POWER_TYPES = {"power_source", "power", "battery", "voltage_source", "source"}


def _clean_label(name: str, value: str) -> str:
    name = (name or "").strip()
    value = (value or "").strip()
    if name and value and value.lower() not in name.lower():
        return f"{name}\n{value}"
    return name or value or "?"


def generate_schematic(schematic_description: dict):
    try:
        if not schematic_description or not isinstance(schematic_description, dict):
            return None
        elements = schematic_description.get("elements") or []
        if not isinstance(elements, list) or len(elements) == 0:
            return None
        title = schematic_description.get("title") or "Circuit"

        power_label = None
        rungs = []  # (kind, class_or_None, label)
        for el in elements:
            if not isinstance(el, dict):
                continue
            etype = (el.get("type") or "").strip().lower()
            label = _clean_label(el.get("name") or etype, el.get("value") or "")
            if etype in ("ground", "gnd"):
                continue
            if etype in _POWER_TYPES:
                if power_label is None:
                    power_label = label
                else:
                    rungs.append(("block", None, label))
                continue
            if etype in _PASSIVE_MAP:
                rungs.append(("passive", _PASSIVE_MAP[etype], label))
                continue
            rungs.append(("block", None, label))

        if power_label is None:
            power_label = "VBAT"

        top_y, bot_y = 0.0, -3.5
        mid_y = (top_y + bot_y) / 2.0
        x_start, x_step = 0.0, 3.0
        rung_xs = [x_start + x_step * (i + 1) for i in range(len(rungs))]
        x_last = rung_xs[-1] if rung_xs else x_start

        d = schemdraw.Drawing()
        d.config(fontsize=11, lw=1.6)
        d += elm.Battery().at((x_start, top_y)).to((x_start, bot_y)).label(power_label, loc="left")

        for (kind, cls, label), x in zip(rungs, rung_xs):
            if kind == "passive" and cls is not None:
                d += cls().at((x, top_y)).to((x, bot_y)).label(label)
            else:
                d += elm.Line().at((x, top_y)).to((x, mid_y + 0.7))
                d += elm.Line().at((x, mid_y - 0.7)).to((x, bot_y))
                d += elm.Rect(w=2.0, h=1.4).at((x - 1.0, mid_y - 0.7))
                d += elm.Label().at((x, mid_y)).label(label)

        d += elm.Line().at((x_start, top_y)).to((x_last, top_y))
        d += elm.Line().at((x_start, bot_y)).to((x_last, bot_y))
        d += elm.Ground().at((x_last, bot_y))
        d += elm.Label().at(((x_start + x_last) / 2.0, top_y + 0.35)).label("VCC")
        d += elm.Label().at((x_start - 0.1, top_y + 0.9)).label(title)

        png_bytes = d.get_imagedata("png")
        return Image.open(io.BytesIO(png_bytes))
    except Exception:
        return None
