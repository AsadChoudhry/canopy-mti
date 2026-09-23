# Canopy Material Transition — decision-support prototype

Interactive dashboard helping Canopy researchers understand global material flows, investigate companies, follow products into supplier / mill / feedstock sourcing, assess product-specific transitions and improve the evidence through structured data entry.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle (dist/)
```

Stack: React 19 · TypeScript · Tailwind v4 · React Router · Recharts · Lucide · d3-geo + world-atlas (SVG map) · MapLibre (optional basemap).

## Views

| Route | Purpose |
|---|---|
| `/` | Global overview — FAO 2024 baseline, evidence-state fibre composition (with explicit demo mode), production / fibre-origin map, researched-producer table. Fashion tab: "Data not yet populated". |
| `/companies/:id?product=…&panel=transition&tab=…` | Company workspace. Producer view (Mondi, Smurfit Westrock) with selected product, supply-chain context and the **Transition options** panel (Alternatives / Scenario / Evidence) that never leaves the company context. Brand view (H&M) is a separate purchasing accounting view. |
| `/solutions` | Canopy solutions catalogue — EcoPaper / Next Gen providers / ForestMapper, search + filters, shortlist. No calculator here by design. |
| `/mills` | Next Gen mill siting, India first. Candidate regions scored on verified feedstock (PIB paddy straw, Fashion for Good textile waste) and existing MMCF demand (Hot Button 2026), with adjustable weights and a list of the data layers to add next. |
| `/roadmap` | Year-one roadmap: what is built, what is proposed, who owns each piece and the decision it changes. |
| `/workspace?tab=…` | Data workspace — forms for companies, products, facilities, origins, sourcing links, quantities, sources, solutions, scenarios; validation; local persistence; JSON import/export. |

## Implementation note

### Verified sources (opened and text-extracted on 2026-09-21)
- **FAO Forest Products Statistics (2024)** — paper & paperboard 423 Mt; wood pulp 189 Mt; pulp from fibres other than wood 10 Mt; recovered paper 241 Mt. All four figures confirmed on the FAO data page.
- **FAOSTAT bulk forestry dataset** — country-level 2024 paper & paperboard production (world 423,018,755 t, flag A). Top 40 producers loaded into `src/data/fao_paper_2024.json` with FAO flags (A official / E estimated / X external organisation). "China" aggregate excluded in favour of "China, mainland" + Taiwan.
- **Mondi SDR 2025** — production statistics confirmed: containerboard 2.6 Mt, kraft paper 1.3 Mt, uncoated fine paper 0.9 Mt, market pulp 0.7 Mt. **The materials-flow page is printed page 83, not 82 as the brief stated.** Also: 82% FSC/PEFC-certified wood fibre, remainder FSC Controlled Wood (report cross-references page 69); purchased inputs (wood 15.1 million m³, paper for recycling 1.5 Mt, external pulp 0.2 Mt).
- **Mondi responsible wood sourcing extract** — >90% of wood fibre sourced from countries where mills are located; main sourcing countries Austria, Poland, Slovakia, Czech Republic, South Africa (plantation), Finland, Sweden.
- **SmartKraft Brown product page** — 30% unbleached fresh fibre / 70% recycled fibre; "Produced in Europe". No tonnage, mill, customers or origin.
- **Smurfit Westrock SR 2025 supporting data** — paper & board mill production 19,123 kt (NA 11,359 / EMEA & APAC 6,399 / Latam 1,365).
- **Canopy Next Gen providers directory** — category counts (8 / 2 / 19 / 9 / 3 / 5); provider names load client-side and were not captured.
- Mondi ESRS & Performance Index 2025 was downloaded but no claims were extracted from it yet (marked "needs review").

- **Hot Button Progress Report 2026** (released 2026-09-22) — 2026 grid transcribed from page 5; shirt colours and Next Gen markers read from the rendered page. Green shirt capacity excluding known risk calculates to 53.0% (22 of 28 assessed producers), matching Canopy's published 53%.
- **Canopy Annual Reports 2023/24 and 2024/25** — 60 Mt Next Gen target by 2033, 1.3 Gt GHG avoided, $78B investment, 8.35 Mt Next Gen production in 2024, 4 t CO2e avoided per tonne of Next Gen pulp, Re-START Alliance 1 Mt by 2030.
- **PIB, 8 Oct 2021** — paddy straw generated: Punjab 18.74 Mt, Haryana 6.8 Mt, eight NCR districts of UP 0.67 Mt (2021 projections).
- **Fashion for Good, Wealth in Waste** — India textile waste up to 7.8 Mt a year (summary article only; full report not opened).

### Calculated values
- Road to 60 Mt: 24.5% a year = (60 / 8.35)^(1/9) − 1; ~$1,510 per tonne of new annual output = $78B / (60 − 8.35) Mt.
- Scenario GHG estimate = Next Gen fibre tonnes introduced × 4 t CO2e (Canopy's pulp average applied to fibre tonnes; recycled fibre not credited).
- Mondi paper & board 4.8 Mt = 2.6 + 1.3 + 0.9 (market pulp excluded).
- Mondi ~1.13% and Smurfit Westrock ~4.52% = company 2025 output / FAO 2024 world output × 100. Labelled "2025 company output compared with 2024 global output"; year mismatch stated; not a share of global fibre consumption.

### Illustrative / unverified records (excluded from evidence-backed totals)
- Global demo composition 50 / 35 / 10 / 5 — only visible in the explicitly selected demo mode.
- Solutions catalogue categories (recycled paper & board, agricultural-residue materials, textile-to-textile cellulose) — labelled illustrative.
- EcoPaper listings for Charming Trim, Rudholm Group, Punarbhavaa/CEAE — supplied in the brief, marked "listing supplied", source marked **not accessed**.
- Seed scenario "20% Next Gen substitution" — illustrative, no volume.
- H&M brand data — from the earlier internal brief (company disclosure figures), shown in the separate brand purchasing view and never added to producer totals.

### Remaining gaps
- Global Next Gen share: unknown (deliberately no figure).
- SmartKraft Brown: annual tonnage, mill allocation, customers, fibre origin — unknown / unresolved.
- Mondi facilities are named from the SDR but not linked to any product; product-level origin is unresolved.
- Smurfit Westrock: group production only; no products, mills or origins.
- Fibre-origin map layer shows only company-wide sourcing statements (dashed), not product-level traced origin.
- Fashion global baseline: not populated.

### Evidence model
Every quantity carries value + unit + period + scope + measurement basis + denominator (for %) + evidence status (Reported / Calculated / Estimated / Illustrative / Unknown) + sources + formula/inputs. Sources carry URL, title, publisher, page/section, access date, whether the document was actually opened, passage, limitations, reviewer notes and review status. Unknown is `null`, never 0; compositions are never forced to 100%. Certification and forest-risk are recorded separately from fibre type.

Scenario displacement is computed only on a fibre-mass basis: product volume × fibre share of mass (both explicit assumptions, kept separate from observed data). If either is missing the UI shows "Tonnes shifted: needs product volume".

### Persistence limitations
Records live in the browser's `localStorage` (`canopy-mti-store-v1`). No sync, auth, history or multi-user editing; clearing site data or switching browsers loses edits. Use **Export JSON** in the Data workspace to keep or share a copy and **Import JSON** to restore. The seed dataset can be restored with **Reset to seed**. The data layer (`src/store/StoreContext.tsx`) is the single place to swap in an API.
