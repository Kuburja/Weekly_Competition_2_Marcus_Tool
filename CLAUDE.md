# Pre-Call Tool

This workspace builds Marcus's "Are We Okay?" pre-call tool -- a single-page React app sent to prospects before their first meeting.

## Folder Map

```
./
+-- CLAUDE.md              (you are here)
+-- CONTEXT.md             (start here for task routing)
+-- workspaces/
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
```

## Triggers

| Keyword | Action |
|---------|--------|
| `setup` | Run onboarding questionnaire -- configures Marcus's visual identity and voice |
| `status` | Show pipeline completion for all four stages |

### How `status` works

Scan `stages/*/output/` folders. For each stage, if the output folder contains files (other than .gitkeep), the stage is COMPLETE. Otherwise PENDING. Render:

```
Pipeline Status: pre-call-tool

  [01-brand]  -->  [02-content]  -->  [03-spec]  -->  [04-build]
     STATUS            STATUS           STATUS          STATUS
```

## Routing

| Task | Go To |
|------|-------|
| Define brand and voice | `workspaces/stages/01-brand/CONTEXT.md` |
| Write tool copy | `workspaces/stages/02-content/CONTEXT.md` |
| Design UI interactions | `workspaces/stages/03-spec/CONTEXT.md` |
| Build the React app | `workspaces/stages/04-build/CONTEXT.md` |
| Configure this workspace | `workspaces/setup/questionnaire.md` |

## What to Load

| Task | Load These | Do NOT Load |
|------|-----------|-------------|
| Define brand | `workspaces/shared/pdr.md`, setup answers | `workspaces/shared/logic-spec.md`, all stages except 01, `workspaces/skills/` |
| Write copy | `workspaces/brand-vault/voice-rules.md`, `workspaces/brand-vault/identity.md`, `workspaces/shared/pdr.md`, `workspaces/shared/logic-spec.md` | `workspaces/stages/01-brand/`, `workspaces/stages/03-spec/`, `workspaces/stages/04-build/`, `workspaces/skills/` |
| Design UI | `workspaces/stages/02-content/output/`, `workspaces/brand-vault/visual-identity.md`, `workspaces/shared/pdr.md`, `workspaces/shared/logic-spec.md`, `workspaces/skills/react-best-practices/SKILL.md` | `workspaces/brand-vault/voice-rules.md`, `workspaces/stages/01-brand/`, `workspaces/stages/04-build/` |
| Build app | `workspaces/stages/03-spec/output/`, `workspaces/stages/02-content/output/`, `workspaces/brand-vault/visual-identity.md`, `workspaces/shared/logic-spec.md`, `workspaces/skills/*/SKILL.md` | `workspaces/brand-vault/voice-rules.md`, `workspaces/brand-vault/identity.md`, `workspaces/stages/01-brand/` |

## Stage Handoffs

Each stage writes its output to its own `output/` folder. The next stage reads from there. If you edit an output file between stages, the next stage picks up your edits.

Stage 01 is an exception: it writes to `workspaces/brand-vault/` (shared context) and places a completion marker in `output/`.
