# Cloudflare Current Stack

## Table of Contents

- Snapshot date
- Core recommendation
- Delivery and release layer
- AI inference layer
- Browser verification layer
- Code execution layer
- Agent runtime layer
- Security and identity layer
- Operator access and MCP governance layer
- Observability layer
- Known limits and footguns

## Snapshot Date

This reference reflects the Cloudflare docs, changelog, and blog state as of
April 23, 2026.

## Core Recommendation

For safe AI-assisted shipping on Cloudflare, the current best-practice stack is:

- Workers Builds and Preview URLs for non-production validation
- Access-protected previews
- Flagship for dark launches and controlled exposure
- Workers versions, gradual deployments, and rollbacks for code release control
- AI Gateway as the default inference control plane
- Browser Run for browser verification and human intervention
- Dynamic Workers for fast isolated code-mode execution
- Sandbox for persistent coding environments and untrusted code with previews
- Agents SDK for long-running or stateful remote operators
- Workers Logs, traces, and OTLP export for evidence

Use this as the default unless a specific workload justifies something else.

## Delivery And Release Layer

Prefer:

- Workers Builds with non-production branch builds
- Versioned or aliased Preview URLs
- Access in front of sensitive previews
- `wrangler versions upload` for upload-without-immediate-promotion
- Gradual deployments only when version affinity or asset safety is understood
- Rollbacks for code only, never as a substitute for state rollback
- `preview_urls` pinned in Wrangler so deploys do not undo dashboard choices
- a reviewed Builds token instead of a blindly accepted auto-created token

Important current limitations:

- Preview URLs are not generated for Workers implementing Durable Objects.
- Preview URLs currently do not provide Workers Logs, Wrangler tail, or Logpush.
- Static asset apps can break during gradual rollouts unless version affinity is
  configured.

Implication:

- For Durable Object apps or observability-heavy pre-prod checks, use staging,
  canary, or tightly controlled low-percentage production paths instead of
  relying on Preview URLs alone.

## AI Inference Layer

Use AI Gateway as the default runtime AI control plane.

Current features that materially improve safety and operability:

- The `default` gateway can be created automatically on first authenticated use.
- Automatic retries now exist at the gateway level for upstream failures.
- Unified Billing allows one Cloudflare bill across multiple providers.
- Zero Data Retention can be enabled for supported Unified Billing providers.
- Realtime WebSockets support low-latency voice and live conversational flows.
- Workers can now use the same `AI.run()`-style pattern across Workers AI and
  third-party providers.

Implication:

- Prefer gateway-managed retries and routing over hand-built retry logic.
- Prefer ZDR when handling sensitive prompts or outputs and the provider
  supports it.
- If ZDR is mandatory, verify provider support explicitly because unsupported
  providers downgrade to standard Unified Billing behavior.
- Prefer the unified inference layer when building agents that may change model
  providers over time.

## Browser Verification Layer

Use Browser Run instead of treating browser automation as a black box.

Current capabilities that matter for safe operator workflows:

- Live View for real-time browser inspection
- Human in the Loop for stepping into a live session
- Session Recordings for replay and debugging
- `wrangler browser` commands for session management from the terminal
- WebMCP for sites that expose structured browser tools

Implication:

- Prefer Browser Run for verification of user-facing flows, auth challenges, and
  edge-case browser states.
- Use Human in the Loop when a remote or autonomous agent reaches a page that
  requires human intervention.
- Enable recording deliberately when replay matters; recordings are opt-in,
  available only for Browser Sessions, and are finalized after the session ends.

## Code Execution Layer

Choose between Dynamic Workers and Sandbox intentionally.

Use Dynamic Workers when you need:

- very fast, isolated code execution
- code-mode style execution
- network isolation by default
- typed bindings and per-run observability
- short-lived generated code or custom automation tasks

Use Sandbox when you need:

- a persistent workspace
- Git operations
- long-lived previews and development servers
- snapshots and restore
- file watching
- background processes
- interactive terminals

Use Sandbox bridge when the controlling agent runs outside Workers and still
needs to control sandboxes over HTTP.

## Agent Runtime Layer

For real autonomous remote operators, prefer the current Agents SDK primitives
over ephemeral request-bound agent sessions.

Current strong choices:

- Long-running agents on Durable Objects
- Human-in-the-loop patterns from Agents SDK docs
- Workflows for durable approvals and multi-step release gates
- Code Mode with Dynamic Workers when the agent needs to write code instead of
  stepping tool-by-tool
- Project Think primitives such as durable execution, sub-agents, and
  persistent sessions for advanced operator architectures

Do not force all agentic workloads into one abstraction. Use:

- Agents SDK for stateful, durable operators
- Dynamic Workers for fast isolated code execution
- Sandbox for richer, persistent developer environments

## Security And Identity Layer

For remote and autonomous operators:

- Keep secrets in Workers, not inside Sandboxes
- Use outbound Workers for credential injection
- Start with deny-by-default outbound traffic
- Use allowlists or per-host outbound handlers
- Use scoped tokens and machine identity
- Put internal tools behind Access, Tunnel, or authenticated MCP flows

If the sandbox needs Internet access, make that explicit.

## Operator Access And MCP Governance Layer

For internal tools and enterprise environments, the current best front door is:

- Access MCP portals for centralized governance
- managed OAuth instead of ad hoc shared credentials
- portal session management so users can enable, disable, or reauthorize
  upstream servers without leaving the client
- portal Code Mode when the upstream tool surface is large
- portal logs or Logpush where audit export matters

Implication:

- Prefer a governed portal over many raw local MCP connections when the agent
  can reach sensitive internal systems.

## Observability Layer

Treat observability as a gating requirement, not a nice-to-have.

Current defaults:

- Enable Workers Logs in Wrangler explicitly
- Use traces and metrics for request path evidence
- Use Tail Workers or Logpush where centralized export is needed
- Use OTLP export when you already have an existing observability stack
- Use Dynamic Worker observability or Tail Workers for code-mode execution

Do not sign off on production exposure if the operator cannot inspect the
telemetry it is expected to rely on.

## Known Limits And Footguns

- Preview URLs do not currently solve verification for Durable Object Workers.
- Preview URLs do not currently expose logs.
- Preview URL config can drift when dashboard and Wrangler settings disagree.
- Rollbacks do not revert KV, D1, R2, or Durable Object state.
- Static assets need version affinity during gradual rollouts.
- Dynamic Workers and Sandbox solve different problems; using Sandbox for every
  code-mode task is often heavier than needed.
- Browser Run session recording is opt-in and not available for Quick Actions.
- Workers Builds may auto-create a token with more scope than an autonomous
  production path should hold.
- AI Gateway ZDR does not guarantee retention behavior on unsupported providers.
- Broad production tokens are still the easiest way to destroy the value of an
  otherwise safe architecture.
