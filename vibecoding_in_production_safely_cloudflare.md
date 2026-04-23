# Vibecoding in Production Safely

Markdown export of the playbook plus the Cloudflare tooling addendum.

---

## Main playbook

*Prepared from the provided talk transcript and Q&A, the linked X post
framing, and current Cloudflare / Anthropic / third-party source
material. Updated April 22, 2026.*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Core thesis<br />
</strong>Production vibecoding is not trusting AI-generated code
blindly. It is building a delivery system where code can become an
implementation detail because architecture boundaries, acceptance tests,
runtime controls, observability, and rollback paths are stronger than
the model’s mistakes.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**Short version:** Erik Schluntz is directionally right that teams will
need to validate software at a higher abstraction layer as coding agents
get more capable. But the talk only becomes enterprise-safe when you add
risk tiering, security guardrails, deployment controls, and operational
verification. That is where Cloudflare matters most.

> 1\. What the talk gets right
>
> 2\. What the talk misses or underweights
>
> 3\. What the audience and discourse are really worried about
>
> 4\. The operating model for companies
>
> 5\. The developer workflow
>
> 6\. How Cloudflare enables this in practice
>
> 7\. A reference architecture
>
> 8\. Checklists and a 30/60/90-day rollout plan

# 1. What the talk gets right

The talk’s strongest contribution is its reframing of the problem. It
argues that the future bottleneck is not code generation but code
verification: as models can handle longer and more autonomous tasks,
teams that insist on reading every generated line will eventually become
their own throughput limit. That is a management and systems-design
insight, not just a prompting tip. The framing also matches Anthropic’s
broader guidance that successful agentic systems tend to use simple,
composable patterns rather than magical orchestration. \[1\]\[2\]

The second strong idea is the distinction between “forget the code
exists” and “forget the product exists.” The former is an aspiration
about abstraction; the latter is negligence. The analogy to compilers
and managers is useful because it says the answer is not perfect
implementation visibility but a verifiable abstraction boundary. In
other words: stop demanding omniscience, start demanding evidence.
\[1\]\[2\]

The third strong idea is the “leaf node” rule. The talk correctly
identifies tech debt as the hardest thing to validate from outside the
code. That means teams should begin with bounded, customer-visible,
low-dependency surfaces rather than core architecture, identity,
billing, or foundational data models. This is the right default for
adoption because it constrains blast radius while still capturing AI
speed. \[1\]\[4\]\[5\]

The fourth strong idea is the human-role shift. In the talk, the human
stops being a typist and becomes a mixture of product manager,
architect, and verifier. The practical move is not “prompt better” in
the abstract; it is to supply context, examples, constraints, relevant
files, and an evaluation target before the model starts coding. The
model does not need inspiration; it needs onboarding. \[1\]\[2\]

The fifth strong idea is verifiability over diff-reading. The
22,000-line internal example is persuasive not because the code was
AI-written, but because the team created stress tests, observable I/O
boundaries, and human-checkable checkpoints. That is the real lesson:
large AI-authored changes only become mergeable when the surrounding
system makes them legible. \[1\]

# 2. What the talk misses or underweights

The talk’s biggest blind spot is that its flagship success case was
largely offline. That matters. A batch reinforcement-learning subsystem
is far easier to protect than an internet-facing SaaS product with
authentication, billing, secrets, abuse, privacy, and compliance
requirements. The moment an AI-built feature touches identity, payments,
or untrusted user input, “leaf node” safety is no longer enough because
the operational risk is cross-cutting rather than purely local.
\[1\]\[5\]\[6\]

Second, “leaf node” is necessary but not sufficient. Many product teams
think a feature is a leaf node because it sits at the UI edge, but in
practice it can still couple into rate limits, entitlement checks, email
triggers, analytics, search indexes, admin tools, and data retention
policies. So the real enterprise unit is not the feature but the blast
radius. Teams need a risk-tier model, not just a dependency-tree model.

Third, the talk underplays security failure modes specific to agents:
prompt injection via tools, unsafe dependency additions, secret leakage,
hallucinated endpoints, context drift, schema drift, and side effects
triggered from wrong assumptions. Georgia Tech’s recent reporting on its
Vibe Security Radar is a useful counterweight here: researchers describe
fast-growing detection of AI-introduced vulnerabilities and argue that
production AI output should be reviewed like a junior developer’s PR,
especially around input handling and authentication. Snyk’s earlier
survey likewise found that insecure AI suggestions were common, while
security processes lagged adoption. \[5\]\[6\]

Fourth, the talk correctly says humans must ask the right questions, but
that line hides an organizational truth: not every team is equally
ready. A company cannot get production vibecoding safely just by buying
agent seats. It needs templates, architecture constraints,
secret-management defaults, deploy protections, review rituals, and
observability that are stronger than any single developer’s discipline.
That is why platform engineering matters more, not less, in an agentic
era. \[7\]\[10\]\[11\]\[12\]

Finally, the talk is intentionally provocative in order to shift
developer intuition. The mirrored X post amplified exactly the most
sensational version of the idea – “hasn’t written code by hand in
months,” “49 full features,” “100% written by AI” – and showed the kind
of engagement numbers that drive hype cycles. That framing is powerful
marketing, but by itself it encourages copycat behavior without the
invisible safeguards that made the original case acceptable. \[3\]

# 3. What the audience and discourse are really worried about

The live Q&A in the transcript is more useful than most social
discussion because it surfaces the operational objections directly. The
themes cluster into six recurring concerns:

| Concern                         | What it really means                                                                                                                           |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Learning and skill atrophy      | If AI handles the grind, how do developers still become better engineers and architects?                                                       |
| Context density                 | How much guidance is enough before the model becomes overconstrained or brittle?                                                               |
| Security                        | How do you prevent the classic AI failure modes – leaked keys, bypassed auth, weak defaults, exploitable endpoints – from reaching production? |
| Testing discipline              | How do you get test-first or at least test-led behavior, instead of the model writing implementation-specific tests after the fact?            |
| Context drift and long sessions | Why do agents rename functions, wander off-pattern, or go off the rails over longer runs?                                                      |
| Workflow scaling                | Should teams use worktrees, multiple agents, staged plans, or unfamiliar-codebase exploration flows to increase output safely?                 |

