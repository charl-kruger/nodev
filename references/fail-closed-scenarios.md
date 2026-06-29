# Fail-Closed Scenarios

Every fail-closed scenario maps to one of: continue, planning-only,
preview-only, handoff, or hard block.

## Missing Execution Mode

Planning-only. Implementation, deployment, production promotion, and
authority-expanding actions are blocked until the mode is known.

## Missing Promotion Authority

Preview-only or handoff. Build, test, and preview may be allowed by mode and
tier. Production promotion is blocked until the owner or policy is explicit.

## Missing Preview Path

Handoff for Tier 1+ release work. Provide the required preview or staging setup
instead of recommending production exposure.

## Missing Telemetry

Preview-only. Production exposure is blocked. Preview work may continue only
when preview evidence is sufficient for the requested decision.

## Missing State Rollback

Hard block for production exposure when the change touches D1, KV, R2, Durable
Objects, queues, workflows, migrations, or external state. Require state
rollback, recovery, or forward-fix policy before release.

## Broad Cloudflare Token

Handoff or hard block depending on risk. Do not broaden scope for convenience.
Require a least-privilege token or human-owned promotion path.

## Durable Object Worker With Preview URL Assumption

Planning-only or preview-only. Do not assume Preview URLs exist. Recommend a
staging Worker, canary route, or another non-production verification path.

## AI Gateway ZDR Requirement Not Verified

Hard block when ZDR is mandatory and provider support or gateway settings are
unknown. Mark non-critical ZDR uncertainty as an assumption, not evidence.

## Browser Run Recording Assumption

Continue only without replay claims. Do not claim replay evidence unless
recording was enabled for a Browser Session and the recording is available.

## Leaf UI With Shared Side Effects

Continue only after reclassification by blast radius. If the UI change affects
auth, billing, tenancy, entitlements, rate limits, retention, or shared state,
raise the tier and apply the stronger release gate.
