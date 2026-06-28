# Evidence Ledger

Use this ledger for Tier 1+ release work, remote/autonomous operators,
production exposure, or any recommendation that says work may continue.

## Evidence States

- `evidence`: directly observed from repo, config, test output, logs, preview
  URL, deployment settings, or user-provided policy.
- `assumption`: plausible but not verified.
- `blocker`: required fact or capability is missing.
- `recommendation`: suggested next action, not yet evidence.

## Required Fields

| Field | State | Value | Source |
| --- | --- | --- | --- |
| Execution mode | evidence / assumption / blocker |  |  |
| Promotion owner | evidence / blocker |  |  |
| Risk tier | recommendation |  |  |
| Blast radius | evidence / assumption |  |  |
| Data touched | evidence / assumption |  |  |
| Auth/billing/tenancy touched | evidence / assumption |  |  |
| Cloudflare account/token scope | evidence / blocker |  |  |
| Preview/staging path | evidence / blocker |  |  |
| Tests run | evidence / blocker |  |  |
| Browser verification | evidence / blocker / not applicable |  |  |
| Logs/metrics/traces available | evidence / blocker |  |  |
| Code rollback | evidence / blocker |  |  |
| State rollback | evidence / blocker |  |  |
| Feature flag/exposure control | evidence / blocker / not applicable |  |  |
| Final action allowed | recommendation |  |  |

## Compact Summary

Use this shape when the full table would be too large:

```markdown
## Evidence ledger
- Evidence:
- Assumptions:
- Blockers:
- Recommendations:
```

Do not present an assumption as evidence. Do not convert a blocker into a
recommendation unless the missing fact has been observed.
