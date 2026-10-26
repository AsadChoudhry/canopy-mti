# Canopy interview playbook

**Monday 28 September 2026, 5:00 to 6:30 pm** · 90 minutes · **10-minute presentation**, then questions  
Role: Data & Research Lead (Agent Curious Fox), reporting to the Head of Impact

Deck: **claude.ai/artifact/BRhp5KsYHFit5S3pQiUvhN** (private to you; present it from your own login, or download it as PDF/PPTX)  
Prototype: **canopy-mti.vercel.app**

Every figure here comes from your brief, or from the screen you'll be showing. Speak it in your own words.

---

## Should you walk through the website? Yes, twice, for about four minutes

The panel read your brief, so repeating it on slides wastes their time. What they haven't seen is the tool working. The job ad asks for someone who builds "dashboards, maps, calculators and other decision-support tools" and sets "standards for source tracking". Clicking through a working tool shows both better than any slide.

But a website with no structure around it eats ten minutes fast. So use a **sandwich**:

| Part | Where | Time | Ends at |
|---|---|---|---|
| 1. Opening: the number that matters | Deck, slide 1 | 0:50 | 0:50 |
| 2. Six datasets | Deck, slide 2 | 1:00 | 1:50 |
| 3. What comes first, and why | Deck, slide 3 | 1:15 | 3:05 |
| 4. How the data connects | Deck, slide 4 | 0:35 | 3:40 |
| **5. Demo A: packaging** | **Website** | **1:45** | **5:25** |
| **6. Demo B: fashion** | **Website** | **2:15** | **7:40** |
| 7. The finding (306 kt, 0 brands) | Deck, slide 7 | 0:20 | 8:00 |
| 8. Year one | Deck, slide 8 | 0:40 | 8:40 |
| 9. How it lasts | Deck, slide 9 | 0:35 | 9:15 |
| 10. Close | Deck, slide 10 | 0:30 | 9:45 |

**Time checks:** glance at the clock when you leave slide 4 (about 3:40), when you finish Demo A (about 5:25) and when you come back to the deck (about 7:40). If you're more than 30 seconds behind at 7:40, skip slide 9.

The deck's speaker notes carry the same words as this playbook, with timings.

---

## Setup

### Sunday (15 minutes)
1. Open **canopy-mti.vercel.app** on the laptop you'll use. Click through the whole demo path below once. I walked through the code on your branch but couldn't reach the live Vercel site from here, so check that what you see matches this playbook (for example, 3 mills on the planner and 0.69 Mt missing on the demand page). If it doesn't, the deployed site is older than your branch: redeploy.
2. Open the deck and click **Present**. Check the speaker notes are visible to you only.
3. Download the deck as **PDF** and save it on the desktop, in case claude.ai asks you to log in again on Monday.
4. Rehearse out loud twice with a timer. Aim for 9:45.

### Monday, 4:30 pm
1. Restart the laptop. Close Slack, email and anything that pops up. Turn on **Do Not Disturb**.
2. Open Chrome in a **Guest window** (or Incognito). The prototype saves scenarios in the browser, so a clean window means no leftover state.
3. **Tab 1:** the deck, in Present mode, on slide 1.
4. **Tab 2:** canopy-mti.vercel.app, on the Global overview with **Packaging** selected, scrolled to the top.
5. Zoom: Ctrl/Cmd + 0 to reset. If the screen is narrower than 1440 px, use 90% so the sidebar and content fit.
6. In Zoom, Teams or Meet, **share the whole Chrome window, not a single tab**, so the panel sees you switch between tabs. Test it with a friend or a second device if you can.
7. To switch tabs: **Ctrl + Tab** (Windows) or **Cmd + Option + →** (Mac), or just click the tab.
8. Have water, this printed playbook, and a clock you can see.

---

## Run of show

How each step is written:  
**DO** is what you click. **SEE** is what appears. **SAY** is the words. **THINK** is why the step is there, and what to avoid.

### Slide 1 · The number that matters (0:00 to 0:50)

**SEE:** dark slide, "8.35 Mt → 60 Mt".

