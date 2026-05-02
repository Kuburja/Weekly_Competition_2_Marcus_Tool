# Conversational Card Flow — Design Spec

Date: 2026-05-02  
Status: Approved

---

## What This Changes

The existing Phase 1 card flow uses a large centered card (minHeight 360px, 52px question label) that fills the viewport one question at a time. The user found this too imposing — "feels like an interrogation."

This spec replaces it with a conversational thread layout: Marcus asks each question as a chat message, the user replies, and Marcus's reaction stays as a permanent item in the thread. The rest of the app (Phase 2 letter, Phase 3 sliders) is unchanged.

---

## Layout Structure

Single centered column, same max-width and page background as the rest of the app.

```
[ Intro block         ]   ← static, always visible at top
[ Conversation thread ]   ← grows downward as questions are answered
[ Active input area   ]   ← current question + input + progress dots
```

---

## Intro Block

No change to content. Visual treatment becomes more compact to fit the conversational context below it:

- "Are We Okay?" heading in Cormorant Garamond, Primary green — same as current but can sit at a slightly smaller scale (42px desktop, 32px mobile) since it no longer needs to fill a hero space
- One-line description in Source Sans 3 body text below

---

## Conversation Thread

Each completed exchange adds three items to the thread:

1. **Marcus question** — left-aligned, small M avatar, off-white bubble with grey border
2. **User answer** — right-aligned, dark green (`#234736`) background, white text
3. **Marcus reaction** — left-aligned, no bubble box, italic Source Sans 3, Text Secondary color (`#5F655E`), left-indented with a thin left border in `#e0dbd3` to visually tie it to the avatar column without adding visual weight

Items are separated by a small spacer (4–8px) between exchanges. Within an exchange the three items are tightly spaced (8px gap).

---

## Active Question

The current (unanswered) question renders below the thread:

- Same left-aligned avatar + bubble structure as completed questions
- Bubble border uses Primary green (`#234736`) instead of grey — this is the only visual signal that marks "you are here"
- No additional highlight or animation beyond the border color change

### Input Row

Sits directly below the active question bubble, indented to align with the bubble (38px left margin to clear the avatar):

- Full-width text input, 1px border in Secondary (`#A79E92`), transparent background, 16px Source Sans 3
- Arrow button (`→`) to the right: Primary green background, white text, same height as input
- Enter key submits (same as current behavior)
- Inline validation error appears between the input row and progress dots when triggered

### Progress Dots

Six dots, 7px diameter, immediately below the input row, same left indent as the input:

- Completed steps: Accent (`#C46F52`)
- Active step: Primary (`#234736`)
- Upcoming steps: Secondary (`#A79E92`)

---

## Reactions

After a valid answer is submitted:

1. The user's answer appears as a right-aligned green bubble (immediate)
2. After a brief pause (~600ms), Marcus's reaction text appears below it in the thread (fade in, 150ms)
3. After the reaction appears (~1000ms hold), the next question fades in as the new active question

The reaction stays permanently in the thread — it does not fade out or get replaced.

---

## Scroll Behavior

After each answer + reaction + next question sequence completes, auto-scroll to keep the active input in view. No jumping to top. The thread grows naturally downward.

---

## Editing Previous Answers

The editable chip UI is removed. It does not fit the thread metaphor, and the 6-question flow is short enough that restarting is a reasonable fallback if someone needs to correct an answer. No restart button is needed — the browser refresh handles it.

---

## Components Affected

| File | Change |
|------|--------|
| `src/components/CardFlow.jsx` | Full rewrite — replaces section/frame/chip/card layout with thread + active-input layout |
| `src/components/CardStep.jsx` | Delete — its logic (question label, input, button, reaction display) is absorbed directly into `CardFlow.jsx` |
| `src/components/ProgressDots.jsx` | Reuse as-is or inline — dots logic unchanged, just repositioned |

`TheLetter.jsx`, `SliderExplorer.jsx`, `App.jsx` are not affected.

---

## What Does Not Change

- All 6 questions, their copy, and their input types (number/currency) are unchanged
- Validation rules and error messages are unchanged
- The `onComplete(answers)` callback signature that hands off to Phase 2 is unchanged
- Brand colors, fonts, and the overall page background are unchanged
