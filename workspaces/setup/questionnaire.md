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