**SAY:**
> Thank you for having me, and for reading the brief ahead of time. I'll spend my ten minutes on why I made the choices in it, and then show you the tool working, rather than repeat the document.
>
> I started from one number. Canopy wants 60 million tonnes of Next Gen material on the market by 2033. In 2024 it was 8.35. That's about 25 percent growth every year for nine years, which means new mills, new feedstock and new buyers all have to show up at the same time.
>
> So the question I asked wasn't "what data exists?" It was "which decisions move that number, and what evidence do they need?"

**THINK:** Slow down on the opening. Look at the camera, not the slide. This frames you as someone who starts from the decision, which is what the job ad wants ("act on evidence, not guesswork").

**DO:** → next slide.

### Slide 2 · Six datasets (0:50 to 1:50)

**SAY:**
> I looked at the landscape by the question each source answers, not by how big it is.
>
> Two are Canopy's own and they're the strongest levers. Hot Button tells us which viscose producers are green, at risk or already selling Next Gen. EcoPaper, with over 1,400 vetted listings, turns a traced product into a concrete alternative.
>
> FAO and Textile Exchange give the baselines: 278 million tonnes of packaging paper and board, and 8.4 million tonnes of MMCF, of which only 1.1 percent comes from recycled feedstock.
>
> Company reports, EPDs and EUDR declarations take us down to a single product. That gets much richer from December, when EUDR applies to large and medium operators.
>
> The sixth is one I'd build: an India feedstock layer that puts district crop production, NASA fire data and textile-waste clusters together.

**THINK:** Don't read the cards. The panel can read. Your words add the *why*. The dark card (India feedstock) is the one to point at.

**DO:** → next slide.

### Slide 3 · What comes first, and why (1:50 to 3:05)

**SAY:**
> This was the hardest call. Packaging tracing was the obvious pick: the data's more public and it's closest to done. But it mostly sharpens a decision Canopy already makes well, which producer Pack4Good engages next.
>
> India feedstock plus Hot Button plus brand demand feeds a bigger decision with a clock on it: which two or three regions, and which kind of mill, go into feasibility first under the $2 billion plan for 1.5 million tonnes. Getting that wrong costs years.
>
> It has two weak spots, and I've planned around them. Brand demand isn't public, and nobody knows how much straw is actually collectable. So quarter one tests both: the India hub on mill type and collection, CanopyStyle on whether three brands will share volumes confidentially.
>
> If brands won't, I use producer expansion plans as the demand signal and narrow to one route: Next Gen pulp for Birla's Harihar expansion.

**THINK:** This is the slide they'll score hardest ("prioritizes one… with clear justification"). Naming your own weak spots before they do shows judgement. Pause briefly after "Getting that wrong costs years."

**DO:** → next slide.

### Slide 4 · How the data connects (3:05 to 3:40)

**SAY:**
> This chain is what turns six datasets into one tool. A brand, to the producer that supplies it, which Hot Button scores, to the pulp it needs, to a mill that can make it, to the feedstock around that mill, to a year it can deliver.
>
> And one rule sits underneath: a match only counts when fibre spec, process, supplier and date all line up. I'd rather show three real matches than thirty soft ones.
>
> Let me show you how it works.

**DO:** Switch to **Tab 2** (the prototype).

**THINK:** Say "Let me show you" *while* switching, so there's no silence. **Time check: about 3:40.**

---

### Demo A · Packaging: from the global picture to one product (3:40 to 5:25)

**A1. Global overview: the provenance badge (about 20 seconds)**

**SEE:** "A global view of material transition". Packaging/Fashion toggle top right (Packaging selected). The **Road to 60 Mt** chart, with tiles: *Produced in 2024: 8.35 Mt (Reported)*, *Growth needed every year: 24.5% (Calculated)*, *$78 bn*, *1.3 Gt CO2e*.

**SAY:**
> This is the prototype, live at canopy-mti.vercel.app. Same target: 8.35 to 60.

**DO:** Click the small **"Calculated"** badge beside **24.5%**.

**SEE:** A drawer slides in from the right, showing the **formula** "(60 / 8.35) ^ (1 / 9) − 1", **Limitations**, and **Sources (2)**: Canopy's Annual Reports, with page numbers and the date they were accessed.

**SAY:**
> Every number has one of these badges. Click it and you get the formula, the source with its page, and its limitations. That's the provenance standard, built in.

**DO:** Press **Esc** to close the drawer.

