---
description: Use the Nodev skill to design or review safe production delivery for an AI-authored Cloudflare change
argument-hint: [feature, change, system, or rollout to analyze]
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit, WebFetch]
---

Use the Nodev skill for this request: $ARGUMENTS

Start by reading:

- @SKILL.md
- @references/playbook.md when the task needs execution modes,
  risk tiers, authority matrix, verification, rollout policy, handoff, or red
  flags
- @references/cloudflare-tooling.md when the task needs detailed
  Cloudflare product guidance, release controls, storage, observability,
  security controls, agent runtime, browser verification, or sandboxing
- @references/cloudflare-current-stack.md when the task needs
  latest/current Cloudflare-safe defaults for build, preview, AI routing,
  Browser Run, Dynamic Workers, Sandbox, Agents SDK, or MCP governance
- @references/evidence-ledger.md for Tier 1+ release work,
  remote/autonomous operators, production exposure, or any recommendation that
  says work may continue
- @references/fail-closed-scenarios.md when authority, telemetry,
  preview, rollback, token scope, ZDR, Browser Run recording, or Durable Object
  Preview URL assumptions are unclear
- @references/source-freshness.md when a current Cloudflare fact,
  security/compliance claim, limit, pricing, availability, API, beta status, or
  documented constraint materially affects the answer

Then:

1. Apply the skill's When To Use and When Not To Use rules.
2. Detect the execution mode first: `human-local`, `human-remote`,
   `autonomous-remote`, or `autonomous-deployer`.
3. If the execution mode is unknown, planning/review/policy work may continue
   in `planning-only` posture, but implementation, deploy, production
   promotion, and authority-expanding actions are blocked.
4. Run the capability check before suggesting implementation or release steps.
5. Classify by risk tier and actual blast radius.
6. Fail closed when required authority, preview verification, telemetry, or
   rollback paths are missing.
7. Choose the smallest output mode that satisfies the request: Quick Review,
   Full Release Plan, Handoff Package, Codex Implementation Brief, or Policy /
   Operating Model.

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

1. Execution mode
2. Capability check
3. Risk tier
4. Blast radius
5. Required Cloudflare controls
6. Verification gates
7. Rollout and rollback
8. Evidence ledger
9. Open risks
10. Handoff if the current mode cannot complete the task

If the request includes implementation or review work, apply the skill's rules
while doing that work.
