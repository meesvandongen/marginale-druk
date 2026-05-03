---
title: Parameters 2026
---

# Parameters 2026

```js
import {PARAMS_2026} from "./lib/params.js";
```

<div class="hero">
<p>Alle bedragen die deze calculator gebruikt. Wijzigingen kun je doen in <code>src/lib/params.js</code>; de hele calculator wordt automatisch herberekend.</p>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Box 1 — onder AOW-leeftijd</h3>

```js
Inputs.table(PARAMS_2026.box1.underAOW.map((b, i, a) => ({
  schijf: i + 1,
  van: i === 0 ? 0 : a[i - 1].upTo,
  totEnMet: b.upTo === Infinity ? "—" : b.upTo,
  tarief: `${(b.rate * 100).toFixed(2)}%`
})), {layout: "auto"})
```

  </div>
  <div class="card">
    <h3>Box 1 — vanaf AOW-leeftijd</h3>

```js
Inputs.table(PARAMS_2026.box1.overAOW.map((b, i, a) => ({
  schijf: i + 1,
  van: i === 0 ? 0 : a[i - 1].upTo,
  totEnMet: b.upTo === Infinity ? "—" : b.upTo,
  tarief: `${(b.rate * 100).toFixed(2)}%`
})), {layout: "auto"})
```

  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Algemene heffingskorting</h3>

```js
Inputs.table([
  {scenario: "onder AOW", ...PARAMS_2026.algemeneHeffingskorting.underAOW},
  {scenario: "vanaf AOW", ...PARAMS_2026.algemeneHeffingskorting.overAOW}
], {layout: "auto"})
```

  </div>
  <div class="card">
    <h3>IACK — Inkomensafhankelijke combinatiekorting</h3>

```js
Inputs.table([PARAMS_2026.iack], {layout: "auto"})
```

  </div>
</div>

<div class="card">
  <h3>Arbeidskorting — segmenten onder AOW</h3>

```js
Inputs.table(PARAMS_2026.arbeidskorting.underAOW, {layout: "auto"})
```

</div>

<div class="card">
  <h3>Arbeidskorting — segmenten vanaf AOW</h3>

```js
Inputs.table(PARAMS_2026.arbeidskorting.overAOW, {layout: "auto"})
```

</div>

<div class="card">
  <h3>Zorgtoeslag</h3>

```js
Inputs.table([{
  standaardpremie: PARAMS_2026.zorgtoeslag.standaardpremie,
  drempelinkomen: PARAMS_2026.zorgtoeslag.drempel,
  norm_alleen: `${(PARAMS_2026.zorgtoeslag.norm.alleen*100).toFixed(3)}%`,
  norm_partner: `${(PARAMS_2026.zorgtoeslag.norm.partner*100).toFixed(3)}%`,
  afbouwpct: `${(PARAMS_2026.zorgtoeslag.afbouwPct*100).toFixed(2)}%`,
  max_alleen: PARAMS_2026.zorgtoeslag.max.alleen,
  max_partner: PARAMS_2026.zorgtoeslag.max.partner,
  inkomensgrens_alleen: PARAMS_2026.zorgtoeslag.inkomensgrens.alleen,
  inkomensgrens_partner: PARAMS_2026.zorgtoeslag.inkomensgrens.partner
}], {layout: "auto"})
```

</div>

<div class="card">
  <h3>Huurtoeslag (vereenvoudigd)</h3>

```js
Inputs.table([{
  basishuur: PARAMS_2026.huurtoeslag.eigenBijdrageBasis,
  kwaliteitskortingsgrens: PARAMS_2026.huurtoeslag.kwaliteitskortingsgrens,
  aftoppingsgrens_alleen: PARAMS_2026.huurtoeslag.aftoppingsgrens.alleen,
  aftoppingsgrens_partner: PARAMS_2026.huurtoeslag.aftoppingsgrens.partner,
  maxHuur: PARAMS_2026.huurtoeslag.maxHuur,
  inkomensMin_alleen: PARAMS_2026.huurtoeslag.inkomensMin.alleen,
  inkomensMin_partner: PARAMS_2026.huurtoeslag.inkomensMin.partner,
  afbouw_alleen: `${(PARAMS_2026.huurtoeslag.afbouwPct.alleen*100).toFixed(0)}%`,
  afbouw_partner: `${(PARAMS_2026.huurtoeslag.afbouwPct.partner*100).toFixed(0)}%`
}], {layout: "auto"})
```

</div>

<div class="card">
  <h3>Kindgebonden budget</h3>

```js
Inputs.table([{
  perKindBasis:           PARAMS_2026.kindgebondenBudget.perKindBasis,
  extra12_15:             PARAMS_2026.kindgebondenBudget.extra12_15,
  extra16_17:             PARAMS_2026.kindgebondenBudget.extra16_17,
  extraEersteKindAlleen:  PARAMS_2026.kindgebondenBudget.extraEersteKindAlleen,
  aloKop:                 PARAMS_2026.kindgebondenBudget.aloKop,
  drempel_alleen:         PARAMS_2026.kindgebondenBudget.drempel.alleen,
  drempel_partner:        PARAMS_2026.kindgebondenBudget.drempel.partner,
  afbouwPct: `${(PARAMS_2026.kindgebondenBudget.afbouwPct*100).toFixed(2)}%`
}], {layout: "auto"})
```

