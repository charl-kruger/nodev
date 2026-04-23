# Common Workflows

This document shows what `charl` looks like when used well.

## Workflow 1: Human On A Laptop Shipping A Small Workers Feature

Mode:

- `human-local`

Typical request:

- "Use `$charl` to review a Tier 1 Workers feature before production."

What the skill should do:

1. Confirm the mode and release owner
2. Check preview path, logs, metrics, and rollback
3. Classify the feature as Tier 1 or Tier 2
4. Recommend preview, staged exposure, and explicit observability checks
5. Return a release recommendation and any blockers

Why this is useful:

- it stops the team from treating a small feature as "obviously safe"
- it also stops the team from over-bureaucratizing a low-risk release

## Workflow 2: Remote Agent Builds And Previews, Human Promotes

Mode:

- `human-remote`

Typical request:

- "Use `$charl` to decide what this sandboxed agent can do before handing off to
  a human for release."

What the skill should do:

1. Confirm that the remote agent has repo and preview access
2. Confirm that final production promotion belongs to a human
3. Require tests, preview verification, logs, and rollback notes
4. Return a handoff package with preview URL, test results, and open risks

Why this is useful:

- it turns remote-agent output into something a human can trust quickly
- it prevents the human from reviewing a giant diff with no operational context

## Workflow 3: Autonomous Remote Agent Without Production Authority

Mode:

- `autonomous-remote`

Typical request:

- "Use `$charl` to tell me whether this unattended agent can deploy or must
  stop after preview."

What the skill should do:

1. Check authority first
2. Allow build, test, preview, and evidence collection if capabilities exist
3. Block broad production promotion for Tier 2+ changes without explicit deploy
   authority
4. Produce a handoff package instead of improvising

Why this is useful:

- it turns the absence of authority into a clean state, not an awkward failure

## Workflow 4: Autonomous Deployer With Scoped Rights

Mode:

- `autonomous-deployer`

Typical request:

- "Use `$charl` to govern a progressive rollout for this AI-authored feature."

What the skill should do:

1. Confirm explicit deploy authority
2. Confirm telemetry and rollback access
3. Require preview verification first
4. Recommend a dark launch or gradual exposure path
5. Stop if state rollback is unclear or observability is missing

Why this is useful:

- it lets the system move fast without pretending the deployer is omniscient

## Workflow 5: Critical System Change That Must Not Be Automated

Mode:

- any mode

Typical request:

- "Use `$charl` to assess an auth, billing, or shared schema change."

What the skill should do:

1. Classify it as Tier 3
2. Refuse unattended release
3. Narrow the agent’s role to analysis, implementation assistance, or evidence
   preparation
4. Return the safest next human-owned action

Why this is useful:

- it makes "no" operationally useful instead of merely conservative

## The Pattern Behind All Five

The best use of `charl` is not "tell me what to do."

It is:

- "tell me what this operator, in this environment, with this authority, can
  safely do next"

That is the behavior that makes AI-assisted shipping usable in real production
systems.
