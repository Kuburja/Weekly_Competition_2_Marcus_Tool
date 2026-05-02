# UI Specification — "Are We Okay?" Pre-Call Tool

---

## Page Structure

Single vertical page. No routing, no navigation. Three phases render in sequence from top to bottom on the same page:

```
[ Phase 1: Card Area   ]  ← active on load
[ Phase 2: Letter Area ]  ← revealed after card 6
[ Phase 3: Slider Area ]  ← below letter, revealed after Phase 2
```

All content in a centered single column with a max reading width. Page background: warm paper (`#F6F1E8`). Body font: Source Sans 3. All three phases share this column.

---

## Phase 1 — Card Flow

### Card Appearance

One card visible at a time. Prior cards are gone — not stacked, not scrollable above. The viewport shows exactly one card, vertically centered in the space above the fold.

Card container: Surface color (`#FFFDFC`), thin border in Secondary (`#A79E92`), comfortable padding. No heavy shadow.

### Progress Indicator

Six dots or a thin step bar at the top of the card area. Completed steps use Accent (`#C46F52`), current step uses Primary (`#234736`), upcoming steps use Secondary (`#A79E92`). No numeric labels.

### Input Method Per Field

| Step | Field | Input Type | Notes |
|------|-------|-----------|-------|
| 1 | Current age | Number field | Whole years, no decimals |
| 2 | Household income | Currency field | Dollar sign prefix, whole dollars |
| 3 | Annual expenses | Currency field | Dollar sign prefix, whole dollars |
| 4 | Current savings | Currency field | Dollar sign prefix, whole dollars |
| 5 | Monthly savings | Currency field | Dollar sign prefix, whole dollars |
| 6 | Target retirement age | Number field | Whole years, no decimals |

Each card shows: question label in serif heading (Cormorant Garamond), input field, and a "Continue" button in Primary green. Pressing Enter/Return submits the same as clicking the button. Submit does not trigger on blur alone.

### Validation

Inline, below the input field. No alert dialogs. Error message in Text Secondary color (`#5F655E`). Progression is blocked until the field is valid. Edge cases per logic-spec apply: retirement age must be greater than current age; no negative values permitted.

### Marcus Reaction Display

After a valid answer is submitted:

1. The input field and button fade out
2. Marcus's reaction text cross-fades into the same card container, body text styling — no callout badge or special treatment
3. Reaction holds for approximately 1.5 seconds
4. Reaction fades out, next card fades in

Reactions are exactly as written in the Stage 02 copy. No typing animation, no ellipsis effect.

---

## Phase 2 — The Letter

### Trigger

After card 6's reaction completes, the card area fades out. The letter container fades in with a subtle upward drift. The page scrolls so the top of the letter is near the top of the viewport.

### Letter Container Visual Treatment

Styled to feel like paper, not a UI panel:

- Surface background (`#FFFDFC`)
- Thin border in Secondary (`#A79E92`) or a very soft shadow — one or the other, not both
- Generous padding on all sides — more on desktop, slightly reduced on mobile
- No card header bar or title block — the letter begins directly with body text

### Typography Inside the Letter

- Body paragraphs: Source Sans 3, regular weight, generous line height
- Marcus's name at the close: Cormorant Garamond, slightly larger, below the final paragraph with extra top margin — signed, not labeled
- No section headers, bold callouts, or bullet points inside the letter body

### Dynamic Slot Values

Rendered as plain text at the same weight as surrounding copy. No special color, badge, or underline at initial render. When they update from slider interaction, they briefly highlight (see Phase 3).

### Tier Selection

The tier is determined by the gap percentage at initial calculation and does not change as sliders move. Only the slot values inside the letter update.

---

## Phase 3 — Slider Explorer

### Placement

Directly below the letter, separated by a horizontal rule and generous vertical space. The slider section is present in the page but hidden until Phase 2 has appeared. When the letter becomes visible, the slider section becomes visible below it in the natural scroll flow — no separate entrance animation.

### Section Copy

