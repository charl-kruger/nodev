# Operating Modes

`nodev` is built around one simple rule:

The same change is not equally safe in every environment.

That is why the skill starts by detecting the execution mode.

## New In This Version

- Unknown mode no longer stalls planning, review, architecture, or policy work.
- Unknown mode still blocks implementation, deployment, production promotion,
  and authority-expanding actions.
- Release recommendations must separate evidence, assumptions, blockers, and
  recommendations.
- Current Cloudflare product behavior must use the local snapshot date or be
  verified against official Cloudflare sources.

## The Four Modes

### `human-local`

The human and agent are working on the same workstation.

Typical shape:

- interactive development
- direct repo access
- local testing
- human-controlled deployment

Default stance:

- implementation is usually straightforward
- production release can be allowed for lower-risk work if preview, evidence,
  and rollback exist

### `human-remote`

The agent is running in a sandbox or remote VM, but a human still owns final
promotion.

Typical shape:

- remote execution
- human review of evidence
- preview and staging are normal
- promotion is intentional and explicit

Default stance:

- the agent can build, test, and prepare release
- the human should own the final move into production for meaningful changes

### `autonomous-remote`

The agent is unattended and runs in a sandbox or remote VM, but it does not
have broad production authority.

Typical shape:

- unattended CI-like or sandbox workflow
- preview deploys
- evidence generation
- constrained release path

Default stance:

- the agent may build, test, preview, and prepare handoff
- production promotion is limited and often blocked

### `autonomous-deployer`

The agent is unattended and has explicit deploy rights plus the ability to
observe the result.

Typical shape:

- short-lived machine identity
- scoped production authority
- telemetry access
- rollback access

Default stance:

- promotion is allowed only when the authority matrix, verification gates, and
  rollback requirements are all satisfied

## Capability Check

Before trusting the current mode, `nodev` expects a capability check:

- repo read/write access
- Cloudflare authentication with minimum required scope
- preview deployment path
- logs, metrics, and traces
- rollback understanding for code and state
- safe secret source
- named production promotion owner

If one of these is missing, the correct behavior is to stop and hand off.

## Why This Matters

Without modes, AI delivery gets sloppy.

Teams start acting as if:

- every agent has the same permissions
- every remote environment is equivalent to a laptop
- preview and production are morally interchangeable
- missing authority can be worked around with confidence

That is exactly what `nodev` is trying to prevent.

## Practical Rule

If you do not know the mode, you do not know what the operator is allowed to
do.

That means you do not yet know whether the change is safe to release.

For planning-only work, Nodev may still return a conservative plan. That plan
must name the unknown mode, assume no production promotion authority, and list
the facts needed before implementation or deployment can proceed.

Next:

- [Common Workflows](./common-workflows.md)
- [How To Use Nodev](./how-to-use-nodev.md)
- [What Nodev Does](./what-nodev-does.md)
