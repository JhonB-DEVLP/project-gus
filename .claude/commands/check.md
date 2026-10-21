---
description: Run every quality gate and report what passed and what failed
---

Run these in order and stop at the first failure:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`

Then report in this format:

```
lint       PASS | FAIL
typecheck  PASS | FAIL
test       PASS | FAIL  (n passed, n failed)
build      PASS | FAIL
```

If something failed, show the first error and propose the smallest fix. Do not apply the fix until I say so.

If the change touched UI, also list the pages I should open at 390px and 1280px, in light and dark, and remind me to tab through them.

Never report PASS for a step you did not run.