Those concerns imply a simple translation: the market does not actually
want “vibes in prod.” It wants faster implementation without giving up
governance. Said differently, people are willing to outsource typing,
even a lot of design, but they are not willing to outsource
accountability.

That is why the best replacement phrase is not pure vibe coding but
governed agentic delivery. The agent can own implementation throughput;
the company must own policy, contracts, verification, and operating
controls.

The mirrored X discussion I could access confirmed the post’s framing
and engagement, but not the full reply tree. The richer signal comes
from the talk’s Q&A and from broader public critiques such as Simon
Willison’s argument that vibe coding is great for prototypes but
dangerous when maintainability and accountability matter. \[3\]\[4\]

# 4. The operating model for companies

## 4.1 Adopt risk tiers, not blanket rules

| Tier   | Typical scope                                                                                | AI autonomy | Human review standard                                                           | Release rule                                           |
|--------|----------------------------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------|--------------------------------------------------------|
| Tier 0 | Prototype, internal toy, throwaway experiment                                                | High        | Spot-check outputs                                                              | Never connect to prod data or users                    |
| Tier 1 | Leaf-node UI, content transforms, internal tooling, non-critical workflows                   | High        | Review tests, behavior, logs, and permissions                                   | Allowed behind preview env, feature flag, and rollback |
| Tier 2 | Customer-facing app logic with bounded data access                                           | Medium      | Review interfaces, auth path, dependencies, tests, observability, rollback plan | Allowed only with staged rollout and explicit owner    |
| Tier 3 | Auth, billing, payments, core architecture, shared data models, compliance-sensitive systems | Low         | Deep human design and implementation review                                     | AI can assist, but not drive unsupervised merges       |

This one change prevents most organizational confusion. Teams stop
arguing about whether AI coding is “allowed” and start asking the only
useful question: what tier is this change, and what evidence is required
before release?

In practice, most companies should get aggressive first in Tier 1,
selective in Tier 2, and conservative in Tier 3. That lines up with the
talk’s leaf-node principle while translating it into policy language
that engineering, security, and product can all use.

## 4.2 Require an AI change package for every non-trivial PR

| Artifact                            | Why it exists                                                                            |
|-------------------------------------|------------------------------------------------------------------------------------------|
| Goal and acceptance criteria        | Prevents vague “make it better” prompts from becoming vague code.                        |
| Files / surfaces expected to change | Constrains the model and focuses review.                                                 |
| Risk notes                          | Calls out auth, data access, secrets, dependencies, PII, cost, abuse, and failure modes. |
| Verification plan                   | Defines end-to-end tests, stress tests, synthetic checks, and manual spot checks.        |
| Observability plan                  | Defines logs, metrics, traces, and alerts before release.                                |
| Rollback plan                       | Makes reversal a first-class output instead of a scramble after failure.                 |

This is the most important cultural shift. If an AI-generated change
arrives as a giant diff with no spec, no tests, and no rollback, the
model has effectively denial-of-serviced your review process. The
artifact bundle restores legibility.

A useful organizational rule is: no autonomous code without autonomous
evidence. If the model wrote 2,000 lines, it should also produce the
tests, the migration notes, the dashboards to watch, the feature flag
location, and the rollback command.

## 4.3 Separate platform responsibilities from product-team responsibilities

Platform / infra should own the paved road: project templates, secrets
defaults, deployment protections, preview environments, observability
exports, test harnesses, database migration workflows, and approved
external libraries.

Security should own the guardrails: threat models, appsec checks, secret
scanning, dependency policy, exposure limits, and approval requirements
for higher-risk tiers.

Product teams should own the spec, user behavior, acceptance tests, and
domain-specific correctness.

This split is how you make AI speed compound instead of fragment.
Without it, every developer reinvents their own safety model – and most
will forget something critical.

# 5. The developer workflow

## 5.1 The recommended loop

> • Define the desired behavior in plain product language first.
>
> • Classify the change by risk tier and blast radius.
>
> • Collect context: relevant files, similar patterns, constraints, and
> non-goals.
>
> • Ask the agent for a plan before asking for code.
>
> • Make the agent write acceptance tests and verification steps early.
>
> • Generate implementation into a branch or preview build, not directly
> into production.
>
> • Review behavior, interfaces, tests, dependencies, logs, and
> permissions – not every line equally.
>
> • Run synthetic checks, end-to-end tests, and at least one adversarial
> / abuse path.
>
> • Release gradually behind a flag with live observability.
>
> • Compact context or restart from a written plan at natural milestones
> to reduce drift.

This workflow generalizes the best parts of Erik’s approach without
making it Claude-specific. The point is not the brand of agent. The
point is the sequence: specification, planning, constrained execution,
verification, staged release, and post-release observation.

Notice what drops out of the loop: endless back-and-forth patching
inside one giant session. That is where naming drift, accidental
re-architecture, and unprincipled fixes proliferate. The more important
the task, the more the agent should be driven by a written plan artifact
rather than accumulated chat history.

## 5.2 A reusable prompt scaffold

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Task<br />
- Implement &lt;feature / fix&gt; for &lt;user / workflow&gt;.<br />
<br />
Success criteria<br />
- &lt;observable behavior 1&gt;<br />
- &lt;observable behavior 2&gt;<br />
- &lt;error behavior / edge case&gt;<br />
<br />
Constraints<br />
- Do not change &lt;core module / auth / billing / schema&gt; unless
explicitly noted.<br />
- Follow patterns from &lt;files / classes&gt;.<br />
- Prefer existing libraries already used in the repo.<br />
<br />
Risk notes<br />
- Sensitive areas: &lt;auth / PII / secrets / pricing / rate limits /
migrations&gt;.<br />
<br />
Verification<br />
- Write / update end-to-end tests for happy path, one user error, and
one system error.<br />
- List logs / metrics to inspect after deploy.<br />
- Produce a rollback note.<br />
<br />
Execution mode<br />
- First return a plan and changed-file list.<br />
- Then implement.<br />
- Then summarize what to review.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

