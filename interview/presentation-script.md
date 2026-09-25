# Material Transition Intelligence Brief: interview presentation

**Monday 28 September 2026, 5:00 to 6:30 pm** · 90-minute interview · **10-minute presentation**  
Panel has already read the brief, so the talk doesn't walk through it page by page. It explains **why you chose what you chose** and shows the tool working.  

Role: Data & Research Lead, reporting to the Head of Impact. The job ad stresses standards, provenance, decision-support tools, research commissioning, responsible AI and team leadership, so the script ties back to those.

Every figure below comes from your brief or from the prototype's source notes. Speak it in your own words. Canopy asked for the analysis to be yours, and the panel will notice if it sounds memorised.

---

## Running order and timing

| # | Slide | Time | Cumulative |
|---|---|---|---|
| 1 | The number that matters | 0:50 | 0:50 |
| 2 | Six datasets, one question each | 1:20 | 2:10 |
| 3 | What comes first, and why | 1:40 | 3:50 |
| 4 | How the data connects | 0:50 | 4:40 |
| 5 | Packaging: global to one product (live) | 1:30 | 6:10 |
| 6 | Fashion: where to build mills (live) | 1:40 | 7:50 |
| 7 | Year one and who owns what | 1:50 | 9:40 |
| 8 | Close | 0:40 | 10:20 |

About 1,450 spoken words, which runs slightly over 10 minutes at a calm pace. Drop the lines marked **[cut if short]** (about 120 words) to land right at 10 minutes.

---

## Slide 1: The number that matters

**On the slide**
> **8.35 Mt → 60 Mt by 2033**  
> Next Gen material on the market  
> That is about 25% growth, every year, for nine years.  
> canopy-mti.vercel.app

**Say**

Thank you for having me, and for reading the brief in advance. I'll use my ten minutes on the reasoning behind it and on the prototype. I won't repeat the document.

The way I read this role, it's about one thing: helping people at Canopy and its partners act on evidence, not guesswork. So that's the lens for everything I'm about to show.

I started from one number. Canopy wants 60 million tonnes of Next Gen material on the market by 2033. In 2024 it was 8.35. Getting there takes about 25 percent growth every year for nine years. That's mostly new mills, new feedstock and new buyers, and all three have to show up at the same time.

So I didn't ask "what data exists?" I asked "which decisions actually move that number, and what data do they need?" Everything in the brief follows from that.

One rule runs through the tool: every figure carries its source and a status of reported, estimated or unknown. Where I don't know, it says unknown. That's a provenance standard, and it's what makes the tool safe to use for decisions.

---

## Slide 2: Six datasets, one question each

**On the slide** (table, one line each)
> **Hot Button 2026**: which MMCF producers are green, at risk, or selling Next Gen  
> **FAOSTAT 2024**: how big paper, packaging and pulp are  
> **Company reports, EPDs, EUDR declarations**: what is in one product, from which mill and countries  
> **EcoPaper Database**: what a producer could switch to  
> **Textile Exchange MMR 2025**: how much MMCF is made, how much recycled  
> **India feedstock layer**: straw and textile waste by district, and how much is burned

**Say**

I assessed the landscape by the question each source answers, not by how big it is.

Two are Canopy's own, and they're the strongest levers. **Hot Button** tells us which viscose producers are green, which are at risk and who's already selling Next Gen. **EcoPaper**, with over 1,400 vetted listings, turns a traced product into a concrete alternative.

Two give the baseline. **FAO** gives the scale of paper and packaging: 278 million tonnes of packaging paper and board in 2024. **Textile Exchange** does the same for fashion: 8.4 million tonnes of MMCF, and only 1.1 percent of it from recycled feedstock.

The fifth is **company reports, EPDs and EUDR declarations**. That's the route down to one product: which mill, which countries the wood came from. It gets much richer from December 2026, when EUDR due diligence applies to large and medium operators.

The sixth is one I'd build: an **India feedstock layer**. It combines district crop production, NASA FIRMS fire data and Fashion for Good's textile-waste clusters. Today it's seeded with 26 million tonnes of straw across three northern states and 7.8 million tonnes of textile waste nationally. Getting it to district level is year-one work.

