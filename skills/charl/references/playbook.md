# Safe Delivery Playbook

## Table of Contents

- Core thesis
- Execution modes
- Capability check
- What to preserve from the source material
- Risk tiers
- AI change package
- Deployment authority matrix
- Team responsibilities
- Developer loop
- Prompt scaffold
- Non-interactive rollout
- Handoff contract
- Review focus
- Go-live checklist
- Red flags
- 30/60/90 rollout

## Core Thesis

Production vibecoding is not blind trust in AI-generated code. It is a delivery
system where architecture boundaries, acceptance tests, runtime controls,
observability, and rollback paths are stronger than the model's mistakes.

Optimize for:

- Verification over diff-reading
- Blast radius over surface-level "leaf node" labels
- Behavior and evidence over rhetoric about autonomy
- Platform guardrails over individual heroics

## Execution Modes

Make the operating mode explicit before work starts:

| Mode | Environment | Release owner | Default assumption |
| --- | --- | --- | --- |
| `human-local` | Human workstation | Human | Interactive development and promotion are available |
| `human-remote` | Sandbox or remote VM with human oversight | Human | Agent can build evidence; human owns promotion |
| `autonomous-remote` | Unattended sandbox or remote VM | Policy-defined | Agent can build, test, preview, and prepare release; promotion is constrained |
| `autonomous-deployer` | Unattended environment with explicit deploy rights | Policy-defined | Agent may promote only if authority, evidence, and rollback all exist |

If the mode is not known, the correct action is to stop and ask for that
information or report it as a blocker.

## Capability Check

Run this check before implementation or release:

- Repository access: can the operator read and write the expected files?
- Cloudflare auth: does the operator have the minimum required scope?
- Preview path: can the operator deploy to preview or staging first?
- Verification path: can the operator run tests, browser checks if needed, and
  inspect logs, metrics, and traces?
- Rollback path: are both code and state rollback constraints understood?
- Secrets path: is there a real secret source, not an inline or invented one?
- Promotion authority: who is allowed to widen production exposure?

If any required capability is missing, fail closed.

## What to Preserve From the Source Material

Keep these ideas central:

- The real bottleneck is verification, not typing.
- Humans should operate as product owner, architect, and verifier rather than
  line-by-line typist.
- The model needs onboarding: constraints, examples, patterns, and evaluation
  targets.
- Large AI-authored changes become acceptable only when the surrounding system
  makes them legible.

Correct these common mistakes:

- Do not mistake "UI edge" for "small blast radius".
- Do not assume a bounded feature is safe if it still touches auth, billing,
  entitlements, analytics, or retention.
- Do not expand AI autonomy faster than the organization's test, deploy,
  observability, and rollback maturity.

## Risk Tiers

| Tier | Typical scope | AI autonomy | Human review standard | Release rule |
| --- | --- | --- | --- | --- |
| 0 | Prototype, internal toy, throwaway experiment | High | Spot-check outputs | Never connect directly to production users or data |
| 1 | Leaf-node UI, content transforms, internal tools, non-critical workflows | High | Review tests, behavior, logs, and permissions | Use preview, exposure control, and rollback |
| 2 | Customer-facing app logic with bounded data access | Medium | Review interfaces, auth path, dependencies, tests, observability, and rollback plan | Use staged rollout with a named owner |
| 3 | Auth, billing, payments, shared schema, core architecture, compliance-sensitive systems | Low | Deep human design and implementation review | AI assists, but does not drive unsupervised merges |

Use the blast radius, not just the dependency tree, as the deciding factor.

## AI Change Package

Require an explicit package for any non-trivial AI-authored change:

- Goal and acceptance criteria
- Files or surfaces expected to change
- Risk notes for auth, PII, secrets, dependencies, pricing, rate limits,
  migrations, abuse, and operational cost
- Verification plan covering end-to-end, contract, synthetic, and adversarial
  checks
- Observability plan covering logs, metrics, traces, alerts, and dashboards
- Rollback plan covering both code and state

Use this rule:

- No autonomous code without autonomous evidence.

If the model writes a large change, it should also produce the tests, release
notes, observability hooks, and rollback guidance needed to judge that change.

## Deployment Authority Matrix

Use this matrix as the default action boundary:

| Mode | Tier 0 | Tier 1 | Tier 2 | Tier 3 |
| --- | --- | --- | --- | --- |
| `human-local` | Build and release if requested | Build and release with evidence and rollback | Build and preview; production requires explicit owner review | Assist only |
| `human-remote` | Build and release with human promotion | Build, preview, and release with explicit human approval | Build and preview; human promotion required | Assist only |
| `autonomous-remote` | Build and release only if verification and rollback exist | Build, test, preview, and dark-launch if policy allows | Build, test, preview, and stage only | Assist only |
| `autonomous-deployer` | Build and release if all gates pass | Build, preview, dark-launch, and progressively expose if policy allows | Promote only with explicit authority, observability, and rollback access | Assist only |

Two rules override everything:

- Tier 3 never gets unattended release.
- Missing authority means stop, do not improvise.

## Team Responsibilities

Split responsibilities intentionally:

