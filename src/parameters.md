---
title: Gebruikte parameters 2026
---

# Parameters 2026

Alle bedragen zoals gebruikt door deze calculator. Wijzigingen kun je doen in
`src/lib/params.js`.

```js
import {PARAMS_2026} from "./lib/params.js";
```

## Box 1 — onder AOW-leeftijd

```js
Inputs.table(PARAMS_2026.box1.underAOW.map((b, i, a) => ({
  schijf: i + 1,
  van: i === 0 ? 0 : a[i - 1].upTo,
  totEnMet: b.upTo === Infinity ? "−" : b.upTo,
  tarief: `${(b.rate * 100).toFixed(2)}%`
})), {layout: "auto"})
```

## Box 1 — vanaf AOW-leeftijd

```js
Inputs.table(PARAMS_2026.box1.overAOW.map((b, i, a) => ({
  schijf: i + 1,
  van: i === 0 ? 0 : a[i - 1].upTo,
  totEnMet: b.upTo === Infinity ? "−" : b.upTo,
  tarief: `${(b.rate * 100).toFixed(2)}%`
})), {layout: "auto"})
```

## Algemene heffingskorting

```js
Inputs.table([
  {scenario: "onder AOW", ...PARAMS_2026.algemeneHeffingskorting.underAOW},
  {scenario: "vanaf AOW", ...PARAMS_2026.algemeneHeffingskorting.overAOW}
], {layout: "auto"})
```

## Arbeidskorting — segmenten onder AOW

```js
Inputs.table(PARAMS_2026.arbeidskorting.underAOW, {layout: "auto"})
```

## Arbeidskorting — segmenten vanaf AOW

```js
Inputs.table(PARAMS_2026.arbeidskorting.overAOW, {layout: "auto"})
```

## IACK — Inkomensafhankelijke combinatiekorting

```js
Inputs.table([PARAMS_2026.iack], {layout: "auto"})
```

## Zorgtoeslag

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

## Huurtoeslag (vereenvoudigd)

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

## Kindgebonden budget

```js
Inputs.table([PARAMS_2026.kindgebondenBudget], {layout: "auto"})
```

## Werkgeverslasten

```js
Inputs.table(Object.entries(PARAMS_2026.werkgeverslasten).map(([k, v]) => ({
  parameter: k,
  waarde: typeof v === "number" && v < 1 ? `${(v*100).toFixed(2)}%` : v
})), {layout: "auto"})
```

## Bronnen

- [Belastingdienst: Box 1 tarieven 2026](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_1/box_1)
- [Belastingdienst: Tabel arbeidskorting 2026](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2026)
- [Belastingdienst: Berekening zorgtoeslag 2026](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/berekening-zorgtoeslag-2026)
- [Volkshuisvesting Nederland: werking huurtoeslag](https://www.volkshuisvestingnederland.nl/onderwerpen/huren-en-wonen/huurtoeslag/werking-en-berekening-huurtoeslag)
- [Belastingplan 2026 — overzicht](https://www.pwc.nl/nl/belastingplan/fiscale-maatregelen-2026.html)
- [Werkgeverslasten 2026 (Van Oers)](https://www.vanoers.nl/nieuws/hr-solutions/werkgeverslasten-2026/)
