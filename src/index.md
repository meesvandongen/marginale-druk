---
toc: false
title: Marginale druk NL 2026
---

```js
import {scenario, marginaleDruk} from "./lib/calc.js";
import {curveWide, toLong, wigSegments} from "./lib/curves.js";
import {fmtEur, fmtPct} from "./lib/format.js";
import {drukCurve} from "./components/druk-curve.js";
import {wigBar} from "./components/wig-bar.js";
import {createOpbouwTable} from "./components/opbouw-table.js";

const pctFmt = x => `${(x * 100).toFixed(1)}%`;
```

<div class="hero">
  <h1>Marginale druk Nederland <span class="tag">2026</span></h1>
  <p>Hoeveel houd je over van je inkomen — en van een loonsverhoging? Vul je bruto jaarinkomen in en deze calculator stapelt alle officiële <em>2026</em>-tarieven op elkaar: belasting, heffingskortingen, toeslagen en werkgeverslasten. <a href="./uitleg">Hoe het werkt →</a></p>
</div>

```js
// De tabel is tegelijk invoer (bewerkbaar bruto-veld) én uitkomst. Hij wordt
// één keer opgebouwd en daarna in-place bijgewerkt, zodat typen nooit de
// focus verliest.
const opbouw = createOpbouwTable(50000);
const bruto = Generators.input(opbouw);
```

```js
const kinderen = Array.from({length: aantalKinderen}, () => jongsteKindOnder12 ? 8 : 13);

// Alles behalve het inkomen. De curve hangt hier vanaf; het inkomen niet,
// want elk curvepunt heeft zijn eigen bruto. Zo herberekent typen in de tabel
// alleen het goedkope losse scenario en blijft de invoer vloeiend.
const situatie = {
  aow, expat, arbeidsongeschikt,
  partner, partnerInkomen, partnerAOW,
  jongsteKindOnder12, huurMaand, kinderen,
  flex, grootWerkgever, whk,
  pensioenWerkgeverPct, pensioenWerknemerPct, franchise,
  woz, hypoRente,
  studieleningJaar, stelselOud,
  kovUren, kovUurprijs
};
```

```js
const rows = curveWide(situatie, {from: 8000, to: 250000, step: 1000});
const long = toLong(rows);
```

```js
const sce = scenario({...situatie, bruto});
const md = marginaleDruk({...situatie, bruto});
const wig = wigSegments(sce);

const dB = md.deltaBruto;
const comp = {
  bruto,
  marginaal: md.drukOpBruto,
  marginaalWg: md.drukOpWerkgever,
  "Inkomstenbelasting":               md.delta.ib / dB,
  "Verlies algemene heffingskorting": md.delta.ahk / dB,
  "Verlies arbeidskorting":           md.delta.ak / dB,
  "Verlies IACK":                     md.delta.ic / dB,
  "Pensioen werknemer":               md.delta.eigenPensioen / dB,
  "Verlies zorgtoeslag":              md.delta.zorgtoeslag / dB,
  "Verlies huurtoeslag":              md.delta.huurtoeslag / dB,
  "Verlies kindgebonden budget":      md.delta.kindgebondenBudget / dB,
  "Verlies kinderopvangtoeslag":      md.delta.kinderopvangtoeslag / dB,
  "Studielening":                     md.delta.studielening / dB
};

// Werk de resultaatcellen van de (al getoonde) tabel bij.
opbouw.update(sce);
```

<div class="grid grid-cols-1">
  <div class="card">
    <h2>Wat houd je netto over?</h2>
    <p class="muted small">Vul je bruto jaarinkomen in — elk bedrag mag, zonder stapjes. De tabel rekent direct uit wat eraf gaat, wat erbij komt en wat je besteedbaar overhoudt.</p>
    ${opbouw}
  </div>
</div>

