---
name: nodev
description: Use for safe AI-authored Cloudflare delivery: production rollout plans, risk tiering, blast radius analysis, preview/staging verification, deploy authority, rollback, observability, AI Gateway, Workers, Pages, D1, Durable Objects, Queues, Workflows, Sandbox, Browser Run, Access, and MCP governance. Do not use for generic coding help unless release safety, Cloudflare controls, autonomous agents, or production readiness matter.
---

# Nodev

Turn ambiguous "ship this with AI" work into a governed Cloudflare delivery
plan. Support both human-operated local workflows and autonomous agents running
in sandboxes or remote VMs. Optimize for bounded blast radius, preview-first
verification, controlled exposure, and fast rollback.

## When To Use This Skill

Use `nodev` when the task involves any of:

- AI-authored or agent-authored code that may reach users, data, production,
  staging, or a production-like preview.
- Cloudflare deployment, rollout, rollback, observability, permissions,
  secrets, AI runtime traffic, or release governance.
- Choosing Cloudflare controls for safe delivery: Workers, Pages, Workers
  Builds, Preview URLs, Access, Flagship, AI Gateway, D1, Durable Objects, KV,
  R2, Queues, Workflows, Browser Run, Dynamic Workers, Sandbox, Agents SDK,
  Containers, or MCP portals.
- Deciding what a local, remote, autonomous, or deploy-capable agent is allowed
  to do.
- Reviewing whether a plan, PR, branch, preview, or rollout is safe enough to
  continue.

## When Not To Use This Skill

Do not use `nodev` for ordinary coding questions, generic Cloudflare
explanations, UI copywriting, or architecture brainstorming unless production
safety, release authority, autonomous agents, or Cloudflare delivery controls
are part of the decision.

## Reference Routing

Read references before giving a final recommendation when their trigger applies:

- Read `references/playbook.md` for execution modes, risk tiers, AI change
  package, authority matrix, developer loop, non-interactive rollout, handoff,
  go-live checklist, or red flags.
- Read `references/cloudflare-tooling.md` when choosing Cloudflare products,
  bindings, storage, observability, security controls, agent runtime, browser
  verification, sandboxing, or release mechanisms.
- Read `references/cloudflare-current-stack.md` when the user asks for the
  latest or current Cloudflare-safe defaults, or when the recommendation
  depends on recently changing Cloudflare products.
- Read `references/evidence-ledger.md` for Tier 1+ release work,
  remote/autonomous operators, production exposure, or any recommendation that
  says work may continue.
- Read `references/fail-closed-scenarios.md` when authority, telemetry,
  preview, rollback, Cloudflare token scope, ZDR, Browser Run recording, or
  Durable Object Preview URL assumptions are unclear.
- Read `references/source-freshness.md` when a current Cloudflare fact,
  security/compliance claim, limit, pricing, availability, API, beta status, or
  documented constraint materially affects the answer.
- If a current Cloudflare fact materially affects the answer and the local
  reference snapshot may be stale, verify against official Cloudflare docs,
  changelog, or blog before presenting the fact as current.

## Default Behavior

- Detect the execution mode before planning implementation or release work.
- Treat code generation as cheap and release judgment as expensive.
- Prefer the smallest blast radius that satisfies the request.
- Require evidence before release: tests, observability, permissions review,
  and rollback.
- Fail closed when required authority, preview verification, runtime evidence,
  or rollback paths are missing.
- Escalate when the request enters Tier 3 risk or lacks a credible verification
  path.

## Workflow

1. Detect the execution mode and who owns release authority.
2. Run the capability check before implementation or deploy steps.
3. Classify the change by risk tier and actual blast radius.
4. Draft or validate the AI change package before implementation.
5. Choose the minimum Cloudflare controls needed for build, release, runtime,
   state, and access.
6. Define verification gates, rollout shape, and rollback limits.
7. Return the smallest useful output mode with evidence, assumptions, blockers,
   recommendations, and next actions.

## Execution Modes

Choose one mode explicitly:

| Mode | Typical operator | Default stance |
| --- | --- | --- |
| `human-local` | Human and agent on the same workstation | Interactive review and deploy flow is allowed |
| `human-remote` | Agent runs in a sandbox or remote VM, human reviews and promotes | Build, test, preview, and evidence generation are allowed; human owns final promotion |
| `autonomous-remote` | Unattended agent in a sandbox or remote VM | Build, test, preview, and evidence generation are allowed; production promotion is constrained by the authority matrix |
| `autonomous-deployer` | Unattended agent with explicit deploy rights and observability access | Allow promotion only when policy, verification, and rollback requirements are all satisfied |

## Unknown Mode Handling

If the mode is unknown:

