// All Dutch tax & allowance parameters for fiscal year 2026.
// Sources: Belastingdienst, Rijksoverheid, Belastingplan 2026.
// Values are jaarbedragen in euro's tenzij anders aangegeven.

export const PARAMS_2026 = {
  // ---------- BOX 1: progressive income tax ----------
  // Onder AOW-leeftijd. Eerste schijf bevat 27,65% volksverzekeringen + 8,10% IB.
  box1: {
    underAOW: [
      { upTo: 38883, rate: 0.3575 },
      { upTo: 78426, rate: 0.3756 },
      { upTo: Infinity, rate: 0.495 }
    ],
    // Boven AOW: geen AOW-premie meer in de eerste schijf.
    overAOW: [
      { upTo: 38883, rate: 0.1785 },
      { upTo: 78426, rate: 0.3756 },
      { upTo: Infinity, rate: 0.495 }
    ]
  },

  // ---------- Heffingskortingen ----------
  algemeneHeffingskorting: {
    underAOW: { max: 3115, afbouwStart: 29736, afbouwPct: 0.06398, eind: 78426 },
    overAOW: { max: 1556, afbouwStart: 29736, afbouwPct: 0.03195, eind: 78426 }
  },

  // Arbeidskorting: piecewise linear. base = waarde aan begin segment;
  // de korting binnen het segment = base + rate * (income - segmentStart).
  arbeidskorting: {
    underAOW: [
      { from: 0,      to: 11965,    base: 0,    rate: 0.08324 },
      { from: 11965,  to: 25845,    base: 996,  rate: 0.31009 },
      { from: 25845,  to: 45592,    base: 5300, rate: 0.0195 },
      { from: 45592,  to: 132920,   base: 5685, rate: -0.0651 },
      { from: 132920, to: Infinity, base: 0,    rate: 0 }
    ],
    overAOW: [
      { from: 0,      to: 11965,    base: 0,    rate: 0.04156 },
      { from: 11965,  to: 25845,    base: 498,  rate: 0.15483 },
      { from: 25845,  to: 45592,    base: 2647, rate: 0.00974 },
      { from: 45592,  to: 132920,   base: 2840, rate: -0.0325 },
      { from: 132920, to: Infinity, base: 0,    rate: 0 }
    ]
  },

  // Inkomensafhankelijke combinatiekorting (alleen als jongste kind < 12 jaar).
  iack: {
    drempel: 6239, // arbeidsinkomen-grens om recht te krijgen
    opbouwPct: 0.1145, // 11,45% over arbeidsinkomen boven drempel
    max: 3032 // bereikt bij arbeidsinkomen ≈ 32.720
  },

  // ---------- Werknemerszijde sociale verzekeringen ----------
  // Werknemer betaalt zelf geen AOW/Anw los; die zit in box 1 schijf 1.
  // De inkomensafhankelijke bijdrage Zvw door werknemers (4,85%) geldt alleen
  // voor mensen zonder werkgever (zzp/pensioen). Voor werknemers betaalt de
  // werkgever de werkgeversheffing Zvw — geen aftrek op nettoloon.
  zvwWerknemer: {
    pct: 0.0485, // alleen voor zzp / pensioen / niet-werknemers
    maxBijdrageloon: 79409
  },

  // ---------- Toeslagen ----------
  zorgtoeslag: {
    standaardpremie: 2143,         // 2026 standaardpremie Zvw
    drempel: 29736,                // WML-equivalent
    norm: { alleen: 0.01912, partner: 0.04289 },
    afbouwPct: 0.1373,             // boven drempel
    max: { alleen: 1548, partner: 2952 },
    inkomensgrens: { alleen: 41032, partner: 51492 }
  },

  // Huurtoeslag (vereenvoudigd nieuw model 2026).
  // Boven het inkomensminimum loopt de toeslag lineair af met afbouwPct van
  // elke extra euro huishoudinkomen. De "rent slope" structuur bepaalt het
  // maximumbedrag bij minimum inkomen.
  huurtoeslag: {
    kwaliteitskortingsgrens: 498.20,   // per maand
    aftoppingsgrens: { alleen: 713.02, partner: 764.14 },
    maxHuur: 932.93,
    eigenBijdrageBasis: 240.49,        // benadering basishuur 2026
    afbouwPct: { alleen: 0.27, partner: 0.22 }, // per euro huishoudinkomen
    inkomensMin: { alleen: 23425, partner: 31500 } // boven dit bedrag begint afbouw
  },

  // Kindgebonden budget.
  // Maxima zijn afhankelijk van aantal kinderen + leeftijd.
  // Hier het basisbedrag voor 1 kind onder de 12 + ALO-kop voor alleenstaanden.
  kindgebondenBudget: {
    perKindBasis: 2580,            // per kind <12, jaarlijks
    extra12_15: 703,               // extra per kind 12-15
    extra16_17: 936,               // extra per kind 16-17
    extraEersteKindAlleen: 3416,   // ophoging eerste kind voor alleenstaande ouder
    aloKop: 3407,                  // alleenstaande-ouderkop
    drempel: { alleen: 29736, partner: 39141 },
    afbouwPct: 0.0760
  },

  // ---------- Werkgeverslasten 2026 ----------
  werkgeverslasten: {
    wwLaag: 0.0274,                 // vast contract
    wwHoog: 0.0774,                 // flex/oproep
    aofLaag: 0.0627,                // kleine werkgever (<25× gem. premieloon)
    aofHoog: 0.0763,                // grote werkgever
    aofOpslagKinderopvang: 0.0050,  // uniforme opslag
    whkGemiddeld: 0.0152,           // Werkhervattingskas (gem. WGA + ZW)
    zvwWerkgever: 0.0610,           // werkgeversheffing Zvw
    ufoOverheid: 0.0068,            // alleen overheid
    maxPremieloon: 79409,
    pensioenWerkgeverDefault: 0.16, // typisch werkgeverdeel pensioen
    pensioenWerknemerDefault: 0.06, // typisch werknemerdeel pensioen
    franchisePensioen: 17545        // benadering AOW-franchise 2026
  },

  // Vakantiegeld
  vakantiegeldPct: 0.08,

  // ---------- Studielening (terugbetalingsdruk) ----------
  // Onder drempel: geen aflossing. Boven drempel: een vast percentage van het
  // verschil. Drempel ≈ 100% WML alleenstaand / 143% WML met partner (2026).
  studielening: {
    drempel: { alleen: 25400, partner: 36322 },
    pctSF2015: 0.04,   // huidig stelsel sinds 2015 + stelsel 2024
    pctOud:    0.12    // stelsel van vóór 2015
  },

  // ---------- Kinderopvangtoeslag ----------
  // Vereenvoudigd: lineaire afbouw van vergoedingspercentage tussen
  // inkomenMin (96%) en inkomenMax (33%). Werkelijke schalentabel kent
  // tientallen treden — voor een marginale-druk-analyse is een lineaire
  // benadering meer dan voldoende want de afbouwhelling is wat telt.
  kinderopvangtoeslag: {
    maxUurprijsDagopvang: 11.06,
    maxUurprijsBSO:        9.52,
    maxUurprijsGastouder:  8.30,
    vergoedingMax: 0.96,
    vergoedingMin: 0.33,
    inkomenMin: 25000,
    inkomenMax: 230000
  },

  // ---------- 30%-regeling (expatregeling) ----------
  // 30% van bruto loon onbelast; grondslag gecapped op WNT-norm.
  expatRegeling: {
    pct: 0.30,
    plafondGrondslag: 246000
  },

  // ---------- Eigen woning ----------
  // Eigenwoningforfait als bijtelling op belastbaar inkomen, hypotheekrente
  // als aftrek. Het belastingvoordeel op de aftrek is gecapped op het tarief
  // van de eerste schijf IB-deel (37,48% in 2026).
  eigenWoning: {
    ewfPct: 0.0035,
    maxAftrekTarief: 0.3748
  },

  // ---------- Box 2 / Box 3 ----------
  // Box 2 en 3 vallen buiten de marginale druk op arbeid (separate boxen),
  // maar staan hier voor referentie en eventueel aanvullende berekeningen
  // op huishoudniveau.
  box2: {
    schijven: [
      { upTo: 67000,    rate: 0.245 },
      { upTo: Infinity, rate: 0.31  }
    ]
  },
  box3: {
    heffingsvrijVermogen: 57684,
    forfaitairRendement: 0.0589,
    tarief: 0.36
  }
};