- Platform and infrastructure own the paved road: templates, secrets defaults,
  preview environments, deploy protections, test harnesses, migration
  workflows, observability, and approved libraries.
- Security owns guardrails: threat models, appsec checks, secret scanning,
  dependency policy, and approval requirements.
- Product teams own the spec, user behavior, acceptance tests, and
  domain-specific correctness.

Without this split, each team invents its own safety model and misses different
failure modes.

## Developer Loop

Follow this order:

1. Detect the execution mode and release owner.
2. Run the capability check.
3. Define desired behavior in plain product language.
4. Classify the change by risk tier and blast radius.
5. Collect context: relevant files, patterns, constraints, non-goals, and
   failure concerns.
6. Ask for a plan before asking for code.
7. Make the agent write acceptance tests and verification steps early.
8. Generate into a branch or preview build, not directly into production.
9. Review behavior, interfaces, dependencies, logs, and permissions.
10. Run synthetic checks, end-to-end tests, and at least one abuse-path check.
11. Release gradually behind an exposure control with live observability.
12. Restart from a written plan at major milestones to reduce context drift.

## Prompt Scaffold

Use or adapt this scaffold when briefing the coding agent:

```text
Execution mode
- <human-local | human-remote | autonomous-remote | autonomous-deployer>

Authority
- Production promotion owner: <person / team / policy>

Capabilities
- Repo write: <yes / no>
- Cloudflare auth scope: <what is available>
- Preview path: <yes / no>
- Verification path: <tests / browser / logs / metrics / traces>
- Rollback path: <code / state>

Task
- Implement <feature / fix> for <user / workflow>.

Success criteria
- <observable behavior 1>
- <observable behavior 2>
- <error behavior / edge case>

Constraints
- Do not change <core module / auth / billing / schema> unless explicitly noted.
- Follow patterns from <files / classes>.
- Prefer libraries already used in the repo.

Risk notes
- Sensitive areas: <auth / PII / secrets / pricing / rate limits / migrations>.

Verification
- Write or update end-to-end tests for happy path, one user error, and one
  system error.
- List the logs and metrics to inspect after deploy.
- Produce a rollback note.

Execution mode
- First return a plan and changed-file list.
- Then implement.
- Then summarize what to review.
```

## Non-Interactive Rollout

For `autonomous-remote` and `autonomous-deployer`, use this release sequence:

1. Build or update the change in Git.
2. Run required tests and capture artifacts.
3. Deploy to preview or staging first.
4. Run preview verification, including browser checks when the path is user
   facing.
5. Confirm logs, metrics, and traces exist and are inspectable.
6. Prepare the rollback note for both code and state.
7. If the authority matrix allows it, promote behind a dark launch or staged
   exposure control.
8. Observe production telemetry before widening exposure.

If any step cannot be completed, stop and hand off.

## Handoff Contract

When the current operator cannot safely continue, return a handoff package with:

- Execution mode detected
- Risk tier and blast radius
- What was completed
- What is blocked
- Missing capabilities or permissions
- Preview URL or branch
- Test and verification results
- Required next action for the next human or agent
- Rollback note

## Review Focus

Review the following harder than raw code volume:

- Interfaces and contracts: routes, schemas, migrations, permissions, caching
- Dependencies: new packages, network calls, secrets, storage, model providers
- Failure handling: retries, idempotency, null states, partial completion
- Security posture: auth checks, input validation, rate limits, data leakage
- Tests: end-to-end and contract tests over implementation-shaped unit tests
- Runtime evidence: logs, metrics, traces, alarms, and post-release inspection

Rule of thumb:

- Low risk: review behavior harder than code.
- High risk: review behavior and interfaces harder than code.
- Critical systems: review code too.

## Go-Live Checklist

- The feature has explicit acceptance criteria and a named owner.
- The risk tier is recorded.
- A preview environment exists and has been exercised.
- Secrets live in bindings or secret stores, not source code.
- Auth, entitlement, and rate limits were tested on the real path.
- At least one abuse or adversarial path was tested.
- Logs, metrics, and alerts are defined.
- A feature flag or routing control exists where appropriate.
- A rollback path exists and has been tested or rehearsed.
- For AI products, runtime model calls go through a control plane.

## Red Flags

Do not ship directly into production when the change includes:

- Authentication, authorization, billing, payments, or tenancy boundaries
- Large schema or migration changes without a clear rollback story
- New privileged integrations or new secrets storage
- Behavior that cannot be tested from the outside
- Unclear blast radius or missing ownership
- Existing core-path tech debt that the team already struggles to reason about

## 30/60/90 Rollout

Use this adoption plan:

- First 30 days: Pick one or two Tier 1 workflows. Standardize the AI change
  package. Stand up previews, rollback, logging, secrets handling, and the
  runtime AI control plane before scaling autonomy.
- Days 31-60: Add risk tiers to engineering policy. Introduce staged rollout
  defaults, a shared end-to-end test harness, and a standard prompt scaffold.
- Days 61-90: Expand to selected Tier 2 features. Add adversarial testing, cost
  observability for model calls, and a small catalog of approved agent patterns.
