// Pure berekeningsfuncties voor de Nederlandse marginale druk 2026.
// Alles in jaarbedragen, alles deterministisch, alles client-side.
import { PARAMS_2026 } from "./params.js";

const P = PARAMS_2026;

// -------- Box 1 inkomstenbelasting (excl. heffingskortingen) --------
export function box1Tax(belastbaarInkomen, { aow = false } = {}) {
  const brackets = aow ? P.box1.overAOW : P.box1.underAOW;
  let tax = 0;
  let last = 0;
  for (const b of brackets) {
    const top = Math.min(belastbaarInkomen, b.upTo);
    if (top > last) tax += (top - last) * b.rate;
    if (belastbaarInkomen <= b.upTo) break;
    last = b.upTo;
  }
  return tax;
}

export function box1MarginalRate(belastbaarInkomen, { aow = false } = {}) {
  const brackets = aow ? P.box1.overAOW : P.box1.underAOW;
  for (const b of brackets) if (belastbaarInkomen <= b.upTo) return b.rate;
  return brackets[brackets.length - 1].rate;
}

// -------- Heffingskortingen --------
export function algemeneHeffingskorting(belastbaarInkomen, { aow = false } = {}) {
  const c = aow ? P.algemeneHeffingskorting.overAOW : P.algemeneHeffingskorting.underAOW;
  if (belastbaarInkomen <= c.afbouwStart) return c.max;
  if (belastbaarInkomen >= c.eind) return 0;
  const verlaging = (belastbaarInkomen - c.afbouwStart) * c.afbouwPct;
  return Math.max(0, c.max - verlaging);
}

export function arbeidskorting(arbeidsinkomen, { aow = false } = {}) {
  const segs = aow ? P.arbeidskorting.overAOW : P.arbeidskorting.underAOW;
  for (const s of segs) {
    if (arbeidsinkomen <= s.to) {
      return Math.max(0, s.base + s.rate * (arbeidsinkomen - s.from));
    }
  }
  return 0;
}

export function iack(arbeidsinkomen, { jongsteKindOnder12 = false } = {}) {
  if (!jongsteKindOnder12) return 0;
  if (arbeidsinkomen <= P.iack.drempel) return 0;
  const opbouw = (arbeidsinkomen - P.iack.drempel) * P.iack.opbouwPct;
  return Math.min(P.iack.max, opbouw);
}

// -------- Eigen woning --------
// Saldo eigen woning = EWF (bijtelling) − hypotheekrente (aftrek).
// Negatief = aftrekpost. Aftrek-voordeel is gecapped op tarief eerste schijf.
export function eigenWoningSaldo({ hypoRente = 0, woz = 0 } = {}) {
  return P.eigenWoning.ewfPct * woz - hypoRente;
}

// -------- 30%-regeling (expat) --------
// 30% van bruto onbelast, grondslag gecapped op WNT-norm.
export function expatVrij(bruto, { expat = false } = {}) {
  if (!expat) return 0;
  const e = P.expatRegeling;
  return e.pct * Math.min(bruto, e.plafondGrondslag);
}

// -------- Studielening (terugbetalingsdruk) --------
export function studielening(toetsingsinkomen, {
  studieleningJaar = 0,
  stelselOud = false,
  partner = false
} = {}) {
  if (!studieleningJaar || studieleningJaar <= 0) return 0;
  const s = P.studielening;
  const drempel = partner ? s.drempel.partner : s.drempel.alleen;
  const pct = stelselOud ? s.pctOud : s.pctSF2015;
  const overdrempel = Math.max(0, toetsingsinkomen - drempel);
  return Math.min(studieleningJaar, pct * overdrempel);
}

// -------- Toeslagen --------
export function zorgtoeslag(huishoudInkomen, { partner = false } = {}) {
  const z = P.zorgtoeslag;
  const aantal = partner ? 2 : 1;
  const base = aantal === 2 ? z.standaardpremie * 2 : z.standaardpremie;
  const norm = partner ? z.norm.partner : z.norm.alleen;
  const grens = partner ? z.inkomensgrens.partner : z.inkomensgrens.alleen;
  const max = partner ? z.max.partner : z.max.alleen;
  if (huishoudInkomen >= grens) return 0;
  const inkomenBovenDrempel = Math.max(0, huishoudInkomen - z.drempel);
  const inkomenOnderDrempel = Math.min(huishoudInkomen, z.drempel);
  const normpremie = norm * inkomenOnderDrempel + z.afbouwPct * inkomenBovenDrempel;
  return Math.max(0, Math.min(max, base - normpremie));
}

