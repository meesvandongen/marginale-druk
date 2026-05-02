import * as Plot from "npm:@observablehq/plot";
import {WIG_ORDER, WIG_RANGE} from "../lib/colors.js";
import {fmtEur, fmtEurK} from "../lib/format.js";

// Single horizontal stacked bar from "totale werkgeverskost" → "besteedbaar".
// Negative segments (toeslagen received) sit to the left of zero.
export function wigBar({width, segments, height = 130} = {}) {
  const ord = new Map(WIG_ORDER.map((s, i) => [s, i]));
  const sorted = [...segments].sort((a, b) => (ord.get(a.seg) ?? 99) - (ord.get(b.seg) ?? 99));
  let pos = 0, neg = 0;
  const labels = sorted.map(s => {
    if (s.value >= 0) {
      const center = pos + s.value / 2;
      pos += s.value;
      return {...s, center};
    }
    const center = neg + s.value / 2;
    neg += s.value;
    return {...s, center};
  });

  return Plot.plot({
    width,
    height,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 32,
    marginBottom: 36,
    style: {fontSize: "12px"},
    x: {
      label: "← € per jaar →",
      grid: true,
      tickFormat: fmtEurK
    },
    y: {axis: null},
    color: {
      legend: true,
      domain: WIG_ORDER,
      range: WIG_RANGE,
      label: null
    },
    marks: [
      Plot.barX(segments, {
        x: "value",
        y: () => "wig",
        fill: "seg",
        order: WIG_ORDER,
        stroke: "white",
        strokeWidth: 1.5,
        insetTop: 6,
        insetBottom: 6,
        title: d => `${d.seg}\n${fmtEur(d.value)}`,
        tip: true
      }),
      Plot.text(labels.filter(d => Math.abs(d.value) >= 4000), {
        x: "center",
        y: () => "wig",
        text: d => fmtEur(d.value),
        fill: "white",
        fontWeight: 600
      }),
      Plot.ruleX([0])
    ]
  });
}
