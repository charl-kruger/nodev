# Cloudflare Tooling Guide

## Table of Contents

- Core platform stance
- Bootstrap and local iteration
- Preview and release
- Rollout and rollback caveats
- Runtime AI control plane
- Agent runtime and tool connectivity
- State, storage, and recovery
- Secrets, identity, abuse control, and observability
- Recommended operating patterns
- Safe default stacks
- Cloudflare-specific footguns

## Core Platform Stance

Use Cloudflare to separate build, deploy, release, runtime, state, and access
control. Let the coding agent write code and tests into Git. Let Cloudflare
handle previewing, versioning, exposure control, identity, browser automation,
isolated execution, async recovery, and observability.

Support two operator classes explicitly:

- Human-supervised operators on a local workstation or remote environment
- Autonomous operators in sandboxes or remote VMs

The second class must fail closed when preview, observability, rollback, or
production authority are missing.

## Use The Current Product Defaults

As of April 23, 2026, the safest Cloudflare defaults for agentic delivery are:

- Workers Builds plus Preview URLs for non-production validation
- Access-protected previews
- Flagship for feature exposure control
- AI Gateway as the default inference control plane
- Browser Run for browser verification and human intervention
- Dynamic Workers for fast isolated code execution
- Sandbox for persistent coding environments and rich workspaces
- Agents SDK for long-running or stateful operators
- Workers Logs and tracing for evidence

If an older pattern conflicts with one of these defaults, prefer the newer
platform-native approach unless you have a workload-specific reason not to.

## Bootstrap and Local Iteration

Prefer these defaults:

- Start from C3 or an existing Wrangler-managed project instead of an ad hoc
  repo skeleton.
- Treat `wrangler.jsonc` as the source of truth for bindings, environments,
  routes, and deployment behavior.
- In `human-local`, develop locally by default.
- In remote modes, prefer preview builds, remote bindings, and explicit CI-style
  steps instead of assuming workstation access.
- Use remote bindings selectively when correctness depends on real Cloudflare
  resources.
- Reserve `wrangler dev --remote` for cases that genuinely require edge-specific
  behavior.
- Run tests in the Workers runtime with the Workers Vitest integration.
- Prefer Workers Builds for repo-connected projects, especially when you want
  non-production branch builds, preview URLs, or autoconfig-generated pull
  requests for Cloudflare deployment setup.
- Review the Workers Builds API token before calling the path safe by default.
  The auto-created token can have account and route edit permissions that are
  too broad for an autonomous operator.

## Preview and Release

Use a preview-first release path:

- Upload or build a preview version before production exposure.
- Verify the actual running system on its preview URL.
- Protect sensitive previews with Access.
- Pin `preview_urls` in Wrangler so dashboard toggles do not drift on the next
  deploy.
- Promote code to production only after preview verification.
- Keep new behavior dark behind Flagship or an equivalent exposure control until
  metrics look healthy.

For unattended operators, treat preview verification, telemetry inspection, and
rollback preparation as mandatory gates, not best-effort steps.

Important current limits:

- Preview URLs now support both versioned and aliased forms.
- Preview URLs are not generated for Workers implementing Durable Objects.
- Preview URLs do not currently provide Workers Logs, Wrangler tail, or Logpush.
- Preview URL behavior can drift if dashboard settings disagree with the
  Wrangler file used for deploys.

Implication:

- If you need logs before promotion, use a staging path or tightly scoped canary
  instead of relying on Preview URLs alone.
- Use aliased Preview URLs or stable non-production branch builds when a human
  reviewer needs a durable link that survives multiple commits.

Use both code promotion and exposure control:

- Versioning decides which code exists.
- Flagship decides who can see or execute the behavior.
- Workers Builds automation is only as safe as the token behind it; review the
  token scope rather than accepting the default forever.

## Rollout and Rollback Caveats

Treat these as hard constraints:

- Worker rollbacks do not restore KV, R2, Durable Objects, or D1 state.
- Resource migrations can block clean rollback paths.
- Gradual deployments can produce mixed HTML and static asset versions for
  asset-heavy apps.

