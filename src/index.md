---
title: Marginale druk Nederland 2026
toc: false
---

# Marginale druk in Nederland 2026

<div class="hero">
<p><strong>Wat houdt jouw werknemer over van een loonsverhoging?</strong> En wat kost die verhoging zijn werkgever écht? Deze calculator visualiseert de marginale druk in Nederland: het percentage van iedere extra verdiende euro dat <em>niet</em> bij het huishouden terechtkomt, omdat het opgaat aan belastingen, premies of het verlies van toeslagen.</p>
</div>

```js
import {scenario, marginaleDruk, curve} from "./lib/calc.js";
import {PARAMS_2026} from "./lib/params.js";
```

## Jouw situatie

<div class="grid grid-cols-2">
<div class="card">

```js
const bruto = view(Inputs.range([15000, 200000], {label: "Jaarbruto (€, excl. vakantiegeld)", value: 50000, step: 500}));
```

```js
const partner = view(Inputs.toggle({label: "Toeslagpartner", value: false}));
```

```js
const partnerInkomen = view(Inputs.range([0, 150000], {label: "Inkomen partner (€)", value: 0, step: 500, disabled: !partner}));
```

```js
const aow = view(Inputs.toggle({label: "AOW-leeftijd bereikt", value: false}));
```

```js
const huurMaand = view(Inputs.range([0, 1200], {label: "Maandhuur (€, voor huurtoeslag)", value: 0, step: 10}));
```

```js
const aantalKinderen = view(Inputs.range([0, 5], {label: "Aantal kinderen", value: 0, step: 1}));
```

```js
const jongsteKindOnder12 = view(Inputs.toggle({label: "Jongste kind < 12 (IACK)", value: aantalKinderen > 0, disabled: aantalKinderen === 0}));
```

</div>
<div class="card">

```js
const flex = view(Inputs.toggle({label: "Flex-/oproepcontract (WW-hoog)", value: false}));
```

```js
const grootWerkgever = view(Inputs.toggle({label: "Grote werkgever (Aof-hoog)", value: false}));
```

```js
const pensioenWerkgeverPct = view(Inputs.range([0, 0.30], {label: "Pensioenpremie werkgever (% over grondslag)", value: 0.16, step: 0.005, format: x => `${(x*100).toFixed(1)}%`}));
```

```js
const pensioenWerknemerPct = view(Inputs.range([0, 0.15], {label: "Pensioenpremie werknemer (% over grondslag)", value: 0.06, step: 0.005, format: x => `${(x*100).toFixed(1)}%`}));
```

```js
const franchise = view(Inputs.range([0, 25000], {label: "Franchise pensioen (€)", value: 17545, step: 100}));
```

```js
const xMin = view(Inputs.range([0, 80000], {label: "Curve van (€)", value: 10000, step: 1000}));
```

```js
const xMax = view(Inputs.range([60000, 250000], {label: "Curve tot (€)", value: 150000, step: 1000}));
```

</div>
</div>

```js
// Eenvoudig model: alle kinderen krijgen dezelfde leeftijdscategorie.
// 8 = onder 12 (IACK + basis KGB); 13 = 12-15 (extra KGB).
const kinderen = Array.from({length: aantalKinderen}, () => jongsteKindOnder12 ? 8 : 13);

const baseInput = {
  bruto, partner, partnerInkomen, aow, jongsteKindOnder12,
  huurMaand, kinderen, flex, grootWerkgever,
  pensioenWerkgeverPct, pensioenWerknemerPct, franchise
};

const sce = scenario(baseInput);
const md = marginaleDruk(baseInput);
const data = curve(baseInput, {from: xMin, to: xMax, step: 500});
```

## Jouw cijfers in één oogopslag

<div class="grid grid-cols-4">
  <div class="card stat"><h2>${fmtPct(md.drukOpBruto)}</h2><span>marginale druk op brutoloon</span></div>
  <div class="card stat"><h2>${fmtPct(md.drukOpWerkgever)}</h2><span>marginale druk op werkgeverskost</span></div>
  <div class="card stat"><h2>${fmt(sce.besteedbaar)}</h2><span>besteedbaar inkomen / jaar</span></div>
  <div class="card stat"><h2>${fmt(sce.totaalKostenWerkgever)}</h2><span>totale kosten werkgever / jaar</span></div>
