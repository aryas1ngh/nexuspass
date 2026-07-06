# NexusPass — Milestone 2 Slide Deck

A self-contained, offline HTML presentation for **ENT307 — Marketing of Services, Milestone 2**.
**Group 15 · NexusPass** — a unified digital pass that owns the entire in-venue event journey (ticketing → parking → navigation → exit) for attendees (B2C) and organizers (B2B).

---

## How to run

**Locally (just view):** double-click `index.html` — it opens in any browser, no internet needed.

**Host on your PC for others on the same network:**
```bash
cd slides
python3 -m http.server 8420 --bind 0.0.0.0
```
Then share `http://<your-LAN-IP>:8420` (find your IP with `ipconfig getifaddr en0` on macOS). Everyone on the same Wi-Fi opens that link. Keep the terminal running while presenting.

## Navigation
- **Next:** → / Space / click right edge / "Next" button
- **Previous:** ← / click left edge / "Prev" button
- **Jump:** Home (first) / End (last)
- **Fullscreen:** F / "⛶ Full" button (toggle)
- **Export to PDF:** ⌘P / Ctrl+P → "Save as PDF" (print CSS renders one slide per page)

Transitions: a light crossfade between slides, plus a staggered per-element reveal of the body content as each slide opens. Titles and subtitles never animate. Respects `prefers-reduced-motion`.

## File structure
```
slides/
├── index.html      all 18 slides
├── style.css       light theme + all component styles
├── script.js       navigation, page numbering, stage scaling
├── assets/         competitor logos (BookMyShow, Park+, Cvent, Bizzabo)
└── README.md       this file
```

## Theme
Light, premium, easy on the eyes. Warm off-white background (`#FAFAF7`), teal accent (`#00A896`), amber accent (`#E8963A`), risk red (`#D64545`), success green (`#3FA76B`). Dot-grid + soft-blob texture on every slide (amber-toned on the three "candor" slides: 3, 13, 15). Footer signature is uniform everywhere: **NexusPass · Group 15** + auto page number.

---

## Full slide content

### 1 · Title
**NexusPass: Designing the Service Engine**
Milestone 2 · Group 15 — ENT307, Marketing of Services

### 2 · The Story So Far — *A quick recap of what Milestone 1 taught us*
- 🎯 **The Problem** — Fragmented, high-friction events: ticketing, parking, navigation, exit.
- 👥 **The Customer** — Fans, corporate delegates, organizers: three segments, one pain.
- 💡 **The Insight** — Peak-End Rule: the pain is *after* entry, not before.

### 3 · Listening Changed the Design — *What feedback did we get, and what did we change?* (candor)
> "Go deeper — balance the customer side and the organizer side. Lean a bit more into the customer."

**What we changed**
1. Customer journey is now its own slide, before the blueprint
2. Moments of Truth told attendee-first
3. Added a capacity & quality slide (was missing)
4. Pricing reframed around customer fairness

**Kept:** the B2B dashboard — the revenue engine and our real differentiator. We condensed it, didn't cut it.
**Validated:** our survey confirmed exit & parking as the #1 pain — see the data next.

### 4 · A Large, Growing Market — *How big is the organizer market we're entering?* (Secondary research)
Two engines drive India's organized events — **live entertainment** and **MICE** — together a **~₹50,000 crore** market, and no platform owns the *in-venue* layer of either.

**🎤 Live Events — ₹12,000 cr+** (organized segment, 2024)
- Grew 15% in 2024, ~19% projected CAGR over 3 years
- 70–80 concert days with 10,000+ crowds in 2024
- Concerts, sports, festivals, ticketed shows

**💼 MICE — ₹37,576 cr** (Meetings · Incentives · Conferences · Exhibitions)
- Meetings ≈ 48% of MICE — the largest sub-segment
- 70+ world-class convention centres nationwide
- Corporate delegates — our secondary wedge

*Sources: FICCI-EY Media & Entertainment Report (live events, 2024–25); India Tourism Ministry / MICE market estimate (₹37,576 cr, 2024).*

### 5 · Protecting the Final Memory — *Whose friction are we solving first?*
**Refined problem statement:** Fragmented logistics — parking, navigation, and exit — quietly ruin the *final memory* of an event, and *no single platform* owns the attendee journey from ticket to exit.

