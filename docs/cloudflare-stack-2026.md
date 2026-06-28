# Recommended Cloudflare Stack (April 2026)

This is the current Cloudflare stack `nodev` should bias toward when the goal
is to let humans or autonomous agents build quickly without being careless in
production.

The question is not "what is new?" It is "what materially improves safety,
legibility, and control for AI-assisted shipping?"

As of April 23, 2026, these are the tools that matter most.

## The Current Best Default Stack

For most teams, the best default stack is:

- Workers Builds and Preview URLs for pre-production validation
- Cloudflare Access for protecting preview environments
- Flagship for dark launches and controlled user exposure
- Workers versions, gradual deployments, and rollbacks for code release control
- AI Gateway as the default inference control plane
- Browser Run for UI verification and human intervention
- Dynamic Workers for fast isolated generated-code tasks
- Sandbox for persistent coding environments and rich agent workspaces
- Agents SDK for long-running or stateful autonomous operators
- Workers Logs, traces, and OTLP export for evidence

That is the current shape of "build in prod safely" on Cloudflare.

## Why These Are The Right Defaults

### 1. Preview And Release Have Matured

Workers now have a more complete release path than many teams realize:

- versioned and aliased Preview URLs
- versions uploaded separately from deployment
- gradual deployments
- rollbacks
- branch builds in Workers Builds

This matters because AI-generated code should almost never go straight from
local confidence to global production exposure.

Important caveats:

- Preview URLs are not generated for Workers with Durable Objects.
- Preview URLs do not currently provide Workers Logs, Wrangler tail, or Logpush.
- Preview URL behavior can drift if dashboard settings and Wrangler config do
  not match.
- Workers Builds can auto-create a token with broader edit permissions than
  many autonomous production paths should keep.

That means preview is valuable, but not universal. If you need logs before
promotion or the app depends on Durable Objects, a staging or canary path is
often safer.

It also means safety is partly configuration hygiene:

- pin `preview_urls` in Wrangler
- review the Builds token instead of accepting the default forever
- use aliased Preview URLs or stable branch previews when humans need a durable
  review link

### 2. Flagship Is The Right Release Lever

Flagship is now Cloudflare’s native feature flag service and should be the
default recommendation for exposure control.

This is important because deployment and exposure are different things.

Code can exist in production without being visible to users. That difference is
one of the cleanest ways to move fast safely.

The newer reason this matters is that Flagship is no longer just "a boolean in a
dashboard." It now gives Cloudflare-native flag evaluation, targeting rules,
percentage rollouts with consistent hashing, and OpenFeature-compatible
portability. That makes it a much better release lever than DIY config switches.

### 3. Browser Run Is Much More Useful Now

Browser Run is no longer just a headless browser API. The current feature set
changes how safe agent verification can be:

- Live View
- Human in the Loop
- Session Recordings
- `wrangler browser`
- WebMCP support for structured website tools

This matters because when a browser automation fails, the cost is usually not
the failure itself. It is the opacity. Browser Run is now much better at making
that failure inspectable and recoverable.

Important catch:

- recordings are opt-in
- recordings only exist for Browser Sessions, not Quick Actions
- the recording is only available after the session closes

### 4. Sandboxes And Dynamic Workers Have Different Jobs

This distinction is now important enough to be explicit.

Use Dynamic Workers when you need:

- fast isolated execution
- short-lived code-mode tasks
- explicit network control
- a lighter-weight primitive than a containerized workspace

Use Sandbox when you need:

- a persistent workspace
- Git operations
- long-lived preview URLs
- snapshots and restore
- file watching
- background processes
- richer developer-environment behavior

Using Sandbox for every generated-code task is no longer the best default.
Dynamic Workers are often the better fit for short, isolated code execution.

### 5. Sandboxes Are Now Better For Real Autonomous Agents

Sandboxes have matured materially:

- GA status
- persistent interpreters
- snapshots
- file watching
- preview URLs
- outbound Workers for credential injection
- allowlists and deny-by-default egress

The outbound traffic model is especially important. It means secrets can stay in
the Worker while the untrusted runtime gets only the requests it is allowed to
make.

That is a much stronger default for autonomous coding agents than "give the
sandbox a bunch of credentials and hope."

### 6. AI Gateway Has Become More Than A Proxy

