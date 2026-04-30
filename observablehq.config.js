// See https://observablehq.com/framework/config for documentation.
export default {
  title: "Marginale druk NL 2026",
  pages: [
    { name: "Calculator", path: "/" },
    { name: "Hoe het werkt", path: "/uitleg" },
    { name: "Parameters", path: "/parameters" }
  ],
  theme: ["air", "wide"],
  header: "",
  footer:
    "Op basis van openbare 2026-cijfers (Belastingdienst, Rijksoverheid). Geen fiscaal advies.",
  toc: true,
  pager: true,
  root: "src",
  output: "dist",
  search: true,
  cleanUrls: true,
  style: "style.css"
};
