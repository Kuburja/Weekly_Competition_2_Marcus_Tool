# Pre-Call Tool Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a complete ICM workspace that guides an agent through building Marcus's "Are We Okay?" pre-call retirement planning tool -- from brand definition through React app generation.

**Architecture:** Four-stage pipeline (brand, content, spec, build) using the ICM five-layer routing architecture. All files are markdown. Shared context lives in `brand-vault/` and `shared/`. No application code in this plan -- the workspace itself is the deliverable.

**Tech Stack:** Markdown, ICM conventions, git

---

## File Map

```
./
+-- CLAUDE.md                          (workspace entry, routing, what-to-load)
+-- CONTEXT.md                         (task routing, shared resources)
+-- setup/
|   +-- questionnaire.md               (6 onboarding questions)
+-- shared/
|   +-- pdr.md                         (product design requirements)
|   +-- logic-spec.md                  (calculation methodology)
+-- brand-vault/
|   +-- CONTEXT.md                     (routes to brand files)
|   +-- identity.md                    (Marcus's positioning -- hardcoded)
|   +-- visual-identity.md             (colors, fonts -- placeholder template)
|   +-- voice-rules.md                 (voice patterns -- placeholder template)
+-- skills/
|   +-- .gitkeep                       (skills bundled during setup)
+-- stages/
    +-- 01-brand/
    |   +-- CONTEXT.md                 (stage contract)
    |   +-- output/.gitkeep
    |   +-- references/.gitkeep
    +-- 02-content/
    |   +-- CONTEXT.md                 (stage contract)
    |   +-- output/.gitkeep
    |   +-- references/.gitkeep
    +-- 03-spec/
    |   +-- CONTEXT.md                 (stage contract)
    |   +-- output/.gitkeep
    |   +-- references/.gitkeep
    +-- 04-build/
        +-- CONTEXT.md                 (stage contract)
        +-- output/.gitkeep
        +-- references/.gitkeep
```

---

### Task 1: Create folder structure

**Files:**
- Create: all directories and `.gitkeep` files listed in the file map above

- [ ] **Step 1: Create the directory tree**

Run:
```bash
mkdir -p workspaces/{setup,shared,brand-vault,skills} && mkdir -p workspaces/stages/{01-brand,02-content,03-spec,04-build}/{output,references}
```

- [ ] **Step 2: Add .gitkeep files to empty directories**

Run:
```bash
touch workspaces/stages/{01-brand,02-content,03-spec,04-build}/output/.gitkeep && touch workspaces/stages/{01-brand,02-content,03-spec,04-build}/references/.gitkeep && touch workspaces/skills/.gitkeep
```

- [ ] **Step 3: Verify structure exists**

Run:
```bash
find workspaces -type d | sort
```

Expected output should show all 16 directories.

- [ ] **Step 4: Commit**

```bash
git add workspaces/ && git commit -m "scaffold: create pre-call-tool workspace directory structure"
```

---

### Task 2: Write workspace CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write CLAUDE.md**

Create `CLAUDE.md` with this exact content:

