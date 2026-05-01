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
