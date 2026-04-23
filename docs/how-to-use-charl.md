# How To Use Charl

This guide is for people who want to use the skill immediately without reading
the full internal `SKILL.md` first.

## Install

Public repository:

```bash
npx skills add https://github.com/charl-kruger/skills
```

Install the named skill explicitly:

```bash
npx skills add https://github.com/charl-kruger/skills --skill charl
```

Manual project-level install:

```bash
mkdir -p /path/to/project/.agents/skills
cp -R skills/charl /path/to/project/.agents/skills/
```

Manual Codex global install:

```bash
mkdir -p ~/.codex/skills
cp -R skills/charl ~/.codex/skills/
```

## Use As A Skill

Ask for the skill directly when you want a governed delivery answer, for
example:

- "Use `$charl` to review this AI-authored rollout plan."
- "Use `$charl` to tell me whether this remote agent should be allowed to
  deploy."
- "Use `$charl` to design a safe Cloudflare rollout for this Workers feature."
- "Use `$charl` to classify this change by risk tier and blast radius."

The better your request, the better the result. The most useful inputs are:

- what is being built or changed
- who or what is operating
- where the code is running
- whether production deploy rights exist
- what Cloudflare products are in play
- what you already know about preview, logs, metrics, and rollback

## Use As A Claude Code Command

If this repo is present locally in Claude Code, you can use:

```text
/charl [feature, change, system, or rollout to analyze]
```

That command is defined in [`.claude/commands/charl.md`](../.claude/commands/charl.md).

## What To Expect Back

A good `charl` response should usually contain:

1. Execution mode
2. Capability check
3. Risk tier
4. Blast radius
5. Required Cloudflare controls
6. Verification gates
7. Rollout and rollback
8. Open risks
9. Handoff if the current operator cannot continue

If the response jumps straight to implementation or deployment without those
gates, it is not using the skill properly.

## Best Prompts

These prompt shapes work well:

### Review Prompt

```text
Use $charl to review whether this AI-authored Cloudflare deployment plan is safe.
The operator is an autonomous remote agent in a sandbox.
It has repo write access, preview deploy access, and logs, but no broad
production token.
```

### Design Prompt

```text
Use $charl to design a safe rollout for a new Workers feature that uses D1 and
AI Gateway. We want preview, dark launch, verification gates, and rollback.
```

### Authority Prompt

```text
Use $charl to tell me what an autonomous-deployer should be allowed to do for
this Tier 2 customer-facing change.
```

### Handoff Prompt

```text
Use $charl to prepare a handoff package because the current remote agent can
build and preview the change but cannot promote it to production.
```

## When To Reach For Charl

Use it when:

- AI wrote or will write a meaningful change
- the change touches production or a production-like preview path
- there is ambiguity about deploy authority
- the operator is remote or autonomous
- you need a Cloudflare-aware release recommendation, not just code

Do not use it only as a substitute for basic coding help. It is most valuable
when release discipline matters.

Next:

- [Operating Modes](./operating-modes.md)
- [Common Workflows](./common-workflows.md)
- [What Charl Does](./what-charl-does.md)
