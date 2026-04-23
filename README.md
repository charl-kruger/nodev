# Charl

AI makes software much cheaper to write.

It does not automatically make software safer to ship.

That gap is where most teams get stuck. They do not mainly lack code
generation. They lack confidence, legibility, release discipline, and a clean
way to say "yes, this can go live" or "no, this must stop here."

`charl` exists to close that gap.

It is an Agent Skill for building and shipping on Cloudflare with AI without
confusing implementation speed for production safety. It helps a human on a
laptop, a coding agent in a sandbox, or an autonomous remote operator answer
the same question in a disciplined way:

`What is safe to do next, with the authority and evidence we actually have?`

## Why Use Charl

Most AI coding workflows fail in one of two ways:

- They become timid and bureaucratic, where the team slows down because nobody
  trusts the output.
- They become reckless and theatrical, where code moves fast but responsibility
  disappears.

`charl` is designed to avoid both.

It reframes the job from "Did the AI write good code?" to:

- What mode are we operating in?
- What are we allowed to do?
- What is the blast radius?
- What evidence do we need before release?
- What Cloudflare controls should carry the risk?
- When should we stop and hand off instead of improvising?

That is the real value of the skill. It does not merely help an agent build. It
helps a team trust the build path.

Read more:

- [Why Charl Exists](./docs/why-charl.md)
- [What Charl Does](./docs/what-charl-does.md)
- [Recommended Cloudflare Stack (April 2026)](./docs/cloudflare-stack-2026.md)
- [Cloudflare Audit (April 23, 2026)](./docs/cloudflare-audit-2026-04-23.md)

## What Charl Does

`charl` gives an agent a repeatable operating model for safe Cloudflare
delivery. In practice, it makes the agent do six things before it pretends a
deployment is safe:

1. Detect the execution mode: `human-local`, `human-remote`,
   `autonomous-remote`, or `autonomous-deployer`
2. Run a capability check for repo access, Cloudflare auth, preview path,
   observability, rollback, and promotion authority
3. Classify the work by risk tier and blast radius
4. Choose the minimum Cloudflare controls for build, preview, rollout, runtime,
   secrets, state, verification, and recovery
5. Define verification gates and rollback limits
6. Fail closed and hand off when authority or evidence is missing

That means the skill is useful both before code exists and after code exists:

- Before implementation: to design a safe delivery plan
- During implementation: to govern what the agent is and is not allowed to do
- Before release: to decide whether promotion is justified
- After blockage: to produce a clean handoff package for the next human or
  agent

Read more:

- [What Charl Does](./docs/what-charl-does.md)
- [Operating Modes](./docs/operating-modes.md)
- [Common Workflows](./docs/common-workflows.md)
- [Recommended Cloudflare Stack (April 2026)](./docs/cloudflare-stack-2026.md)
- [Cloudflare Audit (April 23, 2026)](./docs/cloudflare-audit-2026-04-23.md)

## Who It Is For

- Founders and small teams shipping quickly on Cloudflare
- Platform engineers trying to make AI-assisted delivery governable
- Developers using Codex, Claude Code, Cursor, or similar agents
- Teams running agents in remote sandboxes or CI-like environments
- Anyone who wants AI speed without pretending rollback, access control, and
  observability are optional

## Install

Public repo:

```bash
npx skills add https://github.com/charl-kruger/skills
```

Install the skill by name:

```bash
npx skills add https://github.com/charl-kruger/skills --skill charl
```

Manual project-level install:

```bash
mkdir -p /path/to/project/.agents/skills
cp -R skills/charl /path/to/project/.agents/skills/
```

Manual OpenAI Codex global install:

```bash
mkdir -p ~/.codex/skills
cp -R skills/charl ~/.codex/skills/
```

For other agents, use `npx skills` or the client’s own skills directory docs.

## Use

Direct skill invocation examples:

- "Use `$charl` to review this Cloudflare rollout plan before production."
- "Use `$charl` to classify this AI-authored feature by risk tier and blast
  radius."
- "Use `$charl` to tell me whether an autonomous remote agent should be allowed
  to deploy this change."
- "Use `$charl` to design a safe preview, dark launch, and rollback path for a
  new Workers feature."

If you use Claude Code and have this repo available locally, you can also use
the project command:

```text
/charl [feature, change, system, or rollout to analyze]
```

Important:

- The skill itself installs with `npx skills`.
- The `/charl` command is a repo-local Claude Code command defined in
  [`.claude/commands/charl.md`](./.claude/commands/charl.md). It is useful when
  working directly in this repository or when you copy the command into another
  Claude Code project.

Read more:

- [How To Use Charl](./docs/how-to-use-charl.md)
- [Operating Modes](./docs/operating-modes.md)
- [Common Workflows](./docs/common-workflows.md)
- [Recommended Cloudflare Stack (April 2026)](./docs/cloudflare-stack-2026.md)
- [Cloudflare Audit (April 23, 2026)](./docs/cloudflare-audit-2026-04-23.md)

## Documentation

Start here if you are new:

- [Why Charl Exists](./docs/why-charl.md)
- [What Charl Does](./docs/what-charl-does.md)
- [How To Use Charl](./docs/how-to-use-charl.md)
- [Operating Modes](./docs/operating-modes.md)
- [Common Workflows](./docs/common-workflows.md)
- [Recommended Cloudflare Stack (April 2026)](./docs/cloudflare-stack-2026.md)
- [Cloudflare Audit (April 23, 2026)](./docs/cloudflare-audit-2026-04-23.md)

Internal skill and command files:

- [skills/charl/SKILL.md](./skills/charl/SKILL.md)
- [skills/charl/references/playbook.md](./skills/charl/references/playbook.md)
- [skills/charl/references/cloudflare-tooling.md](./skills/charl/references/cloudflare-tooling.md)
- [commands/charl.md](./commands/charl.md)
- [`.claude/commands/charl.md`](./.claude/commands/charl.md)

## Repository Layout

- [`skills/charl/`](./skills/charl/)
- [`docs/`](./docs/)
- [`commands/`](./commands/)
- [`.claude/commands/`](./.claude/commands/)
- [`.claude-plugin/`](./.claude-plugin/)
- [`.cursor-plugin/`](./.cursor-plugin/)

## Notes

- The repo is intentionally laid out like a published skill catalog, with a
  top-level `skills/` directory.
- The install target for many project-local agent environments is still
  `.agents/skills/`.
- `agents/openai.yaml` is optional UI metadata for OpenAI/Codex-style clients.
  `npx skills` discovers the skill from `SKILL.md`, not from `openai.yaml`.
