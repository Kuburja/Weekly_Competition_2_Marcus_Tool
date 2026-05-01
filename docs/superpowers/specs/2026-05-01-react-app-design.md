# Design Spec — "Are We Okay?" React App

**Date:** 2026-05-01
**Stage:** 04-Build
**Stack:** Vite + React, inline styles from JS constants, Framer Motion

---

## Overview

Single-page React app sent to prospects before their first meeting with Marcus. Three sequential phases render top-to-bottom on one page with no routing: a card-based input flow, a personalized letter, and an interactive slider explorer.

---

## File Structure

```
pre-call-tool/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx                  ← holds all state, renders phases
│   ├── constants.js             ← all colors, fonts, math params as named exports
│   ├── calc.js                  ← pure calculation engine, no React
│   ├── copy.js                  ← card reactions, letter templates, CTA copy
│   ├── components/
│   │   ├── CardFlow.jsx         ← Phase 1: sequential card inputs
│   │   │   ├── CardStep.jsx     ← single card (label, input, button, reaction)
│   │   │   └── ProgressDots.jsx ← 6-dot step indicator
│   │   ├── TheLetter.jsx        ← Phase 2: rendered letter with dynamic slots
│   │   └── SliderExplorer.jsx   ← Phase 3: two sliders + contextual copy + CTA
│   │       └── SliderRow.jsx    ← single slider with label, live value, helper text
│   └── styles.css               ← Google Fonts import + one CSS reset, nothing else
```

`constants.js` exports every brand token and math parameter. No hex values or `0.07` appear anywhere else in the codebase. `calc.js` is pure JS — imports nothing from React. `copy.js` exports the 6 reactions array and the 6 letter template strings with `{{slot}}` placeholders.

---

## State Architecture

`App.jsx` owns three `useState` slices:

```js
inputs: {
  currentAge, income, annualExpenses,
  currentSavings, monthlySavings, targetRetirementAge
}  // null until CardFlow completes

sliderState: {
  monthlySavings,        // mirrors inputs.monthlySavings on init
  targetRetirementAge    // mirrors inputs.targetRetirementAge on init
}

visiblePhase: 1 | 2 | 3
```

### Data Flow

1. `CardFlow` renders while `visiblePhase === 1`. On final card completion it calls `onComplete(inputs)` → App sets `inputs`, initializes `sliderState`, advances `visiblePhase` to 2.
2. `TheLetter` and `SliderExplorer` render when `visiblePhase >= 2`. Both receive `inputs` and `sliderState` as props.
3. `TheLetter` derives display values by calling `calculate(inputs, sliderState)` inline. The tone tier is locked at initial calculation from `inputs` only — it never changes as sliders move.
4. `SliderExplorer` calls `onSliderChange(field, value)` → App updates `sliderState` → `TheLetter` re-renders with new slot values and triggers highlight flash.
5. `SliderExplorer` also calls `calculate(inputs, sliderState)` to get the current gap for its contextual copy line.

---

## Calculation Engine

**`calc.js` signature:**

```js
calculate(inputs, sliderOverrides = {})
→ {
    retirementTarget,
    futureValueCurrentSavings,
    futureValueMonthlyContributions,
    totalProjectedRetirementSavings,
    gap,
    additionalMonthlySavingsNeeded,  // null when gap <= 0
    totalMonthlySavingsNeeded,       // null when gap <= 0
    yearsToRetirement,
    monthsToRetirement
  }
```

`sliderOverrides` replaces `monthlySavings` and/or `targetRetirementAge` from `inputs` when called from slider context. Returns `null` for inapplicable slots (e.g., `totalMonthlySavingsNeeded` when `gap <= 0`).

All formulas match `logic-spec.md` exactly:
- `retirementTarget = annualExpenses × 25`
- `futureValueCurrentSavings = currentSavings × (1.07 ^ yearsToRetirement)`
- `futureValueMonthlyContributions = monthlySavings × ((1 + r)^n − 1) / r` where `r = 0.07/12`, `n = monthsToRetirement`
- `gap = retirementTarget − totalProjectedRetirementSavings`
- `additionalMonthlySavingsNeeded = gap / (((1 + r)^n − 1) / r)` when `gap > 0`

