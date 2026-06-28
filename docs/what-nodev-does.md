# What Nodev Does

`nodev` is a Cloudflare-focused delivery governance skill for AI-authored
software changes and AI-powered products.

It is not a generic coding helper. It is a decision framework that tells an
agent what it can safely do next.

## New In This Version

Nodev now behaves more like a production safety system than a static prompt:

- It routes to detailed references only when their trigger applies.
- It can continue planning when execution mode is unknown, while blocking
  implementation, deployment, and production promotion.
- It records evidence, assumptions, blockers, and recommendations separately.
- It maps common missing-capability cases to planning-only, preview-only,
  handoff, or hard block outcomes.
- It requires current Cloudflare claims to use the April 23, 2026 local
  snapshot date or fresh official Cloudflare verification.
- It includes golden cases for behavior validation.

## The Job Of The Skill

When `nodev` is invoked, it is supposed to do these things in order:

1. Detect the execution mode
2. Check capabilities and authority
3. Classify the change by risk tier and blast radius
4. Choose the relevant Cloudflare controls
5. Define verification gates and rollback expectations
6. Stop and hand off if the current operator should not continue

That sequence is the value of the skill. It prevents an agent from jumping
directly from "I can write code" to "therefore I should deploy code."

## What Nodev Produces

The skill’s default output shape is:

- Execution mode
- Capability check
- Risk tier
- Blast radius
- Required Cloudflare controls
- Verification gates
- Rollout and rollback
- Evidence ledger
- Open risks
- Handoff

This is intentional. It keeps the result useful whether the next actor is:

- a human reading the plan
- an agent implementing the plan
- an autonomous operator deciding whether it is allowed to continue

## What Nodev Evaluates

### Execution Mode

`nodev` makes the operator type explicit:

- `human-local`
- `human-remote`
- `autonomous-remote`
- `autonomous-deployer`

The same change may be acceptable in one mode and blocked in another.

### Capability Check

Before implementation or promotion, the skill expects answers to questions like:

- Can this operator write to the repo?
- Does it have Cloudflare auth with the right scope?
- Is there a preview path?
- Can it inspect tests, logs, metrics, and traces?
- Is rollback understood for both code and state?
- Is there a real secret source?
- Who owns production promotion?

If the answer is unclear, `nodev` is supposed to fail closed.

For planning, review, architecture, or policy work, an unknown mode may produce
a planning-only answer. That posture does not authorize implementation,
deployment, production promotion, or expanded authority.

### Risk Tier

`nodev` separates work into four tiers:

- `Tier 0`: throwaway, internal, or prototype work
- `Tier 1`: bounded and low-risk work
- `Tier 2`: customer-facing logic with meaningful blast radius
- `Tier 3`: critical systems like auth, billing, payments, shared schema, or
  compliance-sensitive paths

### Cloudflare Controls

The skill maps the change to the smallest useful control set:

- Workers Builds, Preview URLs, and staged release
- staged exposure
- feature flags and Flagship
- AI Gateway
- Access
- governed MCP access for internal tools when needed
- secrets and bindings
- D1, Durable Objects, R2, KV, Hyperdrive
- Queues and Workflows
- Browser Run
- Dynamic Workers
- Sandbox

### Handoff

This is one of the most important parts of the skill.

If the current operator cannot safely continue, `nodev` is supposed to return a
usable handoff package instead of bluffing through the missing capability.

That is what makes it suitable for both humans and autonomous agents.

### Evidence Ledger

For Tier 1+ work, remote/autonomous operators, production exposure, or any
recommendation that says work may continue, `nodev` distinguishes:

- evidence
- assumptions
- blockers
- recommendations

That makes release recommendations auditable instead of rhetorical.

## What Nodev Does Not Do

`nodev` does not guarantee correctness.

It does not replace:

- engineering judgment
- code review where code review is still necessary
- product ownership
- security review for critical systems
- actual Cloudflare platform access

It is a release-governance skill, not magic.

Next:

- [How To Use Nodev](./how-to-use-nodev.md)
- [Operating Modes](./operating-modes.md)
- [Common Workflows](./common-workflows.md)
