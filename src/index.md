---
toc: false
title: Marginale druk NL 2026
---

```js
import {scenario, marginaleDruk} from "./lib/calc.js";
import {dashboard, nearestRow} from "./lib/curves.js";
import {fmtEur, fmtPct, fmtPct0} from "./lib/format.js";
import {drukCurve} from "./components/druk-curve.js";
import {wigBar} from "./components/wig-bar.js";

const pctFmt = x => `${(x * 100).toFixed(1)}%`;
```

<div class="hero">
  <h1>Marginale druk Nederland <span class="tag">2026</span></h1>
  <p>Hoeveel houdt jouw werknemer over van een loonsverhoging — en wat kost die werkgever écht? Deze calculator stapelt alle officiële <em>2026</em>-tarieven op elkaar: belasting, heffingskortingen, toeslagen en werkgeverslasten. <a href="./uitleg">Hoe het werkt →</a></p>
</div>

## Jouw situatie

<div class="grid grid-cols-3" style="grid-auto-rows: auto;">
  <div class="card">
    <h3>Persoonlijk</h3>

```js
const bruto = view(Inputs.range([15000, 200000], {label: "Jaarbruto (€)", value: 50000, step: 500}));
```

```js
const aow = view(Inputs.toggle({label: "AOW-leeftijd"}));
```

```js
const expat = view(Inputs.toggle({label: "30%-regeling"}));
```

```js
const partner = view(Inputs.toggle({label: "Toeslagpartner"}));
```

```js
const partnerInkomen = view(Inputs.range([0, 150000], {label: "Inkomen partner (€)", value: 0, step: 500, disabled: !partner}));
```

```js
const partnerAOW = view(Inputs.toggle({label: "Partner AOW-leeftijd", disabled: !partner}));
```

  </div>
  <div class="card">
    <h3>Gezin & wonen</h3>

```js
const aantalKinderen = view(Inputs.range([0, 5], {label: "Aantal kinderen", value: 0, step: 1}));
```

```js
const jongsteKindOnder12 = view(Inputs.toggle({label: "Jongste kind < 12 (IACK)", value: aantalKinderen > 0, disabled: aantalKinderen === 0}));
```

```js
const huurMaand = view(Inputs.range([0, 1200], {label: "Maandhuur (€)", value: 0, step: 10}));
```

```js
const woz = view(Inputs.range([0, 1000000], {label: "WOZ-waarde eigen woning (€)", value: 0, step: 5000}));
```

```js
const hypoRente = view(Inputs.range([0, 30000], {label: "Hypotheekrente per jaar (€)", value: 0, step: 100, disabled: woz === 0}));
```

  </div>
  <div class="card">
    <h3>Arbeidsrelatie & pensioen</h3>

```js
const flex = view(Inputs.toggle({label: "Flex-/oproepcontract (WW-hoog)"}));
```

```js
const grootWerkgever = view(Inputs.toggle({label: "Grote werkgever (Aof-hoog)"}));
```

```js
const whk = view(Inputs.range([0.005, 0.05], {label: "WHK (sectoraal, %)", value: 0.0152, step: 0.001, format: pctFmt}));
```

```js
const pensioenWerkgeverPct = view(Inputs.range([0, 0.30], {label: "Pensioen werkgever (%)", value: 0.16, step: 0.005, format: pctFmt}));
```

```js
const pensioenWerknemerPct = view(Inputs.range([0, 0.15], {label: "Pensioen werknemer (%)", value: 0.06, step: 0.005, format: pctFmt}));
```

```js
const franchise = view(Inputs.range([0, 25000], {label: "Franchise pensioen (€)", value: 17545, step: 100}));
```

  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: auto;">
  <div class="card">
    <h3>Studielening</h3>

```js
const studieleningJaar = view(Inputs.range([0, 12000], {label: "Aflossing per jaar (€)", value: 0, step: 100}));
```

```js
const stelselOud = view(Inputs.toggle({label: "Stelsel vóór 2015 (12% i.p.v. 4%)", disabled: studieleningJaar === 0}));
```

  </div>
  <div class="card">
    <h3>Kinderopvang</h3>

```js
const kovUren = view(Inputs.range([0, 4000], {label: "Opvanguren per jaar (totaal)", value: 0, step: 50}));
```

