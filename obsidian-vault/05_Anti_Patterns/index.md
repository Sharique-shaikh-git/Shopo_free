# Anti-Patterns Index

> Mistakes we've discovered. NEVER repeat these.

## Template
Each anti-pattern should document:
1. **What went wrong** — the mistake
2. **Why it's bad** — consequences
3. **What to do instead** — the correct pattern
4. **Link to fix** — PR/commit where it was corrected

## Known Anti-Patterns (from docs analysis)
- [[premature-db-partitioning]] — Don't hash-partition at <1000 stores
- [[trusting-client-merchantid]] — Never use merchantId from request body
- [[sync-ai-calls]] — Never call AI APIs in the request path
- [[exposing-tech-terms]] — Never show "DNS/SSL/CDN" to merchants

#anti-patterns #index
