# Cloudflare Audit (April 23, 2026)

This is the source-backed Cloudflare product audit behind the current `charl`
recommendations.

The question was not "what is fashionable on Cloudflare right now?" It was:

`Which current Cloudflare products materially improve the safety, legibility, and control of AI-assisted shipping?`

## What We Reviewed

Official sources only:

- [Cloudflare Changelog](https://developers.cloudflare.com/changelog/)
- [Cloudflare Blog](https://blog.cloudflare.com/)
- [Cloudflare Developers Docs](https://developers.cloudflare.com/)

## Material Findings

### 1. Workers Builds And Preview URLs Are Stronger, But Also Sharper

The modern release path is materially better than it was a year ago:

- Workers Builds can run non-production branch builds
- preview deploys default to `wrangler versions upload`
- Preview URLs now support both versioned and aliased forms
- versions can be uploaded separately from promotion

The important catches are equally material:

- Preview URLs are not generated for Durable Object Workers
- Preview URLs do not currently expose Workers Logs, Wrangler tail, or Logpush
- dashboard Preview URL settings can drift if Wrangler config says something
  else
- Workers Builds can auto-create a token with broader edit permissions than many
  teams should give an autonomous deploy path

Implication:

- `charl` should recommend preview-first delivery, but never pretend preview is
  enough by itself for Durable Objects or observability-heavy checks.

### 2. Flagship Is The Right Exposure Primitive

Flagship is no longer "some future Cloudflare feature flags idea." It is a real
native product and should now be the default recommendation for separating
deployment from exposure.

What matters:

- native Workers binding
- OpenFeature-compatible SDK
- targeting rules
- percentage rollouts with consistent hashing
- multi-type flag variations, including structured JSON

Implication:

- `charl` should prefer dark launch plus explicit flag evaluation over naive
  percentage deployment when the goal is safe rollout.

### 3. Browser Run Is Now A Real Verification Surface

Browser Run materially changed in April 2026:

- Live View
- Human in the Loop
- Session Recordings
- WebMCP
- `wrangler browser` session commands

The catches matter:

- recordings are opt-in
- recordings only exist for Browser Sessions, not Quick Actions
- the recording is available only after the session closes

Implication:

- `charl` should treat Browser Run as the preferred UI verification path, but it
  should not assume replay exists unless recording was explicitly enabled.

### 4. AI Gateway Has Become A Real Control Plane

AI Gateway is no longer just a convenient proxy.

The pieces that matter operationally:

- automatic `default` gateway creation
- gateway-level retries
- Unified Billing
- Zero Data Retention for supported providers
- Realtime WebSockets
- unified inference patterns through `env.AI.run()`

The important catch:

- Cloudflare documents that unsupported providers downgrade to standard
  Unified Billing behavior when ZDR is requested

Implication:

- if retention policy matters, `charl` should fail closed on unsupported
  providers instead of treating Cloudflare's downgrade behavior as good enough.

### 5. Dynamic Workers And Sandbox Are Different Tools

This distinction is now central.

Use Dynamic Workers for:

- fast isolated code-mode execution
- explicit bindings and network control
- short-lived generated code
- per-run observability

Use Sandbox for:

- persistent workspaces
- Git
- previews and dev servers
- snapshots
- background processes
- interactive terminals

Sandbox also got materially stronger for real agent systems:

- outbound Workers for credential injection
- allowlists and deny-by-default egress
- per-instance outbound policy

Implication:

- `charl` should stop treating Sandbox as the universal answer for all
  generated-code tasks.

### 6. Agents SDK Direction Matters

Cloudflare's April 2026 guidance clearly points toward a more durable operator
model:

- long-running agents on Durable Objects
- Workflows for approvals
- Human in the Loop patterns across the Agents SDK
- Project Think primitives such as durable execution, sub-agents, persistent
  sessions, and an execution ladder

Implication:

- `charl` should prefer durable, stateful agent architectures for serious remote
  operators instead of request-bound agent loops.

### 7. Access MCP Portals Are Now The Best Front Door For Internal Tools

For internal and enterprise tool access, the most important current shift is
governed MCP:

- Access MCP portals provide centralized governance
- portal Code Mode is now supported and on by default
- session management lets users enable, disable, or reauthorize servers
- portal logs and Logpush improve auditability

Implication:

- `charl` should recommend Access-governed MCP access for sensitive internal
  systems instead of sprawling unmanaged local MCP setups.

## What Charl Now Recommends By Default

For most "build in prod safely" scenarios, the current default answer is:

1. Build in Git with Wrangler-managed projects or Workers Builds
2. Validate on Preview URLs when they are actually available and sufficient
3. Put Access in front of sensitive previews
4. Use Flagship to decouple deployment from exposure
5. Route runtime AI traffic through AI Gateway
6. Use Browser Run for UI verification and human intervention
7. Use Dynamic Workers for short isolated code-mode tasks
8. Use Sandbox for persistent coding environments
9. Use scoped secrets and outbound credential injection
10. Use governed MCP access for sensitive internal tool estates
11. Require telemetry, rollback notes, and a named promotion owner before
    widening production exposure

## What Charl Should Refuse To Assume

- That Preview URLs are enough for Durable Object apps
- That Preview URLs provide logs
- That Browser Run recordings exist by default
- That AI Gateway ZDR is active on unsupported providers
- That the default Workers Builds token is safely scoped
- That Sandbox is always a better choice than Dynamic Workers
- That a code rollback is also a state rollback

## Key Sources

- [Preview URLs](https://developers.cloudflare.com/workers/configuration/previews/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Gradual deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/)
- [Cloudflare Flagship](https://developers.cloudflare.com/flagship/)
- [Browser Run features](https://developers.cloudflare.com/browser-run/features/)
- [Session recording](https://developers.cloudflare.com/browser-run/features/session-recording/)
- [Wrangler browser commands](https://developers.cloudflare.com/workers/wrangler/commands/browser/)
- [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)
- [AI Gateway automatic retries](https://developers.cloudflare.com/changelog/post/2026-04-02-auto-retry-upstream-failures/)
- [Dynamic Workers](https://developers.cloudflare.com/dynamic-workers/)
- [Sandbox SDK](https://developers.cloudflare.com/sandbox/)
- [Sandbox outbound controls](https://developers.cloudflare.com/changelog/post/2026-04-13-sandbox-outbound-workers-tls-auth/)
- [Human in the Loop for Agents](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/)
- [MCP governance](https://developers.cloudflare.com/agents/model-context-protocol/governance/)
- [MCP portal Code Mode](https://developers.cloudflare.com/changelog/post/2026-03-26-mcp-portal-code-mode/)
- [MCP portal session management](https://developers.cloudflare.com/changelog/post/2026-04-02-mcp-portal-session-management/)
- [Code Mode: give agents an entire API in 1,000 tokens](https://blog.cloudflare.com/code-mode-mcp)
- [Project Think](https://blog.cloudflare.com/project-think/)
- [The AI engineering stack we built internally](https://blog.cloudflare.com/internal-ai-engineering-stack/)
