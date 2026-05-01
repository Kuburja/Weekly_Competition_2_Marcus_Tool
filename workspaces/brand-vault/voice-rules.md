# Voice Rules

Marcus's voice in the tool: how feedback, helper copy, and screen text should sound.

## Voice Patterns

- Short sentences. Avoid stacking multiple clauses when one point will do.
- Default to second person ("you", "your").
- Do not use first person ("I", "me", "my") as the default tool voice.
- If Marcus is ever quoted directly, mark it clearly as a quote or note. Do not blur quoted speech with standard interface copy.
- Present tense when describing their situation. Future tense when describing the path.
- Numbers are stated plainly, never dressed up.
- The tone is honest, steady, and useful.
- Good news is stated clearly. Bad news is stated clearly too.
- Every hard message ends with a next step.
- The writing should sound like Marcus across a table, not software on a screen.

## Core Rules

- Talk to one household at a time. Use "you," not "users" or "clients."
- Use plain words like "saving," "spending," "debt," and "next step."
- Name uncertainty without dramatizing it.
- Be direct without sounding cold.
- Keep each sentence focused on one idea.
- If the result is mixed, say so. Do not force false reassurance.

## UI Microcopy Rules

- Button text: short, plain, action-led. Example: "See where you stand." Not "Optimize my plan."
- Form labels: clear and literal. Name the field directly. Do not get cute.
- Helper text: one calm sentence that explains why the field matters or what to enter.
- Validation: state what needs fixing without blame. If possible, say how to fix it.
- Placeholders: use only for examples, not instructions. Keep them simple and realistic.
- Empty states: acknowledge the blank state plainly and point to the next step.

These UI moments should use a simpler subset of the main voice rules:

- Shorter than result copy.
- Still second person when needed.
- Still plainspoken and human.
- Never salesy, robotic, or overly polished.

## Right/Wrong Examples

| Wrong | Right | Why |
|-------|-------|-----|
| "Based on your inputs, your retirement readiness score indicates underperformance versus recommended benchmarks." | "You are not behind everywhere. But right now, your saving rate is too low for the timeline you want." | The wrong version sounds like finance software. The right version sounds human, direct, and specific without jargon. |
| "Congratulations. You have successfully optimized your household cash flow and are on track for long-term financial success." | "You look steady here. Your monthly cash flow is supporting your goals, and that gives you room to plan the next step well." | The wrong version sounds salesy and inflated. The right version keeps good news grounded and useful. |
| "Immediate action is required to avoid serious future shortfalls." | "This part needs attention. The gap is real. We can start by looking at what you can change in the next few months." | The wrong version uses pressure. The right version tells the truth and immediately gives the user a path forward. |

## Anti-Patterns

Things Marcus would never say:

- "Unlock your ideal financial future."
- "Our proprietary insights show..."
- "You have failed to meet your target."
- "Great news. Everything looks perfect."
- "Your outlook is poor."
- "Based on the algorithm, this result is unfavorable."
- "You should book now before things get worse."

## UI Microcopy Examples

| UI Moment | Wrong | Right |
|-----------|-------|-------|
| Button | "Generate My Financial Readiness Score" | "See where you stand" |
| Helper text | "Provide accurate values to ensure model precision." | "Use your usual monthly number. A close estimate is fine." |
| Validation | "Invalid input. Please revise your submission." | "Enter a monthly amount before you continue." |
| Empty state | "No data available." | "Nothing is here yet. Start with your income so we can show you the full picture." |

## Response Shape

When the tool gives feedback, it should usually follow this order:

1. Plain read on the situation.
2. Short explanation of what is driving it.
3. Clear next step.

Example shape:

"You are in better shape than you may think. Your core spending is under control, but retirement savings still need work. The next step is to look at how much room you have to raise that number."

## Style Checks

Before approving copy, check:

- Can an adult in the 35 to 55 audience read it once and understand it?
- Does it sound like a person talking, not a system labeling?
- If the news is hard, does it still offer a next step?
- Would this feel natural coming from Marcus in a first meeting?
