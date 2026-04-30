// Pure berekeningsfuncties. Alles in jaarbedragen.
// Alle functies zijn deterministisch en alleen client-side.
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

// -------- Algemene heffingskorting --------
export function algemeneHeffingskorting(belastbaarInkomen, { aow = false } = {}) {
  const c = aow ? P.algemeneHeffingskorting.overAOW : P.algemeneHeffingskorting.underAOW;
  if (belastbaarInkomen <= c.afbouwStart) return c.max;
  if (belastbaarInkomen >= c.eind) return 0;
  const verlaging = (belastbaarInkomen - c.afbouwStart) * c.afbouwPct;
  return Math.max(0, c.max - verlaging);
}

// -------- Arbeidskorting (op arbeidsinkomen) --------
export function arbeidskorting(arbeidsinkomen, { aow = false } = {}) {
  const segs = aow ? P.arbeidskorting.overAOW : P.arbeidskorting.underAOW;
  for (const s of segs) {
    if (arbeidsinkomen <= s.to) {
      return Math.max(0, s.base + s.rate * (arbeidsinkomen - s.from));
    }
  }
  return 0;
}

// -------- IACK --------
export function iack(arbeidsinkomen, { jongsteKindOnder12 = false } = {}) {
  if (!jongsteKindOnder12) return 0;
  if (arbeidsinkomen <= P.iack.drempel) return 0;
  const opbouw = (arbeidsinkomen - P.iack.drempel) * P.iack.opbouwPct;
  return Math.min(P.iack.max, opbouw);
}

// -------- Loonbelasting na heffingskortingen --------
export function inkomstenbelastingNetto(
  inkomen,
  { aow = false, jongsteKindOnder12 = false } = {}
) {
  // arbeidsinkomen wordt voor eenvoud gelijkgesteld aan box1-inkomen
  // (in praktijk minus winst-uit-onderneming, etc.).
  const tax = box1Tax(inkomen, { aow });
  const ahk = algemeneHeffingskorting(inkomen, { aow });
  const ak = arbeidskorting(inkomen, { aow });
  const ic = iack(inkomen, { jongsteKindOnder12 });
  return Math.max(0, tax - ahk - ak - ic);
}