<div class="grid grid-cols-4">
  <div class="card big">
    <h2>Marginale druk</h2>
    <span class="value">${fmtPct(md.drukOpBruto)}</span>
    <span class="muted small">van iedere extra € ${arbeidsongeschikt ? "uitkering" : "bruto loon"} gaat <em>niet</em> naar jou</span>
  </div>
  <div class="card big">
    <h2>${arbeidsongeschikt ? "Gemiddelde druk" : "Op werkgeverskost"}</h2>
    <span class="value">${arbeidsongeschikt ? fmtPct(sce.bruto > 0 ? 1 - sce.besteedbaar / sce.bruto : 0) : fmtPct(md.drukOpWerkgever)}</span>
    <span class="muted small">${arbeidsongeschikt ? html`van je bruto uitkering blijft <em>niet</em> besteedbaar over` : "van iedere extra € werkgeverskost komt niet bij jou aan"}</span>
  </div>
  <div class="card big">
    <h2>Besteedbaar / jaar</h2>
    <span class="value">${fmtEur(sce.besteedbaar)}</span>
    <span class="muted small">netto + alle toeslagen</span>
  </div>
  <div class="card big">
    <h2>${arbeidsongeschikt ? "Bruto uitkering / jaar" : "Kost werkgever / jaar"}</h2>
    <span class="value">${arbeidsongeschikt ? fmtEur(sce.bruto) : fmtEur(sce.totaalKostenWerkgever)}</span>
    <span class="muted small">${arbeidsongeschikt ? "WIA/WAO vóór belasting" : "incl. premies, pensioen, vakantiegeld"}</span>
  </div>
</div>

## Verfijn je situatie

<div class="grid grid-cols-3" style="grid-auto-rows: auto;">
  <div class="card">
    <h3>Persoonlijk</h3>

```js
const aow = view(Inputs.toggle({label: "AOW-leeftijd"}));
```

```js
const arbeidsongeschikt = view(Inputs.toggle({label: "Arbeidsongeschiktheidsuitkering (WIA/WAO)"}));
```

```js
const expat = view(Inputs.toggle({label: "30%-regeling", disabled: arbeidsongeschikt}));
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
const flex = view(Inputs.toggle({label: "Flex-/oproepcontract (WW-hoog)", disabled: arbeidsongeschikt}));
```

```js
const grootWerkgever = view(Inputs.toggle({label: "Grote werkgever (Aof-hoog)", disabled: arbeidsongeschikt}));
```

```js
const whk = view(Inputs.range([0.005, 0.05], {label: "WHK (sectoraal, %)", value: 0.0152, step: 0.001, format: pctFmt, disabled: arbeidsongeschikt}));
```

```js
const pensioenWerkgeverPct = view(Inputs.range([0, 0.30], {label: "Pensioen werkgever (%)", value: 0.16, step: 0.005, format: pctFmt, disabled: arbeidsongeschikt}));
```

```js
const pensioenWerknemerPct = view(Inputs.range([0, 0.15], {label: "Pensioen werknemer (%)", value: 0.06, step: 0.005, format: pctFmt, disabled: arbeidsongeschikt}));
```

```js
const franchise = view(Inputs.range([0, 25000], {label: "Franchise pensioen (€)", value: 17545, step: 100, disabled: arbeidsongeschikt}));
```

<p class="muted small">Een uitkering kent geen werkgever en geen pensioenopbouw, dus deze velden vervallen dan.</p>

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