This structure is intentionally plain. It avoids overconstraining the
model while giving it the exact kinds of context humans need on day one
in a new codebase: what good looks like, what must not change, what
patterns to copy, and how success will be judged.

## 5.3 Review the right things

> • Interfaces and contracts: routes, schemas, DB migrations,
> permissions, caching behavior.
>
> • Dependencies: any new package, network call, storage binding, or
> secret requirement.
>
> • Failure handling: timeouts, retries, null states, idempotency, and
> partial completion.
>
> • Security posture: auth checks, input validation, rate limits, secret
> exposure, data leakage.
>
> • Tests: mostly end-to-end and contract tests, not just
> implementation-shaped unit tests.
>
> • Runtime evidence: expected logs, metrics, traces, and alarms after
> release.

A useful rule of thumb: for low-risk AI changes, review behavior harder
than code; for high-risk AI changes, review behavior and interfaces
harder than code; for critical systems, review code too because the
interface alone is not enough.

# 6. How Cloudflare enables this in practice

Cloudflare’s value here is not “AI writes your code for you.” Its value
is that it supplies a production substrate where small teams can ship
fast while still getting controlled execution environments, deployment
safety, observability, security controls, state primitives, and AI
traffic governance. \[7\]\[8\]\[9\]\[10\]\[11\]\[12\]

## 6.1 Principle-to-platform map

| What the playbook needs            | Cloudflare capability                                       | Why it matters for production vibecoding                                                                                                     |
|------------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| Fast, isolated app surfaces        | Workers + Pages                                             | Lets teams ship leaf-node features, APIs, and front ends without managing servers. \[7\]\[11\]                                               |
| Safe previews before release       | Pages preview deployments + Workers Builds preview versions | Every PR can get a preview environment instead of merging blind. \[11\]                                                                      |
| Gradual rollout and rollback       | Workers versions, gradual deployments, rollbacks            | AI-written changes should almost never go from zero to 100% traffic in one move. \[11\]                                                      |
| Operational evidence               | Workers Logs, metrics, OpenTelemetry, Tail Workers          | Makes behavior observable after deploy instead of relying on intuition. \[12\]                                                               |
| AI call governance                 | AI Gateway                                                  | Adds analytics, logging, caching, rate limits, retries, fallback, DLP, and guardrails across providers. \[8\]\[9\]                           |
| Safe secret handling               | Bindings, Worker secrets, Secrets Store                     | Keeps provider keys and credentials out of source code and prompts. \[10\]                                                                   |
| Bot / abuse controls               | Turnstile + WAF rate limiting                               | Protects login, signup, generation, and API endpoints from automated abuse. \[20\]\[21\]                                                     |
| Admin / internal access control    | Cloudflare Access / Zero Trust                              | Locks preview apps, staging tools, and internal dashboards behind identity-based access. \[22\]                                              |
| Right storage for the right risk   | D1, Durable Objects, KV, R2, Hyperdrive                     | Supports explicit choices for relational state, coordination, config, object storage, and existing databases. \[13\]\[14\]\[15\]\[18\]\[19\] |
| Async work and retries             | Queues + Workflows                                          | Decouples side effects and gives durable retries for background or multi-step jobs. \[16\]\[17\]                                             |
| Persistent agents or chat sessions | Agents SDK on Durable Objects                               | Useful when the “product” itself is an agent, while still allowing any model provider. \[23\]                                                |
| Secure execution of untrusted code | Sandbox SDK                                                 | Lets you run AI-generated or user-generated code in isolated environments. \[24\]                                                            |
| Automated browser QA               | Browser Run / Browser Rendering                             | Lets teams execute smoke tests, screenshots, and browser assertions as evidence. \[25\]                                                      |

## 6.2 Deployment controls turn AI speed into something releasable

Workers has versioned deployments, gradual deployments, and rollbacks;
Pages provides preview deployments; Workers Builds can generate preview
versions for non-production branches. This is exactly the infrastructure
you need when an agent can create a lot of code very quickly. The
release move becomes: create preview, test, stage traffic slowly,
monitor, and roll back fast if needed. \[11\]

## 6.3 AI Gateway is the missing control plane for multi-provider AI apps

If the product itself uses AI, route every model call through AI
Gateway. It gives one place to observe prompts and responses, token
usage, costs, and DLP actions, while also enabling caching, rate
limiting, retries, fallback, dynamic routing, and guardrails.
Critically, this is not tied to a single model vendor; Cloudflare
documents AI Gateway as a proxy across providers such as OpenAI,
Anthropic, and others. \[8\]\[9\]

## 6.4 Bindings and secrets reduce the classic vibe-coding failure of leaked credentials

Cloudflare’s bindings model is particularly helpful because it can
expose a permissioned API without making the underlying secret directly
available to code in the same way an environment variable often is. For
secrets that must exist, Workers secrets and the newer Secrets Store
provide encrypted storage and centralized management. This directly
addresses one of the most common public vibe-coding failures: hard-coded
keys and copied credentials. \[10\]

## 6.5 Storage primitives help teams keep “leaf nodes” truly bounded

Workers KV is good for global config and read-heavy flags. Durable
Objects are good for stateful coordination with strict serializability.
D1 is good for lightweight relational application data and includes
migrations plus Time Travel point-in-time recovery. R2 covers object
storage without egress fees. Hyperdrive is the bridge when you already
have a regional Postgres or MySQL database and want Workers access with
connection pooling and acceleration. These explicit primitives make it
easier to separate a feature’s surface from the company’s core systems.
\[13\]\[14\]\[15\]\[18\]\[19\]

## 6.6 Queues, Workflows, Agents, Sandbox, and Browser Run cover the “agentic product” layer

Once the product itself becomes more agentic, you need durable steps,
retries, stateful sessions, isolated tool execution, and browser
automation. Cloudflare’s platform now spans all of those: Queues for
buffered delivery, Workflows for multi-step retriable tasks, Agents on
Durable Objects for persistent state and real-time connections, Sandbox
for isolated code execution, and Browser Run / Browser Rendering for
browser-based verification or task completion.
\[16\]\[17\]\[23\]\[24\]\[25\]

