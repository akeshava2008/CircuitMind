"""Validate the container types consumed by the design viewers."""


def validate_design(design: object) -> dict:
    if not isinstance(design, dict):
        raise ValueError("A design must be a JSON object.")
    if not any(key in design for key in ("components", "bom", "schematic_description")):
        raise ValueError("No CircuitMind design fields were found.")

    def records(value, label):
        if not isinstance(value, list) or any(not isinstance(row, dict) for row in value):
            raise ValueError(f"{label} must be a list of objects.")

    def strings(value, label):
        if not isinstance(value, list) or any(not isinstance(row, str) for row in value):
            raise ValueError(f"{label} must be a list of strings.")

    for key in ("components", "bom", "build_plan"):
        records(design.get(key, []), key)
    strings(design.get("design_warnings", []), "design_warnings")
    for key, lists in (
        ("schematic_description", ("elements", "nets")),
        ("board", ("placements",)),
        ("power_budget", ("cells",)),
    ):
        value = design.get(key, {})
        if not isinstance(value, dict):
            raise ValueError(f"{key} must be an object.")
        for name in lists:
            records(value.get(name, []), f"{key}.{name}")
    strings(design.get("schematic_description", {}).get("connections", []), "connections")
    for phase in design.get("build_plan", []):
        for name in ("steps", "parts"):
            strings(phase.get(name, []), f"build_plan.{name}")
    return design
