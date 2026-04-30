# marginale-druk

Interactieve calculator voor de **Nederlandse marginale druk 2026**, gebouwd
met [Observable Framework](https://observablehq.com/framework/) en deploybaar
als statische site naar **Cloudflare Workers (static assets)**.

De gebruiker kan via sliders en toggles alle relevante parameters wijzigen:
brutoloon, partner, kinderen, huur, contracttype, werkgevergrootte en
pensioenpremies. De calculator laat zien:

- Inkomstenbelasting box 1 met heffingskortingen (AHK, arbeidskorting, IACK).
- Toeslagen: zorgtoeslag, huurtoeslag, kindgebonden budget.
- Werkgeverslasten 2026: WW, Aof, WHK, opslag kinderopvang, Zvw, pensioen.
- Marginale druk op zowel brutoloon als totale werkgeverskost.
- Decompositie van iedere extra euro: waar gaat hij heen?
- De belastingwig: kosten werkgever versus besteedbaar inkomen.

## Lokaal draaien

```bash
npm install
npm run dev
```

Bezoek vervolgens http://localhost:3000.

## Bouwen

```bash
npm run build
```

De output verschijnt in `./dist` en is volledig statisch.

## Deployen naar Cloudflare Workers

```bash
npm run build
npx wrangler login        # eenmalig
npx wrangler deploy
```

`wrangler.toml` configureert de Workers static-assets-binding op `./dist`.

## Bronnen

Alle parameters in `src/lib/params.js` zijn afkomstig uit officiële 2026-publicaties.
Zie [`src/parameters.md`](src/parameters.md) voor de volledige lijst met bronlinks.

## Disclaimer

Geen fiscaal advies. Vereenvoudigt o.a. huurtoeslag, kinderopvangtoeslag,
pensioen en sectorale premies.
