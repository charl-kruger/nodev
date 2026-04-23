---
description: Use the Charl skill to design or review safe production delivery for an AI-authored Cloudflare change
argument-hint: [feature, change, system, or rollout to analyze]
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit, WebFetch]
---

Use the Charl skill for this request: $ARGUMENTS

Start by reading:

- @skills/charl/SKILL.md
- @skills/charl/references/playbook.md when the task needs risk tiers,
  verification, or rollout policy
- @skills/charl/references/cloudflare-tooling.md when the task needs detailed
  Cloudflare product guidance
- @skills/charl/references/cloudflare-current-stack.md when the task needs the
  latest Cloudflare-safe defaults for build, preview, AI routing, Browser Run,
  Dynamic Workers, Sandbox, or MCP governance

Then respond with:

1. Execution mode
2. Capability check
3. Risk tier
4. Blast radius
5. Required Cloudflare controls
6. Verification gates
7. Rollout and rollback
8. Open risks
9. Handoff if the current mode cannot complete the task

If the request includes implementation or review work, apply the skill’s rules
while doing that work.