```markdown
# Pre-Call Tool

This workspace builds Marcus's "Are We Okay?" pre-call tool -- a single-page React app sent to prospects before their first meeting.

## Folder Map

` ``
./
+-- CLAUDE.md              (you are here)
+-- CONTEXT.md             (start here for task routing)
+-- setup/
|   +-- questionnaire.md   (onboarding -- run with "setup")
+-- skills/                (bundled Claude skills for React and design)
+-- brand-vault/
|   +-- CONTEXT.md         (routes to identity and visual files)
|   +-- identity.md        (Marcus's positioning, audience)
|   +-- visual-identity.md (colors, fonts, visual feel)
|   +-- voice-rules.md     (Marcus's voice patterns)
+-- stages/
|   +-- 01-brand/          (define visual identity and voice rules)
|   +-- 02-content/        (write all tool copy)
|   +-- 03-spec/           (define UI interactions and layout)
|   +-- 04-build/          (generate the React application)
+-- shared/
    +-- pdr.md             (product design requirements)
    +-- logic-spec.md      (calculation methodology)
` ``

## Triggers

| Keyword | Action |
|---------|--------|
| `setup` | Run onboarding questionnaire -- configures Marcus's visual identity and voice |
| `status` | Show pipeline completion for all four stages |

### How `status` works

Scan `stages/*/output/` folders. For each stage, if the output folder contains files (other than .gitkeep), the stage is COMPLETE. Otherwise PENDING. Render:

` ``
Pipeline Status: pre-call-tool

  [01-brand]  -->  [02-content]  -->  [03-spec]  -->  [04-build]
     STATUS            STATUS           STATUS          STATUS
` ``

## Routing

| Task | Go To |
|------|-------|
| Define brand and voice | `stages/01-brand/CONTEXT.md` |
| Write tool copy | `stages/02-content/CONTEXT.md` |
| Design UI interactions | `stages/03-spec/CONTEXT.md` |
| Build the React app | `stages/04-build/CONTEXT.md` |
| Configure this workspace | `setup/questionnaire.md` |

## What to Load

| Task | Load These | Do NOT Load |
|------|-----------|-------------|
| Define brand | `shared/pdr.md`, setup answers | `shared/logic-spec.md`, all stages except 01, `skills/` |
| Write copy | `brand-vault/voice-rules.md`, `brand-vault/identity.md`, `shared/pdr.md`, `shared/logic-spec.md` | `stages/01-brand/`, `stages/03-spec/`, `stages/04-build/`, `skills/` |
| Design UI | `stages/02-content/output/`, `brand-vault/visual-identity.md`, `shared/pdr.md`, `shared/logic-spec.md`, `skills/frontend-design/SKILL.md` | `brand-vault/voice-rules.md`, `stages/01-brand/`, `stages/04-build/` |
| Build app | `stages/03-spec/output/`, `stages/02-content/output/`, `brand-vault/visual-identity.md`, `shared/logic-spec.md`, `skills/*/SKILL.md` | `brand-vault/voice-rules.md`, `brand-vault/identity.md`, `stages/01-brand/` |

## Stage Handoffs

Each stage writes its output to its own `output/` folder. The next stage reads from there. If you edit an output file between stages, the next stage picks up your edits.

Stage 01 is an exception: it writes to `brand-vault/` (shared context) and places a completion marker in `output/`.
```

**Note:** The nested code fences above use `` ` `` with a space to avoid breaking the plan's own fencing. When writing the actual file, use standard triple-backtick fences with no space.

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md && git commit -m "feat: add pre-call-tool workspace CLAUDE.md with routing and what-to-load tables"
```

---

### Task 3: Write workspace CONTEXT.md

**Files:**
- Create: `CONTEXT.md`

- [ ] **Step 1: Write CONTEXT.md**

Create `CONTEXT.md` with this exact content:

```markdown
# Pre-Call Tool

Build Marcus's "Are We Okay?" retirement pre-call tool as a single-page React app.

## Task Routing

| Task Type | Go To | Description |
|-----------|-------|-------------|
| Define brand and voice | `stages/01-brand/CONTEXT.md` | Creates visual identity and voice rules for Marcus |
| Write tool copy | `stages/02-content/CONTEXT.md` | Writes card reactions, graduated letter templates, slider copy |
| Design UI interactions | `stages/03-spec/CONTEXT.md` | Defines layout, transitions, responsive behavior |
| Build React app | `stages/04-build/CONTEXT.md` | Generates the complete Vite + React application |

## Shared Resources

| Resource | Location | Contains |
|----------|----------|----------|
| Brand context | `brand-vault/CONTEXT.md` | Routes to identity, visual identity, and voice rules |
| Product requirements | `shared/pdr.md` | Tool phases, constraints, design intent |
| Calculation logic | `shared/logic-spec.md` | Formulas, scenarios, slider math |
| Frontend design skill | `skills/frontend-design/SKILL.md` | Design philosophy and aesthetics |
```

- [ ] **Step 2: Verify line count is under 80**

Run: `wc -l CONTEXT.md`

Expected: under 25 lines.

- [ ] **Step 3: Commit**

```bash
git add CONTEXT.md && git commit -m "feat: add pre-call-tool workspace CONTEXT.md with task routing"
```

---

### Task 4: Write shared reference files

**Files:**
- Create: `workspaces/shared/pdr.md`
- Create: `workspaces/shared/logic-spec.md`

- [ ] **Step 1: Write pdr.md**

Create `workspaces/shared/pdr.md` with this exact content:

```markdown
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
```

- [ ] **Step 2: Write logic-spec.md**

Create `workspaces/shared/logic-spec.md` with this exact content:

```markdown
# Calculation Logic Specification

This file contains Marcus's calculation methodology for the pre-call tool. It is the canonical source for all formulas, scenarios, and slider math.

---

**ACTION REQUIRED:** Paste your calculation logic specification below this line. This document should cover:

- The complete 25x rule formula with all variables
- How monthly contributions are projected forward (compound growth model)
- How the gap is calculated (target - projected)
- Slider interaction math: how changing monthly savings or retirement age recalculates the projection
- Any rounding rules or display formatting for currency values
- Edge cases: zero savings, retirement age in the past, negative gap (ahead of target)

Delete this instruction block after pasting your content.
```

- [ ] **Step 3: Commit**

```bash
git add workspaces/shared/ && git commit -m "feat: add PDR and logic-spec placeholder to shared/"
```

---

### Task 5: Write brand vault files

**Files:**
- Create: `workspaces/brand-vault/CONTEXT.md`
- Create: `workspaces/brand-vault/identity.md`
- Create: `workspaces/brand-vault/visual-identity.md`
- Create: `workspaces/brand-vault/voice-rules.md`

- [ ] **Step 1: Write brand-vault CONTEXT.md**

Create `workspaces/brand-vault/CONTEXT.md` with this exact content:

```markdown
# Brand Vault

Marcus's brand identity, visual identity, and voice rules. Agents load specific sections as directed by stage CONTEXT.md files.

## Files

| File | Key Sections | Load When |
|------|-------------|-----------|
| `identity.md` | "Positioning", "Audience" | Understanding who Marcus is and who the tool is for |
| `visual-identity.md` | "Colors", "Typography" | Applying brand colors and fonts to UI design or code |
| `visual-identity.md` | "Visual Direction" | Understanding the overall visual feel |
| `voice-rules.md` | "Voice Patterns", "Right/Wrong Examples" | Writing any copy in Marcus's voice |
| `voice-rules.md` | "Anti-Patterns" | Checking copy for things Marcus would never say |
```

- [ ] **Step 2: Write identity.md**

Create `workspaces/brand-vault/identity.md` with this exact content:

```markdown
# Marcus -- Brand Identity

## Positioning

Marcus is a financial advisor who builds trust through honesty and directness. His tools feel like conversations, not bank interfaces. He gives prospects a clear picture of where they stand -- no jargon, no sugar-coating, no verdicts.

## Audience

Prospects aged 35-55, dual-income families. They earn well but may not know if they are saving enough. They want a straight answer from someone they can trust, not a sales pitch.

## Tool Philosophy

The pre-call tool is the first thing prospects experience before meeting Marcus. It should feel like Marcus is already in the room -- looking at their numbers and telling them the truth. A letter, not a dashboard.
```

- [ ] **Step 3: Write visual-identity.md**

Create `workspaces/brand-vault/visual-identity.md` with this exact content:

```markdown
# Visual Identity

## Visual Direction

{{VISUAL_DIRECTION}}

## Colors

| Role | Hex | Usage |
|------|-----|-------|
| Primary | {{PRIMARY_COLOR}} | Main actions, key numbers, interactive elements |
| Secondary | {{SECONDARY_COLOR}} | Supporting elements, section backgrounds |
| Accent | {{ACCENT_COLOR}} | Highlights, status indicators, slider tracks |
| Background | {{BACKGROUND_COLOR}} | Page background, card backgrounds |
| Text | {{TEXT_COLOR}} | Body copy, headings, labels |

## Typography

| Role | Font |
|------|------|
| Heading | {{HEADING_FONT}} |
| Body | {{BODY_FONT}} |
```

- [ ] **Step 4: Write voice-rules.md**

Create `workspaces/brand-vault/voice-rules.md` with this exact content:

```markdown
# Voice Rules

Marcus's voice in the tool: how card reactions and letters should sound.

## Voice Patterns

- Short sentences. No compound clauses.
- Second person ("you", "your") -- Marcus is talking to them.
- Present tense when describing their situation. Future tense when describing the path.
- Numbers are stated plainly, never dressed up.

## Right/Wrong Examples

| Wrong | Right | Why |
|-------|-------|-----|
| {{VOICE_WRONG_EXAMPLE_1}} | {{VOICE_RIGHT_EXAMPLE_1}} | {{VOICE_EXAMPLE_REASON_1}} |
| {{VOICE_WRONG_EXAMPLE_2}} | {{VOICE_RIGHT_EXAMPLE_2}} | {{VOICE_EXAMPLE_REASON_2}} |

## Anti-Patterns

Things Marcus would never say:

{{VOICE_ANTI_PATTERNS}}
```

- [ ] **Step 5: Commit**

```bash
git add workspaces/brand-vault/ && git commit -m "feat: add brand vault with identity, visual identity, and voice rule templates"
```

---

### Task 6: Write setup questionnaire

**Files:**
- Create: `workspaces/setup/questionnaire.md`

- [ ] **Step 1: Write questionnaire.md**

Create `workspaces/setup/questionnaire.md` with this exact content:

```markdown
# Onboarding Questionnaire: Pre-Call Tool

Read this file when the user types "setup". Ask ALL questions below in a single conversational pass. The user should be able to answer everything in one message. These configure Marcus's brand identity for the tool. The tool structure, methodology, and audience are already defined in `shared/pdr.md`.

---

### Q1: What visual direction fits Marcus's brand?
- Placeholder: `{{VISUAL_DIRECTION}}`
- Files: `brand-vault/visual-identity.md`
- Type: selection
- Options: Warm & approachable, Clean & professional, Bold & modern
- Default: Warm & approachable

### Q2: Any brand colors? (primary, secondary, accent, background, text as hex)
- Placeholders: `{{PRIMARY_COLOR}}`, `{{SECONDARY_COLOR}}`, `{{ACCENT_COLOR}}`, `{{BACKGROUND_COLOR}}`, `{{TEXT_COLOR}}`
- Files: `brand-vault/visual-identity.md`
- Type: free text (hex codes)
- Default: Agent picks a cohesive palette based on Q1 direction. If the user gives 1-2 colors, fill the rest.

### Q3: Font preference?
- Placeholders: `{{HEADING_FONT}}`, `{{BODY_FONT}}`
- Files: `brand-vault/visual-identity.md`
- Type: selection
- Options: Serif (traditional, trustworthy), Sans-serif (modern, clean), No preference
- Default: No preference -- agent picks based on Q1 direction.
- Agent derives specific font names from the preference (e.g., "serif" becomes "Lora" for headings and "Source Serif 4" for body).

### Q4: Give me 2-3 sentences Marcus would actually say to a client sitting across from him.
- Placeholders: `{{VOICE_RIGHT_EXAMPLE_1}}`, `{{VOICE_RIGHT_EXAMPLE_2}}`
- Files: `brand-vault/voice-rules.md`
- Type: free text
- Example: "Here's the thing -- your savings rate matters more than your income." / "You're not behind. You just started the clock late."

### Q5: Anything Marcus would never say? Words or phrases that don't sound like him?
- Placeholders: `{{VOICE_ANTI_PATTERNS}}`
- Files: `brand-vault/voice-rules.md`
- Type: free text
- Example: "Optimize your financial portfolio for maximum ROI" / "Let's leverage your assets"
- Agent derives from Q4 + Q5 combined:
  - `{{VOICE_WRONG_EXAMPLE_1}}`, `{{VOICE_WRONG_EXAMPLE_2}}` -- wrong-sounding versions of the right examples
  - `{{VOICE_EXAMPLE_REASON_1}}`, `{{VOICE_EXAMPLE_REASON_2}}` -- why each wrong example fails

### Q6: Do you have a logo file to include? (optional)
- Type: free text
- Default: No logo
- If provided: save to `brand-vault/logo.*` and note the path in `brand-vault/visual-identity.md`

---

## After Onboarding (Two-Pass Process)

**Pass 1:** Collect all answers and replace direct placeholders in `brand-vault/visual-identity.md` and `brand-vault/voice-rules.md`.

**Pass 2 (Voice Review):** Present the populated voice rules to the user:

"Here are the voice rules I derived from your examples. Review these and edit anything that does not match how Marcus actually sounds:"

Show the Voice Patterns, Right/Wrong Examples table, and Anti-Patterns section. The user edits before rules are finalized.

**After both passes:** Scan every `.md` file for remaining `{{` patterns. If any remain, resolve them. Tell the user:

"You are set up. Marcus's brand is configured with [palette description] and [font names]. To start the pipeline, say 'status' to see where things stand, then begin with Stage 01 (brand refinement)."
```

- [ ] **Step 2: Commit**

```bash
git add workspaces/setup/ && git commit -m "feat: add 6-question onboarding questionnaire for Marcus's brand"
```

---

### Task 7: Write Stage 01 CONTEXT.md (Brand & Voice)

**Files:**
- Create: `workspaces/stages/01-brand/CONTEXT.md`

- [ ] **Step 1: Write the stage contract**

Create `workspaces/stages/01-brand/CONTEXT.md` with this exact content:

```markdown
# Stage 01: Brand & Voice

Define Marcus's visual identity and voice rules through interactive refinement.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| User | Setup questionnaire answers (in brand-vault/) | Full | Initial brand preferences to refine |
| Reference | `../../shared/pdr.md` | "Key Design Choice" and "Phase 2" | Tone direction and design intent |

## Process

1. Read the PDR for design intent: "feels like talking to Marcus", letter not dashboard
2. Review the current brand-vault files populated by setup
3. Refine the color palette: ensure all 5 roles are cohesive and match the visual direction
4. Select specific fonts: confirm or adjust the heading and body fonts
5. Expand voice rules: add more right/wrong examples derived from card reactions and letter tone in the PDR
6. **[Checkpoint]** -- Present the full brand board: color palette with swatches, typography, voice rules with all examples. Ask if this looks and sounds like Marcus.
7. Write the finalized versions to brand-vault/
8. Write a one-line completion marker to output/

## Checkpoints

| After Step | Agent Presents | Human Decides |
|------------|---------------|---------------|
| 6 | Color palette, typography, voice rules with right/wrong examples | Whether the visual feel and voice sound like Marcus |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Color completeness | All 5 color roles have hex values and usage descriptions |
| Typography defined | Heading and body fonts specified with specific font names |
| Voice concreteness | Voice rules use concrete examples, not abstract adjectives |
| PDR alignment | Visual feel matches "letter not dashboard" intent |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Visual identity | `../../brand-vault/visual-identity.md` | Finalized colors and fonts |
| Voice rules | `../../brand-vault/voice-rules.md` | Finalized voice patterns with examples |
| Completion marker | `output/brand-complete.md` | One-line confirmation that brand-vault is populated |
```

- [ ] **Step 2: Verify line count is under 80**

Run: `wc -l workspaces/stages/01-brand/CONTEXT.md`

Expected: under 55 lines.

- [ ] **Step 3: Commit**

```bash
git add workspaces/stages/01-brand/CONTEXT.md && git commit -m "feat: add Stage 01 (Brand & Voice) contract"
```

---

### Task 8: Write Stage 02 CONTEXT.md (Content Design)

**Files:**
- Create: `workspaces/stages/02-content/CONTEXT.md`

- [ ] **Step 1: Write the stage contract**

Create `workspaces/stages/02-content/CONTEXT.md` with this exact content:

```markdown
# Stage 02: Content Design

Write all tool copy in Marcus's voice -- card reactions, graduated letter templates, slider copy.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Brand vault | `../../brand-vault/voice-rules.md` | Full file | Voice patterns to write in |
| Brand vault | `../../brand-vault/identity.md` | Full file | Audience context |
| Reference | `../../shared/pdr.md` | "Phase 1" and "Phase 2" | Card flow structure, example reactions, letter concept |
| Reference | `../../shared/logic-spec.md` | Full file | Calculation logic for defining tone tier thresholds |

## Process

1. Review Marcus's voice rules and the PDR's example card reactions
2. Write the 6 card reactions, one per input. Each should feel like Marcus responding in real conversation. Use PDR examples as a starting point, refine to match finalized voice rules.
3. Define tone tiers for the letter. Map gap magnitude to tone: way ahead, slightly ahead, on track, slightly behind, significantly behind, way behind. Set threshold boundaries using the calculation model from logic-spec.md.
4. Write a letter template for each tone tier. Each is a short first-person letter from Marcus using dynamic number slots. The further behind, the more the letter emphasizes the path forward. Never a verdict.
5. Write slider UI copy: labels, helper text, any contextual copy that updates as sliders move
6. **[Checkpoint]** -- Present all copy: card reactions, tone tier definitions with thresholds, every letter template, slider copy
7. Run audit checks. If any fail, revise before saving.
8. Save to output/

## Checkpoints

| After Step | Agent Presents | Human Decides |
|------------|---------------|---------------|
| 6 | Card reactions, tone tier thresholds, all letter templates, slider copy | Whether Marcus's voice sounds right and tone graduation feels natural |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Voice consistency | All copy follows voice rules: no jargon, short sentences, second person |
| Tone graduation | Each tier feels distinct; adjacent tiers shift noticeably but not jarringly |
| No verdicts | Behind templates frame gaps constructively, never as judgments |
| Number slots | Every letter template has clear dynamic slots for gap, projected total, target |
| Coverage | All 6 card reactions + all tone tiers + slider copy present |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Tool copy | `output/pre-call-tool-copy.md` | Card reactions, tone tier definitions with thresholds, letter templates, slider copy |
```

- [ ] **Step 2: Verify line count is under 80**

Run: `wc -l workspaces/stages/02-content/CONTEXT.md`

Expected: under 60 lines.

- [ ] **Step 3: Commit**

```bash
git add workspaces/stages/02-content/CONTEXT.md && git commit -m "feat: add Stage 02 (Content Design) contract"
```

---

### Task 9: Write Stage 03 CONTEXT.md (UI Specification)

**Files:**
- Create: `workspaces/stages/03-spec/CONTEXT.md`

- [ ] **Step 1: Write the stage contract**

Create `workspaces/stages/03-spec/CONTEXT.md` with this exact content:

```markdown
# Stage 03: UI Specification

Define layout, interactions, transitions, and responsive behavior -- the WHAT and WHEN, not the HOW.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Stage 02 output | `../02-content/output/pre-call-tool-copy.md` | Full file | Content to lay out |
| Brand vault | `../../brand-vault/visual-identity.md` | Full file | Colors, fonts, visual feel |
| Reference | `../../shared/pdr.md` | "Phase 1", "Phase 2", "Phase 3", "Constraints" | Interaction model, design intent |
| Reference | `../../shared/logic-spec.md` | Slider-relevant sections | How slider values map to recalculations |
| Skills | `../../skills/frontend-design/SKILL.md` | Full file (if bundled) | Interaction design philosophy |

## Process

1. Review the PDR interaction model and all copy from Stage 02
2. Define page structure: single-page vertical flow with card area, letter area, slider area
3. Specify Phase 1 (Card Flow): card appearance (one at a time), input method per field, Marcus reaction display, transition to next card
4. Specify Phase 2 (The Letter): rendering after final card, visual treatment as a letter (typography, spacing, feel of paper not screen)
5. Specify Phase 3 (Slider Explorer): slider layout, labels, which letter values update when each slider moves, real-time update behavior
6. Define responsive behavior: how each phase adapts from desktop to mobile
7. Define transitions: how the experience flows between phases
8. **[Checkpoint]** -- Present the full interaction spec
9. Run audit checks. If any fail, revise before saving.
10. Save to output/

## Checkpoints

| After Step | Agent Presents | Human Decides |
|------------|---------------|---------------|
| 8 | Page structure, card flow, letter treatment, slider mechanics, responsive rules, transitions | Whether the flow feels right and matches "talking to Marcus" intent |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Single page | No navigation, no routing -- everything on one vertical page |
| 3-minute test | The described flow is completable in under 3 minutes |
| Mobile-friendly | Every phase has explicit mobile behavior defined |
| Slider-letter sync | Spec defines exactly which values update when each slider moves |
| No implementation leakage | Zero component names, pixel values, or React-specific details |
| PDR alignment | All 6 inputs present, letter format, slider explorer below letter |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| UI specification | `output/pre-call-tool-spec.md` | Page structure, phase behaviors, transitions, responsive rules, slider-letter mapping |
```

- [ ] **Step 2: Verify line count is under 80**

Run: `wc -l workspaces/stages/03-spec/CONTEXT.md`

Expected: under 60 lines.

- [ ] **Step 3: Commit**

```bash
git add workspaces/stages/03-spec/CONTEXT.md && git commit -m "feat: add Stage 03 (UI Specification) contract"
```

---

### Task 10: Write Stage 04 CONTEXT.md (Build)

**Files:**
- Create: `workspaces/stages/04-build/CONTEXT.md`

- [ ] **Step 1: Write the stage contract**

Create `workspaces/stages/04-build/CONTEXT.md` with this exact content:

```markdown
# Stage 04: Build

Generate the complete React application from the spec, copy, brand, and calculation logic.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Stage 03 output | `../03-spec/output/pre-call-tool-spec.md` | Full file | Layout, interactions, transitions, responsive rules |
| Stage 02 output | `../02-content/output/pre-call-tool-copy.md` | Full file | All copy to render |
| Brand vault | `../../brand-vault/visual-identity.md` | Full file | Colors, fonts for shared constants |
| Reference | `../../shared/logic-spec.md` | Full file | Calculation formulas to implement |
| Skills | `../../skills/*/SKILL.md` | Index, load rules as needed | React and frontend best practices |

## Process

1. Review the UI spec, copy, brand, and logic spec
2. Scaffold the React project with Vite: `npm create vite@latest pre-call-tool -- --template react`
3. Create a shared constants file: all colors, fonts, and calculation parameters (return rate, multiplier) as named exports. No magic numbers anywhere else.
4. Implement the calculation engine as pure functions: inputs in, numbers out. Match logic-spec.md exactly. No UI coupling.
5. Build Phase 1 (Card Flow): one-at-a-time card input with Marcus's reactions from copy file, transitions per spec
6. Build Phase 2 (The Letter): template rendering that selects the correct tone tier based on calculated gap, plugs in dynamic values
7. Build Phase 3 (Slider Explorer): two sliders wired to the calculation engine, letter values update in real time on drag
8. Apply responsive styling per the spec's mobile rules
9. **[Checkpoint]** -- Start dev server with `npm run dev`. User tests the full flow on desktop and mobile viewport.
10. Run audit checks. If any fail, revise before saving.
11. Copy the final project to output/

## Checkpoints

| After Step | Agent Presents | Human Decides |
|------------|---------------|---------------|
| 9 | Running app at localhost | Whether the experience feels right, interactions are smooth, numbers are correct |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Spec coverage | All 3 phases implemented per spec |
| Calculation accuracy | Matches logic spec for 3+ test cases (ahead, on track, behind) |
| Slider reactivity | Both sliders update letter values in real time, no perceptible lag |
| Brand compliance | All colors and fonts come from shared constants, match brand vault |
| Mobile responsive | All phases usable at 375px width |
| Single page | No routing library, no navigation -- one page, vertical scroll |
| No hardcoded values | Zero magic numbers; all params in shared constants |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| React application | `output/pre-call-tool/` | Complete Vite + React project, runs with `npm install && npm run dev` |
```

- [ ] **Step 2: Verify line count is under 80**

Run: `wc -l workspaces/stages/04-build/CONTEXT.md`

Expected: under 65 lines.

- [ ] **Step 3: Commit**

```bash
git add workspaces/stages/04-build/CONTEXT.md && git commit -m "feat: add Stage 04 (Build) contract"
```

---

### Task 11: Discover and bundle skills

**Files:**
- Potentially create: `workspaces/skills/frontend-design/SKILL.md` (and related files)

- [ ] **Step 1: Search for locally installed skills**

Run:
```bash
ls ~/.claude/skills/ 2>/dev/null && ls ~/.agents/skills/ 2>/dev/null
```

Look for: `frontend-design`, `react-best-practices`, or similar React/frontend skills.

- [ ] **Step 2: Search GitHub for React skills**

Search GitHub for Claude Code skill repos matching: "react skill claude", "frontend-design skill claude", "react-best-practices claude skill".

Present any candidates to the user with a one-line description of what each provides. Let the user pick which to bundle.

- [ ] **Step 3: Bundle selected skills**

For each selected skill:
- If local: copy the skill folder into `workspaces/skills/`
- If GitHub: clone the repo into `workspaces/skills/`

Verify each bundled skill has a `SKILL.md` entry point.

- [ ] **Step 4: Update CONTEXT.md shared resources table**

If new skills were bundled beyond `frontend-design`, add them to the Shared Resources table in `CONTEXT.md`.

- [ ] **Step 5: Commit**

```bash
git add workspaces/skills/ CONTEXT.md && git commit -m "feat: bundle React/frontend skills for build stage"
```

---

### Task 12: Convention validation

**Files:**
- Verify: all files created in Tasks 1-11

- [ ] **Step 1: Check CONTEXT.md line counts**

Run:
```bash
wc -l CONTEXT.md workspaces/brand-vault/CONTEXT.md workspaces/stages/*/CONTEXT.md
```

Expected: every CONTEXT.md under 80 lines.

- [ ] **Step 2: Check for remaining placeholders that should not be there**

Run:
```bash
grep -r "{{" . --include="*.md" | grep -v "brand-vault/visual-identity.md" | grep -v "brand-vault/voice-rules.md" | grep -v "questionnaire.md" | grep -v "placeholder-syntax"
```

Expected: no output. Placeholders should only exist in brand-vault template files and the questionnaire.

- [ ] **Step 3: Check all output folders have .gitkeep**

Run:
```bash
ls workspaces/stages/*/output/.gitkeep
```

Expected: 4 .gitkeep files (01-brand, 02-content, 03-spec, 04-build).

- [ ] **Step 4: Verify stage input/output chain**

Manual check:
- Stage 01 reads: PDR, setup answers. Writes: brand-vault/, output/brand-complete.md
- Stage 02 reads: brand-vault/, PDR, logic-spec. Writes: output/pre-call-tool-copy.md
- Stage 03 reads: Stage 02 output, brand-vault visual, PDR, logic-spec, skills. Writes: output/pre-call-tool-spec.md
- Stage 04 reads: Stage 03 output, Stage 02 output, brand-vault visual, logic-spec, skills. Writes: output/pre-call-tool/

Every input is either user-provided, in shared/, in brand-vault/, or produced by a prior stage. Chain is valid.

- [ ] **Step 5: Verify one-way references**

Manual check: no stage references a later stage. brand-vault does not reference any stage. shared/ does not reference any stage. Confirm no circular dependencies.

- [ ] **Step 6: Verify routing tables are complete**

Check that CLAUDE.md routing table and CONTEXT.md task routing table both cover all 4 stages plus setup. Check that CLAUDE.md what-to-load table covers all 4 task types.

- [ ] **Step 7: Final commit if any fixes were needed**

```bash
git add CLAUDE.md CONTEXT.md workspaces/ && git commit -m "fix: address convention validation findings"
```

Only run this step if fixes were made. If validation passed clean, skip.

---

### Task 13: Update root CLAUDE.md routing

**Files:**
- Modify: `CLAUDE.md` (workspace root)

- [ ] **Step 1: Add pre-call-tool to the root routing table**

Add a new row to the Routing table in the root `CLAUDE.md`:

```markdown
| Build Marcus's pre-call tool | `CLAUDE.md` |
```

And add to the Folder Map:

```
    +-- Weekly_Competition_2_Marcus_Tool/   (Marcus's "Are We Okay?" pre-call tool)
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md && git commit -m "feat: add pre-call-tool workspace to root routing"
```
