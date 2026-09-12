"""Rotatable 3D board view.

Takes the design's board outline and component placements and renders them as a
three.js scene: a PCB substrate with each part sitting on it at its real
footprint and height. Drag to orbit, scroll to zoom.
"""

from __future__ import annotations

from . import js_json, THEME_CSS

THREE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"

# Component colours by role, drawn from the CircuitMind palette.
_KIND_COLOR = {
    "ic": "#22d3ee",
    "regulator": "#a78bfa",
    "sensor": "#4b8bff",
    "passive": "#7c8ba5",
    "connector": "#f59e0b",
    "battery": "#ff4d97",
    "antenna": "#7fe9d0",
}
_DEFAULT_COLOR = "#8b9ab3"


def _num(value, default=None):
    if isinstance(value, bool) or value is None:
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def board_html(board: dict, height_px: int = 460) -> tuple:
    """Return (html, height) for the 3D board view, or ("", 0) if unusable."""
    if not isinstance(board, dict):
        return "", 0

    bw = _num(board.get("width_mm"))
    bh = _num(board.get("height_mm"))
    raw = board.get("placements") or []
    if not bw or not bh or not isinstance(raw, list):
        return "", 0

    parts = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        x, y = _num(item.get("x_mm")), _num(item.get("y_mm"))
        w, h = _num(item.get("w_mm")), _num(item.get("h_mm"))
        z = _num(item.get("z_mm"), 1.0) or 1.0
        if None in (x, y, w, h) or w <= 0 or h <= 0:
            continue
        kind = str(item.get("kind") or "").strip().lower()
        parts.append({
            "ref": str(item.get("ref") or ""),
            "name": str(item.get("name") or item.get("ref") or "part"),
            "x": x, "y": y, "w": w, "h": h, "z": max(z, 0.3),
            "color": _KIND_COLOR.get(kind, _DEFAULT_COLOR),
            "kind": kind or "part",
        })
    if not parts:
        return "", 0

    legend_kinds = sorted({p["kind"] for p in parts})
    legend = "".join(
        f'<span class="lg"><i style="background:'
        f'{_KIND_COLOR.get(k, _DEFAULT_COLOR)}"></i>{k}</span>'
        for k in legend_kinds
    )

    page = f"""
<style>
{THEME_CSS}
.wrap{{background:#0b111ca8;border:1px solid var(--line);border-radius:16px;
  backdrop-filter:blur(12px);overflow:hidden;position:relative;}}
#cv{{display:block;width:100%;height:{height_px - 54}px;
  background:radial-gradient(120% 100% at 50% 0%,#0c1a30,#070d18 70%);}}
.bar{{display:flex;align-items:center;justify-content:space-between;gap:12px;
  flex-wrap:wrap;padding:10px 15px;border-top:1px solid var(--line);
  background:#0d1422a6;}}
.legend{{display:flex;gap:13px;flex-wrap:wrap;}}
.lg{{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);
  font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;}}
.lg i{{width:9px;height:9px;border-radius:2px;display:inline-block;}}
.dims{{font-family:var(--mono);font-size:10.5px;color:var(--dim);}}
.tip{{position:absolute;top:12px;right:14px;font-family:var(--mono);font-size:10px;
  color:var(--dim);background:#0a1120b8;border:1px solid var(--line);
  border-radius:999px;padding:4px 11px;pointer-events:none;}}
</style>

<div class="wrap">
  <canvas id="cv"></canvas>
  <div class="tip">drag to rotate · scroll to zoom</div>
  <div class="bar">
    <div class="legend">{legend}</div>
    <div class="dims">{bw:g} × {bh:g} mm · {len(parts)} placed</div>
  </div>
</div>

<script src="{THREE_CDN}"></script>
<script>
(function () {{
  if (typeof THREE === "undefined") {{
    document.getElementById("cv").replaceWith(Object.assign(
      document.createElement("div"),
      {{style: "padding:28px;font-family:monospace;color:#93a3bd;font-size:12px",
        textContent: "3D view needs network access to load three.js."}}));
    return;
  }}

  const BW = {bw}, BH = {bh}, PARTS = {js_json(parts)};
  const canvas = document.getElementById("cv");
  const renderer = new THREE.WebGLRenderer({{canvas: canvas, antialias: true,
    alpha: true}});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 4000);

  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(0.6, 1, 0.45);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4b8bff, 0.4);
  rim.position.set(-0.7, 0.35, -0.6);
  scene.add(rim);

  const root = new THREE.Group();
  scene.add(root);

  // PCB substrate
  const T = 1.6;
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(BW, T, BH),
    new THREE.MeshLambertMaterial({{color: 0x0f3d35}})
  );
  board.position.y = -T / 2;
  root.add(board);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(BW, T, BH)),
    new THREE.LineBasicMaterial({{color: 0x22d3ee, transparent: true, opacity: 0.5}})
  );
  edge.position.y = -T / 2;
  root.add(edge);

  function label(text, color) {{
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    const font = "600 44px 'JetBrains Mono', monospace";
    ctx.font = font;
    c.width = Math.ceil(ctx.measureText(text).width) + 28;
    c.height = 64;
    const g = c.getContext("2d");
    g.font = font;
    g.fillStyle = "rgba(8,11,18,0.82)";
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = color;
    g.textBaseline = "middle";
    g.fillText(text, 14, c.height / 2 + 2);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({{map: tex,
      transparent: true, depthTest: false}}));
    const s = 0.055;
    sp.scale.set(c.width * s, c.height * s, 1);
    return sp;
  }}

  PARTS.forEach(function (p) {{
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(p.w, p.z, p.h),
      new THREE.MeshLambertMaterial({{color: new THREE.Color(p.color)}})
    );
    // placements give the lower-left corner; three.js meshes are centre-origin
    mesh.position.set(p.x + p.w / 2 - BW / 2, p.z / 2, -(p.y + p.h / 2 - BH / 2));
    root.add(mesh);
    const out = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({{color: 0xffffff, transparent: true,
        opacity: 0.22}})
    );
    out.position.copy(mesh.position);
    root.add(out);
    if (p.ref) {{
      const sp = label(p.ref, p.color);
      sp.position.set(mesh.position.x, p.z + 2.2, mesh.position.z);
      root.add(sp);
    }}
  }});

  // --- minimal orbit controls (no extra dependency) ---
  const dist0 = Math.max(BW, BH) * 1.75 + 22;
  let yaw = -0.62, pitch = 0.82, dist = dist0, drag = false, px = 0, py = 0;
  let idle = true;

  function place() {{
    pitch = Math.max(0.12, Math.min(1.45, pitch));
    camera.position.set(
      dist * Math.cos(pitch) * Math.sin(yaw),
      dist * Math.sin(pitch),
      dist * Math.cos(pitch) * Math.cos(yaw)
    );
    camera.lookAt(0, 0, 0);
  }}

  canvas.addEventListener("pointerdown", function (e) {{
    drag = true; idle = false; px = e.clientX; py = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  }});
  canvas.addEventListener("pointermove", function (e) {{
    if (!drag) return;
    yaw -= (e.clientX - px) * 0.0075;
    pitch += (e.clientY - py) * 0.0065;
    px = e.clientX; py = e.clientY;
    place();
  }});
  canvas.addEventListener("pointerup", function (e) {{
    drag = false;
    try {{ canvas.releasePointerCapture(e.pointerId); }} catch (err) {{}}
  }});
  canvas.addEventListener("wheel", function (e) {{
    e.preventDefault(); idle = false;
    dist = Math.max(dist0 * 0.45, Math.min(dist0 * 2.4, dist + e.deltaY * 0.09));
    place();
  }}, {{passive: false}});

  function size() {{
    const w = canvas.clientWidth || 700, h = canvas.clientHeight || 400;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }}
  window.addEventListener("resize", size);

  const slow = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function loop() {{
    requestAnimationFrame(loop);
    if (idle && !slow) {{ yaw += 0.0022; place(); }}
    renderer.render(scene, camera);
  }}
  size(); place(); loop();
}})();
</script>
"""
    return page, height_px
