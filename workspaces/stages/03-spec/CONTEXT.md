# Stage 03: UI Specification

Define layout, interactions, transitions, and responsive behavior -- the WHAT and WHEN, not the HOW.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Stage 02 output | `../02-content/output/pre-call-tool-copy.md` | Full file | Content to lay out |
| Brand vault | `../../brand-vault/visual-identity.md` | Full file | Colors, fonts, visual feel |
| Reference | `../../shared/pdr.md` | "Phase 1", "Phase 2", "Phase 3", "Constraints" | Interaction model, design intent |
| Reference | `../../shared/logic-spec.md` | Slider-relevant sections | How slider values map to recalculations |
| Skills | `../../skills/react-best-practices/SKILL.md` | Relevant sections as needed | Bundled frontend implementation guidance |

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
| PDR alignment | All 6 Phase 1 user inputs present, letter format, slider explorer below letter |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| UI specification | `output/pre-call-tool-spec.md` | Page structure, phase behaviors, transitions, responsive rules, slider-letter mapping |
