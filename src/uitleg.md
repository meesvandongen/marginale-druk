---
title: Hoe het werkt
---

# Hoe het werkt

<div class="hero">
<p><strong>Marginale druk</strong> is het percentage van iedere extra verdiende euro dat je <em>niet</em> in je portemonnee houdt. Het is iets anders dan de gemiddelde belasting: marginale druk telt álles op wat er met de <em>volgende</em> euro gebeurt — meer belasting, minder heffingskorting, minder toeslagen. In bepaalde inkomenszones in Nederland kan deze druk boven de <strong>100%</strong> komen, waardoor een loonsverhoging je netto slechter af maakt.</p>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Inkomstenbelasting box 1 (onder AOW)</h3>

| Schijf | Tot       | Tarief  |
|--------|-----------|---------|
| 1      | € 38.883  | 35,75%  |
| 2      | € 78.426  | 37,56%  |
| 3      | hoger     | 49,50%  |

<p class="muted small">Schijf 1 = 8,10% inkomstenbelasting + 27,65% premie volksverzekeringen (AOW, Anw, Wlz). Boven AOW-leeftijd: schijf 1 = 17,85%.</p>
  </div>
  <div class="card">
    <h3>Heffingskortingen — directe kortingen op de te betalen belasting</h3>

- **Algemene heffingskorting**: max € 3.115. Afbouw met **6,398%** boven € 29.736; nul op € 78.426.
- **Arbeidskorting**: piecewise opbouw tot piek € 5.685 bij € 45.592, daarna afbouw **6,51%** per euro tot nul op € 132.920.
- **IACK**: max € 3.032 (alleen met kind < 12). Bouwt op met **11,45%** vanaf arbeidsinkomen € 6.239 — een *verlagend* effect op de marginale druk.
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Toeslagen — afbouw bij oplopend inkomen</h3>

Elke afgebouwde toeslag voegt zijn afbouwpercentage toe aan de marginale druk.

- **Zorgtoeslag**: afbouw **13,73%** boven € 29.736 (huishoudinkomen).
- **Huurtoeslag**: afbouw **27%** alleenstaand / **22%** met partner per euro huishoudinkomen boven het minimum.
- **Kindgebonden budget**: afbouw **7,60%** boven het toetsingsinkomen.
  </div>
  <div class="card">
    <h3>Werkgeverszijde — wat de werkgever bovenop het loon kwijt is</h3>

- **WW**: 2,74% laag / 7,74% hoog
- **Aof**: 6,27% klein / 7,63% groot
- **Uniforme opslag kinderopvang**: 0,50%
- **Werkhervattingskas (WHK)**: ~1,52%
- **Werkgeversheffing Zvw**: 6,10%
- **Vakantiegeld**: 8%
- **Pensioenpremie werkgever**: 12–20% (varieert sterk per fonds)

<p class="muted small">Boven het maximumpremieloon van € 79.409 vallen WW, Aof, WHK en Zvw weg. Alleen pensioen en vakantiegeld stijgen daarna nog mee.</p>
  </div>
</div>

## Stapeling: de extreme zones

Onderstaande tabel laat zien hoe de combinatie van afbouwen voor een alleenstaande zonder partner kan optellen tot extreme marginale-druk-percentages.

<div class="card">

| Inkomenszone (huishouden) | Belangrijkste effecten | Marginale druk |
|---------------------------|------------------------|----------------|
| € 0 – € 11.965            | Box 1 schijf 1, opbouw arbeidskorting (−8,3%) | ≈ 27% |
| € 11.965 – € 25.845       | Opbouw arbeidskorting (−31%) overheerst | < 10% |
| € 25.845 – € 29.736       | Lichte opbouw arbeidskorting | ≈ 35% |
| € 29.736 – € 41.000       | Afbouw AHK + zorgtoeslag (+ huurtoeslag indien van toepassing) | 60% – 100%+ |
| € 45.592 – € 78.426       | Schijf 2 + AHK-afbouw + arbeidskorting-afbouw | ≈ 56% |
| € 78.426 – € 132.920      | Schijf 3 + arbeidskorting-afbouw | ≈ 56% |
| > € 132.920               | Alleen schijf 3 | ≈ 49,5% |

</div>

## Wat doet deze calculator wel/niet?

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Wel — alle componenten in de marginale druk op arbeid</h3>

- Box 1 inkomstenbelasting met heffingskortingen (AHK, AK, IACK)
- Toeslagen: zorgtoeslag, huurtoeslag, kindgebonden budget, kinderopvangtoeslag
- Werkgeverslasten incl. variabele WHK en pensioen
- Eigen woning: hypotheekrenteaftrek met tariefcap (37,48%) en eigenwoningforfait
- 30%-regeling voor expats (gecapped op WNT-norm)
- Studieleningterugbetaling (stelsel SF2015 / SF2024 of stelsel vóór 2015)
- Toeslagpartner als <em>volledig</em> tweede scenario: eigen schijven, eigen heffingskortingen — verzamelinkomens worden opgeteld voor toeslagentoetsing
- Vergelijking AOW vs. niet-AOW (per persoon instelbaar)
- <strong>Arbeidsongeschiktheidsuitkering (WIA/WAO)</strong>: een uitkering is geen arbeidsinkomen, dus géén arbeidskorting en géén IACK, geen pensioenopbouw en geen werkgeverslasten. Box 1 en de toeslagen werken wél gewoon.
- Marginale druk in beide richtingen: bruto en werkgeverskost
  </div>
  <div class="card">
    <h3>Buiten scope (niet relevant voor druk op arbeid)</h3>

- <strong>Box 2</strong> (aanmerkelijk belang) — separate box, beïnvloedt marginale druk op een loonsverhoging niet. Tarieven staan op de <a href="./parameters">parameters-pagina</a>.
- <strong>Box 3</strong> (vermogen) — idem; forfaitair rendement.
- <strong>Niet-arbeidsgebonden inkomsten</strong>: ontvangen alimentatie, lijfrente.
- <strong>Reiskostenvergoeding</strong>, ET-regeling, eindheffingen onder de WKR — meestal cao-specifiek.
  </div>
</div>

## Bronnen

Zie de pagina [Parameters](./parameters) voor alle exacte 2026-cijfers met
verwijzingen naar de officiële publicaties van de Belastingdienst, het
Ministerie van Financiën en het [WB-NSC-rapport over verborgen lasten op
arbeid](https://wb-nsc.nl/artikelen/onzichtbare-belasting-op-arbeid-wordt-ondraaglijk/).
