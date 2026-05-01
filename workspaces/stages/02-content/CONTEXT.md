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