Implication:

- Always design rollback for both code and state.
- Prefer dark launches over naive percentage rollout when asset coupling is
  risky.
- For static-asset applications, configure version affinity so all requests from
  the same user land on the same Worker version during a rollout.

## Runtime AI Control Plane

For AI-powered product features:

- Route runtime model traffic through AI Gateway unless there is a strong reason
  not to.
- Use the gateway as the choke point for logging, analytics, caching, retries,
  rate limits, DLP, guardrails, provider comparison, and cost control.
- Keep the application model-agnostic where possible.
- Use Workers AI when Cloudflare-hosted models reduce operational surface area.

Use current AI Gateway features where they help:

- `default` gateway creation for fast setup
- gateway-level automatic retries
- Unified Billing for multi-provider usage
- Zero Data Retention for supported Unified Billing providers
- Realtime WebSockets API for low-latency voice or live AI interactions

Important data-policy caveat:

- Cloudflare documents that unsupported providers downgrade to standard Unified
  Billing behavior when ZDR is requested. If ZDR is a requirement, treat
  unsupported providers as a blocker instead of an acceptable degradation.

## Agent Runtime and Tool Connectivity

Use the right runtime for the right job:

- Use the Agents SDK when the product needs persistent agents, stateful
  sessions, WebSockets, or scheduled agent behavior.
- Use Browser Run when you need browser-based verification, screenshots, or
  smoke tests.
- Use Sandbox when the agent or user needs to execute untrusted code.
- Use Dynamic Workers when the task is short-lived, code-mode oriented, and
  benefits from very fast isolated execution with explicit bindings and network
  control.
- Use Access MCP portals when you need a governed front door for many internal
  or third-party MCP servers.
- Use authenticated MCP flows for tool access instead of unauthenticated tool
  surfaces.

Privilege guidance:

- Keep production MCP access read-mostly by default.
- Prefer human-approved promotion paths for production writes.
- Preserve end-user identity when a tool chain crosses internal applications.
- In autonomous modes, use short-lived, scoped machine identity where possible
  and stop if the available identity is broader than required.

Prefer current agent patterns:

- long-running agents for persistent remote operators
- Workflows for approval gates
- HITL patterns such as `needsApproval`, `onToolCall`, MCP elicitation, or
  `waitForApproval()` depending on the architecture
- Code Mode when tool-by-tool orchestration is too slow or expensive
- the Project Think execution ladder mindset: workspace first, then Dynamic
  Workers, browser, and Sandbox only as needed

## State, Storage, and Recovery

Pick storage by failure mode:

- KV: global config and read-heavy flags
- Durable Objects: coordination, sessions, strict serialization, shared cursors
- D1: lightweight relational app data with time-travel recovery
- R2: object storage and generated artifacts
- Hyperdrive: access to existing regional databases
- Queues: at-least-once delivery with retries and dead-letter flows
- Workflows: durable multi-step execution with persisted state
- Vectorize or AI Search: retrieval only when the product truly needs it

When one Worker calls another:

- Prefer service bindings over public HTTP.

## Secrets, Identity, Abuse Control, and Observability

Protect the control plane:

- Store credentials in Worker secrets or Secrets Store, never in source or
  plain config.
- Put internal tools behind Access and Tunnel when appropriate.
- Use scoped service tokens or API tokens for machine access.
- Use Turnstile and WAF rate limits on expensive or sensitive endpoints.
- Keep Workers Logs, traces, and analytics enabled so AI-built changes have an
  evidence trail after release.
- For governed MCP access, prefer Access MCP portals with managed OAuth,
  session controls, and portal logs or Logpush where your plan supports it.

Remote or autonomous operators must not proceed to production exposure if they
cannot read the evidence they are expected to rely on.

For Sandboxes and Containers, use current outbound controls:

- `enableInternet = false` where possible
- allowlists or deny lists for outbound hosts
- outbound Workers for credential injection
- per-instance egress policy when different sandboxes require different access

