---
description: Use the Nodev skill to design or review safe production delivery for an AI-authored Cloudflare change
argument-hint: [feature, change, system, or rollout to analyze]
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit, WebFetch]
---

# Use Nodev

## Arguments

The user invoked this command with: $ARGUMENTS

## Instructions

When this command is invoked:

1. Read `skills/nodev/SKILL.md` first.
2. Apply the skill's When To Use and When Not To Use rules. For generic coding
   help without release safety, Cloudflare controls, autonomous agents, or
   production readiness, do not force the full release template.
3. Read `skills/nodev/references/playbook.md` when you need execution modes,
   risk tiers, AI change package, authority matrix, review focus, rollout,
   handoff, go-live checklist, or red flags.
4. Read `skills/nodev/references/cloudflare-tooling.md` when you need detailed
   Cloudflare control selection, release patterns, storage choices, security
   controls, agent runtime, browser verification, sandboxing, or footguns.
5. Read `skills/nodev/references/cloudflare-current-stack.md` when you need
   latest/current Cloudflare-safe defaults for build, preview, AI routing,
   Browser Run, Dynamic Workers, Sandbox, Agents SDK, or MCP governance.
6. Read `skills/nodev/references/evidence-ledger.md` for Tier 1+ release work,
   remote/autonomous operators, production exposure, or any recommendation that
   says work may continue.
7. Read `skills/nodev/references/fail-closed-scenarios.md` when authority,
   telemetry, preview, rollback, token scope, ZDR, Browser Run recording, or
   Durable Object Preview URL assumptions are unclear.
8. Read `skills/nodev/references/source-freshness.md` when a current Cloudflare
   fact, security/compliance claim, limit, pricing, availability, API, beta
   status, or documented constraint materially affects the answer.
9. Detect the execution mode first: `human-local`, `human-remote`,
   `autonomous-remote`, or `autonomous-deployer`.
10. If the execution mode is unknown, planning/review/policy work may continue
   in `planning-only` posture, but implementation, deploy, production
   promotion, and authority-expanding actions are blocked.
11. Run the capability check before suggesting implementation or release steps.
12. Classify the request by risk tier and actual blast radius.
13. Fail closed when required authority, preview verification, telemetry, or
   rollback paths are missing.
14. Choose the smallest output mode that satisfies the request: Quick Review,
   Full Release Plan, Handoff Package, Codex Implementation Brief, or Policy /
   Operating Model.
15. If the request implies code changes, use the skill as the governing policy
   for what is safe to change, what needs stronger review, and what must fail
   closed.

Before final output, apply the Nodev pre-response check:

- Is execution mode known, unknown, or blocked?
- Is production promotion authority explicit?
- Is risk tier justified by blast radius, not surface label?
- Are preview/staging, telemetry, and rollback paths identified?
- Are code rollback and state rollback separated?
- Are claims tagged as evidence, assumption, blocker, or recommendation?
- If current Cloudflare behavior matters, was freshness verified or marked as
  an assumption?

For Full Release Plan outputs, include:

- Execution mode
- Capability check
- Risk tier
- Blast radius
- Required Cloudflare controls
- Verification gates
- Rollout and rollback
- Evidence ledger
- Open risks
- Handoff

## Example Usage

```text
/nodev review this AI-authored Workers rollout plan before we ship it
/nodev classify this change and tell me which Cloudflare controls we need
/nodev design a safe rollout for a new AI-powered feature on Workers
```
