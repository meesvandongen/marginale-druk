const eur = new Intl.NumberFormat("nl-NL", {
  style: "currency", currency: "EUR", maximumFractionDigits: 0
});

const eurDecimal = new Intl.NumberFormat("nl-NL", {
  style: "currency", currency: "EUR", maximumFractionDigits: 2
});

const pct1 = new Intl.NumberFormat("nl-NL", {
  style: "percent", maximumFractionDigits: 1, minimumFractionDigits: 1
});

const pct0 = new Intl.NumberFormat("nl-NL", {
  style: "percent", maximumFractionDigits: 0
});

const num = new Intl.NumberFormat("nl-NL", {maximumFractionDigits: 0});

export const fmtEur = x => eur.format(x);
export const fmtEurExact = x => eurDecimal.format(x);
export const fmtPct = x => pct1.format(x);
export const fmtPct0 = x => pct0.format(x);
export const fmtNum = x => num.format(x);

// "€38k" for axis ticks
export const fmtEurK = x =>
  Math.abs(x) >= 1000 ? `€${Math.round(x / 1000)}k` : `€${x}`;