// -------- Toeslagen --------
export function zorgtoeslag(huishoudInkomen, { partner = false } = {}) {
  const z = P.zorgtoeslag;
  const aantal = partner ? 2 : 1;
  const base = aantal === 2 ? P.zorgtoeslag.standaardpremie * 2 : P.zorgtoeslag.standaardpremie;
  const norm = partner ? z.norm.partner : z.norm.alleen;
  const grens = partner ? z.inkomensgrens.partner : z.inkomensgrens.alleen;
  const max = partner ? z.max.partner : z.max.alleen;
  if (huishoudInkomen >= grens) return 0;
  // Vereenvoudigd: max - afbouw
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

export function kindgebondenBudget(
  huishoudInkomen,
  { partner = false, kinderen = [] } = {}
) {
  const k = P.kindgebondenBudget;
  if (kinderen.length === 0) return 0;
  // Basisbedrag per kind + leeftijdstoeslagen
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

// -------- Werkgeverslasten --------
export function werkgeverslasten(brutoLoon, opties = {}) {
  const {
    flex = false,            // WW-hoog ipv laag
    grootWerkgever = false,  // Aof-hoog ipv laag
    pensioenWerkgeverPct,    // override; default uit params
    franchise = PARAMS_2026.werkgeverslasten.franchisePensioen,
    vakantiegeldOpgeteld = true
  } = opties;
  const w = PARAMS_2026.werkgeverslasten;
  const grondslag = vakantiegeldOpgeteld ? brutoLoon * (1 + PARAMS_2026.vakantiegeldPct) : brutoLoon;
  const premieloon = Math.min(grondslag, w.maxPremieloon);

  const ww = (flex ? w.wwHoog : w.wwLaag) * premieloon;
  const aof = (grootWerkgever ? w.aofHoog : w.aofLaag) * premieloon;
  const aofKO = w.aofOpslagKinderopvang * premieloon;
  const whk = w.whkGemiddeld * premieloon;
  const zvw = w.zvwWerkgever * premieloon;

  const pensioenPct = pensioenWerkgeverPct ?? w.pensioenWerkgeverDefault;
  const pensioenGrondslag = Math.max(0, grondslag - franchise);
  const pensioen = pensioenPct * pensioenGrondslag;

  const vakantiegeld = vakantiegeldOpgeteld ? brutoLoon * PARAMS_2026.vakantiegeldPct : 0;

  return {
    ww, aof, aofKO, whk, zvw, pensioen, vakantiegeld,
    totaal: ww + aof + aofKO + whk + zvw + pensioen + vakantiegeld
  };
}

// -------- Volledig scenario voor een gegeven brutoloon --------
export function scenario(input) {
  const {
    bruto,                       // jaarbruto excl. vakantiegeld
    partner = false,
    partnerInkomen = 0,
    aow = false,
    jongsteKindOnder12 = false,
    huurMaand = 0,
    kinderen = [],
    flex = false,
    grootWerkgever = false,
    pensioenWerkgeverPct,
    pensioenWerknemerPct = PARAMS_2026.werkgeverslasten.pensioenWerknemerDefault,
    franchise = PARAMS_2026.werkgeverslasten.franchisePensioen,
    vakantiegeldInBruto = false  // toon je vakantiegeld als onderdeel van bruto?
  } = input;

  // Belastbaar loon = bruto - werknemerdeel pensioen (bovenop franchise).
  const grondslagPensioen = Math.max(0, bruto - franchise);
  const eigenPensioen = pensioenWerknemerPct * grondslagPensioen;
  const belastbaar = Math.max(0, bruto - eigenPensioen);

  const ib = box1Tax(belastbaar, { aow });
  const ahk = algemeneHeffingskorting(belastbaar, { aow });
  const ak = arbeidskorting(belastbaar, { aow });
  const ic = iack(belastbaar, { jongsteKindOnder12 });
  const ibNetto = Math.max(0, ib - ahk - ak - ic);

  const huishoudInkomen = belastbaar + (partner ? partnerInkomen : 0);
  const zt = zorgtoeslag(huishoudInkomen, { partner });
  const ht = huurtoeslag(huishoudInkomen, huurMaand, { partner });
  const kgb = kindgebondenBudget(huishoudInkomen, { partner, kinderen });

  const netto = bruto - eigenPensioen - ibNetto;
  const besteedbaar = netto + zt + ht + kgb;

  const wgl = werkgeverslasten(bruto, {
    flex, grootWerkgever, pensioenWerkgeverPct, franchise,
    vakantiegeldOpgeteld: !vakantiegeldInBruto
  });
  const totaalKostenWerkgever = bruto + wgl.totaal;

  return {
    bruto,
    eigenPensioen,
    belastbaar,
    ib, ahk, ak, ic, ibNetto,
    netto,
    huishoudInkomen,
    zorgtoeslag: zt,
    huurtoeslag: ht,
    kindgebondenBudget: kgb,
    toeslagenTotaal: zt + ht + kgb,
    besteedbaar,
    werkgever: wgl,
    totaalKostenWerkgever,
    wig: totaalKostenWerkgever - besteedbaar,
    wigPct: (totaalKostenWerkgever - besteedbaar) / totaalKostenWerkgever
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
    // Bijdragen aan marginale druk
    delta: {
      ib: b.ib - a.ib,
      ahk: -(b.ahk - a.ahk),
      ak: -(b.ak - a.ak),
      ic: -(b.ic - a.ic),
      zorgtoeslag: -(b.zorgtoeslag - a.zorgtoeslag),
      huurtoeslag: -(b.huurtoeslag - a.huurtoeslag),
      kindgebondenBudget: -(b.kindgebondenBudget - a.kindgebondenBudget),
      werkgeverslasten: b.werkgever.totaal - a.werkgever.totaal
    }
  };
}

// -------- Curve generator --------
export function curve(baseInput, { from = 10000, to = 150000, step = 500 } = {}) {
  const out = [];
  for (let bruto = from; bruto <= to; bruto += step) {
    const s = scenario({ ...baseInput, bruto });
    const m = marginaleDruk({ ...baseInput, bruto });
    out.push({ bruto, ...s, marginaal: m.drukOpBruto, marginaalWg: m.drukOpWerkgever, marginaalDelta: m.delta });
  }
  return out;
}