- **Heading:** "Adjust Your Path" — Cormorant Garamond serif heading
- **Subhead:** "See how small changes shift your outcome. Drag either slider to explore what's possible." — body text, Text Secondary color

### Slider Layout

Two sliders stacked vertically, each in its own row with clear vertical spacing between them.

Each slider row contains:

- Label above-left (e.g., "Monthly savings")
- Current value above-right, updating in real time (e.g., "$3,500 / month")
- Slider control full width of the column; track in Secondary, active fill and thumb in Accent (`#C46F52`)
- Helper text below in Text Secondary

### Slider 1 — Monthly Savings

- Range: $0 to the greater of three times the user's original input or $5,000, in $100 increments
- Default position: user's original monthly savings input
- Display format: "$X / month"
- Helper text: "This is where the math changes most. Even $100 more per month adds up fast."

### Slider 2 — Retirement Age

- Range: current age + 1 to age 80, in 1-year increments
- Default position: user's original target retirement age
- Display format: "Age X"
- Helper text: "Working a year or two longer gives your money more time to compound and you more time to save."

### Real-Time Contextual Copy

A single line between the sliders and the CTA that updates on every slider change:

| State | Copy |
|-------|------|
| Sliders at original input values | "Drag the sliders to see what shifts." |
| Gap is shrinking but still above zero | "You're closing the gap. Keep adjusting to see how close you can get." |
| Gap reaches zero or goes negative | "That closes it. You're on target now." |

### Which Letter Values Update

When either slider moves, these specific values update in place in the letter:

- `{{total_projected_retirement_savings}}`
- `{{gap}}`
- `{{additional_monthly_savings_needed}}` (when visible)
- `{{total_monthly_savings_needed}}` (when visible)

Update behavior: the value briefly highlights in Accent (`#C46F52`) — fades in, holds, fades back to normal text color. No layout shift; only the text content changes.

### CTA

Below the contextual copy line:

- **Button:** "Schedule your meeting" — Primary green background, Surface text. Full width on mobile, centered fixed width on desktop.
- **Supporting line:** "You've seen your numbers. Let's talk about the next step." — Text Secondary, body size, below the button.

---

## Responsive Behavior

### Desktop (viewport 768px and wider)

- Content column centered with a comfortable max reading width
- Cards vertically centered in viewport above the fold
- Letter with generous padding on all sides
- Sliders comfortable within the column
- CTA button centered, not full-width

### Mobile (viewport below 768px)

- Content column full width with horizontal padding on both sides
- Cards: input fields full width, button tall enough for a comfortable touch target
- Letter: reduced horizontal padding, same reading rhythm and font sizes preserved — no compression
- Sliders: full column width, thumb sized for comfortable touch interaction
- CTA button: full width

Both breakpoints maintain the same vertical reading order and spacing rhythm. Nothing collapses into a horizontal layout or dense stack.

---

## Transitions

| Moment | Behavior |
|--------|----------|
| Card submit → reaction | Input and button fade out; reaction text fades in |
| Reaction hold | Approximately 1.5 second pause |
| Reaction → next card | Reaction fades out; next card fades in |
| Card 6 reaction → letter | Card area fades out; letter fades in with slight upward drift; page scrolls to letter top |
| Slider move → letter values | Affected values flash Accent color briefly, then return to normal text color |
| Phase 3 reveal | Becomes visible below the letter when Phase 2 appears; no directional motion |

---

## Slider–Letter Value Mapping

| Slider changed | Values that recalculate | Values that do NOT change |
|---------------|------------------------|--------------------------|
| Monthly savings | `total_projected_retirement_savings`, `gap`, `additional_monthly_savings_needed`, `total_monthly_savings_needed` | `future_value_current_savings`, `retirement_target` |
| Retirement age | All projected values including `future_value_current_savings`, `future_value_monthly_contributions`, `total_projected_retirement_savings`, `gap`, `additional_monthly_savings_needed`, `total_monthly_savings_needed` | Raw inputs |
| Both adjusted | Full recalculation from raw inputs plus current slider state | — |
