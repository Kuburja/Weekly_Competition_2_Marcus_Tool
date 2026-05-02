# Pre-Call Tool — UI Overhaul Plan

## Context

The live build at http://127.0.0.1:4173/ has 8 problems identified by the user. The app is a single-page React app (Vite) in `workspaces/stages/04-build/output/pre-call-tool/src/`. Changes touch the questionnaire UX, the scoring logic, the letter copy, and the slider section. All design decisions were confirmed via visual mockups in the brainstorming session.

---

## Change 1 — Replace Card Flow with Conversational Stack

**Problem:** One question at a time feels like an interrogation.

**Decision (confirmed):** Conversational stack — answered questions sit as clickable chips at the top. Current question shows as an active card below. Click a chip to edit it inline (chip expands with pre-filled value + Save button; no separate "← Edit" button).

**Files:**
- `src/components/CardFlow.jsx` — full rewrite of layout and state machine
- `src/components/cardFlowConfig.js` — no structural change, field order stays

**Implementation notes:**
- State: `answeredFields` (array of `{ key, label, displayValue }`), `editingKey` (which chip is expanded, or null), `activeIndex`, draft value, validation error
- Chips render above the active question card; clicking sets `editingKey` — only one chip can be open at a time
- Chip edit saves on "Save" click or Enter keypress; closes chip and recalculates `displayValue`
- Active question card keeps its fade-in animation via Framer Motion; reactions between questions can stay or be simplified
- Progress indicator: "Question X of 5"

---

## Change 2 — Add Reset Button

**Problem:** No way to start over after completing the questions.

**Decision:** Add a "Start over" button at the bottom of Phase 3 (the slider section), below the CTA button.

**Files:**
- `src/App.jsx` — add `handleReset` that sets `visiblePhase = 1`, clears `inputs` and `sliderState`
- `src/components/SliderExplorer.jsx` — add "Start over" button at bottom, calls `onReset` prop

---

## Change 3 — Placeholder Text on All Inputs

**Problem:** Inputs are blank with no hint of what to type.

**Decision:** Add descriptive placeholder text to every input showing format and example value.

**Files:**
- `src/components/cardFlowConfig.js` — add `placeholder` field to each step config

**Placeholders to use:**
| Field | Placeholder |
|-------|-------------|
| Current age | e.g. 38 |
| Annual household income | e.g. $85,000 |
| Current retirement savings | e.g. $42,000 |
| Monthly savings contribution | e.g. $500 |
| Target retirement age | e.g. 65 |
| Total debt (if applicable) | e.g. $25,000 |

---

## Change 4 — Remove Annual Expenses, Derive It

**Problem:** Annual Expenses is redundant — it can be calculated from income and savings.

**Decision:** Remove the Annual Expenses question. Derive it internally:
```
annualExpenses = annualIncome - (monthlySavings × 12)
```
The retirement target formula remains `annualExpenses × 25`, just fed a derived value.

**Files:**
- `src/components/cardFlowConfig.js` — remove the `annualExpenses` step (reduces from 6 questions to 5 core + 1 conditional debt)
- `src/calc.js` — before running calculations, compute `annualExpenses = inputs.income - (inputs.monthlySavings * 12)` if not provided directly; update `calculate()` to accept income and derive expenses internally
- `src/App.jsx` — remove `annualExpenses` from `inputs` state shape

---

## Change 5 — Add Debt Question (Conditional)

**Problem:** No awareness of debt, which is relevant context for Marcus.

**Decision (confirmed):** Acknowledge in letter only, don't affect retirement math.

**Flow:**
- Question 6 (final): "Are you carrying any significant debt?" — Yes / No toggle (not a text input)
- If Yes: a follow-up input appears inline asking "How much total?" with placeholder `e.g. $25,000`
- If No: question completes immediately, debt stored as `0`
- `inputs.debt` is passed to `TheLetter` but not to `calc.js`

**Files:**
- `src/components/cardFlowConfig.js` — add debt step with `type: 'yesno'`, sub-input config for amount
- `src/components/CardFlow.jsx` — handle `yesno` input type (two buttons, reveal amount input on yes)
- `src/copy.js` — add debt acknowledgment line to all 6 letter templates (shown only when `debt > 0`): short, non-alarming, e.g. *"You also mentioned carrying {{debt}} in debt — we'll factor that conversation in."*
- `src/components/TheLetter.jsx` / `src/components/theLetterUtils.js` — conditionally render debt line when `inputs.debt > 0`

---

## Change 6 — Income Period Toggle (Yearly / Monthly)

