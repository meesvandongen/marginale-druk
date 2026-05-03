// Data-prep helpers that turn the raw scenario calculator into the shapes
// our charts want. All maths lives in lib/calc.js — these are pure pivots.
import {scenario, marginaleDruk} from "./calc.js";
import {COMPONENT_ORDER, WIG_ORDER} from "./colors.js";

// Wide rows: one row per income point, with a column per druk-component
// expressing the marginal-druk fraction attributed to that component.
// Negative values are normal (e.g. arbeidskorting opbouw < €25k).
export function curveWide(baseInput, {from = 10000, to = 150000, step = 500} = {}) {
  const rows = [];
  for (let bruto = from; bruto <= to; bruto += step) {
    const m = marginaleDruk({...baseInput, bruto});
    const dB = m.deltaBruto;
    const row = {
      bruto,
      marginaal: m.drukOpBruto,
      marginaalWg: m.drukOpWerkgever,
      "Inkomstenbelasting":              m.delta.ib / dB,
      "Verlies algemene heffingskorting":m.delta.ahk / dB,
      "Verlies arbeidskorting":          m.delta.ak / dB,
      "Verlies IACK":                    m.delta.ic / dB,
      "Pensioen werknemer":              m.delta.eigenPensioen / dB,
      "Verlies zorgtoeslag":             m.delta.zorgtoeslag / dB,
      "Verlies huurtoeslag":             m.delta.huurtoeslag / dB,
      "Verlies kindgebonden budget":     m.delta.kindgebondenBudget / dB,
      "Verlies kinderopvangtoeslag":     m.delta.kinderopvangtoeslag / dB,
      "Studielening":                    m.delta.studielening / dB
    };
    rows.push(row);
  }
  return rows;
}

// Long format suitable for Plot.areaY with fill="component".
export function toLong(rows) {
  const out = new Array(rows.length * COMPONENT_ORDER.length);
  let i = 0;
  for (const r of rows) {
    for (const c of COMPONENT_ORDER) {
      out[i++] = {bruto: r.bruto, component: c, value: r[c]};
    }
  }
  return out;
}

// Snap a bruto value onto the nearest sample in the curve.
export function nearestRow(rows, bruto) {
  if (!rows.length) return null;
  let best = rows[0], bestDiff = Math.abs(rows[0].bruto - bruto);
  for (const r of rows) {
    const d = Math.abs(r.bruto - bruto);
    if (d < bestDiff) { best = r; bestDiff = d; }
  }
  return best;
}

// Wedge segments: a single horizontal stacked bar that goes from "what the
// employer spends" on the left to "what the household has to spend" on the
// right. Toeslagen are shown as a positive segment because they top up
// disposable income — making the wedge visually narrower for low incomes.
export function wigSegments(sce) {
  return [
    {seg: "Werkgever WW",              value: sce.werkgever.ww},
    {seg: "Werkgever Aof + WHK + Zvw", value: sce.werkgever.aof + sce.werkgever.whk + sce.werkgever.aofKO + sce.werkgever.zvw},
    {seg: "Werkgever pensioen",        value: sce.werkgever.pensioen},
    {seg: "Vakantiegeld",              value: sce.werkgever.vakantiegeld},
    {seg: "Pensioen werknemer",        value: sce.eigenPensioen},
    {seg: "Inkomstenbelasting",        value: sce.ibNetto},
    {seg: "Studielening",              value: sce.studielening ?? 0},
    {seg: "Toeslagen",                 value: -sce.toeslagenTotaal},
    {seg: "Besteedbaar",               value: sce.besteedbaar}
  ].filter(s => Math.abs(s.value) > 0.5);
}

// Compute scenario + curve for a given input, in one call. Cached at the
// call site by Framework's reactive runtime.
export function dashboard(baseInput, curveOpts) {
  const sce = scenario(baseInput);
  const md = marginaleDruk(baseInput);
  const rows = curveWide(baseInput, curveOpts);
  return {sce, md, rows, long: toLong(rows), wig: wigSegments(sce)};
}
