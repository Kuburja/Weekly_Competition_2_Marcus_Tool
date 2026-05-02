# Pre-Call Tool Copy

All finalized copy for Marcus's "Are We Okay?" tool. Card reactions, tone tier definitions, letter templates, and slider UI copy.

---

## Card Reactions

One reaction per input. Appears after the user answers each card, before the next card appears.

| Step | Input | Reaction |
|------|-------|----------|
| 1 | Current age | "Got it. Let's see what we're working with." |
| 2 | Household income | "Solid. Now let's talk about what's going out." |
| 3 | Annual expenses | "That's the number that actually matters." |
| 4 | Current savings | "Good — that's your starting line." |
| 5 | Monthly savings | "Every dollar here does the heavy lifting." |
| 6 | Target retirement age | "Alright, let's run it." |

---

## Tone Tiers

Gap is calculated as: `gap = retirement_target − total_projected_retirement_savings`

Thresholds are expressed as a percentage of `retirement_target`.

| Tier | Threshold | Emotional Register |
|------|-----------|-------------------|
| Way Ahead | gap ≤ −30% of retirement_target | Warm confidence. Affirm real strength without overselling. The goal is to keep good momentum going, not celebrate. |
| Slightly Ahead | −30% < gap ≤ −5% of retirement_target | Quiet optimism. The picture looks good. Note what is working and where a small adjustment could make it even better. |
| On Track | −5% < gap < 5% of retirement_target | Steady and grounded. Things are in balance. Surface any fragility without alarm — the meeting is about staying there. |
| Slightly Behind | 5% ≤ gap < 25% of retirement_target | Honest and calm. Name the gap plainly. Show the path forward is real and manageable with the right moves. |
| Significantly Behind | 25% ≤ gap < 60% of retirement_target | Direct and constructive. The gap is real and needs attention. The letter leans heavily toward the path forward — this is what the meeting is for. |
| Way Behind | gap ≥ 60% of retirement_target | Clear-eyed and forward-leaning. The picture is hard to look at. Do not soften it. But anchor the letter in what is still possible. |

---

## Letter Templates

Each letter is a short first-person note from Marcus. Dynamic values use `{{slot}}` format. The letter opens directly with body text and closes with Marcus's name.

### Available slots

- `{{retirement_target}}` — their retirement target (annual_expenses × 25)
- `{{total_projected_retirement_savings}}` — projected savings at retirement
- `{{gap}}` — gap amount (absolute value; always positive in copy)
- `{{additional_monthly_savings_needed}}` — extra per month to close gap by target date
- `{{total_monthly_savings_needed}}` — total monthly savings needed (current + additional)
- `{{monthly_savings}}` — their current monthly savings (raw input)
- `{{target_retirement_age}}` — their chosen retirement age
- `{{years_to_retirement}}` — years remaining

---

### Tier 1 — Way Ahead

You are in strong shape. Your projected savings of {{total_projected_retirement_savings}} put you meaningfully ahead of your retirement target of {{retirement_target}}.

That gives us options. In the meeting, I want to look at how those savings are structured — taxes, investment mix, and the risks that do not show up neatly in a calculator. You have built a strong base. Now we make sure the plan around it is just as strong.

Marcus

---

### Tier 2 — Slightly Ahead

You are tracking ahead of your {{retirement_target}} retirement target. With projected savings of {{total_projected_retirement_savings}} and {{years_to_retirement}} years left, you are not starting from behind.

That is a good place to plan from. In our meeting, we will look at whether your current savings rate is enough to keep that cushion, and whether small changes now could give you more flexibility later.

Marcus

---

### Tier 3 — On Track

You are on track. Your projected savings of {{total_projected_retirement_savings}} are close to your {{retirement_target}} retirement target, and the math is holding together right now.

That does not mean the plan is locked in. A market pullback, a pause in saving, or a higher expense year can still move the numbers. In our meeting, we will look at where the risks are and whether there are simple ways to give you more cushion.

Marcus

---

### Tier 4 — Slightly Behind

There is a gap. At your current pace, your projected savings of {{total_projected_retirement_savings}} fall short of your {{retirement_target}} retirement target by roughly {{gap}}.

That is not a crisis. It is a drift we can look at clearly. Closing the full gap would mean saving about {{additional_monthly_savings_needed}} more per month, for a total of {{total_monthly_savings_needed}}. In our meeting, we will look at whether that number is realistic — and what other options may help close the gap.

Marcus

---

### Tier 5 — Significantly Behind

Your projected savings of {{total_projected_retirement_savings}} are tracking significantly short of your {{retirement_target}} retirement target. The gap is roughly {{gap}}.

That is not an easy number, but it is useful to know before we sit down. Closing the full gap would take about {{additional_monthly_savings_needed}} more per month, bringing your total monthly savings to {{total_monthly_savings_needed}}. In our meeting, we will look at what can realistically change — savings rate, investment structure, timing, and what a practical path forward looks like.

Marcus

---

### Tier 6 — Way Behind

Your projected savings of {{total_projected_retirement_savings}} fall well short of your {{retirement_target}} retirement target. The gap is roughly {{gap}}.

That number is serious, but it gives us a clear place to start. Closing the full gap would require about {{additional_monthly_savings_needed}} more per month, for a total of {{total_monthly_savings_needed}}. That may not be realistic, and that is okay. In our meeting, we will work through what is actually available to you and build a plan from there.

Marcus

---

## Slider UI Copy

### Section Heading

Adjust Your Path

### Section Subhead

See how small changes shift your outcome. Drag either slider to explore what's possible.

### Slider 1 — Monthly savings

**Label:** Monthly savings

**Helper text:** This is where the math changes most. Even $100 more per month adds up fast.

**Display format:** $X / month

### Slider 2 — Retirement age

**Label:** Target retirement age

**Helper text:** Working a year or two longer gives your money more time to compound and you more time to save.

**Display format:** Age X

### Real-Time Contextual Copy

Appears near the sliders and updates as the user drags.

| State | Copy |
|-------|------|
| No change (sliders at original input values) | "Drag the sliders to see what shifts." |
| Improving (gap is shrinking) | "You're closing the gap. Keep adjusting to see how close you can get." |
| On track now (gap reaches zero or goes negative) | "That closes it. You're on target now." |

### CTA

**Button:** Schedule your meeting

**Supporting line:** You've seen your numbers. Let's talk about the next step.