</div>

<div class="grid grid-cols-2">
  <div class="card stat"><h2>${fmt(sce.wig)}</h2><span>belasting­wig (kost werkgever − besteedbaar)</span></div>
  <div class="card stat"><h2>${fmtPct(sce.wigPct)}</h2><span>wig als % van werkgeverskost</span></div>
</div>

## Marginale druk over het inkomensspectrum

```js
Plot.plot({
  width,
  height: 360,
  marginLeft: 60,
  x: {label: "Jaarbruto (€)", grid: true, tickFormat: d => `€${d/1000}k`},
  y: {label: "Marginale druk", percent: true, grid: true, domain: [0, 1.2]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleY([1], {stroke: "red", strokeDasharray: "4,4"}),
    Plot.line(data, {x: "bruto", y: "marginaal", stroke: "steelblue", strokeWidth: 2.5}),
    Plot.line(data, {x: "bruto", y: "marginaalWg", stroke: "darkorange", strokeWidth: 2}),
    Plot.ruleX([bruto], {stroke: "red"}),
    Plot.dot(data.filter(d => d.bruto === Math.round(bruto / 500) * 500), {x: "bruto", y: "marginaal", fill: "red", r: 5})
  ]
})
```

<p class="muted"><span style="color:steelblue">━━</span> druk op brutoloon · <span style="color:darkorange">━━</span> druk op totale werkgeverskost · <span style="color:red">━</span> jouw inkomen. Boven 100% lever je <em>netto</em> in op een loonsverhoging.</p>

## Decompositie: waar gaat de extra euro heen?

```js
const breakdown = (() => {
  const d = md.delta;
  const b = md.deltaBruto;
  const items = [
    {naam: "Inkomstenbelasting (bruto)", waarde: d.ib, type: "belasting"},
    {naam: "Verlies algemene heffingskorting", waarde: d.ahk, type: "korting"},
    {naam: "Verlies arbeidskorting (afbouw)", waarde: d.ak, type: "korting"},
    {naam: "Verlies IACK", waarde: d.ic, type: "korting"},
    {naam: "Verlies zorgtoeslag", waarde: d.zorgtoeslag, type: "toeslag"},
    {naam: "Verlies huurtoeslag", waarde: d.huurtoeslag, type: "toeslag"},
    {naam: "Verlies kindgebonden budget", waarde: d.kindgebondenBudget, type: "toeslag"}
  ].map(x => ({...x, pct: x.waarde / b}));
  items.push({naam: "Netto over voor jou", waarde: b - items.reduce((s, x) => s + x.waarde, 0), type: "netto", pct: (b - items.reduce((s, x) => s + x.waarde, 0)) / b});
  return items;
})();
```

```js
Plot.plot({
  width,
  height: 240,
  marginLeft: 220,
  x: {label: "Aandeel van iedere extra €", percent: true, grid: true},
  color: {legend: false, domain: ["belasting", "korting", "toeslag", "netto"], range: ["#1f77b4", "#ff7f0e", "#d62728", "#2ca02c"]},
  marks: [
    Plot.barX(breakdown, {x: "pct", y: "naam", fill: "type", sort: {y: "x", reverse: true}}),
    Plot.text(breakdown, {x: "pct", y: "naam", text: d => `${(d.pct*100).toFixed(1)}%  (€${d.waarde.toFixed(0)})`, dx: 6, textAnchor: "start"}),
    Plot.ruleX([0])
  ]
})
```

## Werkgever vs werknemer: de wig