# 7. A Cloudflare-native reference architecture for “build a product with AI”

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Users<br />
-&gt; Cloudflare Pages (frontend / preview environments)<br />
-&gt; Cloudflare Workers (API + business logic)<br />
-&gt; AI Gateway -&gt; model providers (Anthropic / OpenAI / Gemini /
etc.)<br />
-&gt; D1 (app relational data)<br />
-&gt; Durable Objects (sessions, coordination, chat, locks)<br />
-&gt; KV (flags, config, routing)<br />
-&gt; R2 (uploads, generated files, artifacts)<br />
-&gt; Hyperdrive (existing Postgres / MySQL if needed)<br />
-&gt; Queues / Workflows (async jobs, retries, long-running tasks)<br />
-&gt; Sandbox / Browser Run (safe code execution and browser
verification)<br />
<br />
Security envelope: Turnstile + WAF rate limits + Access + Secrets /
Bindings<br />
Release envelope: Preview deploys + staged rollout + live logs / traces
+ rollback</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Why this works: it keeps the app layer simple enough for agents to
modify, while the platform layer handles the safety rails. Developers
can ask an AI agent to build a feature, but the feature lands inside a
runtime that already has secrets discipline, abuse protection, staged
deployment, and observability.

This architecture also remains model-agnostic. The coding agent that
writes the software can be anything. The runtime product can call any
provider through AI Gateway or direct APIs. And if the product itself
needs persistent AI behavior, the Agents SDK can still use Workers AI by
default or swap to external models. \[8\]\[23\]

# 8. Checklists and rollout plan

## 8.1 Go-live checklist for an AI-authored feature

> □ The feature has explicit acceptance criteria and a named owner.
>
> □ The risk tier is recorded.
>
> □ Preview environment exists and has been exercised.
>
> □ Secrets are stored in bindings / secrets, not source code.
>
> □ Auth, entitlement, and rate limits were tested on the real path.
>
> □ At least one abuse / adversarial path was tested.
>
> □ Logs, metrics, and alerts are defined.
>
> □ A feature flag or routing control exists where appropriate.
>
> □ Rollback path is written and tested or at least rehearsed.
>
> □ For AI products: calls go through AI Gateway unless there is a
> strong reason not to.

## 8.2 Red flags that mean “do not vibe code this directly into production”

> • Changes to authentication, authorization, billing, payments, or
> tenancy boundaries.
>
> • Large schema or migration changes with unclear rollback.
>
> • Anything that introduces new privileged integrations or stores new
> secrets.
>
> • Changes where there is no practical way to test behavior from the
> outside.
>
> • Changes where the team cannot clearly state blast radius or owner.
>
> • Anything already suffering from unclear architecture or tech debt in
> the core path.

## 8.3 A pragmatic 30 / 60 / 90-day rollout

**First 30 days:** Choose one or two Tier 1 workflows. Standardize the
AI change package. Set up preview deployments, versioned releases,
rollback, logging, secret handling, and one AI Gateway. Do not scale
agent autonomy before the paved road exists.

**Days 31-60:** Add risk tiers to engineering policy. Introduce staged
rollout defaults, a shared end-to-end test harness, and a standard
prompt scaffold. Start using D1 / Durable Objects / KV / R2
intentionally instead of ad hoc storage decisions.

**Days 61-90:** Expand to selected Tier 2 features. Add adversarial
testing, cost observability for model calls, and a small catalog of
approved agent patterns. Consider Sandbox or Browser Run for products
that execute code or need browser verification.

# Conclusion

The real lesson from Erik Schluntz’s talk is not that companies should
ship code they do not understand. It is that they should design systems
where understanding the product, the constraints, and the evidence
matters more than understanding every generated line.

In that world, the winning teams will be the ones that treat AI as an
implementation multiplier and platform engineering as the enforcement
layer. They will move fast because their deploy path is safe, not
because they are careless.

Cloudflare fits this moment unusually well because it compresses the
distance between prototype and production while still giving teams the
controls that production requires: previews, staged rollout, rollback,
observability, edge security, data primitives, AI traffic governance,
isolated execution, and browser-based verification. That is what makes
“vibecoding in production” less of a slogan and more of an operating
system.

# Appendix: source notes

These source notes correspond to the bracketed references used
throughout the playbook.

> **\[1\]** Anthropic YouTube - Vibe coding in prod \| Code w/ Claude
> (talk page; presented May 22, 2025 in San Francisco).
>
> **\[2\]** Anthropic Engineering - Building effective agents (Dec. 19,
> 2024).
>
> **\[3\]** Mirrored X post for @codewithimanshu on Sotwe, including the
> viral framing and engagement snapshot.
>
> **\[4\]** Simon Willison - Will the future of software development run
> on vibes? (Mar. 6, 2025).
>
> **\[5\]** Georgia Tech Research - Bad Vibes: AI-Generated Code is
> Vulnerable, Researchers Warn (Apr. 2026).
>
> **\[6\]** Snyk - AI Code, Security, and Trust in Modern Development
> report.
>
> **\[7\]** Cloudflare Workers overview docs.
>
> **\[8\]** Cloudflare AI Gateway overview docs.
>
> **\[9\]** Cloudflare AI Gateway features docs: guardrails, DLP,
> logging, dynamic routing, caching.
>
> **\[10\]** Cloudflare Workers docs: secrets, bindings, environments.
>
> **\[11\]** Cloudflare Workers / Pages docs: versions and deployments,
> gradual deployments, rollbacks, preview deployments, builds.
>
> **\[12\]** Cloudflare Workers docs: observability, Workers Logs,
> testing, Vitest integration.
>
> **\[13\]** Cloudflare D1 docs: overview, migrations, Time Travel,
> audit logs.
>
> **\[14\]** Cloudflare Durable Objects docs: overview, rules, SQLite
> storage, point-in-time recovery.
>
> **\[15\]** Cloudflare R2 docs: overview and how R2 works.
>
> **\[16\]** Cloudflare Queues docs: overview and how Queues works.
>
> **\[17\]** Cloudflare Workflows docs: overview and rules.
>
> **\[18\]** Cloudflare Workers KV docs: overview and how KV works.
>
> **\[19\]** Cloudflare Hyperdrive docs: overview, connection pooling,
> private database access via Tunnel and Access.
>
> **\[20\]** Cloudflare Turnstile overview docs.
>
> **\[21\]** Cloudflare WAF rate limiting docs.
>
> **\[22\]** Cloudflare One / Access docs.
>
> **\[23\]** Cloudflare Agents docs: overview and using AI models from
> any provider.
>
> **\[24\]** Cloudflare Sandbox SDK docs: overview and security model.
>
> **\[25\]** Cloudflare Browser Run / Browser Rendering docs.


