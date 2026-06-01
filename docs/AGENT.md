# Agent Workspace Guide

This file gives maintainers and coding agents the current operating context for the `SWAG_LAB_Basic_Playwright` repository.

## Purpose

The project is a Playwright E2E suite for SauceDemo. It uses TypeScript page objects to keep browser actions outside spec files.

## Source Map

```text
pages/login.ts          Login URL navigation and credential submission.
pages/inventory.ts      Inventory selection, sorting checks, cart verification, and checkout.
pages/logout.ts         Burger menu logout flow.
tests/purchase.spec.ts  End-to-end purchase test using the page objects.
tests/sorting.spec.ts   Inventory sorting verification test.
docs/TEST_CASES.md      Executed test-case catalog with steps and expectations.
playwright.config.js    Browser projects, reporter, trace, and CI behavior.
scripts/update-docs.js  Runs tests and updates AGENT_PROGRESS.md.
scripts/local-mcp-server.js
                        Local JSON-RPC MCP utility with file-info and greeting tools.
```

## Commands

Run commands from the repository root.

```bash
npm install
npx playwright install
npx playwright test
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --headed
npx playwright show-report
npm run update-docs
```

## Current Test Design

- `test.beforeEach` logs in as `standard_user` and verifies navigation to `/inventory.html`.
- The purchase test adds two known products, verifies the cart contents, completes checkout, logs out, and verifies the login URL.
- The sorting test verifies all four sort options: `az`, `za`, `lohi`, and `hilo`.
- Chromium and Firefox are enabled in `playwright.config.js`.
- WebKit and mobile projects are available as commented examples.

## Maintenance Rules

- Keep raw locators and UI actions in `pages/`.
- Keep test intent and assertions in `tests/`.
- Reuse existing helper methods before introducing new abstractions.
- Prefer `getByTestId(...)` when SauceDemo exposes a `data-test` attribute.
- Use role locators for stable accessible controls when no useful test id exists.
- Avoid XPath and long CSS paths unless there is no better locator.
- Keep functions small and intention-revealing.
- Add explicit return types to public async methods (for example `: Promise<void>`) to satisfy ESLint rules.
- Keep tests deterministic; avoid arbitrary waits, prefer explicit waits/assertions.
- Add or update assertions for any behavior change.
- Run ESLint and resolve reported issues before committing.
- Preserve existing public method names unless the change is intentional.
- Minimize cross-file churn; prefer focused edits.
- When changing page objects, update dependent specs in the same change.
- Handle async failures explicitly; avoid unhandled promise rejections.
- Log errors with useful context, but never include secrets or PII.
- Do not hardcode secrets, credentials, or environment-specific values.
- Keep inline comments focused on intent and tradeoffs ("why"), not line-by-line narration ("what").
- Follow Conventional Commits for commit messages (`feat:`, `fix:`, `chore:`).
- Do not commit generated folders such as `playwright-report/` or `test-results/`.
- Do not commit `node_modules/`, `.env` files, or build artifacts such as `dist/` and `build/`.
- Update Markdown files when page object names, commands, browser projects, or test flow change.
- Update `README.md` when user-facing behavior or project setup changes.

## Known Documentation Hooks

- `docs/AGENT_PROGRESS.md` has a test-results block bounded by `<!-- TEST_RESULTS_START -->` and `<!-- TEST_RESULTS_END -->`.
- `npm run update-docs` rewrites that block after running `npx playwright test`.
