---
description: Use the Charl skill to design or review safe production delivery for an AI-authored Cloudflare change
argument-hint: [feature, change, system, or rollout to analyze]
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit, WebFetch]
---

# Use Charl

## Arguments

The user invoked this command with: $ARGUMENTS

## Instructions

When this command is invoked:

1. Read `skills/charl/SKILL.md` first.
2. Read `skills/charl/references/playbook.md` when you need the operating
   model, risk tiers, AI change package, review focus, or rollout guidance.
3. Read `skills/charl/references/cloudflare-tooling.md` when you need detailed
   Cloudflare control selection, release patterns, storage choices, or
   platform-specific footguns.
4. Read `skills/charl/references/cloudflare-current-stack.md` when you need the
   latest Cloudflare defaults for build, preview, AI routing, Browser Run,
   Dynamic Workers, Sandbox, or governed MCP access.
-5. Detect the execution mode first: `human-local`, `human-remote`,
   `autonomous-remote`, or `autonomous-deployer`.
6. Run the capability check before suggesting implementation or release steps.
7. Classify the request by risk tier and actual blast radius.
8. Fail closed when required authority, preview verification, telemetry, or
   rollback paths are missing.
9. Produce a concrete plan or review using the response structure from the
   skill:
   - Execution mode
   - Capability check
   - Risk tier
   - Blast radius
   - Required Cloudflare controls
   - Verification gates
   - Rollout and rollback
   - Open risks
   - Handoff
10. If the request implies code changes, use the skill as the governing policy
   for what is safe to change, what needs stronger review, and what must fail
   closed instead of relying on hidden workarounds.

## Example Usage

```text
/charl review this AI-authored Workers rollout plan before we ship it
/charl classify this change and tell me which Cloudflare controls we need
/charl design a safe rollout for a new AI-powered feature on Workers
```
