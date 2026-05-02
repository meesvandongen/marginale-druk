// Centralised colour palette. Colours are deliberately grouped by semantic
// meaning so that the area-stack and the wedge-bar can share the same vocabulary.

// Components of marginal pressure (stacked from bottom to top of the chart).
export const COMPONENT_ORDER = [
  "Inkomstenbelasting",
  "Verlies algemene heffingskorting",
  "Verlies arbeidskorting",
  "Verlies IACK",
  "Verlies zorgtoeslag",
  "Verlies huurtoeslag",
  "Verlies kindgebonden budget"
];

export const COMPONENT_COLOR = {
  "Inkomstenbelasting":              "#4338ca", // indigo-700
  "Verlies algemene heffingskorting":"#6366f1", // indigo-500
  "Verlies arbeidskorting":          "#0ea5e9", // sky-500
  "Verlies IACK":                    "#22d3ee", // cyan-400
  "Verlies zorgtoeslag":             "#f97316", // orange-500
  "Verlies huurtoeslag":             "#ef4444", // red-500
  "Verlies kindgebonden budget":     "#ec4899", // pink-500
  "Naar jou":                        "#16a34a"  // green-600
};

export const COMPONENT_RANGE = COMPONENT_ORDER.map(c => COMPONENT_COLOR[c]);

// Wedge segments (employer cost → disposable income, left to right).
export const WIG_ORDER = [
  "Werkgever WW",
  "Werkgever Aof + WHK + Zvw",
  "Werkgever pensioen",
  "Vakantiegeld",
  "Pensioen werknemer",
  "Inkomstenbelasting",
  "Toeslagen",
  "Besteedbaar"
];

export const WIG_COLOR = {
  "Werkgever WW":              "#f97316",
  "Werkgever Aof + WHK + Zvw": "#fb923c",
  "Werkgever pensioen":        "#be185d",
  "Vakantiegeld":              "#f59e0b",
  "Pensioen werknemer":        "#a855f7",
  "Inkomstenbelasting":        "#4338ca",
  "Toeslagen":                 "#84cc16",
  "Besteedbaar":               "#16a34a"
};

export const WIG_RANGE = WIG_ORDER.map(c => WIG_COLOR[c]);
