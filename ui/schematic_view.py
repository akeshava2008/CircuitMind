"""Interactive schematic canvas.

Lays the design's schematic elements out in columns by role, wires them up from
the structured nets, and renders the result as clickable SVG. Selecting a block
shows its details and highlights every net it touches.
"""

from __future__ import annotations
import html

from . import js_json, THEME_CSS

# Which column each element type sits in, left to right: sources feed
# regulation, regulation feeds the MCU, the MCU drives peripherals and RF.
_COLUMN_OF = {
    "power_source": 0, "battery": 0,
    "capacitor": 1, "resistor": 1, "inductor": 1, "diode": 1, "switch": 1,
    "regulator": 2,
    "ic": 3,
    "sensor": 4, "led": 4, "connector": 4, "antenna": 4,
}
_SKIP = {"ground", "gnd", "label"}

_KIND_ACCENT = {
    0: "#ff4d97",  # sources
    1: "#93a3bd",  # passives
    2: "#a78bfa",  # regulation
    3: "#22d3ee",  # the MCU / main ICs
    4: "#4b8bff",  # peripherals and RF
}

NODE_W, NODE_H = 178, 62
COL_GAP, ROW_GAP = 96, 30
PAD_X, PAD_Y = 26, 26


def _layout(elements: list) -> tuple:
    """Assign every renderable element a column, row and pixel position."""
    columns: dict = {}
    nodes = []
    for el in elements:
        if not isinstance(el, dict):
            continue
        etype = str(el.get("type") or "").strip().lower()
        if etype in _SKIP:
            continue
        col = _COLUMN_OF.get(etype, 3)
        row = len(columns.setdefault(col, []))
        node = {
            "ref": str(el.get("ref") or el.get("name") or f"?{len(nodes)}"),
            "name": str(el.get("name") or etype or "Component"),
            "type": etype or "part",
            "value": str(el.get("value") or ""),
            "notes": str(el.get("notes") or ""),
            "col": col, "row": row,
            "accent": _KIND_ACCENT.get(col, "#93a3bd"),
        }
        columns[col].append(node)
        nodes.append(node)

    if not nodes:
        return [], 0, 0

    used = sorted(columns)
    tallest = max(len(columns[c]) for c in used)
    height = PAD_Y * 2 + tallest * NODE_H + (tallest - 1) * ROW_GAP
    width = PAD_X * 2 + len(used) * NODE_W + (len(used) - 1) * COL_GAP

    for slot, col in enumerate(used):
        members = columns[col]
        block = len(members) * NODE_H + (len(members) - 1) * ROW_GAP
        top = (height - block) / 2
        for i, node in enumerate(members):
            node["x"] = PAD_X + slot * (NODE_W + COL_GAP)
            node["y"] = top + i * (NODE_H + ROW_GAP)
    return nodes, width, height


def _wires(nets: list, by_ref: dict) -> list:
    """Route each net as an orthogonal path between two placed blocks."""
    wires = []
    for net in nets:
        if not isinstance(net, dict):
            continue
        a = by_ref.get(str(net.get("from") or ""))
        b = by_ref.get(str(net.get("to") or ""))
        if not a or not b or a is b:
            continue
        if a["x"] > b["x"]:
            a, b = b, a
        x1, y1 = a["x"] + NODE_W, a["y"] + NODE_H / 2
        x2, y2 = b["x"], b["y"] + NODE_H / 2
        if x2 <= x1:                       # same column: loop around below
            mid = max(a["y"], b["y"]) + NODE_H + 14
            path = (f"M{a['x'] + NODE_W / 2} {a['y'] + NODE_H} V{mid} "
                    f"H{b['x'] + NODE_W / 2} V{b['y'] + NODE_H}")
        else:
            mx = (x1 + x2) / 2
            path = f"M{x1} {y1} H{mx} V{y2} H{x2}"
        # stagger labels vertically so parallel nets don't print on top of each other
        stagger = (len(wires) % 3) * 11
        wires.append({
            "d": path,
            "label": str(net.get("name") or ""),
            "note": str(net.get("note") or ""),
            "a": a["ref"], "b": b["ref"],
            "lx": (x1 + x2) / 2,
            "ly": (min(y1, y2) if y1 != y2 else y1) - 9 - stagger,
        })
    return wires


