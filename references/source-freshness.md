# Source Freshness Protocol

Use local references for stable operating principles.

Verify externally when:

- The user asks for latest/current Cloudflare product behavior.
- The recommendation depends on a Cloudflare feature, limit, pricing,
  availability, preview/beta status, API, or documented constraint that may
  have changed.
- The local reference snapshot is older than 30 days and the answer depends on
  exact product behavior.
- The task involves security, compliance, data retention, ZDR, identity, or
  deployment limits.

## Source Priority

1. Repository evidence and user-provided policy.
2. Local Cloudflare config: Wrangler, CI, deploy scripts, bindings, envs.
3. Actual test, deploy, log, metric, or trace output.
4. Official Cloudflare docs, changelog, and blog.
5. Other sources only for context, never as authority over Cloudflare behavior.

When freshness cannot be verified, mark the recommendation as an assumption or
blocker rather than presenting it as current fact.

The local `cloudflare-current-stack.md` snapshot reflects Cloudflare docs,
changelog, and blog state as of April 23, 2026. Do not say "current
Cloudflare best practice" without either naming that snapshot date or verifying
current official sources.