**[cut if short]** What I left out matters too. Forest-risk layers are valuable, but I sequenced them later because they sharpen decisions Canopy already makes well.

---

## Slide 3: What comes first, and why

**On the slide**
> **Priority: India feedstock + Hot Button + brand demand**  
> The decision: which 2–3 regions, and which kind of mill, go into feasibility first?  
> Stake: Canopy's $2 bn plan for the first 1.5 Mt in India  
> Risks: brand demand isn't public · collectable feedstock is uncertain

**Say**

This was the hardest choice, and I want to be transparent about how I made it.

The obvious candidate was packaging tracing. The data is more public, it's closer to done, and I've built most of it. But it mostly improves engagement choices Canopy already makes. It helps Pack4Good pick the right producer to talk to.

Combining India's feedstock data with Hot Button and brand demand feeds a bigger decision with a deadline. The India hub has to choose which two or three regions, and which kind of mill, go into feasibility first under the $2 billion plan for 1.5 million tonnes. Getting that choice wrong costs years. That's why this came first.

I also know where it's weak. Brand demand isn't public, and nobody really knows how much straw is collectable, as opposed to how much exists. So Quarter 1 is built to test both. I'd ask the India hub which kind of mill they favour and what collection really looks like. I'd ask CanopyStyle whether three brands would share volumes confidentially.

If they won't, I have a fallback. I'd use producer expansion plans as the demand signal and narrow to one concrete route: Next Gen pulp for Aditya Birla's Harihar lyocell expansion. Either way, the India hub gets an answer in Quarter 1.

---

## Slide 4: How the data connects

**On the slide** (a left-to-right chain)
> Brand → Producer (Hot Button) → Pulp needed → Mill that can make it → Feedstock around the mill → Delivery year  
> *A match counts only when fibre spec, process, supplier and date all line up.*

**Say**

This is what turns six datasets into one tool.

Each link is a join. A brand buys from a producer, and Hot Button tells us which producers and how they score. That producer needs a certain pulp. A mill can make that pulp from a certain feedstock, and the feedstock has to be within reach of the mill. Then there's the year it can deliver.

The rule underneath matters most. A match only counts when fibre spec, process, supplier and date all line up. Otherwise you get lots of optimistic "matches" on paper that never become offtake agreements. I'd rather show three real matches than thirty soft ones.

**[cut if short]** This chain is also the start of the shared architecture the role describes. The datasets, the source documents and the decision tools all hang off the same records.

---

## Slide 5: Packaging, from the global picture to one product (live demo)

**On the slide / screen**: switch to the prototype. Path: *Global overview → Companies → Mondi → Metsä Board Pro FBB Bright → Transition panel → Disclosure coverage*

**Say**

Let me show you how it works, starting with packaging.

*(Global overview)* At the top: 278 million tonnes of packaging paper and board, roughly 156 recycled and 92 virgin wood. That split is estimated, and the badge says so. The Next Gen share is shown as unknown on purpose.

*(Company: Mondi)* One level down is the company. Mondi makes 3.9 million tonnes of packaging grades, with wood from seven countries and 82 percent certified, all from its sustainability report.

*(Product: Metsä Board Pro FBB Bright)* Then one product. Fibre comes from its EPD. It's made at Äänekoski, with wood from Finland, Sweden, Estonia and Latvia, from its EUDR declaration. All eight evidence fields are filled, and three of them are flagged as proxies. You can see exactly which ones.

*(Transition panel)* Then the solution: EcoPaper and Next Gen alternatives ranked for that product.

*(Disclosure coverage)* Finally, this is Pack4Good's view. It shows where evidence is thin and what to ask each producer for. I want to be clear that it measures what research found, not a rating of the company. Some products stop at company level. Mondi's SmartKraft Brown, for example, is only "30% fresh, 70% recycled, made in Europe." That tells the producer what to disclose to move up. **[cut if short]** It also helps policy teams time their asks to the EUDR deadline on 30 December.

**Backup if the demo fails:** have screenshots of these five screens in order and talk over them with the same script.