- For implementation, deployment, production promotion, or
  authority-expanding actions: stop and return a blocker.
- For planning, review, architecture, or policy work: continue in
  `planning-only` posture, mark execution mode as unknown, assume no production
  promotion authority, and list the minimum facts needed to proceed beyond
  planning.
- Never infer deploy authority from tone, urgency, or the user saying "just
  ship it."

`planning-only` is an action boundary, not a fifth execution mode.

## Capability Check

Require these capabilities before proceeding beyond planning:

- Repository read and write access for the expected change surface
- Cloudflare authentication with the minimum required scope
- A preview or non-production deployment path
- Verification surfaces: tests, browser checks if needed, logs, metrics, and
  traces
- A rollback path for both code and state
- A safe secret source; never invent or inline credentials
- Clear production promotion authority for the current mode

If any required capability is missing, stop with an explicit error and a
handoff package. Do not improvise around missing permissions or missing
verification.

## Risk Tiers

| Tier | Typical scope | AI autonomy | Minimum release rule |
| --- | --- | --- | --- |
| 0 | Prototype, internal toy, throwaway experiment | High | Keep it away from production users and production data |
| 1 | Leaf-node UI, content transforms, internal tools, non-critical workflows | High | Require preview verification, exposure control, and rollback |
| 2 | Customer-facing logic with bounded data access | Medium | Review interfaces, auth path, dependencies, tests, observability, and ownership before rollout |
| 3 | Auth, billing, payments, shared schema, core architecture, compliance-sensitive systems | Low | Let AI assist, but do not let AI drive unsupervised merges or production release decisions |

Treat "leaf node" as a starting heuristic, not a guarantee. Re-check coupling
to auth, billing, entitlements, analytics, email, rate limits, search, admin
tools, and retention before declaring a change safe.

## Authority Matrix

Apply these defaults unless the user or organization provides stricter policy:

| Mode | Tier 0 | Tier 1 | Tier 2 | Tier 3 |
| --- | --- | --- | --- | --- |
| `human-local` | Can build and release if requested | Can build and release with preview, evidence, and rollback | Can build, preview, and propose release; require explicit owner review before production | Assist only; do not drive release |
| `human-remote` | Can build and release if human owns promotion | Can build, preview, and release with explicit human approval | Can build and preview; require explicit human promotion | Assist only; do not drive release |
| `autonomous-remote` | Can build and release only if preview, evidence, and rollback exist | Can build, test, preview, and dark-launch if policy allows | Can build, test, preview, and stage; do not promote to broad production without explicit deploy authority | Assist only; do not drive release |
| `autonomous-deployer` | Can build and release if verification and rollback pass | Can build, preview, dark-launch, and progressively expose if policy allows | Can promote only with explicit deploy authority, production observability, rollback access, and a named owner | Assist only; do not drive release |

When the current request exceeds the allowed action for its mode and tier, stop
and hand off instead of partially deploying.

## AI Change Package

Require these artifacts for any non-trivial change:

- Goal and acceptance criteria
- Expected files or surfaces to change
- Risk notes covering auth, PII, secrets, pricing, rate limits, migrations,
  dependencies, abuse, and cost
- Verification plan covering end-to-end, contract, synthetic, and adversarial
  checks
- Observability plan covering logs, metrics, traces, alerts, and dashboards
- Rollback plan that separates code rollback from state rollback

If one of these is missing, create it before implementation.

## Cloudflare Control Map

- Build and preview: Prefer Wrangler-managed projects, local development, and
  Workers Builds, Preview URLs, and non-production branch builds. Protect
  sensitive previews with Access. Pin `preview_urls` in Wrangler. If the Worker
  uses Durable Objects, do not assume Preview URLs are available.
- Exposure control: Prefer dark launches behind Flagship or an equivalent
  application-level flag. Prefer Flagship when possible so exposure control
  stays separate from code promotion.
- Runtime AI traffic: Route model calls through AI Gateway unless there is a
  strong reason not to. If ZDR is mandatory, verify provider support and
  gateway settings and fail closed otherwise.
- Secrets and access: Use bindings, Worker secrets, or Secrets Store. Keep
  production write access narrower than production read access for agents.
- Stateful runtime: Use KV for config and flags, Durable Objects for
  coordination and sessions, D1 for lightweight relational data, R2 for
  artifacts, and Hyperdrive for existing regional databases.
- Async and long-running work: Use Queues for delivery and retries. Use
  Workflows for durable multi-step execution.
- Tooling and verification: Use Browser Run for UI verification. Enable
  recordings explicitly when replay matters; they are opt-in and only available
  for Browser Sessions, not Quick Actions.
- Code execution: Prefer Dynamic Workers for fast isolated code-mode tasks and
  Sandbox for persistent workspaces, Git, previews, snapshots, and interactive
  coding environments.