</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Studielening</h3>

```js
Inputs.table([{
  drempel_alleen:  PARAMS_2026.studielening.drempel.alleen,
  drempel_partner: PARAMS_2026.studielening.drempel.partner,
  pct_SF2015: `${(PARAMS_2026.studielening.pctSF2015*100).toFixed(0)}%`,
  pct_oud:    `${(PARAMS_2026.studielening.pctOud*100).toFixed(0)}%`
}], {layout: "auto"})
```

  </div>
  <div class="card">
    <h3>30%-regeling</h3>

```js
Inputs.table([{
  pct: `${(PARAMS_2026.expatRegeling.pct*100).toFixed(0)}%`,
  plafondGrondslag: PARAMS_2026.expatRegeling.plafondGrondslag
}], {layout: "auto"})
```

  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Kinderopvangtoeslag (lineaire benadering)</h3>

```js
Inputs.table([{
  maxUurprijs_dagopvang: PARAMS_2026.kinderopvangtoeslag.maxUurprijsDagopvang,
  maxUurprijs_BSO:       PARAMS_2026.kinderopvangtoeslag.maxUurprijsBSO,
  maxUurprijs_gastouder: PARAMS_2026.kinderopvangtoeslag.maxUurprijsGastouder,
  vergoeding_max: `${(PARAMS_2026.kinderopvangtoeslag.vergoedingMax*100).toFixed(0)}%`,
  vergoeding_min: `${(PARAMS_2026.kinderopvangtoeslag.vergoedingMin*100).toFixed(0)}%`,
  inkomenMin: PARAMS_2026.kinderopvangtoeslag.inkomenMin,
  inkomenMax: PARAMS_2026.kinderopvangtoeslag.inkomenMax
}], {layout: "auto"})
```

  </div>
  <div class="card">
    <h3>Eigen woning</h3>

```js
Inputs.table([{
  ewfPct:           `${(PARAMS_2026.eigenWoning.ewfPct*100).toFixed(2)}%`,
  maxAftrekTarief:  `${(PARAMS_2026.eigenWoning.maxAftrekTarief*100).toFixed(2)}%`
}], {layout: "auto"})
```

  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Box 2 — aanmerkelijk belang (referentie)</h3>

```js
Inputs.table(PARAMS_2026.box2.schijven.map((b, i, a) => ({
  schijf: i + 1,
  van: i === 0 ? 0 : a[i - 1].upTo,
  totEnMet: b.upTo === Infinity ? "—" : b.upTo,
  tarief: `${(b.rate * 100).toFixed(1)}%`
})), {layout: "auto"})
```

  </div>
  <div class="card">
    <h3>Box 3 — vermogen (referentie)</h3>

```js
Inputs.table([{
  heffingsvrijVermogen: PARAMS_2026.box3.heffingsvrijVermogen,
  forfaitairRendement: `${(PARAMS_2026.box3.forfaitairRendement*100).toFixed(2)}%`,
  tarief: `${(PARAMS_2026.box3.tarief*100).toFixed(0)}%`
}], {layout: "auto"})
```

  </div>
</div>

<div class="card">
  <h3>Werkgeverslasten</h3>

```js
Inputs.table(Object.entries(PARAMS_2026.werkgeverslasten).map(([k, v]) => ({
  parameter: k,
  waarde: typeof v === "number" && v < 1 ? `${(v*100).toFixed(2)}%` : v
})), {layout: "auto"})
```

</div>

<div class="callout">
  <strong>Bronnen.</strong>

  <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_1/box_1">Belastingdienst — Box 1 tarieven 2026</a> ·
  <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2026">Tabel arbeidskorting 2026</a> ·
  <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/berekening-zorgtoeslag-2026">Berekening zorgtoeslag 2026</a> ·
  <a href="https://www.volkshuisvestingnederland.nl/onderwerpen/huren-en-wonen/huurtoeslag/werking-en-berekening-huurtoeslag">Volkshuisvesting Nederland — werking huurtoeslag</a> ·
  <a href="https://www.pwc.nl/nl/belastingplan/fiscale-maatregelen-2026.html">PwC — Belastingplan 2026</a> ·
  <a href="https://www.vanoers.nl/nieuws/hr-solutions/werkgeverslasten-2026/">Werkgeverslasten 2026 (Van Oers)</a> ·
  <a href="https://wb-nsc.nl/artikelen/onzichtbare-belasting-op-arbeid-wordt-ondraaglijk/">WB-NSC — Onzichtbare belasting op arbeid (april 2026)</a>
</div>
