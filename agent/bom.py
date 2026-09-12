"""Bill-of-Materials helpers: format the agent's bom list for display and build
Digikey search links."""

from __future__ import annotations
from urllib.parse import quote_plus
import pandas as pd


def generate_digikey_url(part_number: str) -> str:
    if not part_number:
        part_number = ""
    return f"https://www.digikey.com/en/products/filter?keywords={quote_plus(str(part_number))}"


def _to_float(value, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        if isinstance(value, str):
            cleaned = value.replace("$", "").replace(",", "").strip()
            return default if cleaned == "" else float(cleaned)
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_int(value, default: int = 1) -> int:
    try:
        if value is None:
            return default
        return int(float(value))
    except (TypeError, ValueError):
        return default


def format_bom_table(bom: list) -> pd.DataFrame:
    columns = ["Item", "Part Number", "Qty", "Unit Price ($)", "Total ($)", "Digikey Link"]
    if not bom:
        return pd.DataFrame(columns=columns)

    rows = []
    for entry in bom:
        if not isinstance(entry, dict):
            continue
        part_number = entry.get("part_number", "") or ""
        qty = _to_int(entry.get("qty", 1))
        unit_price = _to_float(entry.get("unit_price_usd", 0.0))
        total = _to_float(entry.get("total_usd")) if entry.get("total_usd") is not None else None
        if total is None:
            total = round(qty * unit_price, 2)
        link = entry.get("digikey_search_url") or generate_digikey_url(part_number)
        rows.append({
            "Item": entry.get("item", ""),
            "Part Number": part_number,
            "Qty": qty,
            "Unit Price ($)": round(unit_price, 2),
            "Total ($)": round(total, 2),
            "Digikey Link": link,
        })
    return pd.DataFrame(rows, columns=columns)


def calculate_bom_total(bom: list) -> float:
    if not bom:
        return 0.0
    grand_total = 0.0
    for entry in bom:
        if not isinstance(entry, dict):
            continue
        if entry.get("total_usd") is not None:
            grand_total += _to_float(entry.get("total_usd"))
        else:
            grand_total += _to_int(entry.get("qty", 1)) * _to_float(entry.get("unit_price_usd", 0.0))
    return round(grand_total, 2)