**Problem:** "Annual Household Income" is ambiguous — users may think in monthly terms.

**Decision:** Add a yearly / monthly toggle next to the income input. If monthly is selected, multiply by 12 internally before passing to `calc.js`.

**Files:**
- `src/components/CardFlow.jsx` — for the income step, render a small toggle (Annual / Monthly) below the input; store `incomePeriod` in local state
- `src/components/cardFlowConfig.js` — add `hasPeriodToggle: true` to the income step
- `src/App.jsx` — normalize income to annual before storing in `inputs`: `income = incomePeriod === 'monthly' ? raw * 12 : raw`
- Placeholder updates dynamically: annual → `e.g. $85,000 / year`, monthly → `e.g. $7,000 / month`

---

## Change 7 — Rewrite Letter Templates (Shorter + Emotional)

**Problem:** Letter is too long and too static/emotionless.

**Decision:** Rewrite all 6 tier templates in `copy.js`. Keep the same dynamic slots (`{{gap}}`, `{{total_projected_retirement_savings}}`, etc.) but:
- Cut length by ~40% — aim for 3 short paragraphs max per tier
- Open with a direct, emotionally honest line (not just a number dump)
- Use Marcus's voice: warm, plain-spoken, avoids financial jargon
- End each tier with a forward-looking line, not a neutral summary

**Files:**
- `src/copy.js` — rewrite all 6 `LETTER_TEMPLATES` entries; do not change slot names or tier keys

**Tone guidance per tier:**
| Tier | Opening feel |
|------|-------------|
| Way Ahead | Genuinely warm — "You've done the hard work." |
| Slightly Ahead | Quietly proud — "You're further ahead than most." |
| On Track | Steady reassurance — "You're holding a good line." |
| Slightly Behind | Honest but calm — "There's a gap, and it's fixable." |
| Significantly Behind | Clear, not panicked — "This needs attention, not alarm." |
| Way Behind | Respectful directness — "I won't soften this, but I will help." |

---

## Change 8 — Slides Section: Before / After Comparison

**Problem:** Slider section shows placeholder text and nothing actually shifts visually.

**Decision (confirmed):** Two-column Before / After layout.
- Left column (locked): user's original path — projected savings, gap, additional monthly savings needed
- Right column (live): updates in real time as sliders move — same three numbers
- Both columns visible simultaneously; right column values animate on change (reuse existing Accent highlight pattern from `TheLetter`)

**Files:**
- `src/components/SliderExplorer.jsx` — replace placeholder content with Before/After layout; compute `baseCalc` once on mount (lock it), re-run `calculate()` on every slider change for live column
- `src/components/sliderExplorerUtils.js` — add `formatDelta(base, adjusted)` helper for showing change direction (↑ / ↓)
- `src/copy.js` — update `SLIDER_COPY` headings to match new layout (e.g., "Your Current Path" / "With These Adjustments")

---

## File Map Summary

| File | Changes |
|------|---------|
| `src/App.jsx` | Reset handler, income normalization, remove annualExpenses from state |
| `src/calc.js` | Derive annualExpenses from income and monthlySavings |
| `src/copy.js` | Rewrite 6 letter templates, add debt line, update slider copy headers |
| `src/components/CardFlow.jsx` | Full rewrite — conversational stack, chip editing, yesno type, period toggle |
| `src/components/cardFlowConfig.js` | Remove annualExpenses step, add debt step, add placeholders, add hasPeriodToggle |
| `src/components/TheLetter.jsx` | Pass debt to template renderer, conditionally show debt line |
| `src/components/theLetterUtils.js` | Handle debt slot in template parsing |
| `src/components/SliderExplorer.jsx` | Before/After layout, locked base calc, reset button |
| `src/components/sliderExplorerUtils.js` | Add formatDelta helper |

---

## Verification

1. Run `npm run dev` in `workspaces/stages/04-build/output/pre-call-tool/`
2. Complete all 5 core questions + debt question → confirm letter appears
3. Click an answered chip → confirm it expands inline, saves, and collapses
4. Set debt to Yes → confirm debt line appears in letter
5. Set debt to No → confirm no debt line in letter
6. Toggle income to Monthly, enter a value → confirm math uses annualized figure
7. Drag both sliders → confirm Before/After columns update; left column stays locked
8. Click "Start over" → confirm app returns to question 1 with all state cleared
9. Spot-check math: age 38, income $85k/yr, savings $42k, monthly $500, retire 65 → annualExpenses = $79k, target = $1.975M