## Recommended Operating Patterns

### Pattern A: Safe AI Coding-Agent Workflow

1. Start from a Wrangler-managed project.
2. Give the coding agent repository context and, where useful, read-only
   Cloudflare discovery access.
3. Detect whether the operator is `human-local`, `human-remote`,
   `autonomous-remote`, or `autonomous-deployer`.
4. Develop locally with realistic bindings only when the mode supports that.
5. Require Workers-runtime tests and Browser Run verification for UI paths.
6. Upload a preview version and verify it before production.
7. Deploy code only after preview verification and only if the current mode is
   allowed to promote.
8. Keep new behavior dark behind Flagship until metrics support wider exposure.

### Pattern B: Safe Runtime Architecture for AI-Powered Features

- Workers handle request entrypoints.
- AI Gateway handles model traffic.
- Durable Objects and D1 handle state.
- R2 stores generated artifacts.
- Queues and Workflows handle anything you cannot afford to lose if the request
  path ends early.

### Pattern C: Secure Agent Access to Internal Tools

- Publish internal tools behind Access.
- Use Tunnel for private origins.
- Prefer OAuth-protected or authenticated MCP servers.
- For many tool servers, prefer an Access MCP portal with portal Code Mode so
  the agent does not carry a giant tool schema for every upstream service.
- Preserve user identity when downstream apps care about the caller.

### Pattern D: Isolation for Dangerous Capabilities

- Use Sandbox for untrusted code execution.
- Use Browser Run for privileged browsing or UI verification.
- Do not run arbitrary code inside the main application Worker.

## Safe Default Stacks

Use these maturity defaults:

- Level 1: Wrangler, local development, selected remote bindings, Workers
  Vitest, preview URLs, protected previews, production secrets via bindings,
  Workers Logs, Turnstile, and WAF rate limits.
- Level 2: Add AI Gateway, Flagship, D1 or Durable Objects, Queues or
  Workflows, and high-cardinality product telemetry.
- Level 3: Add the Agents SDK, Browser Run, Sandbox, retrieval infrastructure
  where needed, and identity-aware MCP connectivity for internal tools.

Use these 2026 upgrades where relevant:

- Replace generic browser automation with Browser Run plus Live View and HITL
- Replace ad hoc provider wrappers with AI Gateway defaults, retries, and ZDR
- Use Dynamic Workers for fast code-mode tasks
- Use Sandbox for persistent workspaces, snapshots, Git, and previews
- Use Sandbox bridge when controlling sandboxes from outside Workers
- Replace sprawling internal MCP catalogs with Access MCP portals plus Code
  Mode when context usage and auditability matter

## Cloudflare-Specific Footguns

- Do not assume a code rollback is a full system rollback.
- Do not use `wrangler dev --remote` casually against sensitive resources.
- Do not rely on percentage rollout alone for asset-heavy applications.
- Do not ignore Preview URL limitations for Durable Objects and logging.
- Do not let Preview URL dashboard settings drift away from the Wrangler file
  that actually deploys the Worker.
- Do not assume Workers Builds' default token is scoped tightly enough for
  autonomous production use.
- Do not give a coding agent broad production Cloudflare account write access by
  default.
- Do not keep secrets in source or in plain Wrangler configuration.
- Do not expose internal tools or MCP servers directly when Access or Tunnel can
  preserve authentication and isolation.
- Do not let the main Worker execute untrusted code when Sandbox exists for that
  purpose.
- Do not use Sandbox for every generated-code task when Dynamic Workers are the
  lighter and faster primitive.
- Do not bypass AI Gateway and then rebuild its controls badly in application
  code.
- Do not assume Browser Run recordings exist unless you enabled recording for
  that session.
- Do not assume ZDR is active on a provider unless you verified that provider is
  supported for the gateway path you are using.
- Do not let an autonomous operator promote to production without explicit
  authority, preview verification, telemetry visibility, and rollback access.
