import {fmtEur, fmtNum} from "../lib/format.js";

const MAX_BRUTO = 1_000_000;

const clamp = (n) => Math.max(0, Math.min(MAX_BRUTO, Math.round(n) || 0));

// Interactive build-up table. The gross income is an editable cell; every
// other row is a computed result. The element is created once and mutated in
// place via `.update(sce)`, so typing in the income field never loses focus
// and never rebuilds the DOM. Implements the Observable input protocol
// (a `.value` property + "input" events) so it plugs straight into
// `Generators.input` / `view`.
export function createOpbouwTable(initialBruto = 50000) {
  let bruto = clamp(initialBruto);

  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.autocomplete = "off";
  input.className = "bruto-input";
  input.setAttribute("aria-label", "Bruto inkomen per jaar");
  input.value = fmtNum(bruto);

  const table = document.createElement("table");
  table.className = "opbouw";

  const cells = {};

  // Editable income row.
  const brutoLabel = document.createElement("th");
  brutoLabel.scope = "row";
  brutoLabel.className = "post";
  brutoLabel.textContent = "Bruto inkomen";
  {
    const tr = document.createElement("tr");
    tr.className = "bruto-row";
    const td = document.createElement("td");
    td.className = "bedrag";
    const field = document.createElement("label");
    field.className = "euro-field";
    const euro = document.createElement("span");
    euro.className = "euro-sign";
    euro.textContent = "€";
    field.append(euro, input);
    td.append(field);
    tr.append(brutoLabel, td);
    table.append(tr);
  }

  function makeRow(key, label, kind = "post") {
    const tr = document.createElement("tr");
    if (kind === "subtotal") tr.className = "subtotal";
    const th = document.createElement("th");
    th.scope = "row";
    th.className = "post";
    th.textContent = label;
    const td = document.createElement("td");
    td.className = "bedrag";
    tr.append(th, td);
    table.append(tr);
    cells[key] = {tr, th, td};
  }

  makeRow("pensioen", "Pensioenpremie werknemer");
  makeRow("ib", "Inkomstenbelasting");
  makeRow("netto", "Nettoloon", "subtotal");
  makeRow("studielening", "Aflossing studielening");
  makeRow("zorgtoeslag", "Zorgtoeslag");
  makeRow("huurtoeslag", "Huurtoeslag");
  makeRow("kindgebondenBudget", "Kindgebonden budget");
  makeRow("kinderopvangtoeslag", "Kinderopvangtoeslag");
  makeRow("besteedbaar", "Besteedbaar inkomen", "subtotal");

  // sign: -1 subtract, +1 add, 0 plain (subtotal).
  function setAmount(key, value, sign) {
    const {td} = cells[key];
    const op = sign < 0 ? "−" : sign > 0 ? "+" : "";
    td.innerHTML = op
      ? `<span class="op">${op}</span>${fmtEur(value)}`
      : fmtEur(value);
  }
  const show = (key, on) => {cells[key].tr.hidden = !on;};

  table.update = (sce) => {
    brutoLabel.textContent = sce.arbeidsongeschikt ? "Bruto uitkering" : "Bruto inkomen";

    show("pensioen", sce.eigenPensioen > 0.5);
    setAmount("pensioen", sce.eigenPensioen, -1);

    setAmount("ib", sce.ibNetto, -1);

    // Show the intermediate "Nettoloon" only when something is added or
    // subtracted afterwards — otherwise it just repeats "Besteedbaar".
    const heeftVervolg =
      sce.studielening > 0.5 || sce.zorgtoeslag > 0.5 || sce.huurtoeslag > 0.5 ||
      sce.kindgebondenBudget > 0.5 || sce.kinderopvangtoeslag > 0.5;
    show("netto", heeftVervolg);
    setAmount("netto", sce.netto, 0);

    show("studielening", sce.studielening > 0.5);
    setAmount("studielening", sce.studielening, -1);
    show("zorgtoeslag", sce.zorgtoeslag > 0.5);
    setAmount("zorgtoeslag", sce.zorgtoeslag, +1);
    show("huurtoeslag", sce.huurtoeslag > 0.5);
    setAmount("huurtoeslag", sce.huurtoeslag, +1);
    show("kindgebondenBudget", sce.kindgebondenBudget > 0.5);
    setAmount("kindgebondenBudget", sce.kindgebondenBudget, +1);
    show("kinderopvangtoeslag", sce.kinderopvangtoeslag > 0.5);
    setAmount("kinderopvangtoeslag", sce.kinderopvangtoeslag, +1);

    setAmount("besteedbaar", sce.besteedbaar, 0);
    return table;
  };

  Object.defineProperty(table, "value", {get: () => bruto, configurable: true});

  const read = () => {
    const digits = input.value.replace(/\D/g, "");
    return clamp(digits ? parseInt(digits, 10) : 0);
  };
  input.addEventListener("input", () => {
    bruto = read();
    table.dispatchEvent(new Event("input", {bubbles: true}));
  });
  // While editing show raw digits (no separators → no cursor jumps); reformat
  // with thousands separators when the field loses focus.
  input.addEventListener("focus", () => {
    input.value = bruto ? String(bruto) : "";
    input.select();
  });
  input.addEventListener("blur", () => {input.value = fmtNum(bruto);});

  return table;
}