---

## Slide 6: Fashion, where to build Next Gen mills (live demo)

**On the slide / screen**: *Next Gen mills → India → Mill build planner (Haryana) → Demand and supply*

**Say**

Now fashion, which is the priority.

*(Next Gen mills, India)* Candidate regions in India, Europe and North America, ranked by how much evidence exists. That tells the India hub where to validate first, which is a different claim from where to build.

*(Mill build planner, Haryana)* Here's the planner. Haryana has about 6.8 million tonnes of paddy straw. If 20 percent is collectable and yield is 50 percent (the yield comes from Red Leaf's design figures), that's enough for about three 200-kilotonne mills. It's an illustrative scenario, not a feasibility estimate, and the assumptions are the sliders you can see. A state government can use this to see where straw that's burned today could become pulp.

*(Demand and supply)* The last view is for CanopyStyle and brands. Pick a Next Gen goal, say 10 percent of MMCF, and it shows the gap. After 2024 output and committed new capacity, about 0.7 million tonnes isn't covered. That's roughly a dozen 60-kilotonne mills, again as a scenario.

What building this taught me: the five named projects I could find add up to about 306 kilotonnes, at mixed stages. And I couldn't find a single brand publishing its Next Gen demand in tonnes. That gap is the most important finding in the brief, and collecting that number is the first job.

---

## Slide 7: Year one, and who owns what

**On the slide**

| Q | Build and load | Owner with Data & Research | Target |
|---|---|---|---|
| Q1 | India feedstock layer, Hot Button links, 3-brand demand pilot | India hub, CanopyStyle | 3 regions agreed; 3 brands sharing volumes |
| Q2 | Packaging product tracing, EcoPaper export, disclosure coverage | Pack4Good | 10 producers researched to the same depth |
| Q3 | Demand pilot 3 → 20 brands, forest-risk layers | Next Gen Solutions, CanopyStyle, Forests | Next Gen demand in tonnes from 20 brands |
| Q4 | District-level siting in 3 regions, policy tracker | Regional hubs, Campaigns | Shortlists for 3 regions; validated India sites to investors |

**Say**

Here's the year. Every quarter has a team that owns the decision and a target you can check.

In Quarter 1, with the India hub and CanopyStyle, we agree three regions for validation and get three brands sharing volumes. Quarter 2 is packaging with Pack4Good: ten producers researched to the same depth, so comparisons are fair. In Quarter 3 we scale the demand pilot from three brands to twenty and add forest-risk layers with the Forests team. In Quarter 4 we do district-level siting in three regions, so we can take validated India sites to investors.

How I'd work across teams comes down to one principle. Data & Research owns the evidence, and each team owns the decision its page supports. I don't want to build a tool and hand it over. Each page has an owner who reviews it with me every quarter.

Keeping it alive is mostly about refresh cycles. Hot Button updates every September, and FAO and Textile Exchange update yearly. Partners can add sourced evidence through the data workspace, and it goes through the same status rules.

This lines up with the first-year priorities in the role. Every dataset has an owner, a source and an update cycle, which is the dataset register. The status rules are the start of shared quality and provenance standards. Brand volumes are collected confidentially by design. And the Q3 demand numbers are exactly the kind of evidence a flagship report or op-ed needs, which I'd plan with Communications.

---

## Slide 8: Close

**On the slide**
> **The first job: get Next Gen demand in tonnes.**  
> Every figure sourced. Every gap labelled. Every page owned by the team that decides.

**Say**

To sum up: the data for the material transition already exists, but it's scattered, and the one number that matters most, brand demand in tonnes, isn't published anywhere. My first year is about closing that gap and linking it to feedstock and mills in India, so the India hub's first feasibility choice rests on evidence.

The prototype is live and I'm happy to go into any part of it: the sourcing, the assumptions, or what I'd do differently. Thank you.

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

## Logistics checklist

- [ ] Prototype open in a browser tab at the Global overview, logged in, zoomed for screen share
- [ ] Screenshots of the demo path as backup
- [ ] Brief PDF open in another tab
- [ ] Timer visible; rehearse twice out loud to 9:30