---

## Cloudflare tooling addendum

*Companion brief to the main playbook. Updated April 22, 2026.*

# Executive summary

The important Cloudflare question is not “which products have AI in the
name?” It is: which Cloudflare controls let a team move implementation
work to an AI system without also moving release judgment, secret
handling, exposure control, and rollback discipline to that same system.
The answer is that Cloudflare gives you a stack that separates build,
deploy, release, runtime, state, and access control unusually well. That
is why it fits the “vibecode in production safely” thesis better than a
plain hosting platform. \[26\]\[27\]\[31\]\[32\]\[36\]\[40\]

The single biggest update since the main playbook is Flagship.
Cloudflare positions it as a native feature flag service built on
Workers, Durable Objects, and KV, compatible with the OpenFeature
standard, and evaluated fastest on Workers through a native binding. In
practice, that means the safest Cloudflare release pattern is no longer
just “deploy carefully”; it is “deploy dark, verify on preview URLs,
promote code, and expose behavior only behind flags.” \[34\]\[35\]

Wrangler is the operational spine of that workflow. It is the CLI for
Cloudflare developer products, Cloudflare recommends treating the
Wrangler configuration file as the source of truth, and modern Workers
features such as environments, preview URLs, versions, and version
uploads fit naturally into a Git-and-branch workflow. \[27\]\[31\]\[32\]

My overall recommendation is simple: let the coding agent write code,
tests, and infrastructure changes into Git; let Cloudflare handle
previewing, versioning, release gating, identity, browser automation,
sandboxed execution, async recovery, and observability; and keep
production write privileges narrower than production read privileges.
That last point is my recommendation rather than an explicit Cloudflare
policy, but it follows directly from Cloudflare’s scoped token model,
OAuth-based MCP flows, and Access controls. \[42\]\[43\]\[54\]

# 1. The core Cloudflare layers that matter for safe agent-driven shipping

## 1.1 Bootstrap and local iteration: C3, Wrangler, remote bindings, Vite, and Vitest