export function huurtoeslag(huishoudInkomen, huurMaand, { partner = false } = {}) {
  const h = P.huurtoeslag;
  if (huurMaand <= 0) return 0;
  const subsidiableHuur = Math.min(huurMaand, h.maxHuur);
  const basis = h.eigenBijdrageBasis;
  if (subsidiableHuur <= basis) return 0;

  const kkg = h.kwaliteitskortingsgrens;
  const aft = partner ? h.aftoppingsgrens.partner : h.aftoppingsgrens.alleen;

  let maxJaar = 0;
  if (subsidiableHuur <= kkg) {
    maxJaar = (subsidiableHuur - basis) * 12;
  } else if (subsidiableHuur <= aft) {
    maxJaar = ((kkg - basis) + 0.65 * (subsidiableHuur - kkg)) * 12;
  } else {
    maxJaar =
      ((kkg - basis) + 0.65 * (aft - kkg) + 0.4 * (subsidiableHuur - aft)) * 12;
  }

  const grens = partner ? h.inkomensMin.partner : h.inkomensMin.alleen;
  const af = partner ? h.afbouwPct.partner : h.afbouwPct.alleen;
  const verlaging = Math.max(0, (huishoudInkomen - grens) * af);
  return Math.max(0, maxJaar - verlaging);
}

export function kindgebondenBudget(huishoudInkomen, { partner = false, kinderen = [] } = {}) {
  const k = P.kindgebondenBudget;
  if (kinderen.length === 0) return 0;
  let max = 0;
  kinderen.forEach((leeftijd, i) => {
    let kindBedrag = k.perKindBasis;
    if (i === 0 && !partner) kindBedrag += k.extraEersteKindAlleen;
    if (leeftijd >= 12 && leeftijd <= 15) kindBedrag += k.extra12_15;
    if (leeftijd >= 16 && leeftijd <= 17) kindBedrag += k.extra16_17;
    max += kindBedrag;
  });
  if (!partner) max += k.aloKop;

  const drempel = partner ? k.drempel.partner : k.drempel.alleen;
  const verlaging = Math.max(0, huishoudInkomen - drempel) * k.afbouwPct;
  return Math.max(0, max - verlaging);
}

// -------- Kinderopvangtoeslag --------
// Vereenvoudigd: vergoedingspercentage daalt lineair tussen inkomenMin en
// inkomenMax. Echte tabel kent tientallen treden, maar voor de marginale
// druk telt vooral de afbouwhelling — die is hier (vergMax-vergMin)/range.
export function kinderopvangtoeslag(huishoudInkomen, {
  kovUren = 0,
  kovUurprijs = 0
} = {}) {
  if (kovUren <= 0 || kovUurprijs <= 0) return 0;
  const k = P.kinderopvangtoeslag;
  let pct;
  if (huishoudInkomen <= k.inkomenMin) pct = k.vergoedingMax;
  else if (huishoudInkomen >= k.inkomenMax) pct = k.vergoedingMin;
  else {
    const t = (huishoudInkomen - k.inkomenMin) / (k.inkomenMax - k.inkomenMin);
    pct = k.vergoedingMax - t * (k.vergoedingMax - k.vergoedingMin);
  }
  const uurprijs = Math.min(kovUurprijs, k.maxUurprijsDagopvang);
  return pct * uurprijs * kovUren;
}

// -------- Werkgeverslasten --------
export function werkgeverslasten(brutoLoon, opties = {}) {
  const {
    flex = false,
    grootWerkgever = false,
    pensioenWerkgeverPct,
    franchise = P.werkgeverslasten.franchisePensioen,
    whk = P.werkgeverslasten.whkGemiddeld,
    vakantiegeldOpgeteld = true
  } = opties;
  const w = P.werkgeverslasten;
  const grondslag = vakantiegeldOpgeteld ? brutoLoon * (1 + P.vakantiegeldPct) : brutoLoon;
  const premieloon = Math.min(grondslag, w.maxPremieloon);

  const ww = (flex ? w.wwHoog : w.wwLaag) * premieloon;
  const aof = (grootWerkgever ? w.aofHoog : w.aofLaag) * premieloon;
  const aofKO = w.aofOpslagKinderopvang * premieloon;
  const whkBedrag = whk * premieloon;
  const zvw = w.zvwWerkgever * premieloon;

  const pensioenPct = pensioenWerkgeverPct ?? w.pensioenWerkgeverDefault;
  const pensioenGrondslag = Math.max(0, grondslag - franchise);
  const pensioen = pensioenPct * pensioenGrondslag;

  const vakantiegeld = vakantiegeldOpgeteld ? brutoLoon * P.vakantiegeldPct : 0;

  return {
    ww, aof, aofKO, whk: whkBedrag, zvw, pensioen, vakantiegeld,
    totaal: ww + aof + aofKO + whkBedrag + zvw + pensioen + vakantiegeld
  };
}

