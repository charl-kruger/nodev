# AGENTS.md

## Repository Purpose

This repo publishes the `nodev` agent skill for governed AI-assisted
Cloudflare delivery.

## Before Editing

Read:

1. `SKILL.md`
2. `references/playbook.md` for operating model, risk tiers,
   rollout, and handoff policy
3. `references/cloudflare-tooling.md` for Cloudflare
   product/control guidance
4. `references/cloudflare-current-stack.md` only when current
   Cloudflare-safe defaults matter

## Editing Rules

- Preserve the core thesis: code generation is cheap; release judgment is
  expensive.
- Do not weaken fail-closed rules.
- Do not broaden autonomous production authority without adding stronger
  evidence requirements.
- Keep `SKILL.md` concise enough for skill loading; put detailed protocols in
  `references/`.
- Add or update golden cases when changing behavior.
- If a recommendation depends on current Cloudflare product behavior, mark the
  local snapshot date or verify against official Cloudflare sources.
- Write strongly typed code. Do not use `any`.
- Do not implement fallbacks that hide missing data. If required data is
  missing, fail with an explicit error.

## Validation

Run:

```bash
npm run validate:nodev
```

Before finishing, summarize:

- files changed
- behavior changed
- new or updated golden cases
- validation result