C3 (\`npm create cloudflare\`) is Cloudflare’s official project
bootstrapper for Workers and Pages. It sets up new applications with
official templates, and Wrangler is installed as part of the standard
workflow. That matters because a coding agent is far more reliable when
it starts from a paved template instead of an ad hoc repo skeleton.
\[26\]

Wrangler is the CLI that creates, develops, deploys, and manages Workers
projects. Cloudflare now recommends \`wrangler.jsonc\` for new projects,
and explicitly recommends treating the Wrangler configuration file as
the source of truth for Worker configuration. That is extremely useful
for AI-assisted development because the agent can reason over one
machine-readable file that defines bindings, environments, secrets
requirements, routes, and deployment behavior. \[27\]

For day-to-day development, Cloudflare recommends local development plus
remote bindings when needed. That is the right default for AI-heavy
workflows too: the agent can run code locally, but selected bindings can
point at real remote resources when correctness depends on actual
Cloudflare infrastructure. Reserve \`wrangler dev --remote\` for cases
that truly require edge-specific behavior, because remote development
uploads code to a temporary preview environment and all bindings connect
to remote resources. \[28\]

The Cloudflare Vite plugin and the Workers Vitest integration make this
safer. The Vite plugin runs code inside \`workerd\`, which matches
production behavior closely, while the Vitest integration runs tests
inside the Workers runtime itself. This is exactly the kind of
behavioral verification Erik’s talk argues for: validate the system at
the right abstraction layer instead of pretending line-by-line
inspection will scale. \[29\]\[30\]

## 1.2 Preview first, then release: versions, preview URLs, Workers Builds, and Flagship

Cloudflare Workers versions and deployments are the backbone of a safe
release path. Versions capture code and configuration together. Preview
URLs let every new Worker version get its own unique URL, and \`wrangler
versions upload\` creates a version without promoting it to production.
Workers Builds uses that exact pattern for non-production branches by
default. \[31\]\[32\]

That means an AI agent can build a feature into a branch, Workers Builds
can create a preview version, and humans or automated checks can verify
the actual running system before any production traffic shifts. Protect
those preview URLs with Cloudflare Access when the feature is sensitive;
Cloudflare explicitly supports requiring authentication for
\`workers.dev\` access. \[31\]\[32\]

Flagship is the release-layer complement to versioning. Cloudflare says
Flagship is built on Workers, Durable Objects, and KV; is compatible
with OpenFeature; can be used from Workers, Node.js, Bun, Deno, and the
browser; and can be bound directly in Wrangler as \`env.FLAGS\`. The
operational implication is important: versioning controls which code
exists, while Flagship controls who can see or execute the new behavior.
In an AI delivery workflow, that is the difference between “the agent
deployed it” and “users are actually exposed to it.” \[34\]\[35\]

My recommendation is to use both. Use version uploads and preview URLs
for build verification, then production deploys for code promotion, then
Flagship for exposure control by cohort, tenant, or operator override.
This is safer than relying on gradual traffic shifting alone, because a
flag can keep a dangerous path dormant even after the code has shipped.
\[31\]\[34\]\[35\]

## 1.3 Rollout and rollback: what Cloudflare gives you and what it does not

Cloudflare supports gradual deployments and rollbacks for Workers, and
the platform keeps up to 100 recent versions available for rollback.
That is excellent for AI-authored change because it turns “ship small”
into a first-class deployment primitive instead of a team habit.
\[31\]\[33\]

But the docs are clear about two sharp edges. First, state changes for
storage resources such as KV, R2, Durable Objects, and D1 are not
tracked with Worker versions. Second, rollbacks may be blocked when
relevant platform resources have changed, such as after a Durable Object
migration. So code rollback is not database rollback. Any playbook that
says otherwise is false comfort. \[31\]\[33\]

There is also a specific caveat for gradual deployments with static
assets: requests can receive HTML from one version that references
assets from another version, creating 404s or broken experiences. So if
a coding agent is changing an asset-heavy app, do not assume a naive
percentage rollout is safe. Either use Cloudflare’s static asset rollout
guidance carefully or prefer dark launches with Flagship at the
application layer. \[33\]

## 1.4 AI model control plane: AI Gateway and Workers AI

If the product itself uses LLMs or other models, AI Gateway should
usually be mandatory. Cloudflare describes AI Gateway as the layer that
lets you observe and control AI applications with analytics, logging,
caching, rate limiting, request retries, and model fallback. It also
supports custom providers, which means you can preserve the same control
plane even when your preferred model vendor is not natively listed.
\[36\]\[38\]

The safety value is straightforward. AI Gateway becomes the choke point
where you can cap cost, see abuse, compare providers, and keep a
provider-agnostic runtime architecture. Its guardrails feature inspects
prompts and model responses for harmful content, and its DLP feature
scans both incoming prompts and outgoing responses for sensitive
information. Those are the kinds of controls teams tend to promise in
architecture docs and forget in implementation; Cloudflare gives them as
platform features. \[37\]

Cloudflare also exposes AI Gateway through Worker bindings. The
\`env.AI.run()\` API can route both Workers AI models and third-party
models through AI Gateway. Cloudflare notes that third-party models
through the AI binding require AI Gateway and unified billing, while
bring-your-own-keys flows should use the REST or chat-completions
endpoints instead. \[39\]

Workers AI then covers the “models hosted on Cloudflare” case.
Cloudflare describes it as serverless model execution on GPUs across its
network, callable from Workers, Pages, or the API. For teams that do not
need a specific external provider, that reduces operational surface area
even further. \[40\]

## 1.5 Agent runtime and tool connectivity: Agents SDK, MCP, Browser Run, and Sandbox SDK

Cloudflare’s Agents SDK matters because it is not just a model wrapper.
Each agent runs on a Durable Object, with built-in state, SQL storage,
WebSocket connectivity, and scheduling. Cloudflare also emphasizes that
you can swap in OpenAI, Anthropic, Gemini, or other providers. That
makes the platform model-agnostic in the way you asked for: the playbook
is about safe agentic delivery, not about a single coding model. \[41\]

Cloudflare’s MCP support is now deep enough to treat as part of the
production stack, not just a demo feature. Cloudflare documents MCP as
the open standard that connects AI systems to tools. It offers managed
remote MCP servers for Cloudflare account operations, a Cloudflare
Skills plugin that bundles Cloudflare MCP servers and contextual skills
for coding agents, and guides for building your own authenticated remote
MCP servers on Workers. \[42\]

This is powerful, but it is also the place where teams can get careless.
A coding agent with broad write access to account infrastructure is not
“autonomous engineering”; it is an unbounded production actor. My
recommendation is staged privilege: read-only MCP access in production
by default, write access in staging, and production changes promoted
through CI or explicit human approval. That is a recommendation, not a
Cloudflare rule, but it follows directly from the fact that Cloudflare’s
managed MCP servers can make changes across your account and
Cloudflare’s token model is scopeable by permission and resource.
\[42\]\[54\]

Browser Run extends this further by giving agents browser automation,
screenshots, PDF generation, and test-like interactions through headless
browsers. Cloudflare explicitly documents using Browser Run through MCP
clients so AI coding agents can control browser sessions via the Chrome
DevTools Protocol. This is the most practical way to turn an
AI-generated change into a verifiable UI behavior rather than a diff
that someone hopes is correct. \[44\]

Sandbox SDK is the answer when the agent or the product needs to execute
untrusted code. Cloudflare describes it as isolated code execution built
on Containers, with APIs for commands, files, background processes, and
exposed services. That makes it the right complement when an agent needs
a tool that would otherwise be too dangerous to run in-process inside
the main application Worker. \[45\]

## 1.6 State, search, and recovery: Durable Objects, D1, Queues, Workflows, AI Search, Vectorize, R2, Hyperdrive, and service bindings

Durable Objects are still one of Cloudflare’s strongest primitives for
agentic systems. Cloudflare positions them as the coordination layer for
applications that need shared state or serialization, and notes that
SQLite-backed Durable Objects are generally available. For multi-step
agents, chat sessions, shared cursors, or one-agent-per-tenant patterns,
that is a very natural fit. \[46\]

D1 gives you serverless SQL, but the important safety feature is Time
Travel. Cloudflare states that Time Travel restores to any minute within
the last 30 days, is always on, and creates bookmarks automatically.
Combined with migration tracking in the \`d1_migrations\` table, this
makes D1 a better choice than many teams assume for AI-assisted
iteration, as long as schema changes are still handled deliberately.
\[47\]

Queues and Workflows cover two different reliability problems. Queues
provide guaranteed delivery with at-least-once semantics, default
retries, and dead-letter queue support. Workflows provide durable
multi-step execution with automatic retries and persisted state for
minutes, hours, or weeks. If a coding agent is creating background jobs,
imports, syncs, or multi-stage tasks, those should usually land in
Queues or Workflows instead of an ad hoc retry loop inside request code.
\[48\]\[49\]

AI Search and Vectorize cover the retrieval side. Cloudflare describes
AI Search as a managed search service for applications and agents,
including natural language search over websites, R2 buckets, and
uploaded documents. It also documents the migration from the older
AutoRAG endpoints to the newer AI Search API. Vectorize remains the
globally distributed vector database layer for embeddings and semantic
retrieval. Use AI Search when you want a managed retrieval product; use
Vectorize when you want tighter control over the vector layer.
\[50\]\[51\]

R2 and Hyperdrive fill the remaining gaps. R2 is Cloudflare’s object
storage layer, while Hyperdrive accelerates access from Workers to
existing external databases. And when one Worker needs to call another,
Cloudflare’s own best-practices docs say to use service bindings instead
of public HTTP: they are zero-cost, bypass the public Internet, and
support type-safe RPC. That is the right pattern for keeping an
AI-modified architecture internally composable without accidentally
publishing internal service surfaces. \[52\]\[53\]\[56\]

## 1.7 Secrets, identity, abuse control, and observability

Cloudflare gives you two main secret layers. Worker secrets are
per-Worker encrypted bindings for values like API keys, while Secrets
Store is a centralized account-level secret store that can be bound into
Workers. Cloudflare’s best-practices guidance is explicit: keep secrets
out of source and Wrangler configuration, and use secret bindings
instead. \[53\]

For identity and internal access, Cloudflare Access and Tunnel are the
important pieces. Access can sit in front of self-hosted applications,
while Tunnel connects private infrastructure to Cloudflare without
exposing a public IP. Service tokens let automated systems authenticate
to Access-protected applications, and Cloudflare API tokens can be
scoped by permissions and by specific resources. That makes
least-privilege operational flows practical rather than aspirational.
\[54\]

Cloudflare’s newer AI controls are especially relevant when you connect
agents to internal tools. MCP server portals give users a unified way to
reach multiple MCP servers, and the Linked App Token feature lets an MCP
server call downstream self-hosted applications while propagating user
identity through Access. In other words, you can connect an agent to
internal company systems without flattening your permission model.
\[43\]

On the abuse side, Turnstile protects forms and sensitive actions
without forcing a traditional CAPTCHA experience, and WAF rate limiting
rules let you protect expensive or high-risk endpoints such as login,
signup, and API entry points. When AI makes feature creation cheaper,
these controls matter even more, because teams will spin up more
endpoints and more agent-facing actions. \[55\]

For observability, Cloudflare gives you Workers Logs, OpenTelemetry
export, Tail Workers, and Workers Analytics Engine. New Workers have
observability enabled by default, logs can be exported to OTLP
destinations, Tail Workers let you process events after invocations, and
Analytics Engine is the place to write high-cardinality product
telemetry without choking an external pipeline. This is the minimum
viable evidence layer for AI-built features in production. \[56\]

# 2. Recommended Cloudflare operating patterns for “vibecoding in production”

## Pattern A: Safe AI coding-agent workflow for application changes

- 1\) Start from a C3 or existing Wrangler-managed project, not an
  unstructured repo. \[26\]\[27\]

- 2\) Give the coding agent repository context and, where useful,
  read-only Cloudflare MCP access for discovery. Treat production write
  access as exceptional. \[42\]\[54\]

- 3\) Develop locally with realistic bindings; use remote bindings
  selectively and remote development only for behaviors that really
  require Cloudflare’s network. \[28\]

- 4\) Require tests to run in the Workers runtime with Vitest and, for
  UI features, use Browser Run to verify the actual user flow.
  \[29\]\[44\]

- 5\) Upload a preview version, verify it on a preview URL, and protect
  the preview with Access if the feature is sensitive. \[31\]\[32\]

- 6\) Deploy production code only after preview verification, but keep
  the new behavior dark behind Flagship until metrics look good.
  \[34\]\[35\]

- 7\) Ramp exposure with Flagship and, where appropriate, version-level
  gradual deployments. Keep in mind that code rollback does not revert
  storage state. \[31\]\[33\]

## Pattern B: Safe runtime architecture for AI-powered product features

- Put the product entrypoint in Workers, put model calls behind AI
  Gateway, store short-lived or coordinated state in Durable Objects,
  use D1 or Hyperdrive for relational data, R2 for large objects, Queues
  for guaranteed delivery, and Workflows for multi-step durable jobs.
  Use AI Search or Vectorize only where retrieval is truly needed.
  \[36\]\[40\]\[46\]\[47\]\[48\]\[49\]\[50\]\[51\]\[52\]

- In plain English: Workers handle requests, AI Gateway handles model
  traffic, Durable Objects and D1 handle state, and Workflows handle
  anything you cannot afford to lose if the request path ends early.
  That is the architecture that makes AI-authored code survivable.
  \[36\]\[46\]\[47\]\[49\]

## Pattern C: Secure agent access to internal tools and data

- If the agent needs internal tools, publish them behind Access, connect
  origins through Tunnel where needed, use service tokens for
  machine-to-machine access, and prefer self-hosted or OAuth-protected
  MCP servers rather than unauthenticated ones. If the MCP server must
  call downstream internal apps on behalf of the user, use Cloudflare’s
  Linked App Token pattern so the user’s identity survives the tool
  chain. \[43\]\[54\]

- This is the crucial distinction between “an agent can reach the tool”
  and “an agent can safely reach the tool in the correct user context.”
  Cloudflare is one of the few platforms that now documents that second
  problem directly. \[43\]

## Pattern D: Isolation for dangerous capabilities

- Use Sandbox SDK for untrusted code execution. Use Browser Run for
  browser automation. Do not let the main application Worker execute
  arbitrary user-supplied code directly, and do not let an agent browse
  the web from a privileged environment when Browser Run can give you a
  more isolated, observable path. \[44\]\[45\]

# 3. The safest default Cloudflare stack, by maturity level

## Level 1: Small team shipping AI-assisted features into a normal web app

Use C3 or Wrangler, local dev with selected remote bindings, Vitest in
the Workers runtime, preview URLs, Access-protected previews when
needed, production secrets via bindings, Workers Logs, Turnstile on
sensitive forms, and WAF rate limits on expensive endpoints. This is the
minimum stack that turns “AI wrote some code” into “the team can
actually watch it behave.” \[26\]\[28\]\[29\]\[31\]\[53\]\[55\]\[56\]

## Level 2: Team building an AI-powered product

Add AI Gateway for every runtime model call, Flagship for dark launches
and cohort-based release, D1 or Durable Objects for managed state,
Queues or Workflows for durable async tasks, and Analytics Engine for
high-cardinality usage telemetry. This is where Cloudflare becomes a
control plane rather than just a host.
\[34\]\[36\]\[46\]\[47\]\[48\]\[49\]\[53\]\[56\]

## Level 3: Team building product agents or giving agents tool access

Add the Agents SDK, Browser Run, Sandbox SDK, AI Search or Vectorize
where retrieval is needed, and Access-protected MCP connectivity for
internal tools. At this level, do not skip permission design. The
question is no longer whether the agent can use tools, but whether tool
use is identity-aware, observable, reversible, and bounded.
\[41\]\[42\]\[43\]\[44\]\[45\]\[50\]\[51\]\[54\]

# 4. Common Cloudflare-specific footguns to avoid

- Do not assume a Worker rollback restores KV, R2, Durable Objects, or
  D1 state. It does not. \[31\]\[33\]

- Do not use \`wrangler dev --remote\` casually against production
  resources just because it is convenient. Cloudflare recommends local
  development plus remote bindings for most tasks. \[28\]

- Do not treat percentage rollouts as harmless when static assets are
  involved. Cloudflare documents asset mismatch risks during gradual
  rollouts. \[33\]

- Do not give a coding agent broad, write-capable Cloudflare account
  access unless you are intentionally building an approval-heavy
  operational agent. Prefer read-mostly discovery in production and
  narrower write scopes elsewhere. This is my recommendation based on
  Cloudflare’s token and Access model. \[42\]\[54\]

- Do not put secrets in source or plain configuration. Use Worker
  secrets or Secrets Store. \[53\]

- Do not expose internal tools or MCP servers directly when Access,
  Tunnel, service tokens, or Linked App Tokens can preserve
  authentication and identity. \[43\]\[54\]

- Do not let the main Worker execute untrusted code when Sandbox SDK
  exists specifically for that isolation problem. \[45\]

- Do not ship AI runtime traffic directly to providers from production
  if AI Gateway would give you the missing controls you are otherwise
  going to re-implement badly. \[36\]\[37\]\[38\]

# 5. Bottom line

Cloudflare does not eliminate the need for engineering judgment. What it
does exceptionally well is make judgment attach to the right layer. The
coding agent can move fast on implementation. Cloudflare can hold the
line on release control, provider abstraction, secrets, identity, tool
connectivity, durable execution, and observability.
\[27\]\[31\]\[34\]\[36\]\[41\]\[54\]\[56\]

That is why the deepest Cloudflare answer to “how do we vibecode in
production safely?” is not “use one AI product.” It is: use Wrangler and
previews for build discipline, Flagship for release discipline, AI
Gateway for model discipline, Access and Tokens for permission
discipline, Sandbox and Browser Run for tool discipline, Workflows and
Queues for recovery discipline, and Logs plus Analytics for evidence.
When those layers are in place, AI can write a lot more of the system
without also inheriting permission to silently break it.
\[31\]\[34\]\[36\]\[41\]\[43\]\[44\]\[45\]\[48\]\[49\]\[54\]\[56\]

# Appendix: source notes

These notes correspond to the bracketed references used throughout this
addendum.

\[26\] Cloudflare Workers get started docs and C3 / create-cloudflare
guidance.

\[27\] Cloudflare Wrangler docs: overview, configuration,
source-of-truth guidance, environments, install/update, commands.

\[28\] Cloudflare Workers development and testing docs: local
development, remote bindings, remote development.

\[29\] Cloudflare Workers testing docs: Vitest integration.

\[30\] Cloudflare Workers Vite plugin docs.

\[31\] Cloudflare Workers docs: versions and deployments, preview URLs,
workers.dev access controls.

\[32\] Cloudflare Workers Builds docs: Git integration, preview builds,
deploy commands, build branches.

\[33\] Cloudflare Workers docs: rollbacks, gradual deployments, and
static-assets gradual rollout caveats.

\[34\] Cloudflare blog: Introducing Flagship: feature flags built for
the age of AI (Apr. 17, 2026).

\[35\] Cloudflare Flagship docs: overview, concepts, configuration, and
OpenFeature SDK.

\[36\] Cloudflare AI Gateway docs: overview and feature overview.

\[37\] Cloudflare AI Gateway docs: guardrails and DLP.

\[38\] Cloudflare AI Gateway docs: fallbacks, request handling, and
custom providers.

\[39\] Cloudflare AI Gateway docs: Workers binding methods /
\`env.AI.run()\`.

\[40\] Cloudflare Workers AI overview docs.

\[41\] Cloudflare Agents docs: overview and configuration.

\[42\] Cloudflare Agents docs: MCP overview, Cloudflare managed MCP
servers, Cloudflare Skills plugin, remote MCP server guide.

\[43\] Cloudflare One AI controls docs: MCP server portals and Linked
App Token for MCP-to-self-hosted app access.

\[44\] Cloudflare Browser Run docs, including MCP client / CDP usage and
Browser Rendering rename.

\[45\] Cloudflare Sandbox SDK docs.

\[46\] Cloudflare Durable Objects overview docs.

\[47\] Cloudflare D1 docs: migrations and Time Travel / backups.

\[48\] Cloudflare Queues docs: overview, delivery guarantees, batching,
retries, and DLQ behavior.

\[49\] Cloudflare Workflows overview docs.

\[50\] Cloudflare AI Search docs: overview, get started, and AutoRAG
migration guidance.

\[51\] Cloudflare Vectorize overview docs.

\[52\] Cloudflare R2 overview docs and Workers API usage/docs.

\[53\] Cloudflare Workers secrets docs, Secrets Store docs, and Workers
best practices on secret handling and bindings.

\[54\] Cloudflare Access / Tunnel / service token / API token docs.

\[55\] Cloudflare Turnstile docs and WAF rate limiting docs.

\[56\] Cloudflare Workers observability docs, Workers Logs, Tail
Workers, and Workers Analytics Engine docs.