**Target segments (in order):**
- 🎧 **Entertainment Fans** — *Primary Focus* · largest market · highest frequency
- 💼 **Corporate Delegates** — Secondary · higher revenue per user
- 📊 **Event Organizers** — Tertiary · enabling layer

### 6 · The Options Today — *What do people do now — including nothing?*
- **BookMyShow** — Ticket booking → stops at the gate
- **Park+** — Parking only → off from the event
- **Cvent / Bizzabo** — Registration → no in-venue nav
- **"Doing Nothing"** — Ask staff, follow crowd, WhatsApp pins → *this is our gap*

Every option is single-function. Today the real workaround is **each other** — the frontstage gap we close.

### 7 · Why Us — *Why would a customer choose us over the alternatives?* (Value Proposition Canvas)
One pass that owns the whole in-venue journey — *so the memory you keep isn't the memory of getting there.*

**Customer Profile**
- Jobs: enjoy it, find things, get in & out smoothly
- Pains *(red)*: 3–4 apps, nav chaos, exit gridlock
- Gains *(green)*: one pass, live wayfinding, smooth exit

**NexusPass Fit**
- Relievers: unified QR pass, parking, live routing
- Creators: organizer telemetry, sponsor ROI, dynamic badges

### 8 · Aiming, In Order — *Who are we targeting, in what order, and why?* (STP)
| | 🎧 Fans | 💼 Delegates | 📊 Organizers |
|---|---|---|---|
| Mindset | Experience-seekers | Efficiency-driven | ROI & data-hungry |
| Behavior | 2–5 / yr | 3–8 / yr | 10–50+ / yr |
| Priority | 🥇 Primary | 🥈 Secondary | 🥉 Tertiary |

**Positioning:** Unlike BookMyShow or Cvent, which stop at the gate, we own the whole in-venue journey.
**Perceptual map:** axes = Single-Function ↔ End-to-End and B2C ↔ B2B; NexusPass sits alone at End-to-End / top-center, bridging B2C and B2B.

### 9 · Three Acts of an Event — *What happens before, during, and after?* (Peak-End Rule)
- 🎫 **Before** — Booking & registration; uncertainty about parking/access. *(neutral → mildly anxious)*
- 📍 **During** — Entry scan, in-venue navigation, engaging with the event. *(dips at friction, peaks at the show)*
- 🚗 **After** — Exit, parking retrieval, the memory people share. *(Peak-End Rule: this decides the memory)*

### 10 · The Invisible Engine — *How is the service actually delivered?* (Service Blueprint)
- 🙋 **① Customer Actions:** Browse → Book → Arrive → Scan QR → Navigate → Engage → Exit → Review
- 📱 **② Frontstage:** App UI · QR Pass · Live Map · Notifications · Polls
- 👁️ **Line of visibility** — what the customer never sees
- ⚙️ **③ Backstage:** Payments · Parking engine · BLE triangulation · Crowd-density engine
- 🗄️ **④ Support:** Cloud infra · Venue Wi-Fi · BLE hardware · Third-party APIs · Analytics

### 11 · Won or Lost in Seconds — *Where is trust won or lost — and how do we recover?* (Recovery Paradox)
| Moment | Fail point | Recovery |
|---|---|---|
| 🎫 Entry Scan | Slow scan → queue | Manual lanes < 2 min |
| 🅿️ Parking | API failure | Staff guide + push map |
| 🧭 Navigation | BLE dead zones | GPS fallback + push |
| 🚪 Exit | Server overload | Staggered + marshalling |

Every failure: **Detect → Respond < 2 min → Repair.**

### 12 · Where the Strain Shows — *What breaks first when demand spikes?* (Capacity · Consistency · Quality)
Severity meters, highest first:
- **Capacity (92%)** — BLE & cloud throughput are fixed per venue; 50K is a different problem than 5K.
- **Waiting Time (84%)** — Entry throughput sets the pace; a slow gate cascades downstream.
- **Consistency (66%)** — Rides on venue Wi-Fi & staff training; we can't standardize what we don't control.
- **Staffing (60%)** — Recovery needs venue staff trained on our fallbacks, not just a fast app.
- **Quality Variability (54%)** — A first-time venue will visibly underperform a flagship one.

