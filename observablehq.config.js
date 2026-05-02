import {readFileSync} from "node:fs";

// Inline our custom CSS into the document head so it cascades after the
// built-in theme stylesheet. Setting `style:` instead would replace the
// theme entirely, which we don't want.
const customCss = readFileSync(new URL("./src/style.css", import.meta.url), "utf8");

export default {
  title: "Marginale druk NL 2026",
  pages: [
    {name: "Calculator", path: "/"},
    {name: "Hoe het werkt", path: "/uitleg"},
    {name: "Parameters", path: "/parameters"}
  ],
  theme: ["air", "wide"],
  header: "",
  footer:
    "Op basis van openbare 2026-cijfers (Belastingdienst, Rijksoverheid). Geen fiscaal advies.",
  toc: false,
  pager: true,
  root: "src",
  output: "dist",
  search: true,
  cleanUrls: true,
  head: `<style>${customCss}</style>`
};