- Internal tools: Put them behind Access, Tunnel, or authenticated MCP flows.
  For larger tool estates, prefer Access MCP portals with managed OAuth.
- Autonomous egress: In Sandboxes or Containers, prefer deny-by-default
  outbound traffic with allowlists, outbound Workers, and credential injection.

## Fail-Closed Rules

- Do not proceed beyond planning without an explicit execution mode.
- Do not proceed without preview verification for Tier 1+ release work.
- Do not proceed without logs, metrics, or traces for Tier 1+ production
  exposure.
- Do not assume Preview URLs provide logs or are available for Durable Object
  Workers.
- Do not assume Browser Run recordings exist unless recording was enabled for
  that session.
- Do not assume ZDR is active unless the chosen provider and gateway settings
  were verified explicitly.
- Do not proceed without a code rollback and state rollback assessment.
- Do not broaden token scope just to make automation easier.
- Do not replace a missing capability with a manual assumption or a hidden
  workaround.

If blocked, return the blocker, the missing capability, and the exact handoff
artifacts the next operator needs.

## Output Modes

Choose the smallest output that satisfies the task:

- Quick Review: Use for small plans or single changes. Include execution mode,
  risk tier, top blockers, and next action.
- Full Release Plan: Use for new features, production rollout, Tier 1+
  changes, or remote/autonomous operators. Use the full response template.
- Handoff Package: Use when the current operator cannot continue safely.
  Include completed work, blockers, missing permissions, evidence,
  branch/preview, tests, rollback note, and required next action.
- Codex Implementation Brief: Use when the user wants another coding agent to
  implement. Include files to edit, exact changes, acceptance criteria, and
  validation commands.
- Policy / Operating Model: Use when the user asks how a team should govern
  AI-assisted delivery. Include risk tiers, authority matrix, gates, and
  rollout adoption path.

## Evidence Ledger

For Tier 1+ release work, remote/autonomous operators, production exposure, or
any recommendation that says work may continue, distinguish observed facts from
claims. Use a compact evidence summary for normal work and the full ledger from
`references/evidence-ledger.md` for high-risk work.

```markdown
## Evidence ledger
- Evidence:
- Assumptions:
- Blockers:
- Recommendations:
```

## Pre-Response Safety Check

Before final output, confirm:

- Is execution mode known, unknown, or blocked?
- Is production promotion authority explicit?
- Is risk tier justified by blast radius, not surface label?
- Are preview/staging, telemetry, and rollback paths identified?
- Are code rollback and state rollback separated?
- Are claims tagged as evidence, assumption, blocker, or recommendation?
- If current Cloudflare behavior matters, was freshness verified or marked as
  an assumption?

## Response Template

Use this structure for Full Release Plan outputs:

```markdown
## Execution mode
[human-local | human-remote | autonomous-remote | autonomous-deployer | unknown / planning-only]

## Capability check
- [Available capabilities]
- [Missing capabilities]
- [Whether work can continue]

## Risk tier
[Tier and justification]

## Blast radius
[Systems, data, and side-effects touched]

## Required Cloudflare controls
- [Build and preview]
- [Exposure control]
- [Runtime and state]
- [Secrets and access]
- [Observability]

## Verification gates
- [Automated checks]
- [Manual checks]
- [Adversarial or abuse-path check]

## Rollout and rollback
- [Release shape]
- [Code rollback]
- [State rollback]
- [Rollback limits]

## Evidence ledger
- Evidence:
- Assumptions:
- Blockers:
- Recommendations:

## Open risks
- [Remaining concerns or blockers]

## Handoff
- [What the next human or agent needs if this mode cannot complete the task]
```

## References

- Read [references/playbook.md](references/playbook.md) when you need the full
  operating model, AI change package details, prompt scaffold, go-live
  checklist, or 30/60/90 rollout plan.
- Read [references/cloudflare-tooling.md](references/cloudflare-tooling.md)
  when you need detailed Cloudflare product guidance, maturity-level stack
  selection, or platform-specific footguns.
- Read [references/cloudflare-current-stack.md](references/cloudflare-current-stack.md)
  when you need current recommended Cloudflare product choices and safe
  defaults for "build in prod" workflows. Its snapshot date is April 23, 2026.
- Read [references/evidence-ledger.md](references/evidence-ledger.md) when
  recommendations need an auditable evidence trail.
- Read [references/fail-closed-scenarios.md](references/fail-closed-scenarios.md)
  when a missing capability must map to continue, planning-only, preview-only,
  handoff, or hard block.
- Read [references/source-freshness.md](references/source-freshness.md) before
  presenting recently changing Cloudflare behavior as current fact.
