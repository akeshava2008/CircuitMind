"""Small provider schema; the full design is parsed and validated in Python.

A grammar covering every nested BOM, schematic, board and power-budget field
can exceed the provider's compilation budget. A single required JSON-string
field keeps the transport grammar constant as the design format grows.
"""

DESIGN_SCHEMA = {
    "type": "object",
    "properties": {
        "design_json": {
            "type": "string",
            "description": "The complete CircuitMind design object encoded as a JSON string, using every section and field specified in the system prompt.",
        },
    },
    "required": ["design_json"],
    "additionalProperties": False,
}

DESIGN_TRANSPORT_INSTRUCTION = (
    '\n\nTransport format: The structured response must contain exactly one field, '
    '"design_json". Its value is a JSON-encoded string containing the COMPLETE '
    'design object specified above, including all components, BOM, schematic, '
    'board, power budget, build plan and warnings. Follow the full design format '
    'above inside this string. Do not return markdown or a summary.'
)