All math parameters (`25`, `0.07`) come from `constants.js` named exports.

---

## Validation

Card-level, inline, below the input field. Text Secondary color. Continue button disabled while invalid. No alert dialogs.

| Card | Rule |
|------|------|
| Current age | > 0, whole number |
| Income | ≥ 0 |
| Annual expenses | ≥ 0 |
| Current savings | ≥ 0 |
| Monthly savings | ≥ 0 |
| Target retirement age | > currentAge |

Slider bounds computed once when `inputs` are set:
- Monthly savings: `$0` to `max(inputs.monthlySavings × 3, 5000)`, step `$100`
- Retirement age: `inputs.currentAge + 1` to `80`, step `1`

---

## Transitions & Animations

### Phase 1 — Card sequence

Each `CardStep` has two internal visual states: `input` and `reaction`. On valid submit:
1. Input area exits via `AnimatePresence` (fade out)
2. Reaction text enters (fade in)
3. `setTimeout` of 1500ms fires
4. Reaction exits, next card enters (fade in)

`ProgressDots` update immediately on submit.

### Phase 1 → Phase 2

`App` wraps both phases in `AnimatePresence`. On `visiblePhase` advancing to 2:
- Card area exits with fade
- Letter enters with `opacity: 0→1` + `y: 20→0` (upward drift)
- After mount, `window.scrollTo` brings letter top near viewport top

### Phase 2 — Slot highlight flash

`TheLetter` keeps `highlightedSlots: Set<string>`. On `sliderState` change (detected via `useEffect`):
- Changed slot names added to the set
- `setTimeout` of 600ms removes them
- Each slot rendered as `motion.span` — `animate` transitions color from Accent (`#C46F52`) to Text (`#1F2420`)

### Phase 3 reveal

`SliderExplorer` renders below `TheLetter` when `visiblePhase >= 2` with no entrance animation. Becomes visible in natural scroll flow per spec.

---

## Responsive Behavior

Single breakpoint at 768px. Applied via inline style objects reading `window.innerWidth` on mount + `resize` listener, or a single `useWindowWidth` hook shared across components.

| Context | Desktop (≥768px) | Mobile (<768px) |
|---------|-----------------|-----------------|
| Column | Centered, max reading width | Full width, horizontal padding |
| Cards | Vertically centered above fold | Input full width, tall touch targets |
| Letter | Generous padding all sides | Reduced horizontal padding |
| CTA button | Centered, fixed width | Full width |

---

## Constants

`constants.js` exports:

```js
// Brand colors
export const COLOR_PRIMARY = '#234736'
export const COLOR_SECONDARY = '#A79E92'
export const COLOR_ACCENT = '#C46F52'
export const COLOR_BACKGROUND = '#F6F1E8'
export const COLOR_SURFACE = '#FFFDFC'
export const COLOR_TEXT = '#1F2420'
export const COLOR_TEXT_SECONDARY = '#5F655E'

// Typography
export const FONT_HEADING = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
export const FONT_BODY = "'Source Sans 3', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

// Calculation parameters
export const RETIREMENT_MULTIPLE = 25
export const ANNUAL_RETURN_RATE = 0.07
export const MONTHLY_RETURN_RATE = ANNUAL_RETURN_RATE / 12
```

---

## Audit Checklist (from stage 04 CONTEXT)

| Check | How it's met |
|-------|-------------|
| Spec coverage | All 3 phases built per UI spec |
| Calculation accuracy | `calc.js` pure functions tested against 3+ scenarios before render |
| Slider reactivity | `sliderState` in App re-renders `TheLetter` synchronously on each change |
| Brand compliance | All colors/fonts from `constants.js` only |
| Mobile responsive | `useWindowWidth` hook, single 768px breakpoint |
| Single page | No router, no navigation, vertical scroll |
| No hardcoded values | All params in `constants.js` |
