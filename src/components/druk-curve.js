import * as Plot from "npm:@observablehq/plot";
import {COMPONENT_ORDER, COMPONENT_RANGE, COMPONENT_COLOR} from "../lib/colors.js";
import {fmtEur, fmtEurK, fmtPct} from "../lib/format.js";

// Stacked-area visualisation of where each extra euro of bruto goes.
// Negative values (credits in their build-up phase) push the stack below
// the zero baseline, which is how a marginal druk < 0% looks.
export function drukCurve({width, rows, long, currentBruto, currentMarginaal, height = 460} = {}) {
  // Tight, predictable domain. Negative band ≈ −20% covers the IACK/AK
  // build-up zone; positive band reaches a touch over 100% so the red
  // reference line stays inside the plot.
  const minVal = Math.min(0, ...long.map(d => d.value));
  const maxMarginal = Math.max(...rows.map(r => r.marginaal));
  const ymin = Math.min(-0.05, minVal - 0.02);
  const ymax = Math.max(1.1, maxMarginal + 0.05);

  return Plot.plot({
    width,
    height,
    marginLeft: 56,
    marginRight: 18,
    marginTop: 30,
    marginBottom: 42,
    style: {fontSize: "12px"},
    x: {
      label: "Jaarbruto →",
      labelAnchor: "right",
      grid: true,
      tickFormat: fmtEurK
    },
    y: {
      label: "↑ Aandeel van iedere extra €",
      tickFormat: d => `${(d * 100).toFixed(0)}%`,
      grid: true,
      domain: [ymin, ymax]
    },
    color: {
      legend: true,
      domain: COMPONENT_ORDER,
      range: COMPONENT_RANGE,
      label: null
    },
    marks: [
      Plot.areaY(long, {
        x: "bruto",
        y: "value",
        fill: "component",
        order: COMPONENT_ORDER,
        fillOpacity: 0.85,
        curve: "linear"
      }),
      Plot.ruleY([0]),
      Plot.ruleY([1], {stroke: "#dc2626", strokeDasharray: "4,3", strokeOpacity: 0.6}),
      Plot.text([{x: rows[Math.floor(rows.length * 0.85)]?.bruto ?? 0, y: 1}], {
        x: "x", y: "y",
        text: ["100% — alles wat je extra verdient gaat weg"],
        fill: "#dc2626", fontSize: 11, dy: -6, textAnchor: "end"
      }),
      Plot.line(rows, {
        x: "bruto",
        y: "marginaal",
        stroke: "currentColor",
        strokeWidth: 2.2,
        strokeOpacity: 0.9
      }),
      Plot.ruleX([currentBruto], {stroke: "currentColor", strokeWidth: 1.2, strokeOpacity: 0.6}),
      Plot.dot([{bruto: currentBruto, marginaal: currentMarginaal ?? snapMarginaal(currentBruto, rows)}], {
        x: "bruto", y: "marginaal", r: 5, fill: "currentColor", stroke: "white", strokeWidth: 2
      }),
      Plot.ruleX(rows, Plot.pointerX({
        x: "bruto",
        stroke: "currentColor",
        strokeOpacity: 0.35,
        strokeDasharray: "2,2"
      })),
      Plot.tip(rows, Plot.pointerX({
        x: "bruto",
        anchor: "top-left",
        title: r => tipText(r)
      }))
    ]
  });
}

function snapMarginaal(bruto, rows) {
  if (!rows.length) return 0;
  let best = rows[0];
  for (const r of rows) if (Math.abs(r.bruto - bruto) < Math.abs(best.bruto - bruto)) best = r;
  return best.marginaal;
}

function tipText(r) {
  const lines = [
    `Jaarbruto: ${fmtEur(r.bruto)}`,
    `Marginale druk: ${fmtPct(r.marginaal)}`,
    `Naar jou: ${fmtPct(1 - r.marginaal)}`,
    ""
  ];
  for (const c of COMPONENT_ORDER) {
    if (Math.abs(r[c]) < 0.0005) continue;
    lines.push(`${c}: ${fmtPct(r[c])}`);
  }
  return lines.join("\n");
}