### 13 · Priced to Feel Fair — *Who pays, and why does the price feel fair?*
- 🎧 **B2C Attendee — Freemium — ₹99–149.** Fair: safety basics stay free, only convenience is paid. Anchored to Park+ (₹100–200), bundling parking + nav + updates.
- 💼 **B2B Organizer — SaaS / event — ₹50K–5L.** Fair: consolidates spend they already make, not new spend. Undercuts Cvent (~$5–15/attendee) with in-venue intelligence.
- 📈 **Sponsor Analytics — Pay-per-report — Custom.** Net-new revenue for organizers too. Foot-traffic, heatmaps, ROI proof — needs BLE data rivals lack.

### 14 · The Data Backs the Problem — *What did our own research validate?* (Primary research: 25 attendees + 8 organizers)
- **84%** missed part of an event — lost, stuck in a bottleneck, or in a food line
- **52%** rank exiting & parking the single most stressful phase — validating Peak-End
- **88%** agree bad logistics can ruin an otherwise great event
- **76%** are likely to use a single All-Access pass (rated 4–5 of 5)
- **92%** would feel safer with real-time crowd & exit alerts
- **68%** juggle 2–3 apps for one event; organizers coordinate up to 5+ vendor tools

*Source: NexusPass Milestone 1 survey — 25 attendee responses + 8 organizer responses.*

### 15 · The Ideas Behind the Choices — *Which course frameworks shaped our decisions?*
- 🧠 **Peak-End Rule** — Exit, not entry, dominates the memory → shaped the journey & moments slides.
- 🎯 **Value Proposition Canvas** — Made us split attendee vs. organizer value — answering the M1 feedback.
- 🗺️ **Service Blueprint** — Exposed backstage failures with no recovery — until we designed them in.
- 🛟 **Service Recovery Paradox** — Detect → respond → follow-up as one unit per moment of truth.
- 🔄 **Co-Creation / SD-Logic** — Attendee app use generates the data that powers the organizer dashboard — free.

### 16 · Our BIZS Compass — *What will we consciously refuse to do?* (candor)
*Bahaduri · Imaandari · Zimmedari · Samajhdari*
- ✕ **Sell individual location data to sponsors** — Tempting: premium pay for granular, traceable data. We won't: it becomes surveillance without real consent. Principle: **Imaandari — honesty**.
- ✕ **Degrade the free tier to force upgrades** — Tempting: fast way to lift conversion per event. We won't: it exploits a captive in-venue audience. Principle: **Zimmedari — responsibility**.
- ✕ **Oversell BLE accuracy to win venues faster** — Tempting: quicker sales, more partnerships. We won't: one dead zone destroys trust for good. Principle: **Samajhdari — judgment**.

### 17 · The Road Ahead — *What could go wrong, and what's next?*
**Top risks & mitigations**
- 🔴 BookMyShow adds nav → First-mover + BLE hardware lock-in = switching cost.
- 🔴 Venues refuse BLE → Revenue share on sponsor analytics makes BLE a profit center.
- 🟡 Low B2C adoption → NexusPass *is* the ticket — organizer mandates it.

**Assumptions we're betting on**
- **Organizer-led adoption:** organizers mandate the pass, so attendees adopt by default.
- **BLE holds at peak:** venue Wi-Fi + beacons stay reliable at 10K–50K crowds — untested at scale.
- **Attendees trust a digital pass:** and grant location access, powering nav and the data flywheel.

**Roadmap to final**
1. Build a working click-through prototype for user testing.
2. Open one flagship-venue pilot conversation.
3. Build a break-even unit-economics model.

### 18 · Thank You
**Thank You** — Questions & Discussion
NexusPass · Group 15 — ENT307, Marketing of Services

> The anticipated-Q&A appendix is kept in `index.html` but **commented out** (team reference, not presented):
> BookMyShow difference · why another app · BLE cost · first customers · privacy.

---

*Deck built as a local website — light theme, minimal transitions, print-to-PDF ready.*