```js
const wedge = [
  {label: "Besteedbaar (jij)", value: sce.besteedbaar, kleur: "#2ca02c"},
  {label: "Inkomstenbelasting", value: sce.ibNetto, kleur: "#1f77b4"},
  {label: "Eigen pensioen", value: sce.eigenPensioen, kleur: "#9467bd"},
  {label: "Werkgever pensioen", value: sce.werkgever.pensioen, kleur: "#aa6caa"},
  {label: "Werkgever WW", value: sce.werkgever.ww, kleur: "#ffbb78"},
  {label: "Werkgever Aof + WHK", value: sce.werkgever.aof + sce.werkgever.whk + sce.werkgever.aofKO, kleur: "#ff7f0e"},
  {label: "Werkgever Zvw", value: sce.werkgever.zvw, kleur: "#e377c2"},
  {label: "Vakantiegeld", value: sce.werkgever.vakantiegeld, kleur: "#7f7f7f"},
  {label: "Toeslagen ontvangen", value: -sce.toeslagenTotaal, kleur: "#17becf"}
];
```

```js
Plot.plot({
  width,
  height: 320,
  marginLeft: 180,
  x: {label: "€ per jaar", grid: true},
  marks: [
    Plot.barX(wedge, {y: "label", x: "value", fill: "kleur", sort: {y: "x", reverse: true}}),
    Plot.text(wedge, {y: "label", x: "value", text: d => `€${d.value.toFixed(0)}`, dx: 6, textAnchor: "start"}),
    Plot.ruleX([0])
  ]
})
```

## Volledige tabel

<table class="totals">
  <tr><th>Bruto jaarloon</th><td>${fmt(sce.bruto)}</td></tr>
  <tr><th>− Eigen pensioenbijdrage</th><td>${fmt(sce.eigenPensioen)}</td></tr>
  <tr><th>= Belastbaar inkomen</th><td>${fmt(sce.belastbaar)}</td></tr>
  <tr><th>Inkomstenbelasting box 1</th><td>${fmt(sce.ib)}</td></tr>
  <tr><th>− Algemene heffingskorting</th><td>${fmt(sce.ahk)}</td></tr>
  <tr><th>− Arbeidskorting</th><td>${fmt(sce.ak)}</td></tr>
  <tr><th>− IACK</th><td>${fmt(sce.ic)}</td></tr>
  <tr><th>= IB na heffingskortingen</th><td>${fmt(sce.ibNetto)}</td></tr>
  <tr><th>Nettoloon</th><td>${fmt(sce.netto)}</td></tr>
  <tr><th>+ Zorgtoeslag</th><td>${fmt(sce.zorgtoeslag)}</td></tr>
  <tr><th>+ Huurtoeslag</th><td>${fmt(sce.huurtoeslag)}</td></tr>
  <tr><th>+ Kindgebonden budget</th><td>${fmt(sce.kindgebondenBudget)}</td></tr>
  <tr class="emph"><th>Besteedbaar inkomen</th><td>${fmt(sce.besteedbaar)}</td></tr>
  <tr><th colspan="2" class="section">Werkgeverslasten</th></tr>
  <tr><th>Vakantiegeld</th><td>${fmt(sce.werkgever.vakantiegeld)}</td></tr>
  <tr><th>WW (${flex ? "hoog" : "laag"})</th><td>${fmt(sce.werkgever.ww)}</td></tr>
  <tr><th>Aof + opslag kinderopvang</th><td>${fmt(sce.werkgever.aof + sce.werkgever.aofKO)}</td></tr>
  <tr><th>Werkhervattingskas (WHK)</th><td>${fmt(sce.werkgever.whk)}</td></tr>
  <tr><th>Werkgeversheffing Zvw</th><td>${fmt(sce.werkgever.zvw)}</td></tr>
  <tr><th>Pensioen werkgever</th><td>${fmt(sce.werkgever.pensioen)}</td></tr>
  <tr><th>Totale werkgeverslasten</th><td>${fmt(sce.werkgever.totaal)}</td></tr>
  <tr class="emph"><th>Totale kosten werkgever</th><td>${fmt(sce.totaalKostenWerkgever)}</td></tr>
  <tr class="emph"><th>Belastingwig</th><td>${fmt(sce.wig)} (${fmtPct(sce.wigPct)})</td></tr>
</table>

```js
function fmt(x) {
  return new Intl.NumberFormat("nl-NL", {style: "currency", currency: "EUR", maximumFractionDigits: 0}).format(x);
}
function fmtPct(x) {
  return new Intl.NumberFormat("nl-NL", {style: "percent", maximumFractionDigits: 1}).format(x);
}
```