// -------- IB inclusief eigen-woning-tariefcap --------
// Tariefsaanpassing aftrek eigen woning (37,48% in 2026): aftrek-voordeel mag
// nooit meer zijn dan dat percentage van het aftrekbedrag.
function box1MetEigenWoning(belastbaarLoon, ewSaldo, { aow = false } = {}) {
  if (ewSaldo >= 0) {
    return box1Tax(belastbaarLoon + ewSaldo, { aow });
  }
  const aftrek = -ewSaldo;
  const ibZonderAftrek = box1Tax(belastbaarLoon, { aow });
  const ibMetVolledigeAftrek = box1Tax(Math.max(0, belastbaarLoon - aftrek), { aow });
  const voordeelVolledig = ibZonderAftrek - ibMetVolledigeAftrek;
  const voordeelMax = aftrek * P.eigenWoning.maxAftrekTarief;
  return ibZonderAftrek - Math.min(voordeelVolledig, voordeelMax);
}

// -------- Per-persoon scenario (intern) --------
function persoonScenario({
  bruto,
  aow = false,
  expat = false,
  arbeidsongeschikt = false,
  pensioenWerknemerPct = 0,
  franchise = 0,
  jongsteKindOnder12 = false,
  hypoRente = 0,
  woz = 0
}) {
  // Een arbeidsongeschiktheidsuitkering (WIA/WAO) is geen arbeidsinkomen:
  // er wordt geen pensioen via een werkgever opgebouwd en de 30%-regeling
  // geldt niet.
  const grondslagPensioen = Math.max(0, bruto - franchise);
  const eigenPensioen = arbeidsongeschikt ? 0 : pensioenWerknemerPct * grondslagPensioen;
  const expat30 = arbeidsongeschikt ? 0 : expatVrij(bruto, { expat });
  const belastbaarLoon = Math.max(0, bruto - eigenPensioen - expat30);

  const ewSaldo = eigenWoningSaldo({ hypoRente, woz });
  const verzamelinkomen = Math.max(0, belastbaarLoon + ewSaldo);

  // Arbeidskorting en IACK gelden uitsluitend over arbeidsinkomen. Een
  // uitkering telt daarvoor niet mee, dus is het arbeidsinkomen dan nul —
  // fiscaal de grootste oorzaak van het verschil in marginale druk.
  const arbeidsinkomen = arbeidsongeschikt ? 0 : belastbaarLoon;
  const ib = box1MetEigenWoning(belastbaarLoon, ewSaldo, { aow });
  const ahk = algemeneHeffingskorting(verzamelinkomen, { aow });
  const ak = arbeidskorting(arbeidsinkomen, { aow });
  const ic = iack(arbeidsinkomen, { jongsteKindOnder12 });
  const ibNetto = Math.max(0, ib - ahk - ak - ic);

  const netto = bruto - eigenPensioen - ibNetto;

  return {
    bruto, eigenPensioen, expat30,
    belastbaarLoon, ewSaldo, verzamelinkomen,
    ib, ahk, ak, ic, ibNetto, netto
  };
}