<div class="grid grid-cols-1">
  <div class="card chart">
    <h2>Waar gaat iedere extra euro heen?</h2>
    <p class="muted small">Stapel van marginale-druk-componenten over het hele inkomensspectrum. De zwarte lijn is het totaal, de stip jouw inkomen. Onder 0% bouwen kortingen sneller op dan dat belasting toeneemt — meer dan 100% van een loonsverhoging blijft over. Boven 100% lever je netto in op een verhoging.</p>
    ${resize((width) => drukCurve({width, rows, long, currentBruto: bruto, currentMarginaal: md.drukOpBruto}))}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card chart">
    <h2>De wig bij ${fmtEur(bruto)} ${arbeidsongeschikt ? "bruto uitkering" : "jaarbruto"}</h2>
    <p class="muted small">${arbeidsongeschikt ? html`Eén balk: van de bruto uitkering tot wat jij overhoudt. Er is geen werkgever, dus de wig bestaat alleen uit belasting (minus toeslagen).` : html`Eén balk: van wat de werkgever totaal kwijt is tot wat jij overhoudt. <em>Toeslagen</em> staan links van nul (ze tellen op bij je besteedbaar inkomen).`}</p>
    ${resize((width) => wigBar({width, segments: wig}))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Marginale druk bij jouw inkomen</h2>
    <table class="kv">
      <tr><th>${arbeidsongeschikt ? "Bruto uitkering" : "Jaarbruto"}</th><td>${fmtEur(comp.bruto)}</td></tr>
      <tr><th>Marginale druk</th><td>${fmtPct(comp.marginaal)}</td></tr>
      ${arbeidsongeschikt ? "" : html`<tr><th>Idem op werkgeverskost</th><td>${fmtPct(comp.marginaalWg)}</td></tr>`}
      <tr><th colspan="2" class="section">Componenten van die marginale druk</th></tr>
      ${componentRows(comp)}
    </table>
  </div>
  <div class="card">
    <h2>Belastbaar inkomen & werkgeverslasten</h2>
    <table class="kv">
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
      ${sce.arbeidsongeschikt ? html`<tr><th colspan="2" class="section">Werkgeverslasten</th></tr>
        <tr><td colspan="2" class="muted small" style="text-align:left">Een uitkering kent geen werkgever, dus geen werkgeverslasten of belastingwig op werkgeverskost.</td></tr>` : html`<tr><th colspan="2" class="section">Werkgeverslasten</th></tr>
        <tr><th>Vakantiegeld</th><td>${fmtEur(sce.werkgever.vakantiegeld)}</td></tr>
        <tr><th>WW (${flex ? "hoog" : "laag"})</th><td>${fmtEur(sce.werkgever.ww)}</td></tr>
        <tr><th>Aof + opslag KO</th><td>${fmtEur(sce.werkgever.aof + sce.werkgever.aofKO)}</td></tr>
        <tr><th>WHK</th><td>${fmtEur(sce.werkgever.whk)}</td></tr>
        <tr><th>Werkgeversheffing Zvw</th><td>${fmtEur(sce.werkgever.zvw)}</td></tr>
        <tr><th>Pensioen werkgever</th><td>${fmtEur(sce.werkgever.pensioen)}</td></tr>
        <tr class="emph"><th>Totaal werkgever</th><td>${fmtEur(sce.totaalKostenWerkgever)}</td></tr>
        <tr class="emph"><th>Belastingwig</th><td>${fmtEur(sce.wig)} <span class="muted">(${fmtPct(sce.wigPct)})</span></td></tr>`}
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
  return html`${components.filter(c => Math.abs(r[c]) > 0.0005).map(c => html`<tr><th>${c}</th><td class=${r[c] < 0 ? "neg" : ""}>${fmtPct(r[c])}</td></tr>`)}<tr class="emph"><th>Naar jou</th><td>${fmtPct(1 - r.marginaal)}</td></tr>`;
}
```

<div class="callout">
  <strong>Disclaimer.</strong> Dit model neemt alle gangbare factoren voor
  marginale druk op arbeid mee: box 1 met heffingskortingen, alle toeslagen
  (incl. kinderopvang), eigen woning met tariefcap, 30%-regeling,
  studieleningterugbetaling, sectorale WHK en partner als volledig apart
  scenario. Een arbeidsongeschiktheidsuitkering wordt als uitkering behandeld
  (geen arbeidskorting, IACK, pensioen of werkgever). Box 2 en box 3 vallen
  buiten de marginale druk op een loonsverhoging en zijn alleen ter referentie
  opgenomen op de <a href="./parameters">parameters-pagina</a>. Geen fiscaal advies.
</div>
