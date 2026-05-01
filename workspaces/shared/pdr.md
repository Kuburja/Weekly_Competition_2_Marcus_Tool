# PDR -- "Are We Okay?" Pre-Call Tool

## Who It Is For

Prospects aged 35-55, dual-income families. Sent before first meeting with Marcus.

## What It Does

Three-phase single-page experience:

### Phase 1 -- Conversational Input (Card Flow)

Cards appear one at a time. Each card = one input. After each answer, Marcus reacts in his voice before revealing the next.

| Step | Input | Example Reaction |
|------|-------|-----------------|
| 1 | Age | "Got it. Let's see what we're working with." |
| 2 | Household income | "Solid. Now let's talk about what's going out." |
| 3 | Annual expenses | "That's the number that actually matters." |
| 4 | Current savings | "Good -- that's your starting line." |
| 5 | Monthly savings | "Every dollar here does the heavy lifting." |
| 6 | Target retirement age | "Alright, let's run it." |

### Phase 2 -- The Letter

Output renders as a short first-person letter from Marcus. Honest, direct, uses their actual numbers. Three scenarios: ahead, on track, behind. When behind -- no verdict, just: "here's the gap, and here's what closing it looks like."

Tone shifts based on how far ahead or behind the prospect is -- not just three fixed scenarios. The further behind, the more the letter emphasizes the path forward.

### Phase 3 -- Slider Explorer

Below the letter, two sliders appear:

- Monthly savings amount
- Retirement age

Dragging either updates the letter's key numbers (gap, projected total, status) in real time. User sees the gap shrink/grow as they adjust. This is the "path, not a verdict" part.

## Methodology

25x rule (Marcus's default). Annual expenses x 25 = retirement target. Project current savings + monthly contributions at 7% annual return to target retirement age. Gap = target - projected.

## Key Design Choice

Why letter format over dashboard? Marcus said the tool should feel like talking to him. A letter is the closest digital equivalent to sitting across from someone who's looking at your numbers and telling you the truth. Dashboards feel like banks. Letters feel like advisors.

## Constraints

- Under 3 minutes to complete
- 6 inputs, no more
- Single page, no navigation
- Mobile-friendly