**THINK:** This ten-second moment is your best evidence for the governance half of the job (source tracking, quality assurance). Don't read the drawer out; just let them see it exists.

**A2. Packaging composition (about 15 seconds)**

**DO:** Scroll down to **"Packaging fibre composition: What the 277.9 Mt is made of"**.

**SEE:** 277.9 Mt (Reported); Recycled ~156 Mt (Estimated); Virgin wood ~92 Mt (Estimated); Next Gen ≤8.35 Mt (Upper bound).

**SAY:**
> Packaging paper and board is 278 million tonnes, measured by FAO. Everything under it is labelled an estimate, and Next Gen shows only as an upper bound, because packaging's share isn't published.

**THINK:** Don't click "Demo mode". Don't scroll down to the map; there's no time.

**A3. One product: MetsäBoard Pro FBB Bright (about 35 seconds)**

**DO:** Click **Companies** in the left sidebar, then **Metsä Board** (top of the list, "mapping 3/3").

**SEE:** "Metsä Board products" in the middle column, and the company profile on the right (1.364 Mt output, 9 named mills, 8 sourcing countries, 92% certified).

**DO:** Click the product card **"MetsäBoard Pro FBB Bright · 8/8"**.

**SEE:** The product profile: "Evidence fields filled: **8 of 8 · 3 filled with a proxy**", with each field listed and the proxies labelled.

**SAY:**
> Now down to one product. Its fibre comes from the EPD: 28 percent bleached chemical pulp, 47 percent BCTMP. It's made at Äänekoski, and the wood comes from Finland, Sweden, Estonia and Latvia, from Metsä's EUDR declaration.
>
> All eight evidence fields are filled, but three are proxies, and the tool says which: mill capacity stands in for product volume, the certified share is company-wide, and origin is country-level, not forest.

**THINK:** Point with the cursor at the three "Proxy:" lines. This is the step that shows judgement about evidence quality, not just data collection.