def schematic_html(schematic: dict) -> tuple:
    """Return (html, pixel_height) for the interactive schematic, or ("", 0)."""
    if not isinstance(schematic, dict):
        return "", 0
    nodes, width, height = _layout(schematic.get("elements") or [])
    if not nodes:
        return "", 0

    by_ref = {n["ref"]: n for n in nodes}
    wires = _wires(schematic.get("nets") or [], by_ref)
    title = html.escape(str(schematic.get("title") or "Circuit"))

    svg_h = max(height, 240)
    panel_h = 132
    total_h = int(svg_h + panel_h + 24)

    page = f"""
<style>
{THEME_CSS}
.wrap{{background:#0b111ca8;border:1px solid var(--line);border-radius:16px;
  backdrop-filter:blur(12px);overflow:hidden;}}
.stage{{overflow:auto;padding:4px;}}
.hint{{font-family:var(--mono);font-size:10.5px;color:var(--dim);
  padding:9px 15px 0;}}
.node rect{{fill:#0e1420;stroke:#ffffff24;stroke-width:1.4;transition:.16s;}}
.node:hover rect{{stroke:#ffffff4d;}}
.node.sel rect{{stroke-width:2.2;}}
.node{{cursor:pointer;}}
.node .nm{{fill:var(--ink);font-family:var(--head);font-size:13px;font-weight:600;}}
.node .rf{{font-family:var(--mono);font-size:10px;}}
.node .vl{{fill:var(--muted);font-family:var(--mono);font-size:10px;}}
.wire path{{stroke:#31507d;stroke-width:1.8;fill:none;transition:.16s;}}
.wire.on path{{stroke:var(--cyan);stroke-width:2.4;}}
.wire text{{fill:var(--dim);font-family:var(--mono);font-size:9.5px;
  text-anchor:middle;transition:.16s;}}
.wire.on text{{fill:var(--cyan);}}
.panel{{border-top:1px solid var(--line);padding:13px 16px;min-height:{panel_h}px;
  background:#0d1422a6;}}
.p-t{{font-family:var(--head);font-size:14.5px;font-weight:600;color:var(--ink);}}
.p-m{{font-family:var(--mono);font-size:11px;color:var(--cyan);margin-top:4px;}}
.p-d{{font-size:12.5px;color:var(--muted);margin-top:8px;line-height:1.6;}}
.p-n{{font-family:var(--mono);font-size:10.5px;color:var(--dim);margin-top:8px;}}
.chip{{display:inline-block;font-family:var(--mono);font-size:10px;color:#7fe9d0;
  background:#0c241f;border:1px solid #1f6f5a;border-radius:999px;
  padding:2px 9px;margin:3px 5px 0 0;}}
</style>

<div class="wrap">
  <div class="hint">Click a block to inspect it — connected nets highlight.</div>
  <div class="stage">
    <svg id="cv" width="{max(width, 320)}" height="{svg_h}"
         viewBox="0 0 {max(width, 320)} {svg_h}" role="img" aria-label="{title}">
      <g id="wires"></g><g id="nodes"></g>
    </svg>
  </div>
  <div class="panel" id="panel">
    <div class="p-t">{title}</div>
    <div class="p-d">Select a block above to see its designator, value and the
      nets it connects to.</div>
  </div>
</div>

<script>
const NODES = {js_json(nodes)};
const WIRES = {js_json(wires)};
const NW = {NODE_W}, NH = {NODE_H};
const svgns = "http://www.w3.org/2000/svg";
const gW = document.getElementById("wires");
const gN = document.getElementById("nodes");

function mk(tag, attrs, text) {{
  const e = document.createElementNS(svgns, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text !== undefined) e.textContent = text;
  return e;
}}

WIRES.forEach(function (w, i) {{
  const g = mk("g", {{"class": "wire", "data-i": i}});
  g.appendChild(mk("path", {{d: w.d}}));
  if (w.label) g.appendChild(mk("text", {{x: w.lx, y: w.ly}}, w.label));
  gW.appendChild(g);
}});

NODES.forEach(function (n) {{
  const g = mk("g", {{"class": "node", "data-ref": n.ref}});
  g.appendChild(mk("rect", {{x: n.x, y: n.y, width: NW, height: NH, rx: 11}}));
  g.appendChild(mk("rect", {{x: n.x, y: n.y, width: 3.5, height: NH,
    rx: 1.8, fill: n.accent, stroke: "none"}}));
  g.appendChild(mk("text", {{x: n.x + 14, y: n.y + 25, "class": "nm"}},
    n.name.length > 20 ? n.name.slice(0, 19) + "…" : n.name));
  g.appendChild(mk("text", {{x: n.x + 14, y: n.y + 43, "class": "rf",
    fill: n.accent}}, n.ref.length > 14 ? n.ref.slice(0, 13) + "…" : n.ref));
  if (n.value) {{
    g.appendChild(mk("text", {{x: n.x + NW - 13, y: n.y + 43, "class": "vl",
      "text-anchor": "end"}},
      n.value.length > 15 ? n.value.slice(0, 14) + "…" : n.value));
  }}
  g.addEventListener("click", function () {{ select(n.ref); }});
  gN.appendChild(g);
}});

function esc(s) {{
  return String(s).replace(/[&<>"]/g, function (c) {{
    return {{"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}}[c];
  }});
}}

function select(ref) {{
  const n = NODES.find(function (x) {{ return x.ref === ref; }});
  if (!n) return;
  document.querySelectorAll(".node").forEach(function (el) {{
    const on = el.dataset.ref === ref;
    el.classList.toggle("sel", on);
    if (on) el.querySelector("rect").setAttribute("stroke", n.accent);
    else el.querySelector("rect").setAttribute("stroke", "#ffffff24");
  }});
  const touching = [];
  document.querySelectorAll(".wire").forEach(function (el) {{
    const w = WIRES[+el.dataset.i];
    const on = w.a === ref || w.b === ref;
    el.classList.toggle("on", on);
    if (on) touching.push(w);
  }});
  const chips = touching.map(function (w) {{
    const other = w.a === ref ? w.b : w.a;
    return '<span class="chip">' + esc(w.label || "net") + " → " + esc(other) +
      "</span>";
  }}).join("");
  document.getElementById("panel").innerHTML =
    '<div class="p-t">' + esc(n.name) + "</div>" +
    '<div class="p-m">' + esc(n.ref) + " · " + esc(n.type) +
      (n.value ? " · " + esc(n.value) : "") + "</div>" +
    (n.notes ? '<div class="p-d">' + esc(n.notes) + "</div>" : "") +
    (chips ? '<div class="p-n">Connected nets</div><div>' + chips + "</div>"
           : '<div class="p-n">No nets reference this block.</div>');
}}
</script>
"""
    return page, total_h
