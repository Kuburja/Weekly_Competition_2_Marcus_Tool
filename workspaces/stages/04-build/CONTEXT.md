# Stage 04: Build

Generate the complete React application from the spec, copy, brand, and calculation logic.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Stage 03 output | `../03-spec/output/pre-call-tool-spec.md` | Full file | Layout, interactions, transitions, responsive rules |
| Stage 02 output | `../02-content/output/pre-call-tool-copy.md` | Full file | All copy to render |
| Brand vault | `../../brand-vault/visual-identity.md` | Full file | Colors, fonts for shared constants |
| Reference | `../../shared/logic-spec.md` | Full file | Calculation formulas to implement |
| Skills | `..\workspaces\skills\react-best-practices\SKILL.md` | Index, load rules as needed | React and frontend best practices |

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