```js
const kovUurprijs = view(Inputs.range([0, 15], {label: "Werkelijke uurprijs (€)", value: 10, step: 0.10, disabled: kovUren === 0}));
```

  </div>
</div>

```js
const kinderen = Array.from({length: aantalKinderen}, () => jongsteKindOnder12 ? 8 : 13);

const baseInput = {
  bruto, aow, expat,
  partner, partnerInkomen, partnerAOW,
  jongsteKindOnder12, huurMaand, kinderen,
  flex, grootWerkgever, whk,
  pensioenWerkgeverPct, pensioenWerknemerPct, franchise,
  woz, hypoRente,
  studieleningJaar, stelselOud,
  kovUren, kovUurprijs
};

const {sce, md, rows, long, wig} = dashboard(baseInput, {from: 10000, to: 160000, step: 500});
const here = nearestRow(rows, bruto);
```

<div class="grid grid-cols-4">
  <div class="card big">
    <h2>Marginale druk</h2>
    <span class="value">${fmtPct(md.drukOpBruto)}</span>
    <span class="muted small">van iedere extra € bruto loon gaat <em>niet</em> naar jou</span>
  </div>
  <div class="card big">
    <h2>Op werkgeverskost</h2>
    <span class="value">${fmtPct(md.drukOpWerkgever)}</span>
    <span class="muted small">van iedere extra € werkgeverskost komt niet bij jou aan</span>
  </div>
  <div class="card big">
    <h2>Besteedbaar / jaar</h2>
    <span class="value">${fmtEur(sce.besteedbaar)}</span>
    <span class="muted small">netto + alle toeslagen</span>
  </div>
  <div class="card big">
    <h2>Kost werkgever / jaar</h2>
    <span class="value">${fmtEur(sce.totaalKostenWerkgever)}</span>
    <span class="muted small">incl. premies, pensioen, vakantiegeld</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card chart">
    <h2>Waar gaat iedere extra euro heen?</h2>
    <p class="muted small">Stapel van marginale-druk-componenten over het hele inkomensspectrum. De zwarte lijn is het totaal. Onder 0% bouwen kortingen sneller op dan dat belasting toeneemt — meer dan 100% van een loonsverhoging blijft over. Boven 100% lever je netto in op een verhoging.</p>
    ${resize((width) => drukCurve({width, rows, long, currentBruto: bruto}))}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card chart">
    <h2>De wig bij ${fmtEur(bruto)} jaarbruto</h2>
    <p class="muted small">Eén balk: van wat de werkgever totaal kwijt is tot wat jij overhoudt. <em>Toeslagen</em> staan links van nul (ze tellen op bij je besteedbaar inkomen).</p>
    ${resize((width) => wigBar({width, segments: wig}))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Bij dit inkomen op de curve</h2>
    <table class="kv">
      <tr><th>Jaarbruto</th><td>${fmtEur(here.bruto)}</td></tr>
      <tr><th>Marginale druk</th><td>${fmtPct(here.marginaal)}</td></tr>
      <tr><th>Idem op werkgeverskost</th><td>${fmtPct(here.marginaalWg)}</td></tr>
      <tr><th colspan="2" class="section">Componenten van die marginale druk</th></tr>
      ${componentRows(here)}
    </table>
  </div>
  <div class="card">
    <h2>Alle bedragen op jaarbasis</h2>
    <table class="kv">
      <tr><th>Bruto</th><td>${fmtEur(sce.bruto)}</td></tr>
      <tr><th>− Pensioen werknemer</th><td>${fmtEur(-sce.eigenPensioen)}</td></tr>
      <tr><th>− Inkomstenbelasting netto</th><td>${fmtEur(-sce.ibNetto)}</td></tr>
      <tr><th>= Nettoloon</th><td>${fmtEur(sce.netto)}</td></tr>
      ${sce.studielening > 0 ? html`<tr><th>− Studielening</th><td>${fmtEur(-sce.studielening)}</td></tr>` : ""}
      <tr><th>+ Zorgtoeslag</th><td>${fmtEur(sce.zorgtoeslag)}</td></tr>
      <tr><th>+ Huurtoeslag</th><td>${fmtEur(sce.huurtoeslag)}</td></tr>
      <tr><th>+ Kindgebonden budget</th><td>${fmtEur(sce.kindgebondenBudget)}</td></tr>
      <tr><th>+ Kinderopvangtoeslag</th><td>${fmtEur(sce.kinderopvangtoeslag)}</td></tr>
      <tr class="emph"><th>= Besteedbaar</th><td>${fmtEur(sce.besteedbaar)}</td></tr>
      <tr><th colspan="2" class="section">Belastbaar inkomen</th></tr>
      <tr><th>Belastbaar loon</th><td>${fmtEur(sce.belastbaar)}</td></tr>
      ${sce.expat30 > 0 ? html`<tr><th>30%-regeling onbelast</th><td>${fmtEur(sce.expat30)}</td></tr>` : ""}
      ${Math.abs(sce.ewSaldo) > 0.5 ? html`<tr><th>Saldo eigen woning</th><td class=${sce.ewSaldo < 0 ? "neg" : ""}>${fmtEur(sce.ewSaldo)}</td></tr>` : ""}
      <tr><th>Verzamelinkomen</th><td>${fmtEur(sce.verzamelinkomen)}</td></tr>
      ${sce.partner ? html`<tr><th colspan="2" class="section">Partner (apart belast)</th></tr>
        <tr><th>Partner bruto</th><td>${fmtEur(sce.partner.bruto)}</td></tr>
        <tr><th>Partner IB netto</th><td>${fmtEur(sce.partner.ibNetto)}</td></tr>
        <tr><th>Partner netto</th><td>${fmtEur(sce.partner.netto)}</td></tr>
        <tr><th>Huishoudverzamelinkomen</th><td>${fmtEur(sce.huishoudInkomen)}</td></tr>` : ""}
      <tr><th colspan="2" class="section">Werkgeverslasten</th></tr>
      <tr><th>Vakantiegeld</th><td>${fmtEur(sce.werkgever.vakantiegeld)}</td></tr>
      <tr><th>WW (${flex ? "hoog" : "laag"})</th><td>${fmtEur(sce.werkgever.ww)}</td></tr>
      <tr><th>Aof + opslag KO</th><td>${fmtEur(sce.werkgever.aof + sce.werkgever.aofKO)}</td></tr>
      <tr><th>WHK</th><td>${fmtEur(sce.werkgever.whk)}</td></tr>
      <tr><th>Werkgeversheffing Zvw</th><td>${fmtEur(sce.werkgever.zvw)}</td></tr>
      <tr><th>Pensioen werkgever</th><td>${fmtEur(sce.werkgever.pensioen)}</td></tr>
      <tr class="emph"><th>Totaal werkgever</th><td>${fmtEur(sce.totaalKostenWerkgever)}</td></tr>
      <tr class="emph"><th>Belastingwig</th><td>${fmtEur(sce.wig)} <span class="muted">(${fmtPct(sce.wigPct)})</span></td></tr>
    </table>
  </div>
</div>

```js
function componentRows(r) {
  const components = [
    "Inkomstenbelasting",
    "Verlies algemene heffingskorting",
    "Verlies arbeidskorting",
    "Verlies IACK",
    "Pensioen werknemer",
    "Verlies zorgtoeslag",
    "Verlies huurtoeslag",
    "Verlies kindgebonden budget",
    "Verlies kinderopvangtoeslag",
    "Studielening"
  ];
  return html`${components.map(c => html`<tr><th>${c}</th><td class=${r[c] < 0 ? "neg" : ""}>${fmtPct(r[c])}</td></tr>`)}<tr class="emph"><th>Naar jou</th><td>${fmtPct(1 - r.marginaal)}</td></tr>`;
}
```

<div class="callout">
  <strong>Disclaimer.</strong> Dit model neemt alle gangbare factoren voor
  marginale druk op arbeid mee: box 1 met heffingskortingen, alle toeslagen
  (incl. kinderopvang), eigen woning met tariefcap, 30%-regeling,
  studieleningterugbetaling, sectorale WHK en partner als volledig apart
  scenario. Box 2 en box 3 vallen buiten de marginale druk op een
  loonsverhoging en zijn alleen ter referentie opgenomen op de
  <a href="./parameters">parameters-pagina</a>. Geen fiscaal advies.
</div>