// -------- Volledig scenario --------
export function scenario(input) {
  const {
    bruto,
    aow = false,
    expat = false,
    arbeidsongeschikt = false,
    partner = false,
    partnerInkomen = 0,
    partnerAOW = false,
    jongsteKindOnder12 = false,
    huurMaand = 0,
    kinderen = [],
    flex = false,
    grootWerkgever = false,
    whk = P.werkgeverslasten.whkGemiddeld,
    pensioenWerkgeverPct,
    pensioenWerknemerPct = P.werkgeverslasten.pensioenWerknemerDefault,
    franchise = P.werkgeverslasten.franchisePensioen,
    hypoRente = 0,
    woz = 0,
    studieleningJaar = 0,
    stelselOud = false,
    kovUren = 0,
    kovUurprijs = 0,
    vakantiegeldInBruto = false
  } = input;

  const me = persoonScenario({
    bruto, aow, expat, arbeidsongeschikt,
    pensioenWerknemerPct, franchise,
    jongsteKindOnder12,
    hypoRente, woz
  });

  let partnerSce = null;
  if (partner && partnerInkomen > 0) {
    partnerSce = persoonScenario({
      bruto: partnerInkomen,
      aow: partnerAOW,
      expat: false,
      pensioenWerknemerPct: 0,
      franchise: 0,
      jongsteKindOnder12: false,
      hypoRente: 0,
      woz: 0
    });
  }

  const huishoudVerzamel = me.verzamelinkomen + (partnerSce?.verzamelinkomen ?? 0);

  const zt  = zorgtoeslag(huishoudVerzamel, { partner });
  const ht  = huurtoeslag(huishoudVerzamel, huurMaand, { partner });
  const kgb = kindgebondenBudget(huishoudVerzamel, { partner, kinderen });
  const kot = kinderopvangtoeslag(huishoudVerzamel, { kovUren, kovUurprijs });

  const studielast = studielening(me.verzamelinkomen, {
    studieleningJaar, stelselOud, partner
  });

  const eigenBesteedbaar = me.netto - studielast + zt + ht + kgb + kot;

  // Bij een uitkering is er geen werkgever, dus geen werkgeverslasten.
  const wgl = arbeidsongeschikt
    ? { ww: 0, aof: 0, aofKO: 0, whk: 0, zvw: 0, pensioen: 0, vakantiegeld: 0, totaal: 0 }
    : werkgeverslasten(bruto, {
        flex, grootWerkgever, whk,
        pensioenWerkgeverPct, franchise,
        vakantiegeldOpgeteld: !vakantiegeldInBruto
      });
  const totaalKostenWerkgever = bruto + wgl.totaal;

  return {
    bruto,
    arbeidsongeschikt,
    eigenPensioen: me.eigenPensioen,
    expat30: me.expat30,
    belastbaar: me.belastbaarLoon,
    ewSaldo: me.ewSaldo,
    verzamelinkomen: me.verzamelinkomen,
    ib: me.ib, ahk: me.ahk, ak: me.ak, ic: me.ic, ibNetto: me.ibNetto,
    netto: me.netto,
    studielening: studielast,
    huishoudInkomen: huishoudVerzamel,
    partner: partnerSce,
    zorgtoeslag: zt,
    huurtoeslag: ht,
    kindgebondenBudget: kgb,
    kinderopvangtoeslag: kot,
    toeslagenTotaal: zt + ht + kgb + kot,
    besteedbaar: eigenBesteedbaar,
    werkgever: wgl,
    totaalKostenWerkgever,
    wig: totaalKostenWerkgever - eigenBesteedbaar,
    wigPct: (totaalKostenWerkgever - eigenBesteedbaar) / totaalKostenWerkgever
  };
}

// -------- Marginale druk via numerieke afgeleide --------
export function marginaleDruk(input, { delta = 100 } = {}) {
  const a = scenario(input);
  const b = scenario({ ...input, bruto: input.bruto + delta });
  const dBesteedbaar = b.besteedbaar - a.besteedbaar;
  const dBruto = b.bruto - a.bruto;
  const dWerkgever = b.totaalKostenWerkgever - a.totaalKostenWerkgever;
  return {
    drukOpBruto: 1 - dBesteedbaar / dBruto,
    drukOpWerkgever: 1 - dBesteedbaar / dWerkgever,
    deltaBesteedbaar: dBesteedbaar,
    deltaBruto: dBruto,
    deltaWerkgever: dWerkgever,
    delta: {
      ib:                  b.ib - a.ib,
      ahk:                 -(b.ahk - a.ahk),
      ak:                  -(b.ak - a.ak),
      ic:                  -(b.ic - a.ic),
      eigenPensioen:        (b.eigenPensioen - a.eigenPensioen),
      zorgtoeslag:         -(b.zorgtoeslag - a.zorgtoeslag),
      huurtoeslag:         -(b.huurtoeslag - a.huurtoeslag),
      kindgebondenBudget:  -(b.kindgebondenBudget - a.kindgebondenBudget),
      kinderopvangtoeslag: -(b.kinderopvangtoeslag - a.kinderopvangtoeslag),
      studielening:         (b.studielening - a.studielening),
      werkgeverslasten:    b.werkgever.totaal - a.werkgever.totaal
    }
  };
}

// -------- Curve generator --------
export function curve(baseInput, { from = 10000, to = 150000, step = 500 } = {}) {
  const out = [];
  for (let bruto = from; bruto <= to; bruto += step) {
    const s = scenario({ ...baseInput, bruto });
    const m = marginaleDruk({ ...baseInput, bruto });
    out.push({
      bruto, ...s,
      marginaal: m.drukOpBruto,
      marginaalWg: m.drukOpWerkgever,
      marginaalDelta: m.delta
    });
  }
  return out;
}
