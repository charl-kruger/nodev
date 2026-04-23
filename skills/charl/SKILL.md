---
name: charl
description: Plan, review, and implement safe production delivery for AI-authored Cloudflare changes and AI-powered products. Use when the user asks how to vibe code safely in production, ship AI-written Cloudflare features, classify risk tiers or blast radius, design previews, feature-flagged rollout, rollback, observability, or choose Cloudflare controls such as Workers, Pages, Flagship, AI Gateway, Access, D1, Durable Objects, Queues, Workflows, Browser Run, or Sandbox. Support both human-operated local workflows and autonomous agents running in sandboxes or remote VMs, and fail closed when required authority, verification, or rollback paths are missing.
---

# Charl

Turn ambiguous "ship this with AI" work into a governed Cloudflare delivery
plan. Support both human-operated local workflows and autonomous agents running
in sandboxes or remote VMs. Optimize for bounded blast radius, preview-first
verification, controlled exposure, and fast rollback.

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
7. Return a concrete shipping plan or review with open risks, blockers, and
   next actions.

## Execution Modes

Choose one mode explicitly:

| Mode | Typical operator | Default stance |
| --- | --- | --- |
| `human-local` | Human and agent on the same workstation | Interactive review and deploy flow is allowed |
| `human-remote` | Agent runs in a sandbox or remote VM, human reviews and promotes | Build, test, preview, and evidence generation are allowed; human owns final promotion |
| `autonomous-remote` | Unattended agent in a sandbox or remote VM | Build, test, preview, and evidence generation are allowed; production promotion is constrained by the authority matrix |
| `autonomous-deployer` | Unattended agent with explicit deploy rights and observability access | Allow promotion only when policy, verification, and rollback requirements are all satisfied |

If the mode is unknown, stop and report that as a blocker.

## Capability Check

Require these capabilities before proceeding:

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
  Workers Builds, Preview URLs, and non-production branch builds. In
  `human-local`, prefer local development first. In remote modes, use preview
  builds and remote bindings intentionally. Protect sensitive previews with
  Access. Pin `preview_urls` in Wrangler so dashboard toggles do not drift on
  the next deploy. Review Workers Builds token scope instead of blindly keeping
  the auto-created token. If the Worker uses Durable Objects, do not assume
  Preview URLs are available.
- Exposure control: Prefer dark launches behind Flagship or an equivalent
  application-level flag. Prefer Flagship when possible so exposure control
  stays separate from code promotion. Use gradual deployments carefully. For
  static-asset applications, use version affinity or prefer dark launches over
  naive percentage rollout.
- Runtime AI traffic: Route model calls through AI Gateway unless there is a
  strong reason not to. Prefer the unified `default` gateway pattern, gateway
  retries, and Unified Billing or ZDR where the data policy requires it. If ZDR
  is a hard requirement, verify provider support and gateway settings and fail
  closed otherwise.
- Secrets and access: Use bindings, Worker secrets, or Secrets Store. Keep
  production write access narrower than production read access for agents.
- Stateful runtime: Use KV for config and flags, Durable Objects for
  coordination and sessions, D1 for lightweight relational data, R2 for
  artifacts, and Hyperdrive for existing regional databases.
- Async and long-running work: Use Queues for delivery and retries. Use
  Workflows for durable multi-step execution.
- Tooling and verification: Use Browser Run for UI verification. Prefer Live
  View, Session Recordings, and Human in the Loop when the browser path is
  brittle. Enable recordings explicitly when you need replay; they are opt-in
  and only available for Browser Sessions, not Quick Actions. Use WebMCP when
  the site exposes structured browser tools.
- Code execution: Prefer Dynamic Workers for fast isolated code-mode tasks and
  short-lived generated code. Prefer Sandbox for persistent workspaces, Git,
  previews, snapshots, and interactive coding environments. Use Sandbox bridge
  when the controller runs outside Workers.
- Internal tools: Put them behind Access, Tunnel, or authenticated MCP flows.
  For larger tool estates, prefer Access MCP portals with managed OAuth and
  portal Code Mode. Preserve user identity where possible.
- Autonomous egress: In Sandboxes or Containers, prefer deny-by-default
  outbound traffic with allowlists, outbound Workers, and credential injection
  so secrets stay outside the untrusted runtime.

## Fail-Closed Rules

- Do not proceed without an explicit execution mode.
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

## Review Focus

- Interfaces and contracts: routes, schemas, migrations, permissions, caching
  behavior
- Dependencies and bindings: packages, model providers, secrets, network calls,
  and storage primitives
- Failure handling: timeouts, retries, idempotency, null states, and partial
  completion
- Security posture: auth checks, input validation, rate limits, data exposure,
  and secret handling
- Runtime evidence: acceptance tests, logs, metrics, traces, alerts, and
  dashboards

For low-risk changes, review behavior harder than code. For high-risk changes,
review behavior and interfaces harder than code. For Tier 3 changes, review the
code too.

## Gotchas

- A UI edge can still have a large blast radius if it triggers shared
  side-effects.
- Worker rollbacks do not restore D1, R2, KV, or Durable Object state.
- Asset-heavy gradual deployments can serve mixed HTML and static assets.
- Preview URL behavior can drift if dashboard settings and Wrangler config
  disagree.
- AI Gateway should be the runtime AI control plane, not an optional extra.
- AI Gateway ZDR can downgrade to standard Unified Billing behavior on
  unsupported providers.
- Workers Builds can auto-create a user token with broader edit scope than a
  production agent should usually hold.
- Browser Run session recording is opt-in and only applies to Browser Sessions.
- Do not give coding agents broad production Cloudflare write access by default.
- Do not execute untrusted code inside the main Worker when Sandbox is
  available.

## Response Template

Use this structure unless the user asks for a different format:

```markdown
## Execution mode
[human-local | human-remote | autonomous-remote | autonomous-deployer]

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
- [Rollback limits]

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
  when you need the latest recommended Cloudflare product choices and safe
  defaults for "build in prod" workflows.