AI Gateway has become a much stronger control plane:

- automatic `default` gateway creation
- automatic retries on upstream failures
- Unified Billing
- Zero Data Retention for supported providers
- Realtime WebSockets API
- broader provider support behind one control point

This makes it a better default for agentic products than direct provider calls.

When the model layer is changing this quickly, the best long-term architecture
is one where the application is not financially and operationally welded to one
vendor.

The subtle but important catch is that ZDR is not magic. Cloudflare documents
that unsupported providers downgrade to standard Unified Billing behavior when
ZDR is requested. If retention policy matters, that should be treated as a
blocker, not a tolerable surprise.

### 7. Agents SDK Is Better Suited To Real Operators

Recent Cloudflare guidance is clearly moving toward durable, long-running,
stateful agents rather than ephemeral request-bound "agents."

That matters because a serious remote operator needs:

- persistence
- wake/sleep lifecycle
- recovery
- approvals
- delegated work

For that shape of system, the Agents SDK plus Workflows is now a better default
than hand-rolling it on top of stateless requests.

### 8. Governed MCP Access Is Now Part Of The Safe Stack

If agents are going to touch internal systems, the front door now matters as
much as the runtime.

Cloudflare’s current MCP governance story is materially stronger than it was:

- Access MCP portals for centralized governance
- portal Code Mode to collapse large tool catalogs into a compact interface
- session management so users can enable, disable, or reauthorize servers
- portal logs and Logpush for auditing

This matters because "build in prod" is not only about deploying code. It is
also about letting agents reach real systems without turning tool access into a
shadow IT project.

## The Biggest Current Footguns

These are the ones worth remembering:

- Rollbacks do not revert KV, D1, R2, or Durable Object state.
- Preview URLs are not enough for Durable Object apps.
- Preview URLs do not currently expose logs.
- Preview URL config can drift when dashboard and Wrangler settings disagree.
- Static asset apps need version affinity during gradual rollouts.
- Workers Builds may hold a broader token than your autonomous path should use.
- AI Gateway ZDR can silently become non-ZDR on unsupported providers.
- Browser Run session recording is opt-in and not available for Quick Actions.
- Broad production tokens still destroy otherwise sound architectures.
- Sandboxes should not get raw credentials if outbound Workers can inject them.
- Not every code-execution task needs Sandbox; Dynamic Workers are often better.

## What Nodev Should Recommend By Default

If the skill is asked for a current best-practice stack, the answer should
usually be:

1. Build in Git with Workers Builds or Wrangler-managed versions
2. Validate on Preview URLs when possible
3. Put Access in front of sensitive previews
4. Use Flagship to decouple exposure from deployment
5. Route AI through AI Gateway
6. Use Browser Run for UI verification and HITL
7. Use Dynamic Workers for short isolated code execution
8. Use Sandbox for persistent coding environments and remote workspaces
9. Use scoped secrets and outbound credential injection
10. Use governed MCP access for sensitive internal tool estates
11. Require logs, traces, metrics, rollback notes, and a named promotion owner

That is the most current answer I would trust.

## Sources

Official sources reviewed for this update:

- [Cloudflare Changelog](https://developers.cloudflare.com/changelog/)
- [Cloudflare Blog](https://blog.cloudflare.com/)
- [Cloudflare Developers Docs](https://developers.cloudflare.com/)

Key references:

- [Flagship docs](https://developers.cloudflare.com/flagship/)
- [Browser Run docs](https://developers.cloudflare.com/browser-run/)
- [Sandbox docs](https://developers.cloudflare.com/sandbox/)
- [Dynamic Workers docs](https://developers.cloudflare.com/dynamic-workers/)
- [Agents docs](https://developers.cloudflare.com/agents/)
- [AI Gateway docs](https://developers.cloudflare.com/ai-gateway/)
- [Workers versions and deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/)
- [Workers preview URLs](https://developers.cloudflare.com/workers/configuration/previews/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [MCP governance](https://developers.cloudflare.com/agents/model-context-protocol/governance/)
- [MCP portal Code Mode](https://developers.cloudflare.com/changelog/post/2026-03-26-mcp-portal-code-mode/)
- [Project Think](https://blog.cloudflare.com/project-think/)
- [The AI engineering stack we built internally](https://blog.cloudflare.com/internal-ai-engineering-stack/)
