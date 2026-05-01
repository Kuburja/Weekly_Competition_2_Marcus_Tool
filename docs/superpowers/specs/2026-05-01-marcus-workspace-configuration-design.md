# Marcus Workspace Configuration Design

## Goal

Configure the pre-call tool workspace so Marcus is the source of truth for:

- retirement calculation methodology
- audience and positioning
- visual identity
- tool voice

This configuration should make later stages feel like Marcus is already in the room: direct, human, useful, and calm.

## Scope

This design covers updates to:

- `workspaces/shared/logic-spec.md`
- `workspaces/brand-vault/identity.md`
- `workspaces/brand-vault/visual-identity.md`
- `workspaces/brand-vault/voice-rules.md`

It does not cover application code, layouts, or stage outputs beyond the shared brand and logic context.

## Source Of Truth

The single source of truth is `Marcus_Client_Brief.pdf`.

Where the brief is explicit, the workspace should follow it exactly.

Where the brief leaves an operational detail unstated, the workspace may fill in only the minimum needed to make the later stages implementable.

## Design Decisions

### Calculation Methodology

`logic-spec.md` will use Marcus's methodology exactly:

- retirement target is `annual expenses x 25`
- growth assumption is `7% average annual return`
- required inputs are:
  - current age
  - income
  - annual expenses
  - current savings
  - monthly savings
  - target retirement age

The spec will explain:

- target calculation
- future value projection for current savings
- future value projection for ongoing monthly contributions
- total projected retirement savings
- gap calculation as `target - projected`
- derived path-forward scenarios when someone is behind

The tool should not stop at a deficit number. It must show a path, including:

- additional monthly savings needed to close the gap by the target date
- how the gap changes if retirement is delayed
- how smaller timeline adjustments change the result

The spec should favor clear display rules over financial-model complexity.

### Brand Identity

`identity.md` will reinforce Marcus as:

- a Denver financial advisor
- serving people aged 35 to 55
- primarily working with dual-income families with kids
- solving the recurring first-meeting question: "Are we okay?"

The identity document should present the tool as a conversation starter, not a financial product.

### Visual Identity

`visual-identity.md` will use the approved direction: `Warm & approachable`.

The system should feel like a thoughtful letter rather than a bank calculator. Visual choices should support trust, clarity, and emotional ease without becoming soft or vague.

The palette will use:

- warm off-white or paper-toned backgrounds
- deep grounded green as the primary anchor
- muted secondary neutrals
- a restrained warm accent for highlights and progress states
- dark readable text with strong contrast

Typography should support an editorial, human feel:

- serif heading font
- readable, calm body font

### Voice Rules

`voice-rules.md` will derive its examples and anti-patterns from the brief alone.

The rules should capture:

- short plainspoken sentences
- direct second-person address
- honest delivery without scare tactics
- no jargon
- no sterile calculator tone
- no verdict without a next step

Wrong examples should sound like generic finance software or sales language.

Right examples should sound like Marcus talking across a table.

## File-Level Intent

### `workspaces/shared/logic-spec.md`

This becomes the canonical calculation reference for later stages. It should be detailed enough that the UI and build stages can implement the model without inventing missing math.

### `workspaces/brand-vault/identity.md`

This should tighten Marcus's positioning and the emotional job of the tool without drifting into marketing fluff.

### `workspaces/brand-vault/visual-identity.md`

This should replace placeholders with a complete palette and font selection aligned to the approved warm direction.

### `workspaces/brand-vault/voice-rules.md`

This should replace placeholders with Marcus-specific examples, reasons, and anti-patterns rooted in the brief.

## Error Handling And Edge Cases

`logic-spec.md` should define behavior for:

- zero current savings
- zero monthly savings
- target retirement age less than or equal to current age
- negative or zero gap
- obviously invalid negative inputs

The logic should prefer honest, simple handling and plain-language display notes over complex exception models.

## Testing Intent

This workspace configuration is documentation-first, so testing is document consistency rather than code execution.

Verification should confirm:

- placeholders are removed from the touched files
- the logic matches Marcus's stated methodology
- the voice examples sound consistent with the brief
- the visual identity is complete enough for downstream stages to use directly