**DO (optional, only if you're on time):** Scroll down to **"Where the fibre comes from"**: a map plus Forest → Pulp mill → Board mill → Product. Say one line: *"Forest, pulp mill, board mill, product, all sourced."*

**A4. Assess a transition (about 15 seconds)**

**DO:** Scroll to **"Alternative Canopy solutions"** and click the purple **"Assess a transition →"** button on the right.

**SEE:** "Transition assessment: MetsäBoard Pro FBB Bright", with tabs **Alternatives / Scenario / Evidence**. Under Alternatives: "Increase recycled content · *Candidate · suitability unverified*" and "Requirements to check" (strength, mill compatibility, supply, cost), all **unknown**.

**SAY:**
> Then the solution side: recycled content or agricultural-residue blends, as candidates. Strength, mill compatibility, supply and cost are all marked unknown, because they are. It's a lead for a conversation, not a claim.

**THINK:** Don't open the Scenario tab here. Save it for Q&A if someone asks about the maths.

**A5. Disclosure coverage: the Pack4Good decision (about 30 seconds)**

**DO:** Click **Disclosure coverage** in the sidebar.

**SEE:** "Packaging producer disclosure coverage", a green **Decision this supports** box, and the ranking: **Metsä Board 30 (High coverage)**, **Mondi 20.8 (Partial coverage)**, **Smurfit Westrock 4 (Not yet researched)**.

**DO:** Click the **Mondi** row to open it.

**SEE:** "Product fibre traced 0.8 / 6: ProVantage SmartKraft Brown, 1 of 8 fields filled"; "Product origin traced 0 / 4". On the right, **Engagement ask**: (1) *Share a content declaration (EPD) and mill for the products brand partners buy (+5.2)*; (2) *Declare origin per product, as the EUDR due diligence statement already requires (+4)*.

**SAY:**
> This is Pack4Good's view. It measures what research found, not a rating of the company. Mondi discloses well at company level, but SmartKraft Brown stops at "30 percent fresh, 70 percent recycled, made in Europe." So the ask writes itself: share the EPD and mill for the products brand partners buy, and declare origin per product, which EUDR already requires from December.

**THINK:** Here the data turns into an action, which is the brief's whole point. Point at "Not yet researched" for Smurfit Westrock: it shows you're honest about coverage. **Time check: about 5:25.**

---

### Demo B · Fashion: where to look first for Next Gen mills (5:25 to 7:40)

**B1. Next Gen mills, India (about 25 seconds)**

**DO:** Click **Next Gen mills** in the sidebar.

**SEE:** "Where to look first for Next Gen mills", with India / North America / Europe tabs (India selected). A **Decision this supports** box: "Which Indian regions should Canopy validate first, and for which kind of mill?" Tiles: **26.2 Mt** paddy straw, **7.8 Mt** textile waste, **1.5 Mt** India blueprint. Candidate regions ranked: Panipat 3/6, Central Punjab 2/6, Western UP 2/6, Harihar 2/6, Tiruppur 1/6.

**SAY:**
> Now fashion, the priority. This page answers one question for the India hub: which regions to validate first, and for which kind of mill. It ranks regions by how much evidence exists, not by where a mill belongs. Panipat is first because it's the only place where straw and textile waste sit together.

**THINK:** Stress "evidence, not suitability". It heads off the objection "you can't rank sites from a desk".

**B2. Mill build planner: Haryana (about 45 seconds)**

**DO:** Scroll down to **Mill build planner**. Under Feedstock, click **"Haryana paddy straw"**. Under Mill size, click **"Red Leaf, straw · 200 kt"**.

**SEE:** Feedstock 6.8 Mt a year; Collectable share **20%** (Assumption); Straw to pulp yield **50%**. Results: **Mills of this size: 3**, **Next Gen pulp a year: 0.60 Mt**, **Investment: $0.8 bn** at $1,333/t, **GHG avoided: 2.4 Mt CO2e**, **Canopy's 1.5 Mt India blueprint: 40%**. Below that: **"If the collectable share is…"** 5% → 0 mills, 10% → 1, 20% → 3, 35% → 5, 50% → 8.

**SAY:**
> Here's the planner. Haryana has 6.8 million tonnes of paddy straw. If 20 percent is collectable, and yield is 50 percent (that's from Red Leaf's design figures), it supports about three 200-kilotonne mills, 40 percent of Canopy's India blueprint. It's a scenario, not a feasibility estimate, and every assumption is a labelled slider.

**DO:** Move the cursor along the **"If the collectable share is…"** row.

**SAY:**
> And this row is the real finding. At 5 percent collectable it's zero mills; at 50 percent it's eight. The collectable share decides the answer, and it's the number with the least data. That's why quarter one starts there.

**THINK:** This is the analytical high point of the whole talk. Pause after "eight". Don't drag the sliders live, which is fiddly on a video call; the table already shows the sensitivity.

**B3. Harihar: the fallback route (about 25 seconds)**

**DO:** Scroll back up to the candidate list and click **4 · Harihar (Karnataka · Retrofit or offtake)**.

**SEE:** "Harihar, Karnataka · Retrofit or offtake". *Existing MMCF demand: Quantified*: Birla Cellulose's two-phase lyocell expansion, first phase due 2027; Aditya Birla holds 15.87% of global MMCF capacity. Then **Why it is on the list** and **Questions to answer next**.

**SAY:**
> Harihar is my fallback. Birla is expanding lyocell here and already sells Next Gen lines with Circulose pulp. The fastest route may be Next Gen pulp into those new lines, not a new mill. And the questions to answer next are right here: would Birla commit a share, and where would that pulp come from.

**THINK:** This ties the demo back to the fallback on slide 3. It shows the plan survives if brands don't share data.

**B4. Demand and supply (about 40 seconds)**

**DO:** Click **Demand and supply** in the sidebar.

**SEE:** "How many Next Gen fibre mills does fashion need?" The slider is at **10%**. The steps: **Fibre wanted 0.84 Mt**, **Made today 0.09 Mt**, **New capacity since 2024 0.06 Mt** (Circulose), **Still missing 0.69 Mt**. Mill size **60 kt** is selected, giving **12 mills**; **18%** covered.

**SAY:**
> Last, CanopyStyle's view. If brands wanted 10 percent of MMCF to be Next Gen, that's 0.84 million tonnes. 2024 output and new capacity cover 18 percent. About 0.7 million tonnes is missing: roughly twelve mills the size of Circulose's.

**DO:** Scroll down to **"Who has promised to buy?"**

**SEE:** A table with Circulose (11 brands, names and tonnes not published), Aditya Birla (no tonnage), Red Leaf/Dart (volume not stated), and Canopy brand partners (950+ policies, not tonnes).

**SAY:**
> And this is why brand data comes first. Eleven brands committed to Circulose, but names and tonnes aren't published. 950 brands have policies favouring Next Gen, but policies aren't tonnes.

**DO:** Switch back to **Tab 1** (the deck) and go to **slide 7** (the orange one).

**THINK:** **Time check: about 7:40.** If you're behind, skip slide 9.

---

### Slide 7 · What building it revealed (7:40 to 8:00)

**SAY:**
> So the demo surfaces the key finding. The five named Next Gen projects I could find add up to about 306 kilotonnes. And I couldn't find a single brand publishing its Next Gen demand in tonnes. That's the number the whole plan depends on, and collecting it is the first job.

### Slide 8 · Year one (8:00 to 8:40)

**SAY:**
> Here's the year. Quarter one, with the India hub and CanopyStyle: three regions agreed for validation, and three brands sharing volumes. Quarter two is packaging with Pack4Good: ten producers researched to the same depth, so comparisons are fair. Quarter three, the demand pilot goes from three brands to twenty, and forest-risk layers come in with the Forests team. Quarter four, district-level siting in three regions, so we can take validated India sites to investors.

**THINK:** Read the owner column with emphasis. It answers requirement 5 ("work across Canopy's internal teams").

### Slide 9 · How it lasts (8:40 to 9:15) · skip if behind

**SAY:**
> How it lasts. Data and Research owns the evidence; each team owns the decision its page supports, and we review it together every quarter. I don't want to build a tool and hand it over.
>
> Every dataset has an owner, a source and a refresh cycle. Every figure is reported, estimated or unknown. Brand volumes are confidential by design. And the quarter-three demand numbers are exactly the evidence a flagship report or op-ed needs, which I'd plan with Communications.

### Slide 10 · Close (9:15 to 9:45)

**SAY:**
> To sum up: the data for the material transition exists, but it's scattered, and the number that matters most, brand demand in tonnes, isn't published anywhere. My first year closes that gap and links it to feedstock and mills in India, so the India hub's first feasibility choice rests on evidence, not guesswork.
>
> The prototype is live, and I'm happy to go anywhere in it or in the brief. Thank you.

**THINK:** Then **stop talking**. Leave the slide up. Don't fill the silence.

---

## If something goes wrong

| Problem | What to do |
|---|---|
| The site is slow or down | Say *"Let me show you the same path in screenshots,"* go back to Tab 1 and jump to the **Backup** section at the end of the deck (slides 11 to 21). Use the same words. |
| You click the wrong thing | Don't apologise at length. Say *"Let me go back,"* and use the **left sidebar** to get to the right page. Every page is one click from the sidebar. |
| Someone interrupts with a question | Answer in one or two sentences, then say *"I'll come back to that in the Q&A if you'd like to go deeper,"* and carry on. |
| You're running long at the 7:40 check | Skip slide 9. If you're still long, cut the Harihar step (B3) next time you rehearse. |
| Screen share shows only one tab | Stop sharing and re-share the **Chrome window**, or present everything from the browser tab with the site and open the deck from the PDF. |
| A drawer or panel won't close | Press **Esc**, or click the grey area outside it. |
| The planner shows different numbers | Someone changed the feedstock or mill size. Click **Haryana paddy straw** and **Red Leaf, straw · 200 kt** again; collectable share should read 20%. |

---

## Deep dives for Q&A: where to click when they ask

Keep Tab 2 open during questions. These are the fastest routes.

| If they ask about… | Click | What to point at |
|---|---|---|
| Hot Button, the fashion baseline | Global overview → **Fashion** toggle (top right) | 8.4 Mt MMCF; **53%** of capacity in green shirts (22 of 28 producers); **24.8%** at known risk; 20 Next Gen lines, 12 from China |
| "Show me the maths" on a transition | Companies → Metsä Board → MetsäBoard Pro FBB Bright → Assess a transition → **Scenario** tab | Type Virgin **70**, Recycled **30**, Fibre share **75** → **195,000 t** fibre basis, **58,500 t** virgin fibre displaced. Point at the guardrail: "Finished-product tonnes are not fibre tonnes" |
| Sources and quality | Same panel → **Evidence** tab | Each source marked **Accessed**, with the exact passage. The EPD is valid until 2027-03-25 |
| Forest risk | **Supply risk** | EUDR country tiers on the map; exposure High / Watch / Unknown / Low. Sateri is High (Hot Button known risk); Metsä is Low |
| Policy timing | **Policy tracker** | EUDR countdown (a little over three months on Monday), PPWR, textile EPR. Items still to verify are marked **Needs review** |
| EcoPaper | **Canopy solutions** → EcoPaper tab | Listings ranked against the Metsä product; "Missing: capacity, minimum order…"; field coverage for 3 real listings |
| Project pipeline vs the target | Next Gen mills → scroll to **Named Next Gen projects** | **306 kt** named, 0.6% of the 51.6 Mt gap, vs Canopy's own **11.9 Mt** capacity count |
| The plan | **Year-one roadmap** | Each card: used by, data, owner, success looks like, data still to load |
| Governance, versioning, data entry | **Data workspace** | Record counts (94 quantities, 47 sources); **Save and mark for review**; **Export JSON**; **Reset to seed** |

**Numbers that might trip you up:**
- The Road to 60 chart shows an **11.9 Mt capacity** line as well as **8.35 Mt produced**. Capacity isn't output; the brief uses production.
- Mondi shows **4.8 Mt** in the tool (containerboard + kraft paper + uncoated fine paper). Your brief says **3.9 Mt of packaging grades** (containerboard + kraft paper only). Both are right; they cover different grades.
- EUDR countdown: the tool counts to **30 December 2026**, so the number changes daily.

---

# How the brief maps to the role

The job ad's first-year priorities, and where your brief already answers them. Use this to connect answers back to the role during Q&A.

| First-year priority (job ad) | Where it shows up in your brief and prototype |
|---|---|
| Document priority datasets: ownership, sources, update cycles | Six datasets with rationale; "Keeping it alive" names owners and refresh cycles; README logs every source and access date |
| Standards for quality, provenance, confidentiality, AI-supported analysis | Reported / estimated / unknown status on every figure; illustrative data kept out of totals; confidential brand volumes |
| Coordinated process for commissioning research | **Not explicit in the brief.** Be ready to describe it (see Q12) |
| Prioritised roadmap for decision-support tools | The year-one table: one tool per quarter, each with an owning team and a target |
| Technical knowledge on Next Gen materials and regional cohorts | India feedstock layer, mill build planner, Next Gen project pipeline |
| Data workflows behind major reports | Every chart traces to a cited source; calculations documented with formulas |
| Thought leadership calendar with Communications | **Not explicit in the brief.** The "no brand publishes demand in tonnes" finding is a natural first piece |

**Parts of the role your brief doesn't show, so prepare real examples from your own experience:**
- Managing a team, and overseeing consultants or external researchers
- Commissioning research and synthesising work from subject-matter experts
- Training colleagues and writing documentation that people actually use
- Supporting a public report through to publication

---

# Q&A preparation (the remaining ~75 minutes)

When an answer involves the tool, use the click routes in **Deep dives for Q&A** above.

Short answer shapes. Keep each answer to 60–90 seconds, then stop.

**1. Why India feedstock over packaging tracing, when packaging is further along?**
Packaging improves a decision Canopy already makes well: which producer to engage. India informs a larger, time-bound one: where the first feasibility money goes under a $2 bn plan. Packaging still ships in Q2, so it's sequenced, not dropped.

**2. Brand demand isn't public. What if brands refuse to share?**
Confidential sharing through CanopyStyle, aggregated so no single brand is visible. If three won't, the fallback is producer expansion plans as the demand signal, narrowed to one route (Harihar). Name it as the biggest risk, and say the plan already accounts for it.

**3. How do you know how much straw is really collectable?**
You don't yet, and that's why the 20% is a slider, not a finding. Q1 validates it with the India hub. FIRMS fire counts help triangulate (e.g. 5,114 residue burning events in Punjab, 15 Sep to 30 Nov 2025): burned straw is straw nobody else is using.

**4. How do you keep data quality and trust?**
Every figure carries a source and one of three statuses: reported, estimated, unknown. Illustrative scenarios are labelled as such and never enter evidence totals. When I opened every source, I caught a wrong page reference in my earlier notes (Mondi's materials flow is on page 83, not 82), and the tool records that correction. Small, but it shows the discipline.

**5. How would you measure success at 12 months?**
The quarterly targets: 3 regions agreed, 20 brands sharing tonnes, 10 producers at equal depth, validated India sites in front of investors. And ultimately: did a team make a different or faster decision because of the tool?

**6. How would you work with teams that don't think in data?**
Start from their decision, not the dataset. Each page answers one question for one team. The team owns the decision, I own the evidence, and we review quarterly. Adoption comes from being useful in a real meeting, not from training.

**7. What would you do differently with more time?**
Open the full Fashion for Good report (only the summary was used). Load district-level data. Re-verify capacities like Infinited Fiber's 30 kt. Add forest-level risk layers, not just EUDR country tiers.

**8. How did you use AI?**
Answer honestly and specifically. The assignment allowed AI for supporting tasks like building the prototype interface, formatting and polishing. The dataset choice, the prioritisation and the rationale were yours. Say which parts were which.

**9. Why not rate companies in the disclosure view?**
A rating implies a judgement about the company. The view measures what research could find. That keeps producers engaged rather than defensive, and tells them exactly what to disclose.

**10. What's the policy angle?**
EUDR (30 Dec 2026 for large and medium operators), PPWR, and EU textile EPR on one timeline, with each tracked producer tagged. Campaigns can time their asks to the deadlines.

**11. How would you lead the team, and what would your first 90 days look like?**
*Use a real example of managing people.* Shape: first 30 days listening to each Impact team about the decisions they make and the data they use. By 60, a dataset register (owner, source, update cycle, confidentiality) and draft standards. By 90, the Q1 pilot running and a tool roadmap agreed with the Head of Impact.

**12. How would you commission and manage external research?**
One intake process across the Impact team: the decision it serves, the question, the deadline, the budget. Every commission states its methods, boundaries and deliverable format up front, so results land in the shared architecture instead of a PDF nobody reopens. Review by a named subject-matter expert before anything goes public. *Add a real example of managing consultants.*

**13. What does responsible AI use look like here?**
AI is useful for extraction (pulling figures from reports and EPDs), first-pass literature scans and drafting. The rules: a human verifies every number against the source before it enters the dataset, confidential partner data never goes into tools without the right safeguards, and outputs record that AI was used. Your prototype is an honest example: AI helped build the interface, but each figure was checked against the source document, and the README logs what was opened and when.

**14. When would you *not* build a tool?**
The ad asks for this directly. If a decision happens once, or a single table answers it, build the table. The disclosure coverage view could have been a spreadsheet, and the tool only earns its place because it updates live from the evidence store and several teams use it. Say you'd test with the owning team before building anything bigger.

**15. The carbon comparison (from your application prompt).**
Link it to the brief: the tool applies Canopy's "4 t CO2e avoided per tonne of Next Gen pulp" as a labelled average, not a product claim. For a public chart comparing LCA studies: align system boundaries, reference years and 20- vs 100-year horizons before comparing. Show ranges rather than single points. State exclusions, and have an expert review it. Refer back to what you wrote in your prompt response so the two answers are consistent.

**16. How would you support a flagship public report?**
Own the data, methods and citations. Lock a dataset version for the report, keep a methods note, and make every chart reproducible from a source table. Have a second person check the numbers before layout.

**17. Brand volumes are commercially sensitive. How do you handle that?**
Collect under an explicit confidentiality agreement through CanopyStyle. Store with restricted access, and publish only aggregates across enough brands that no one can be identified. Let brands see their own numbers against the aggregate, which gives them a reason to share.

**18. "A sense of humour."**
It's in the ad, so it's fair game. The Agent Curious Fox badge in the prototype's sidebar is a light touch you can point to. Otherwise, just be yourself.

## Questions to ask them

- Which decision is the India hub facing soonest, and what evidence are they currently missing?
- How does CanopyStyle currently hold brand commitment data, and how confidential is it?
- Where does Data & Research sit relative to program teams, and who would I work with most in the first 90 days?
- What would make you say, a year from now, that this hire was a clear success?
- How big is the team I'd lead, and which external researchers or consultants are already working with the Impact team?
- How does the Head of Impact see this role splitting time between building systems and delivering reports and campaign assets?
