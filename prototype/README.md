# NexusPass — Interactive Prototype

A self-contained, offline, **clickable walkthrough** of the NexusPass service for **ENT307 — Marketing of Services, Milestone 2 (Group 15)**.

This is the deliverable the deck names as its biggest open gap: *a working click-through prototype of the entry-scan → navigation → exit flow* (Slide 13 + roadmap). It walks through **both sides** of the service — the attendee phone app **and** the B2B organizer dashboard — so the whole project is demonstrable, not just described.

> **Honesty note:** this is a *mockup*. Live-looking figures (crowd density, occupancy, analytics) are **simulated** and labelled as such. No real user-test results are shown — the walkthrough test with 5–8 attendees is still the pending next step.

---

## How to run

**Just view:** double-click `index.html` — opens in any browser, no internet needed.

**Host for the room (same Wi-Fi):**
```bash
cd prototype
python3 -m http.server 8421 --bind 0.0.0.0
```
Then open `http://<your-LAN-IP>:8421` (find it with `ipconfig getifaddr en0` on macOS).

## How to drive it

### Record a video — hands-free
- Press **`F`** for fullscreen, start your screen recorder, then hit **▶ Auto-play** (top bar) or press **`P`**.
- It runs the whole story on its own: phone screens 1→8 auto-advance with live micro-interactions (pass reveal, QR scan, poll vote, star rating). At each recovery moment the **outside** "what if…?" control **pulses**, then auto-fires so the real in-app notice appears. It then pulses the **Organizer** tab, switches sides, spotlights each panel, fires the **exit-wave** (heatmap visibly eases), and ends on analytics. A top progress bar tracks the run.
- **Pause/Resume** anytime with `P` (or the toolbar button) to narrate over a step. Any manual click/arrow key takes over and stops auto-play.

### Drive it yourself
- **Guided walk:** `←` / `→` / `Space`, or the **Back / Next** buttons. The caption strip names the phase and framework for each step.
- **Free clicking:** tap any button on the phone (View pass, Scan, vote, rate…) — the guide stays in sync.
- **Switch sides:** the **Attendee app / Organizer dashboard** toggle, or press `1` / `2`.
- **Recovery demos:** on Entry, Navigation and Exit, the pulsing **"What if…?"** button (below the phone, never inside it) plays out **Detect → Respond < 2 min → Repair** as a real in-app notice.
- **The dual-sided link:** in the dashboard, **"Trigger staggered exit wave"** eases the live heatmap *and* is what produces the attendee's smart-exit push.
- **Fullscreen:** `F`.

---

## What it demonstrates (mapped to the deck)

| Prototype element | Deck slide |
|---|---|
| Attendee flow: pass → parking → scan → navigate → engage → exit → retrieval → review | Customer Journey (9), Blueprint (10) |
| Recovery toggles (Entry / Nav / Exit) | Moments of Truth & Recovery (11) |
| Smart staggered exit | Peak-End Rule (9), the "final memory" thesis |
| One pass replacing BookMyShow + Park+ + map | Value Proposition (7), Alternatives (6) |
| Live poll feeding the dashboard | Co-creation / SD-Logic (15) |
| Organizer heatmap · occupancy · capacity | Blueprint (10), Capacity & Quality (12) |
| Exit orchestration control (cross-side) | Blueprint (10), dual-sided model |
| Sponsor analytics tile | Pricing / revenue streams (13) |

## File structure
```
prototype/
├── index.html   shell + 8 attendee screens + organizer dashboard
├── style.css    deck design tokens + phone/dashboard components
├── app.js       state machine, guided nav, hotspots, recovery, cross-side sync
├── assets/      nexuspass.png (copied from the deck)
└── README.md    this file
```

## Theme
Matches the Milestone 2 deck exactly — warm off-white (`#FAFAF7`), teal (`#00A896`), amber (`#E8963A`), Inter, dot-grid texture — so the prototype reads as the same product as the slides.
